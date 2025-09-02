import * as pg from "drizzle-orm/pg-core";

export const registrationsConfigTable = pg.pgTable("registrations_config", {
  id: pg.integer("id").default(1).primaryKey().notNull(),
  registrationsOpen: pg.boolean("registrations_open").default(false).notNull(),
  registrationsCloseDate: pg.timestamp("registrations_close_date"),
});
