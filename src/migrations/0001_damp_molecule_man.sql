ALTER TABLE "account_verification_sessions" DROP CONSTRAINT "account_verification_sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_sessions" DROP CONSTRAINT "auth_sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "passowrd_reset_requests" DROP CONSTRAINT "passowrd_reset_requests_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "password_reset_sessions" DROP CONSTRAINT "password_reset_sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_ticket_id_tickets_id_fk";
--> statement-breakpoint
ALTER TABLE "account_verification_sessions" ADD CONSTRAINT "account_verification_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passowrd_reset_requests" ADD CONSTRAINT "passowrd_reset_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_sessions" ADD CONSTRAINT "password_reset_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;