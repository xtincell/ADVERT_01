import { inngest } from "../client";

/**
 * Test function to verify Inngest setup
 *
 * This function responds to "test/hello.world" events
 * and logs the message to verify the pipeline is working.
 *
 * Usage:
 * 1. Start the Inngest dev server: npx inngest-cli@latest dev
 * 2. Send a test event from the dashboard at http://localhost:8288
 * 3. Verify the function executes and logs the message
 */
export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    name: "Hello World Test",
  },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Log the incoming message
    const message = event.data.message;
    console.log(`[Inngest Test] Received message: ${message}`);

    // Use a step for durable execution
    const greeting = await step.run("create-greeting", async () => {
      return `Hello! You said: "${message}"`;
    });

    // Return the result
    return {
      success: true,
      greeting,
      receivedAt: new Date().toISOString(),
    };
  }
);
