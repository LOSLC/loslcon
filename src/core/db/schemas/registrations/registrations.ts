import * as pg from "drizzle-orm/pg-core";
import { ticketsTable } from "./tickets";

export const registrationsTable = pg.pgTable("registrations", {
  id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
  firstname: pg.varchar("first_name").notNull(),
  lastname: pg.varchar("last_name").notNull(),
  email: pg.varchar("email").notNull().unique(),
  phone_number: pg.varchar("phone_number").notNull(),
  ticket_id: pg
    .uuid("ticket_id")
    .references((): pg.AnyPgColumn => ticketsTable.id, { onDelete: "cascade" })
    .notNull(),
  transaction_id: pg.varchar("transaction_id").unique(),
  confirmed: pg.boolean("confirmed").default(false).notNull(),
  attendanceConfirmed: pg.boolean("attendance_confirmed").default(false).notNull(),
  hadFood: pg.boolean("had_food").default(false).notNull(),
  attended: pg.boolean("attended").default(false).notNull(),
  createdAt: pg.timestamp("created_at").defaultNow().notNull(),
});
