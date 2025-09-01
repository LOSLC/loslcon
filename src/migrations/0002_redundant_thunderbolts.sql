CREATE TABLE "registrations_config" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"registrations_open" boolean DEFAULT false NOT NULL,
	"registrations_close_date" timestamp
);
--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "confirmed" boolean DEFAULT false NOT NULL;