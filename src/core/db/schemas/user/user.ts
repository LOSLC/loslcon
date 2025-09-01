import { randNumericString, randString } from "@/core/utils/random";
import * as pg from "drizzle-orm/pg-core";
import { addDays, addHours, addMinutes } from "date-fns";

const VERIFICATION_DELAY_HOURS = 2;
const AUTH_SESSION_EXPIRATION_TIME_DAYS = 7;
const PWD_RESET_DELAY_MINUTES = 15;
const PWD_RESET_REQUEST_EXPIRATION_MINUTES = 10;

export const usersTable = pg.pgTable("users", {
  id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
  fullName: pg.varchar("full_name").notNull(),
  email: pg.varchar("email").notNull().unique(),
  password: pg.varchar("password").notNull(),
  createdAt: pg.timestamp("created_at").defaultNow().notNull(),
  verified: pg.boolean("verified").default(false).notNull(),
  accessLevel: pg.integer("access_level").default(0).notNull(), // 0: admin, 1: superadmin
});

export const authSessionsTable = pg.pgTable("auth_sessions", {
  id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
  expired: pg.boolean("expired").default(false).notNull(),
  userId: pg
    .uuid("user_id")
    .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: pg.timestamp("created_at").defaultNow().notNull(),
  expiresAt: pg
    .timestamp("expires_at")
    .$defaultFn(() => addDays(new Date(), AUTH_SESSION_EXPIRATION_TIME_DAYS))
    .notNull(),
});

export const accountVerificationSessionsTable = pg.pgTable(
  "account_verification_sessions",
  {
    id: pg
      .varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => randString()),
    userId: pg
      .uuid("user_id")
      .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: pg.timestamp("created_at").defaultNow().notNull(),
    expiresAt: pg
      .timestamp("expires_at")
      .$defaultFn(() => addHours(new Date(), VERIFICATION_DELAY_HOURS))
      .notNull(),
    expired: pg.boolean("expired").default(false).notNull(),
  },
);

export const passwordResetRequestsTable = pg.pgTable(
  "password_reset_requests",
  {
    id: pg
      .varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => randString()),
    userId: pg
      .uuid("user_id")
      .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: pg.timestamp("created_at").defaultNow().notNull(),
    expiresAt: pg.timestamp("expires_at").notNull(),
    expired: pg.boolean("expired").default(false).notNull(),
    code: pg
      .varchar("code")
      .$defaultFn(() => randNumericString())
      .notNull(),
  },
);

export const passwordResetSessionsTable = pg.pgTable(
  "password_reset_sessions",
  {
    id: pg
      .varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => randString()),
    userId: pg
      .uuid("user_id")
      .references((): pg.AnyPgColumn => usersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: pg.timestamp("created_at").defaultNow().notNull(),
    expiresAt: pg
      .timestamp("expires_at")
      .$defaultFn(() =>
        addMinutes(new Date(), PWD_RESET_REQUEST_EXPIRATION_MINUTES),
      )
      .notNull(),
    expired: pg.boolean("expired").default(false).notNull(),
  },
);

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type AuthSession = typeof authSessionsTable.$inferSelect;
export type NewAuthSession = typeof authSessionsTable.$inferInsert;
export type AccountVerificationSession =
  typeof accountVerificationSessionsTable.$inferSelect;
export type NewAccountVerificationSession =
  typeof accountVerificationSessionsTable.$inferInsert;
export type PasswordResetRequest =
  typeof passwordResetRequestsTable.$inferSelect;
export type NewPasswordResetRequest =
  typeof passwordResetRequestsTable.$inferInsert;
export type PasswordResetSession =
  typeof passwordResetSessionsTable.$inferSelect;
export type NewPasswordResetSession =
  typeof passwordResetSessionsTable.$inferInsert;
