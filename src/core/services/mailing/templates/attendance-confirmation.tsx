import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Link,
  Img,
} from "@react-email/components";

type AttendanceConfirmationProps = {
  eventName: string;
  attendeeName: string;
  eventDate: string;
  eventLocation: string;
  confirmUrl: string;
  supportEmail: string;
  appName: string;
  bannerUrl?: string;
};

const colors = {
  background: "#f8f9fb",
  foreground: "#1e293b",
  card: "#f1f5f9",
  border: "#e2e8f0",
  primary: "#4338ca",
  primaryForeground: "#f8f9fb",
  secondary: "#60a5fa",
  mutedForeground: "#64748b",
};

const base = {
  fontFamily:
    "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica Neue, Arial, Noto Sans, sans-serif",
};

export default function AttendanceConfirmation({
  eventName,
  attendeeName,
  eventDate,
  eventLocation,
  confirmUrl,
  supportEmail,
  appName,
  bannerUrl,
}: AttendanceConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: colors.background,
          margin: 0,
          padding: 0,
          ...base,
        }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "16px" }}>
          <Section
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: "20px 16px",
              color: colors.foreground,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            {bannerUrl && (
              <Section style={{ textAlign: "center", marginBottom: 16 }}>
                <Img
                  src={bannerUrl}
                  alt={eventName}
                  width={512}
                  style={{ maxWidth: "100%", borderRadius: 12 }}
                />
              </Section>
            )}

            <Heading
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              Seras-tu des nôtres ?
            </Heading>
            <Text
              style={{
                color: colors.mutedForeground,
                marginTop: 8,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Salut {attendeeName}
            </Text>

            {/* Event reminder */}
            <Section
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "16px",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                }}
              >
                L&apos;événement <strong>{eventName}</strong> approche ! Merci de
                confirmer ta présence pour nous permettre de mieux préparer les
                places, badges et dépenses.
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  margin: 0,
                  color: colors.mutedForeground,
                }}
              >
                Quand
              </Text>
              <Text style={{ margin: "2px 0 10px", fontWeight: 600, fontSize: 15 }}>
                {eventDate}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  margin: 0,
                  color: colors.mutedForeground,
                }}
              >
                Où
              </Text>
              <Text style={{ margin: "2px 0 0", fontWeight: 600, fontSize: 15 }}>
                {eventLocation}
              </Text>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: "center", marginTop: 20 }}>
              <Button
                href={confirmUrl}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.primaryForeground,
                  padding: "12px 20px",
                  borderRadius: 12,
                  textDecoration: "none",
                  display: "inline-block",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Confirmer ma présence
              </Button>
            </Section>

            <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

            <Text style={{ fontSize: 13, color: colors.mutedForeground, margin: 0 }}>
              Besoin d&apos;aide ? Contacte-nous à{" "}
              <Link
                href={`mailto:${supportEmail}`}
                style={{ color: colors.primary }}
              >
                {supportEmail}
              </Link>
              .
            </Text>
          </Section>

          <Text
            style={{
              textAlign: "center",
              color: colors.mutedForeground,
              fontSize: 11,
              marginTop: 12,
            }}
          >
            © {new Date().getFullYear()} {appName}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
