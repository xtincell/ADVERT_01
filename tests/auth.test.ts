import { describe, it, expect, beforeAll, afterAll } from "vitest";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";

describe("Authentication Configuration", () => {
  let prisma: PrismaClient;
  let testTenantId: string;
  let testUserId: string;
  const testPassword = "TestPassword123!";
  let testPasswordHash: string;

  beforeAll(async () => {
    prisma = new PrismaClient();

    // Generate password hash for test user
    testPasswordHash = await bcrypt.hash(testPassword, 10);

    // Create test tenant
    const tenant = await prisma.tenant.create({
      data: { name: "Auth Test Tenant", slug: "auth-test-tenant" },
    });
    testTenantId = tenant.id;

    // Create test user with password
    const user = await prisma.user.create({
      data: {
        email: "auth-test@example.com",
        name: "Auth Test User",
        passwordHash: testPasswordHash,
        tenantId: testTenantId,
        role: "CONSULTANT",
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.tenant.deleteMany({
      where: { slug: "auth-test-tenant" },
    });
    await prisma.$disconnect();
  });

  describe("Password Hashing", () => {
    it("should hash passwords using bcrypt", async () => {
      const password = "MySecurePassword123!";
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2b$")).toBe(true); // bcrypt hash prefix
    });

    it("should verify correct password against hash", async () => {
      const isValid = await bcrypt.compare(testPassword, testPasswordHash);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password against hash", async () => {
      const isValid = await bcrypt.compare("WrongPassword123!", testPasswordHash);
      expect(isValid).toBe(false);
    });
  });

  describe("User Model with Password", () => {
    it("should store passwordHash in User model", async () => {
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
        select: { passwordHash: true },
      });

      expect(user).toBeDefined();
      expect(user?.passwordHash).toBe(testPasswordHash);
    });

    it("should allow null passwordHash for OAuth users", async () => {
      const oauthUser = await prisma.user.create({
        data: {
          email: "oauth-user-auth@example.com",
          name: "OAuth User",
          tenantId: testTenantId,
          role: "CONSULTANT",
          // No passwordHash - OAuth user
        },
      });

      expect(oauthUser.passwordHash).toBeNull();

      // Cleanup
      await prisma.user.delete({ where: { id: oauthUser.id } });
    });

    it("should include all required fields for auth", async () => {
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
        select: {
          id: true,
          email: true,
          name: true,
          passwordHash: true,
          tenantId: true,
          role: true,
          image: true,
        },
      });

      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.email).toBe("auth-test@example.com");
      expect(user?.tenantId).toBe(testTenantId);
      expect(user?.role).toBe("CONSULTANT");
    });
  });

  describe("Auth Configuration Structure", () => {
    // Note: These tests are skipped because NextAuth requires Next.js runtime
    // The auth module is tested via integration tests in the actual app
    it.skip("should export auth functions from auth module (requires Next.js runtime)", async () => {
      // Dynamically import to avoid module issues in test
      const authModule = await import("../src/server/auth.js");

      expect(authModule.auth).toBeDefined();
      expect(authModule.signIn).toBeDefined();
      expect(authModule.signOut).toBeDefined();
      expect(authModule.handlers).toBeDefined();
    });

    it.skip("should export GET and POST handlers (requires Next.js runtime)", async () => {
      const authModule = await import("../src/server/auth.js");

      expect(authModule.handlers.GET).toBeDefined();
      expect(authModule.handlers.POST).toBeDefined();
    });

    it("should have auth route file configured", async () => {
      // Verify the route file exists by checking file system
      const fs = await import("fs");
      const routePath = "src/app/api/auth/[...nextauth]/route.ts";
      expect(fs.existsSync(routePath)).toBe(true);
    });

    it("should have auth configuration file", async () => {
      const fs = await import("fs");
      const authPath = "src/server/auth/config.ts";
      expect(fs.existsSync(authPath)).toBe(true);
    });
  });

  describe("Credentials Validation Logic", () => {
    it("should find user by email", async () => {
      const user = await prisma.user.findUnique({
        where: { email: "auth-test@example.com" },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          tenantId: true,
          role: true,
        },
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe("auth-test@example.com");
      expect(user?.passwordHash).toBeDefined();
    });

    it("should return null for non-existent email", async () => {
      const user = await prisma.user.findUnique({
        where: { email: "nonexistent@example.com" },
      });

      expect(user).toBeNull();
    });

    it("should validate password correctly", async () => {
      const user = await prisma.user.findUnique({
        where: { email: "auth-test@example.com" },
        select: { passwordHash: true },
      });

      expect(user?.passwordHash).toBeDefined();

      const isValid = await bcrypt.compare(testPassword, user!.passwordHash!);
      expect(isValid).toBe(true);
    });
  });

  describe("Session Data Structure", () => {
    it("should include tenantId and role for session", async () => {
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
        select: {
          id: true,
          email: true,
          name: true,
          tenantId: true,
          role: true,
        },
      });

      // Verify all required session fields are present
      expect(user?.id).toBeDefined();
      expect(user?.email).toBeDefined();
      expect(user?.tenantId).toBeDefined();
      expect(user?.role).toBeDefined();

      // Verify types
      expect(typeof user?.id).toBe("string");
      expect(typeof user?.tenantId).toBe("string");
      expect(["AGENCY_OWNER", "CONSULTANT", "BRAND_CLIENT", "DEVELOPER"]).toContain(
        user?.role
      );
    });
  });
});
