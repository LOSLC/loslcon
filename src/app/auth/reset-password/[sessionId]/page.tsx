import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordWithSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Set a new password</h1>
      <ResetPasswordForm sessionId={sessionId} />
    </main>
  );
}
