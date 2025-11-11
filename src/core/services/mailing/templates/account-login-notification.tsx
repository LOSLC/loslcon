import * as React from "react";
import { Html, Head, Body, Container, Section, Text, Hr, Heading } from "@react-email/components";

type AccountLoginNotificationProps = {
  userName: string;
};

const colors = {
  background: "#f8f9fb",
  foreground: "#1e293b",
  card: "#f1f5f9",
  border: "#e2e8f0",
  primary: "#4338ca",
  mutedForeground: "#64748b",
};

const base = {
  fontFamily:
    'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica Neue, Arial, Noto Sans, sans-serif',
};

export default function AccountLoginNotification({ userName }: AccountLoginNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: colors.background, margin: 0, padding: 0, ...base }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: 24 }}>
          <Section
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 32,
              color: colors.foreground,
            }}
          >
            <Heading style={{ margin: 0, fontSize: 22, lineHeight: 1.35 }}>
              New login to your account
            </Heading>
            <Text style={{ color: colors.mutedForeground, marginTop: 6 }}>Security notice</Text>

            <Hr style={{ borderColor: colors.border, margin: "18px 0" }} />

            <Text style={{ fontSize: 16, lineHeight: 1.6 }}>Hi {userName},</Text>
            <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
              We noticed a new sign-in to your account. If this was you, no action is needed. If you don’t
              recognize this activity, please change your password immediately.
            </Text>

            <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 16 }}>
              Tip: For extra protection, enable two-factor authentication if available.
            </Text>
          </Section>
          <Text style={{ textAlign: "center", color: colors.mutedForeground, fontSize: 12, marginTop: 16 }}>
            This is an automated message about your account security.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
