import { redirect } from "next/navigation";

export default function ResetPasswordPage() {
	// Guide users to use the link from their email which contains the session id
	redirect("/auth/reset-password-request");
}
