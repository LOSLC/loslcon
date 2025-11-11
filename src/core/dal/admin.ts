import { db } from "@/core/db/setup";
import {
  authSessionsTable,
  registrationsTable,
  usersTable,
} from "@/core/db/schemas";
import { and, eq, gt, desc, count } from "drizzle-orm";

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
    .where(
      and(
        eq(authSessionsTable.expired, false),
        gt(authSessionsTable.expiresAt, new Date()),
      ),
    );
  return rows;
}

export async function listRegistrations(options?: {
  page?: number;
  perPage?: number;
}) {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 50;
  const offset = (page - 1) * perPage;

  const rows = await db
    .select()
    .from(registrationsTable)
    .orderBy(desc(registrationsTable.createdAt))
    .limit(perPage)
    .offset(offset);

  return rows;
}

export async function countRegistrations() {
  const result = await db.select({ count: count() }).from(registrationsTable);
  return result[0]?.count ?? 0;
}
