import { db } from "@/core/db/setup";
import { registrationsTable, ticketsTable } from "@/core/db/schemas";
import { eq } from "drizzle-orm";

export async function getTickets() {
  return await db.select().from(ticketsTable);
}

export async function getTicketById(id: string) {
  const [t] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id)).limit(1);
  return t ?? null;
}

export async function createRegistration(input: {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  ticket_id: string;
}) {
  const [row] = await db.insert(registrationsTable).values(input).returning();
  return row;
}
