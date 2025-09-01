import { cookies } from "next/headers";
import { verifySignedValue } from "@/core/utils/cookies";
import { db } from "@/core/db/setup";
import { authSessionsTable, usersTable } from "@/core/db/schemas";
import { eq, and, gt } from "drizzle-orm";

export async function getSessionIdFromCookie() {
  const jar = await cookies();
  const raw = jar.get("loslcon.sid")?.value;
  if (!raw) return null;
  const val = await verifySignedValue(raw);
  return val;
}

export async function getSession() {
  const id = await getSessionIdFromCookie();
  if (!id) return null;
  const [session] = await db
    .select()
    .from(authSessionsTable)
    .where(and(eq(authSessionsTable.id, id), eq(authSessionsTable.expired, false), gt(authSessionsTable.expiresAt, new Date())))
    .limit(1);
  return session ?? null;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId))
    .limit(1);
  return user ?? null;
}
