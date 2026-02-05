import { Inngest, EventSchemas } from "inngest";

/**
 * Event type definitions for type-safe event handling
 *
 * Add new event types here as the application grows.
 * Each event should have a name and optional data structure.
 */

// Define event types for the application
type Events = {
  // Test event for verifying Inngest setup
  "test/hello.world": {
    data: {
      message: string;
    };
  };

  // Email sending events
  "email/send": {
    data: {
      to: string;
      subject: string;
      templateId: string;
      templateData: Record<string, unknown>;
    };
  };

  // Strategy generation events
  "strategy/generate": {
    data: {
      strategyId: string;
      userId: string;
      tenantId: string;
    };
  };

  // Export events
  "export/pdf": {
    data: {
      resourceType: "strategy";
      resourceId: string;
      userId: string;
      tenantId: string;
    };
  };

  // Webhook delivery events
  "webhook/deliver": {
    data: {
      webhookId: string;
      payload: Record<string, unknown>;
      targetUrl: string;
    };
  };
};

/**
 * Inngest client instance
 *
 * This is the main entry point for creating and sending events.
 * The client is configured with:
 * - App ID: "advert-01" for identification in Inngest dashboard
 * - Event schemas: Type-safe event definitions
 */
export const inngest = new Inngest({
  id: "advert-01",
  schemas: new EventSchemas().fromRecord<Events>(),
});

// Export event types for use in other modules
export type { Events };
