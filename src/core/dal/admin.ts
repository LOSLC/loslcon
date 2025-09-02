import { db } from "@/core/db/setup";
import { authSessionsTable, registrationsTable, usersTable } from "@/core/db/schemas";
import { and, eq, gt } from "drizzle-orm";

export async function listConnectedUsers() {
  const rows = await db
    .select({
      sessionId: authSessionsTable.id,
      userId: usersTable.id,
      fullName: usersTable.fullName,
      email: usersTable.email,
      createdAt: authSessionsTable.createdAt,
      expiresAt: authSessionsTable.expiresAt,
    })
    .from(authSessionsTable)
    .innerJoin(usersTable, eq(usersTable.id, authSessionsTable.userId))
    .where(and(eq(authSessionsTable.expired, false), gt(authSessionsTable.expiresAt, new Date())));
  return rows;
}

export async function listRegistrations() {
  const rows = await db
    .select()
    .from(registrationsTable);
  return rows;
}
