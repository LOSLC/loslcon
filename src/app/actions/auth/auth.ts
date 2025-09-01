"use server";

import {
  accountVerificationSessionsTable,
  authSessionsTable,
  usersTable,
} from "@/core/db/schemas";
import { db } from "@/core/db/setup";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { UserDto } from "./dto";
import { compareHash, hashString } from "@/core/utils/crypto";
import { sendEmail } from "@/core/services/mailing/mailer";
import { appConfig } from "@/core/utils/config";
import AccountVerificationEmail from "@/core/services/mailing/templates/account-verification";
import AccountLoginNotification from "@/core/services/mailing/templates/account-login-notification";
import { setHttpOnlyCookie } from "@/core/utils/cookies";

export async function createAccount(data: FormData) {
  const accountCreationSchema = z.object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 4 characters long" }),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "The password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/)
      .regex(/[0-9]/, {
        message: "The password must contain at least one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "The password must contain at least one special character",
      }),
  });

  const parsedData = accountCreationSchema.safeParse({
    fullName: data.get("fullName"),
    email: data.get("email"),
    password: data.get("password"),
    passwordConfirmation: data.get("passwordConfirmation"),
  });

  if (!parsedData.success) {
    const errors = parsedData.error.flatten().fieldErrors;
    return { validationErrors: errors };
  }

  if (!appConfig.authorizedEmails.includes(parsedData.data.email)) {
    return { error: "You are not allowed to create an account" };
  }

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsedData.data.email))
    .limit(1);
  if (existingUser) {
    return { error: "A user with this email already exists" };
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      fullName: parsedData.data.fullName,
      email: parsedData.data.email,
      password: await hashString(parsedData.data.password),
    })
    .returning();

  const [accountVerificationSession] = await db
    .insert(accountVerificationSessionsTable)
    .values({
      userId: user.id,
    })
    .returning();
  sendEmail({
    from: {
      email: appConfig.appEmail,
      name: appConfig.appName,
    },
    to: user.email,
    subject: "Verify your account",
    component: AccountVerificationEmail,
    props: {
      appName: appConfig.appName,
      recipientName: user.fullName,
      supportEmail: appConfig.supportEmail,
      verificationUrl: `${appConfig.appBaseUrl}/auth/verify-account/${accountVerificationSession.id}`,
    },
  });

  const u: UserDto = {
    fullName: user.fullName,
    email: user.email,
    id: user.id,
    verified: user.verified,
    accessLevel: user.accessLevel,
  };
  return u;
}

export async function login(data: FormData): Promise<
  | {
      validationErrors?: {
        email?: string[];
        password?: string[];
      };
    }
  | { error: string }
  | (UserDto & { sessionId: string })
> {
  const loginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password is required" }),
  });

  const parsedData = loginSchema.safeParse({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (!parsedData.success) {
    const errors = parsedData.error.flatten().fieldErrors;
    return { validationErrors: errors };
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsedData.data.email))
    .limit(1);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (!user.verified) {
    return { error: "Please verify your account before logging in" };
  }

  if (!(await compareHash(parsedData.data.password, user.password))) {
    return { error: "Invalid email or password" };
  }

  // Fire-and-forget login notification email
  sendEmail({
    from: { email: appConfig.appEmail, name: appConfig.appName },
    to: user.email,
    subject: "New login to your account",
    component: AccountLoginNotification,
    props: { userName: user.fullName },
  });

  // Create auth session and set httpOnly cookie
  const [session] = await db
    .insert(authSessionsTable)
    .values({ userId: user.id })
    .returning();
  // 7 days in seconds (matches schema default)
  await setHttpOnlyCookie("loslcon.sid", session.id, 60 * 60 * 24 * 7);

  return {
    fullName: user.fullName,
    email: user.email,
    id: user.id,
    verified: user.verified,
    accessLevel: user.accessLevel,
    sessionId: session.id,
  };
}

export async function resendVerificationEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return {
      error:
        "If an account with that email exists, a verification email has been sent",
    };
  }

  if (user.verified) {
    return { message: "Account is already verified" };
  }

  const [accountVerificationSession] = await db
    .insert(accountVerificationSessionsTable)
    .values({
      userId: user.id,
    })
    .returning();

  sendEmail({
    from: {
      email: appConfig.appEmail,
      name: appConfig.appName,
    },
    to: user.email,
    subject: "Verify your account",
    component: AccountVerificationEmail,
    props: {
      appName: appConfig.appName,
      recipientName: user.fullName,
      supportEmail: appConfig.supportEmail,
      verificationUrl: `${appConfig.appBaseUrl}/auth/verify-account/${accountVerificationSession.id}`,
    },
  });

  return {
    message:
      "If an account with that email exists, a verification email has been sent",
  };
}

export async function verifyAccount(token: string) {
  const [accountVerificationSession] = await db
    .select()
    .from(accountVerificationSessionsTable)
    .where(eq(accountVerificationSessionsTable.id, token))
    .limit(1);

  if (!accountVerificationSession) {
    return { error: "Invalid verification link" };
  }

  if (
    accountVerificationSession.expired ||
    new Date() > accountVerificationSession.expiresAt
  ) {
    return {
      error: "This verification link has expired. Please request a new one.",
    };
  }

  await db
    .update(usersTable)
    .set({ verified: true })
    .where(eq(usersTable.id, accountVerificationSession.userId));

  return { message: "Account verified successfully" };
}
