"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  companyName: z
    .string()
    .max(100, "Company name must be at most 100 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Format a role enum value for display
 */
function formatRole(role: string): string {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Format a date for display
 */
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfileSettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [hasChanges, setHasChanges] = useState(false);

  const profileQuery = api.user.getProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async (data) => {
      toast.success("Profile updated successfully");
      setHasChanges(false);
      // Refresh session to reflect updated name in header
      await updateSession({
        ...session,
        user: { ...session?.user, name: data.user.name },
      });
      // Refetch profile data
      await profileQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      companyName: "",
    },
  });

  // Populate form when profile data loads
  useEffect(() => {
    if (profileQuery.data) {
      reset({
        name: profileQuery.data.name ?? "",
        companyName: profileQuery.data.tenant.name ?? "",
      });
    }
  }, [profileQuery.data, reset]);

  // Track changes
  const watchedValues = watch();
  useEffect(() => {
    if (profileQuery.data) {
      const nameChanged = watchedValues.name !== (profileQuery.data.name ?? "");
      const companyChanged =
        (watchedValues.companyName ?? "") !==
        (profileQuery.data.tenant.name ?? "");
      setHasChanges(nameChanged || companyChanged);
    }
  }, [watchedValues, profileQuery.data]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  const handleCancel = () => {
    if (profileQuery.data) {
      reset({
        name: profileQuery.data.name ?? "",
        companyName: profileQuery.data.tenant.name ?? "",
      });
      setHasChanges(false);
    }
  };

  // Middleware handles auth redirect
  if (status === "loading" || profileQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || !profileQuery.data) {
    return null;
  }

  const profile = profileQuery.data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Profile Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Editable Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your name and company details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  placeholder="Your company or agency name"
                  {...register("companyName")}
                  aria-invalid={!!errors.companyName}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Read-Only Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                These details cannot be changed from this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label>Email address</Label>
                <Input value={profile.email} disabled />
                <p className="text-xs text-muted-foreground">
                  To change your email, contact support@advert.app
                </p>
              </div>

              {/* Role (read-only) */}
              <div className="space-y-2">
                <Label>Account role</Label>
                <Input value={formatRole(profile.role)} disabled />
                <p className="text-xs text-muted-foreground">
                  Your role is managed by your agency owner.
                </p>
              </div>

              {/* Member since (read-only) */}
              <div className="space-y-2">
                <Label>Member since</Label>
                <Input value={formatDate(profile.createdAt)} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!hasChanges || updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
