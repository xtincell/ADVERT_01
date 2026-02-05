import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/**
 * Test Email Template
 *
 * Simple template for verifying email sending works.
 * Uses React Email components for type-safe HTML templating.
 */

interface TestEmailProps {
  recipientName?: string;
  timestamp?: string;
}

export function TestEmail({
  recipientName = "User",
  timestamp = new Date().toISOString(),
}: TestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Test email from ADVERT</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>ADVERT Test Email</Heading>
          </Section>

          <Section style={content}>
            <Text style={text}>Hello {recipientName},</Text>

            <Text style={text}>
              This is a test email to verify that the email system is working
              correctly.
            </Text>

            <Text style={text}>
              If you received this email, it means the Resend integration is
              configured properly.
            </Text>

            <Text style={mutedText}>Sent at: {timestamp}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              This email was sent from{" "}
              <Link href="https://advert.app" style={link}>
                ADVERT
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "560px",
};

const header = {
  padding: "0 48px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "24px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const content = {
  padding: "0 48px",
};

const text = {
  color: "#1d1c1d",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const mutedText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0",
};

const footer = {
  padding: "0 48px",
  borderTop: "1px solid #e6ebf1",
  marginTop: "32px",
  paddingTop: "20px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const link = {
  color: "#556cd6",
  textDecoration: "none",
};

export default TestEmail;
