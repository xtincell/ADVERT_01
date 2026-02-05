import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "../generated/prisma/index.js";

describe("Database Schema and Multi-Tenancy", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Prisma Client Generation", () => {
    it("should have Prisma Client generated successfully", () => {
      expect(prisma).toBeDefined();
      expect(prisma.tenant).toBeDefined();
      expect(prisma.user).toBeDefined();
      expect(prisma.account).toBeDefined();
      expect(prisma.session).toBeDefined();
      expect(prisma.verificationToken).toBeDefined();
    });
  });

  describe("Tenant Model", () => {
    it("should create a tenant successfully", async () => {
      const tenant = await prisma.tenant.create({
        data: {
          name: "Test Agency",
          slug: "test-agency",
        },
      });

      expect(tenant).toBeDefined();
      expect(tenant.id).toBeDefined();
      expect(tenant.name).toBe("Test Agency");
      expect(tenant.slug).toBe("test-agency");
      expect(tenant.createdAt).toBeDefined();
      expect(tenant.updatedAt).toBeDefined();

      // Cleanup
      await prisma.tenant.delete({ where: { id: tenant.id } });
    });

    it("should enforce unique slug constraint", async () => {
      const tenant1 = await prisma.tenant.create({
        data: { name: "Agency 1", slug: "unique-slug" },
      });

      await expect(
        prisma.tenant.create({
          data: { name: "Agency 2", slug: "unique-slug" },
        })
      ).rejects.toThrow();

      // Cleanup
      await prisma.tenant.delete({ where: { id: tenant1.id } });
    });
  });

  describe("User Model with Multi-Tenancy", () => {
    it("should create a user with tenant relation", async () => {
      const tenant = await prisma.tenant.create({
        data: { name: "User Test Agency", slug: "user-test-agency" },
      });

      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
          tenantId: tenant.id,
          role: "AGENCY_OWNER",
        },
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.tenantId).toBe(tenant.id);
      expect(user.role).toBe("AGENCY_OWNER");

      // Verify relation
      const userWithTenant = await prisma.user.findUnique({
        where: { id: user.id },
        include: { tenant: true },
      });

      expect(userWithTenant?.tenant.slug).toBe("user-test-agency");

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
      await prisma.tenant.delete({ where: { id: tenant.id } });
    });

    it("should support all UserRole enum values", async () => {
      const tenant = await prisma.tenant.create({
        data: { name: "Role Test Agency", slug: "role-test-agency" },
      });

      const roles = ["AGENCY_OWNER", "CONSULTANT", "BRAND_CLIENT", "DEVELOPER"];

      for (const role of roles) {
        const user = await prisma.user.create({
          data: {
            email: `${role.toLowerCase()}@example.com`,
            tenantId: tenant.id,
            role: role as any,
          },
        });

        expect(user.role).toBe(role);

        await prisma.user.delete({ where: { id: user.id } });
      }

      await prisma.tenant.delete({ where: { id: tenant.id } });
    });

    it("should cascade delete users when tenant is deleted", async () => {
      const tenant = await prisma.tenant.create({
        data: { name: "Cascade Test Agency", slug: "cascade-test-agency" },
      });

      const user = await prisma.user.create({
        data: {
          email: "cascade@example.com",
          tenantId: tenant.id,
        },
      });

      // Delete tenant should cascade to user
      await prisma.tenant.delete({ where: { id: tenant.id } });

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deletedUser).toBeNull();
    });
  });

  describe("NextAuth Models", () => {
    it("should create Account model for OAuth", async () => {
      const tenant = await prisma.tenant.create({
        data: { name: "OAuth Test Agency", slug: "oauth-test-agency" },
      });

      const user = await prisma.user.create({
        data: {
          email: "oauth@example.com",
          tenantId: tenant.id,
        },
      });

      const account = await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId: "123456",
        },
      });

      expect(account).toBeDefined();
      expect(account.provider).toBe("google");
      expect(account.userId).toBe(user.id);

      // Cleanup
      await prisma.account.delete({ where: { id: account.id } });
      await prisma.user.delete({ where: { id: user.id } });
      await prisma.tenant.delete({ where: { id: tenant.id } });
    });

    it("should create Session model", async () => {
      const tenant = await prisma.tenant.create({
        data: { name: "Session Test Agency", slug: "session-test-agency" },
      });

      const user = await prisma.user.create({
        data: {
          email: "session@example.com",
          tenantId: tenant.id,
        },
      });

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: "test-token-" + Date.now(),
          expires: new Date(Date.now() + 86400000), // 24 hours
        },
      });

      expect(session).toBeDefined();
      expect(session.sessionToken).toContain("test-token");

      // Cleanup
      await prisma.session.delete({ where: { id: session.id } });
      await prisma.user.delete({ where: { id: user.id } });
      await prisma.tenant.delete({ where: { id: tenant.id } });
    });

    it("should create VerificationToken model", async () => {
      const verificationToken = await prisma.verificationToken.create({
        data: {
          identifier: "test@example.com",
          token: "verification-token-" + Date.now(),
          expires: new Date(Date.now() + 86400000),
        },
      });

      expect(verificationToken).toBeDefined();
      expect(verificationToken.identifier).toBe("test@example.com");

      // Cleanup
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      });
    });
  });

  describe("Database Connection", () => {
    it("should connect to database successfully", async () => {
      await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
    });

    it("should disconnect from database successfully", async () => {
      await expect(prisma.$disconnect()).resolves.toBeUndefined();
      // Reconnect for other tests
      prisma = new PrismaClient();
    });
  });
});
