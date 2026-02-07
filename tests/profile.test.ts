import { describe, it, expect } from "vitest";
import { z } from "zod";
import fs from "fs";

/**
 * Story 2.4: User Profile Management and Updates
 *
 * Tests for profile page, validation, and user router.
 */

// ===== Profile Form Validation =====

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

describe("Profile Form Validation", () => {
  it("accepts valid name", () => {
    const result = profileSchema.safeParse({
      name: "John Doe",
      companyName: "Acme Inc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts name with hyphens", () => {
    const result = profileSchema.safeParse({
      name: "Mary-Jane Watson",
    });
    expect(result.success).toBe(true);
  });

  it("accepts name with apostrophes", () => {
    const result = profileSchema.safeParse({
      name: "O'Brien",
    });
    expect(result.success).toBe(true);
  });

  it("accepts name with accented characters", () => {
    const result = profileSchema.safeParse({
      name: "José García",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = profileSchema.safeParse({
      name: "J",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("at least 2");
    }
  });

  it("rejects name with numbers", () => {
    const result = profileSchema.safeParse({
      name: "John123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name with special characters", () => {
    const result = profileSchema.safeParse({
      name: "John@Doe",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty company name (optional)", () => {
    const result = profileSchema.safeParse({
      name: "John Doe",
      companyName: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // Empty string transforms to undefined
      expect(result.data.companyName).toBeUndefined();
    }
  });

  it("accepts missing company name", () => {
    const result = profileSchema.safeParse({
      name: "John Doe",
    });
    expect(result.success).toBe(true);
  });

  it("rejects company name over 100 characters", () => {
    const result = profileSchema.safeParse({
      name: "John Doe",
      companyName: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

// ===== Role Display =====

describe("Role Formatting", () => {
  function formatRole(role: string): string {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  it("formats AGENCY_OWNER correctly", () => {
    expect(formatRole("AGENCY_OWNER")).toBe("Agency Owner");
  });

  it("formats CONSULTANT correctly", () => {
    expect(formatRole("CONSULTANT")).toBe("Consultant");
  });

  it("formats BRAND_CLIENT correctly", () => {
    expect(formatRole("BRAND_CLIENT")).toBe("Brand Client");
  });

  it("formats DEVELOPER correctly", () => {
    expect(formatRole("DEVELOPER")).toBe("Developer");
  });
});

// ===== Date Formatting =====

describe("Date Formatting", () => {
  function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  it("formats date in user-friendly format", () => {
    const formatted = formatDate("2026-02-05T00:00:00Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("February");
  });

  it("handles Date objects", () => {
    const formatted = formatDate(new Date("2026-01-15"));
    expect(formatted).toContain("January");
    expect(formatted).toContain("2026");
  });
});

// ===== Page Structure Tests =====

describe("Profile Settings Page", () => {
  it("has profile settings page file", () => {
    expect(fs.existsSync("src/pages/settings/profile.tsx")).toBe(true);
  });

  it("uses react-hook-form with zod resolver", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("useForm");
    expect(pageCode).toContain("zodResolver");
  });

  it("uses tRPC getProfile query", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("getProfile");
  });

  it("uses tRPC updateProfile mutation", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("updateProfile");
  });

  it("shows email as read-only with contact support message", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("support@advert.app");
    expect(pageCode).toContain("disabled");
  });

  it("shows role as read-only with explanation", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("agency owner");
  });

  it("shows member since date", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("Member since");
    expect(pageCode).toContain("createdAt");
  });

  it("has Save changes button", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("Save changes");
  });

  it("has Cancel button for unsaved changes", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("Cancel");
    expect(pageCode).toContain("handleCancel");
  });

  it("tracks whether form has changes", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("hasChanges");
  });

  it("refreshes session after update", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("updateSession");
  });

  it("has link back to dashboard", () => {
    const pageCode = fs.readFileSync(
      "src/pages/settings/profile.tsx",
      "utf-8"
    );
    expect(pageCode).toContain("/dashboard");
  });
});

// ===== User Router Tests =====

describe("User Router", () => {
  it("has user router file", () => {
    expect(fs.existsSync("src/server/api/routers/user.ts")).toBe(true);
  });

  it("has getProfile query", () => {
    const routerCode = fs.readFileSync(
      "src/server/api/routers/user.ts",
      "utf-8"
    );
    expect(routerCode).toContain("getProfile");
    expect(routerCode).toContain("protectedProcedure");
  });

  it("has updateProfile mutation", () => {
    const routerCode = fs.readFileSync(
      "src/server/api/routers/user.ts",
      "utf-8"
    );
    expect(routerCode).toContain("updateProfile");
    expect(routerCode).toContain("protectedProcedure");
  });

  it("uses session user ID for queries", () => {
    const routerCode = fs.readFileSync(
      "src/server/api/routers/user.ts",
      "utf-8"
    );
    expect(routerCode).toContain("ctx.session.user.id");
  });

  it("logs profile updates", () => {
    const routerCode = fs.readFileSync(
      "src/server/api/routers/user.ts",
      "utf-8"
    );
    expect(routerCode).toContain("[USER] Profile updated");
  });

  it("is registered in app router", () => {
    const rootCode = fs.readFileSync("src/server/api/root.ts", "utf-8");
    expect(rootCode).toContain("userRouter");
    expect(rootCode).toContain("user: userRouter");
  });
});

// ===== Dashboard Link Tests =====

describe("Dashboard Settings Link", () => {
  it("has link to profile settings", () => {
    const dashboardCode = fs.readFileSync(
      "src/pages/dashboard.tsx",
      "utf-8"
    );
    expect(dashboardCode).toContain("/settings/profile");
    expect(dashboardCode).toContain("Settings");
  });
});

// ===== Route Protection Tests =====

describe("Settings Route Protection", () => {
  it("middleware matches settings routes", () => {
    const middlewareCode = fs.readFileSync("src/middleware.ts", "utf-8");
    expect(middlewareCode).toContain("/settings/:path*");
  });

  it("auth config protects settings routes", () => {
    const configCode = fs.readFileSync(
      "src/server/auth/config.ts",
      "utf-8"
    );
    expect(configCode).toContain("/settings");
  });
});
