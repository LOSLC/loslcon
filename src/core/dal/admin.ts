import { db } from "@/core/db/setup";
import {
  authSessionsTable,
  registrationsTable,
  usersTable,
} from "@/core/db/schemas";
import { and, eq, gt, desc, count, or, ilike, sql } from "drizzle-orm";

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
  search?: string;
}) {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 50;
  const offset = (page - 1) * perPage;
  const search = options?.search?.trim().toLowerCase();

  let query = db
    .select()
    .from(registrationsTable)
    .orderBy(desc(registrationsTable.createdAt))
    .limit(perPage)
    .offset(offset);

  if (search) {
    query = query.where(
      or(
        ilike(registrationsTable.firstname, `%${search}%`),
        ilike(registrationsTable.lastname, `%${search}%`),
        ilike(registrationsTable.email, `%${search}%`),
        ilike(registrationsTable.phone_number, `%${search}%`),
        ilike(registrationsTable.ticket_id, `%${search}%`),
        sql`LOWER(CONCAT(${registrationsTable.firstname}, ' ', ${registrationsTable.lastname})) LIKE ${`%${search}%`}`
      )
    ) as typeof query;
  }

  const rows = await query;
  return rows;
}

export async function countRegistrations(options?: { search?: string }) {
  const search = options?.search?.trim().toLowerCase();

  let query = db.select({ count: count() }).from(registrationsTable);

  if (search) {
    query = query.where(
      or(
        ilike(registrationsTable.firstname, `%${search}%`),
        ilike(registrationsTable.lastname, `%${search}%`),
        ilike(registrationsTable.email, `%${search}%`),
        ilike(registrationsTable.phone_number, `%${search}%`),
        ilike(registrationsTable.ticket_id, `%${search}%`),
        sql`LOWER(CONCAT(${registrationsTable.firstname}, ' ', ${registrationsTable.lastname})) LIKE ${`%${search}%`}`
      )
    ) as typeof query;
  }

  const result = await query;
  return result[0]?.count ?? 0;
}
