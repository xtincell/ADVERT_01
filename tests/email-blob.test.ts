import { describe, it, expect } from "vitest";
import * as fs from "fs";

describe("Resend Email Configuration", () => {
  describe("Email Client", () => {
    it("should have email client at correct path", () => {
      expect(fs.existsSync("src/lib/email/client.ts")).toBe(true);
    });

    it("should export getResendClient function", () => {
      const clientCode = fs.readFileSync("src/lib/email/client.ts", "utf-8");
      expect(clientCode).toContain("export function getResendClient");
    });

    it("should export isEmailConfigured function", () => {
      const clientCode = fs.readFileSync("src/lib/email/client.ts", "utf-8");
      expect(clientCode).toContain("export function isEmailConfigured");
    });

    it("should export sendEmail function", () => {
      const clientCode = fs.readFileSync("src/lib/email/client.ts", "utf-8");
      expect(clientCode).toContain("export async function sendEmail");
    });

    it("should export sendHtmlEmail function", () => {
      const clientCode = fs.readFileSync("src/lib/email/client.ts", "utf-8");
      expect(clientCode).toContain("export async function sendHtmlEmail");
    });

    it("should use RESEND_API_KEY environment variable", () => {
      const clientCode = fs.readFileSync("src/lib/email/client.ts", "utf-8");
      expect(clientCode).toContain("RESEND_API_KEY");
    });

    it("should use RESEND_FROM_EMAIL environment variable", () => {
      const clientCode = fs.readFileSync("src/lib/email/client.ts", "utf-8");
      expect(clientCode).toContain("RESEND_FROM_EMAIL");
    });
  });

  describe("Email Templates", () => {
    it("should have templates directory with index", () => {
      expect(fs.existsSync("src/lib/email/templates/index.ts")).toBe(true);
    });

    it("should have test email template", () => {
      expect(fs.existsSync("src/lib/email/templates/test.tsx")).toBe(true);
    });

    it("should export TestEmail component", () => {
      const indexCode = fs.readFileSync(
        "src/lib/email/templates/index.ts",
        "utf-8"
      );
      expect(indexCode).toContain("export { TestEmail }");
    });

    it("should use React Email components in template", () => {
      const templateCode = fs.readFileSync(
        "src/lib/email/templates/test.tsx",
        "utf-8"
      );
      expect(templateCode).toContain("@react-email/components");
      expect(templateCode).toContain("<Html>");
      expect(templateCode).toContain("<Body");
      expect(templateCode).toContain("<Container");
    });

    it("should have TypeScript interface for props", () => {
      const templateCode = fs.readFileSync(
        "src/lib/email/templates/test.tsx",
        "utf-8"
      );
      expect(templateCode).toContain("interface TestEmailProps");
    });
  });
});

describe("Vercel Blob Storage Configuration", () => {
  describe("Blob Client", () => {
    it("should have blob client at correct path", () => {
      expect(fs.existsSync("src/lib/storage/blob.ts")).toBe(true);
    });

    it("should export isBlobConfigured function", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export function isBlobConfigured");
    });

    it("should export uploadFile function", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export async function uploadFile");
    });

    it("should export deleteFile function", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export async function deleteFile");
    });

    it("should export deleteFiles function for batch delete", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export async function deleteFiles");
    });

    it("should export getFileMetadata function", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export async function getFileMetadata");
    });

    it("should export listFiles function", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export async function listFiles");
    });

    it("should export generateUniqueFilename function", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("export function generateUniqueFilename");
    });

    it("should use BLOB_READ_WRITE_TOKEN environment variable", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("BLOB_READ_WRITE_TOKEN");
    });

    it("should import from @vercel/blob", () => {
      const blobCode = fs.readFileSync("src/lib/storage/blob.ts", "utf-8");
      expect(blobCode).toContain("@vercel/blob");
      expect(blobCode).toContain("put,");
      expect(blobCode).toContain("del,");
      expect(blobCode).toContain("list,");
      expect(blobCode).toContain("head,");
    });
  });

  describe("Upload Test Route", () => {
    it("should have test route at api/upload-test", () => {
      expect(fs.existsSync("src/app/api/upload-test/route.ts")).toBe(true);
    });

    it("should export GET handler for status check", () => {
      const routeCode = fs.readFileSync(
        "src/app/api/upload-test/route.ts",
        "utf-8"
      );
      expect(routeCode).toContain("export async function GET");
    });

    it("should export POST handler for uploads", () => {
      const routeCode = fs.readFileSync(
        "src/app/api/upload-test/route.ts",
        "utf-8"
      );
      expect(routeCode).toContain("export async function POST");
    });

    it("should export DELETE handler for file deletion", () => {
      const routeCode = fs.readFileSync(
        "src/app/api/upload-test/route.ts",
        "utf-8"
      );
      expect(routeCode).toContain("export async function DELETE");
    });

    it("should handle FormData for file uploads", () => {
      const routeCode = fs.readFileSync(
        "src/app/api/upload-test/route.ts",
        "utf-8"
      );
      expect(routeCode).toContain("formData");
      expect(routeCode).toContain('formData.get("file")');
    });

    it("should check if blob is configured", () => {
      const routeCode = fs.readFileSync(
        "src/app/api/upload-test/route.ts",
        "utf-8"
      );
      expect(routeCode).toContain("isBlobConfigured()");
    });
  });
});

describe("Environment Configuration", () => {
  it("should have RESEND_API_KEY in env schema", () => {
    const envConfig = fs.readFileSync("src/env.js", "utf-8");
    expect(envConfig).toContain("RESEND_API_KEY");
  });

  it("should have RESEND_FROM_EMAIL in env schema", () => {
    const envConfig = fs.readFileSync("src/env.js", "utf-8");
    expect(envConfig).toContain("RESEND_FROM_EMAIL");
  });

  it("should have BLOB_READ_WRITE_TOKEN in env schema", () => {
    const envConfig = fs.readFileSync("src/env.js", "utf-8");
    expect(envConfig).toContain("BLOB_READ_WRITE_TOKEN");
  });

  it("should document Resend variables in .env.example", () => {
    const envExample = fs.readFileSync(".env.example", "utf-8");
    expect(envExample).toContain("RESEND_API_KEY");
    expect(envExample).toContain("RESEND_FROM_EMAIL");
    expect(envExample).toContain("Resend");
  });

  it("should document Vercel Blob variables in .env.example", () => {
    const envExample = fs.readFileSync(".env.example", "utf-8");
    expect(envExample).toContain("BLOB_READ_WRITE_TOKEN");
    expect(envExample).toContain("Vercel Blob");
  });
});

describe("Module Structure", () => {
  it("should have email directory in lib", () => {
    expect(fs.existsSync("src/lib/email")).toBe(true);
  });

  it("should have storage directory in lib", () => {
    expect(fs.existsSync("src/lib/storage")).toBe(true);
  });
});
