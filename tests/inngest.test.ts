import { describe, it, expect } from "vitest";
import { inngest, type Events } from "../src/lib/inngest/client";
import { helloWorld } from "../src/lib/inngest/functions";
import * as functions from "../src/lib/inngest/functions";

describe("Inngest Configuration", () => {
  describe("Client Configuration", () => {
    it("should create Inngest client with correct app ID", () => {
      expect(inngest).toBeDefined();
      expect(inngest.id).toBe("advert-01");
    });

    it("should have event schemas configured", () => {
      // The client should be able to create events
      // This verifies the schemas are properly set up
      expect(inngest).toHaveProperty("send");
      expect(typeof inngest.send).toBe("function");
    });
  });

  describe("Event Types", () => {
    it("should define test/hello.world event type", () => {
      // Type check: This will fail at compile time if Events doesn't include this event
      const testEvent: Events["test/hello.world"] = {
        data: {
          message: "Hello, World!",
        },
      };

      expect(testEvent.data.message).toBe("Hello, World!");
    });

    it("should define email/send event type", () => {
      const emailEvent: Events["email/send"] = {
        data: {
          to: "test@example.com",
          subject: "Test Subject",
          templateId: "welcome",
          templateData: { name: "John" },
        },
      };

      expect(emailEvent.data.to).toBe("test@example.com");
      expect(emailEvent.data.templateId).toBe("welcome");
    });

    it("should define strategy/generate event type", () => {
      const strategyEvent: Events["strategy/generate"] = {
        data: {
          strategyId: "strategy-123",
          userId: "user-456",
          tenantId: "tenant-789",
        },
      };

      expect(strategyEvent.data.strategyId).toBe("strategy-123");
      expect(strategyEvent.data.tenantId).toBe("tenant-789");
    });

    it("should define export/pdf event type", () => {
      const exportEvent: Events["export/pdf"] = {
        data: {
          resourceType: "strategy",
          resourceId: "resource-123",
          userId: "user-456",
          tenantId: "tenant-789",
        },
      };

      expect(exportEvent.data.resourceType).toBe("strategy");
    });

    it("should define webhook/deliver event type", () => {
      const webhookEvent: Events["webhook/deliver"] = {
        data: {
          webhookId: "webhook-123",
          payload: { action: "created" },
          targetUrl: "https://example.com/webhook",
        },
      };

      expect(webhookEvent.data.targetUrl).toBe("https://example.com/webhook");
    });
  });

  describe("Hello World Test Function", () => {
    it("should be defined and exported", () => {
      expect(helloWorld).toBeDefined();
    });

    it("should be a valid Inngest function object", () => {
      // Inngest functions are objects with configuration
      expect(typeof helloWorld).toBe("object");
      // The function should have been created successfully
      expect(helloWorld).not.toBeNull();
      expect(helloWorld).toBeDefined();
    });

    it("should be included in functions export", () => {
      expect(functions.helloWorld).toBeDefined();
      expect(functions.helloWorld).toBe(helloWorld);
    });
  });

  describe("API Route Handler", () => {
    it("should have API route file configured", async () => {
      const fs = await import("fs");
      const routePath = "src/app/api/inngest/route.ts";
      expect(fs.existsSync(routePath)).toBe(true);
    });

    it("should export GET and POST handlers from route", async () => {
      // Import the route module
      const routeModule = await import("../src/app/api/inngest/route");

      expect(routeModule.GET).toBeDefined();
      expect(routeModule.POST).toBeDefined();
      expect(routeModule.PUT).toBeDefined();
    });
  });

  describe("Module Structure", () => {
    it("should have client module at correct path", async () => {
      const fs = await import("fs");
      expect(fs.existsSync("src/lib/inngest/client.ts")).toBe(true);
    });

    it("should have functions directory with index", async () => {
      const fs = await import("fs");
      expect(fs.existsSync("src/lib/inngest/functions/index.ts")).toBe(true);
    });

    it("should have test function at correct path", async () => {
      const fs = await import("fs");
      expect(fs.existsSync("src/lib/inngest/functions/test.ts")).toBe(true);
    });
  });
});

describe("Environment Configuration", () => {
  it("should have INNGEST_EVENT_KEY in env schema", async () => {
    const fs = await import("fs");
    const envContent = fs.readFileSync("src/env.js", "utf-8");

    expect(envContent).toContain("INNGEST_EVENT_KEY");
  });

  it("should have INNGEST_SIGNING_KEY in env schema", async () => {
    const fs = await import("fs");
    const envContent = fs.readFileSync("src/env.js", "utf-8");

    expect(envContent).toContain("INNGEST_SIGNING_KEY");
  });

  it("should have Inngest variables in .env.example", async () => {
    const fs = await import("fs");
    const envExampleContent = fs.readFileSync(".env.example", "utf-8");

    expect(envExampleContent).toContain("INNGEST_EVENT_KEY");
    expect(envExampleContent).toContain("INNGEST_SIGNING_KEY");
  });
});
