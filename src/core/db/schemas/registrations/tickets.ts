import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";

export const ticketsTable = pg.pgTable("tickets", {
  id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
  type: pg.varchar("type").notNull(), // stantard, vip
  name: pg.varchar("name").notNull(),
  description: pg.text("description").notNull(),
  perks: pg.text("perks").notNull(),
  fGradient: pg.varchar("f_gradient"),
  sGradient: pg.varchar("s_gradient"),
  price: pg.integer("price").notNull(), // In XOF
  createdAt: pg.timestamp("created_at").defaultNow().notNull(),
  createdBy: pg
    .uuid("created_by")
    .references((): pg.AnyPgColumn => usersTable.id)
    .notNull(),
});

export type Ticket = typeof ticketsTable.$inferSelect;
export type NewTicket = typeof ticketsTable.$inferInsert;
