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
} from "@react-email/components";

type AccountVerificationEmailProps = {
	appName: string;
	recipientName: string;
	verificationUrl: string;
	supportEmail: string;
};

const colors = {
	background: "oklch(0.9776 0.0144 224.4907)",
	foreground: "oklch(0.2795 0.0368 260.031)",
	card: "oklch(0.9549 0.0326 218.3841)",
	border: "oklch(0.9217 0.026 259.0453)",
	primary: "oklch(0.3851 0.0585 259.9056)",
	primaryForeground: "oklch(0.9776 0.0144 224.4907)",
	mutedForeground: "oklch(0.2749 0.0353 258.9107)",
};

const base = {
	fontFamily:
		'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica Neue, Arial, Noto Sans, sans-serif',
};

export default function AccountVerificationEmail({
	appName,
	recipientName,
	verificationUrl,
	supportEmail,
}: AccountVerificationEmailProps) {
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
						<Heading style={{ margin: 0, fontSize: 24, lineHeight: 1.3 }}>
							Verify your account
						</Heading>
						<Text style={{ color: colors.mutedForeground, marginTop: 4 }}>
							{appName}
						</Text>

						<Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

						<Text style={{ fontSize: 16, lineHeight: 1.6 }}>
							Hi {recipientName},
						</Text>
						<Text style={{ fontSize: 16, lineHeight: 1.6 }}>
							Thanks for signing up. Please confirm your email address to activate your account.
						</Text>

						<Section style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}>
							<Button
								href={verificationUrl}
								style={{
									backgroundColor: colors.primary,
									color: colors.primaryForeground,
									padding: "12px 20px",
									borderRadius: 14,
									textDecoration: "none",
									display: "inline-block",
									fontWeight: 600,
								}}
							>
								Confirm email
							</Button>
						</Section>

						<Text style={{ fontSize: 14, color: colors.mutedForeground }}>
							Or copy and paste this link in your browser:
						</Text>
						<Text style={{ wordBreak: "break-all" }}>
							<Link href={verificationUrl} style={{ color: colors.primary }}>
								{verificationUrl}
							</Link>
						</Text>

						<Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

						<Text style={{ fontSize: 14, color: colors.mutedForeground }}>
							If you didn’t create an account, you can safely ignore this email. Need help? Contact
							{" "}
							<Link href={`mailto:${supportEmail}`} style={{ color: colors.primary }}>
								{supportEmail}
							</Link>
							.
						</Text>
					</Section>
					<Text style={{ textAlign: "center", color: colors.mutedForeground, fontSize: 12, marginTop: 16 }}>
						© {new Date().getFullYear()} {appName}
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

