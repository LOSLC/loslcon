CREATE TABLE "password_reset_requests" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"expired" boolean DEFAULT false NOT NULL,
	"code" varchar NOT NULL
);
--> statement-breakpoint
DROP TABLE "passowrd_reset_requests" CASCADE;--> statement-breakpoint
ALTER TABLE "password_reset_requests" ADD CONSTRAINT "password_reset_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;