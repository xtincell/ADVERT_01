import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PrismaClient } from "../../../../generated/prisma";

// Use a separate Prisma client without RLS for user profile operations
// Profile updates need to work without tenant context complications
const prismaUser = new PrismaClient();

/**
 * Profile update input schema
 */
const updateProfileSchema = z.object({
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

export const userRouter = createTRPCRouter({
  /**
   * Get the current user's profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await prismaUser.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  /**
   * Update the current user's profile
   *
   * Only allows updating name and company name.
   * Email and role changes are handled separately.
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, companyName } = input;

      // Update user name
      const updatedUser = await prismaUser.user.update({
        where: { id: ctx.session.user.id },
        data: { name },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          tenantId: true,
        },
      });

      // Update tenant name if company name provided
      if (companyName !== undefined) {
        await prismaUser.tenant.update({
          where: { id: ctx.session.user.tenantId },
          data: { name: companyName },
        });
      }

      console.log(
        `[USER] Profile updated for user: ${updatedUser.id} at ${new Date().toISOString()}`
      );

      return {
        success: true,
        user: updatedUser,
      };
    }),
});
