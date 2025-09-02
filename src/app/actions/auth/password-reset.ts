"use server";
import { z } from "zod";
import { db } from "@/core/db/setup";
import {
  passwordResetRequestsTable,
  passwordResetSessionsTable,
  usersTable,
} from "@/core/db/schemas";
import { eq } from "drizzle-orm";
import { addMinutes, isBefore } from "date-fns";
import { sendEmail } from "@/core/services/mailing/mailer";
import { appConfig } from "@/core/utils/config";
import { hashString } from "@/core/utils/crypto";

const requestSchema = z.object({ email: z.string().email() });

export async function requestPasswordReset(form: FormData) {
  const parsed = requestSchema.safeParse({ email: form.get("email") });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors };
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email))
    .limit(1);
  if (!user)
    return { message: "If an account exists, a reset email was sent." };

  const expiresAt = addMinutes(new Date(), 10);
  const [req] = await db
    .insert(passwordResetRequestsTable)
    .values({ userId: user.id, expiresAt })
    .returning();

  // Minimal email (template can be added later)
  sendEmail({
    from: { email: appConfig.appEmail, name: appConfig.appName },
    to: user.email,
    subject: "Password reset code",
    text: `Your password reset code is ${req.code}. Use this link to proceed: ${appConfig.appBaseUrl}/auth/reset-password/${req.id}`,
  });
  return { message: "If an account exists, a reset email was sent." };
}

const performSchema = z.object({
  sessionId: z.string(),
  code: z.string(),
  password: z.string().min(8),
});

export async function resetPassword(form: FormData) {
  const parsed = performSchema.safeParse({
    sessionId: form.get("sessionId"),
    code: form.get("code"),
    password: form.get("password"),
  });
  
  if (!parsed.success)
    return { validationErrors: parsed.error.flatten().fieldErrors };
  console.log(parsed.data)
  const [session] = await db
    .select()
    .from(passwordResetRequestsTable)
    .where(eq(passwordResetRequestsTable.id, parsed.data.sessionId))
    .limit(1);

  if (!session || session.expired || isBefore(session.expiresAt, new Date())) {
    return { error: "Reset session expired or invalid." };
  }

  if (session.code !== parsed.data.code) {
    return { error: "Invalid reset code." };
  }

  await db
    .update(usersTable)
    .set({ password: await hashString(parsed.data.password) })
    .where(eq(usersTable.id, session.userId));

  return { message: "Password has been reset." };
}
