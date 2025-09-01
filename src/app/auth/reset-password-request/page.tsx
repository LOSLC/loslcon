"use client";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth/password-reset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ResetReqState = null | { message?: string; validationErrors?: Record<string, string[]>; error?: string };

async function actionWrapper(_prev: ResetReqState, fd: FormData): Promise<ResetReqState> {
	return await requestPasswordReset(fd) as ResetReqState;
}

export default function ResetPasswordRequestPage() {
	const [state, formAction, pending] = useActionState<ResetReqState, FormData>(actionWrapper, null);
	return (
		<main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
			<h1 style={{ fontSize: 24, marginBottom: 16 }}>Reset your password</h1>
			{state && state.message && (
				<p className="mb-3 text-sm text-emerald-500">{state.message}</p>
			)}
			{state && state.validationErrors && (
				<p className="mb-3 text-sm text-red-500">Please enter a valid email.</p>
			)}
			<form action={formAction} className="grid gap-3">
				<div className="grid gap-1">
					<Label htmlFor="email">Email</Label>
					<Input id="email" name="email" type="email" required />
				</div>
				<Button type="submit" disabled={pending}>{pending ? "Sending..." : "Send reset link"}</Button>
			</form>
		</main>
	);
}
