import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import stripJsonComments from "strip-json-comments";

describe("T3 Stack Project Setup", () => {
  describe("TypeScript Configuration", () => {
    it("should have strict mode enabled in tsconfig.json", () => {
      const tsconfigPath = join(process.cwd(), "tsconfig.json");
      const tsconfigRaw = readFileSync(tsconfigPath, "utf-8");
      const tsconfig = JSON.parse(stripJsonComments(tsconfigRaw));

      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it("should have all required TypeScript compiler options", () => {
      const tsconfigPath = join(process.cwd(), "tsconfig.json");
      const tsconfigRaw = readFileSync(tsconfigPath, "utf-8");
      const tsconfig = JSON.parse(stripJsonComments(tsconfigRaw));

      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
      expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
    });
  });

  describe("Dependencies Verification", () => {
    it("should have all required T3 Stack dependencies", () => {
      const packageJsonPath = join(process.cwd(), "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const requiredProdDeps = {
        "next": /\^15\./,
        "react": /\^19\./,
        "@trpc/server": /\^11\./,
        "@trpc/client": /\^11\./,
        "@trpc/next": /\^11\./,
        "@prisma/client": true,
        "next-auth": true,
        "zod": true,
      };

      const requiredDevDeps = {
        "typescript": /\^5\./,
        "tailwindcss": /\^4\./,
        "prisma": true,
        "eslint": true,
        "prettier": true,
      };

      for (const [dep, versionCheck] of Object.entries(requiredProdDeps)) {
        expect(packageJson.dependencies[dep]).toBeDefined();
        if (versionCheck instanceof RegExp) {
          expect(packageJson.dependencies[dep]).toMatch(versionCheck);
        }
      }

      for (const [dep, versionCheck] of Object.entries(requiredDevDeps)) {
        expect(packageJson.devDependencies[dep]).toBeDefined();
        if (versionCheck instanceof RegExp) {
          expect(packageJson.devDependencies[dep]).toMatch(versionCheck);
        }
      }
    });

    it("should have Tailwind CSS v4 installed", () => {
      const packageJsonPath = join(process.cwd(), "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.devDependencies.tailwindcss).toMatch(/\^4\./);
    });
  });

  describe("Project Structure", () => {
    it("should follow T3 Stack directory conventions", () => {
      const requiredDirs = [
        "src/app",
        "src/server",
        "src/styles",
        "prisma",
        "public",
      ];

      for (const dir of requiredDirs) {
        const dirPath = join(process.cwd(), dir);
        expect(existsSync(dirPath)).toBe(true);
      }
    });

    it("should have essential T3 Stack files", () => {
      const requiredFiles = [
        "package.json",
        "tsconfig.json",
        "next.config.js",
        ".env.example",
        "prisma/schema.prisma",
      ];

      for (const file of requiredFiles) {
        const filePath = join(process.cwd(), file);
        expect(existsSync(filePath)).toBe(true);
      }
    });
  });

  describe("Git Configuration", () => {
    it("should have .gitignore with required exclusions", () => {
      const gitignorePath = join(process.cwd(), ".gitignore");
      const gitignore = readFileSync(gitignorePath, "utf-8");

      const requiredExclusions = [
        "node_modules",
        ".env",
        ".next",
        "dist",
        "generated",
      ];

      for (const exclusion of requiredExclusions) {
        expect(gitignore).toContain(exclusion);
      }
    });

    it("should exclude .env but include .env.example", () => {
      const gitignorePath = join(process.cwd(), ".gitignore");
      const gitignore = readFileSync(gitignorePath, "utf-8");

      expect(gitignore).toContain(".env");
      expect(existsSync(join(process.cwd(), ".env.example"))).toBe(true);
    });
  });

  describe("ESLint and Prettier Configuration", () => {
    it("should have ESLint configured", () => {
      const eslintConfigPath = join(process.cwd(), "eslint.config.mjs");
      expect(existsSync(eslintConfigPath)).toBe(true);
    });

    it("should have Prettier configured", () => {
      const prettierConfigPath = join(process.cwd(), ".prettierrc");
      expect(existsSync(prettierConfigPath)).toBe(true);

      const prettierConfig = JSON.parse(readFileSync(prettierConfigPath, "utf-8"));
      expect(prettierConfig.semi).toBeDefined();
      expect(prettierConfig.singleQuote).toBeDefined();
    });

    it("should have lint and format scripts in package.json", () => {
      const packageJsonPath = join(process.cwd(), "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.scripts.lint).toBeDefined();
      expect(packageJson.scripts.format).toBeDefined();
    });
  });

  describe("Package Configuration", () => {
    it("should have correct project name", () => {
      const packageJsonPath = join(process.cwd(), "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.name).toBe("advert_01");
    });

    it("should have type module for ESM support", () => {
      const packageJsonPath = join(process.cwd(), "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.type).toBe("module");
    });
  });
});
