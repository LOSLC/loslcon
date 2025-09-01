ALTER TABLE "registrations" ALTER COLUMN "transaction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "perks" text NOT NULL;