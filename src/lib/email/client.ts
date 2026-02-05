import { Resend } from "resend";

/**
 * Resend Email Client
 *
 * Configured instance for sending transactional emails.
 * Uses RESEND_API_KEY from environment variables.
 *
 * @see https://resend.com/docs
 */

// Create Resend instance (null if no API key configured)
const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Get the configured Resend client
 * @throws Error if RESEND_API_KEY is not configured
 */
export function getResendClient(): Resend {
  if (!resendClient) {
    throw new Error("RESEND_API_KEY environment variable is not configured");
  }
  return resendClient;
}

/**
 * Check if email sending is available
 * Useful for conditional logic in development
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Default from email address
 * Uses RESEND_FROM_EMAIL or falls back to a default
 */
export const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "ADVERT <noreply@advert.app>";

/**
 * Send an email using Resend with React component
 *
 * @param options - Email options (to, subject, react component)
 * @returns Email send result with id
 *
 * @example
 * ```ts
 * import { sendEmail } from '~/lib/email/client';
 * import { WelcomeEmail } from '~/lib/email/templates/welcome';
 *
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome to ADVERT',
 *   react: WelcomeEmail({ name: 'John' }),
 * });
 * ```
 */
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}) {
  const client = getResendClient();

  return client.emails.send({
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    react: options.react,
    replyTo: options.replyTo,
  });
}

/**
 * Send an email using Resend with HTML content
 *
 * @param options - Email options (to, subject, html)
 * @returns Email send result with id
 */
export async function sendHtmlEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const client = getResendClient();

  return client.emails.send({
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
}

// Export the Resend class for type usage
export { Resend };
