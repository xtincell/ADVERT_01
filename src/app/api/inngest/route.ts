import { serve } from "inngest/next";
import { inngest } from "~/lib/inngest/client";
import { helloWorld } from "~/lib/inngest/functions";

/**
 * Inngest API Route Handler
 *
 * This route handles all Inngest webhook events:
 * - Function invocations from the Inngest cloud/dev server
 * - Event receiving and routing
 * - Function result callbacks
 *
 * The serve handler automatically:
 * - Validates webhook signatures (in production)
 * - Routes events to the correct functions
 * - Handles retries and step execution
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    // Add more functions here as they are created:
    // sendEmail,
    // generateStrategy,
    // exportPdf,
    // deliverWebhook,
  ],
});
