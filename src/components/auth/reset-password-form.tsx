"use client";
import { useActionState } from "react";
import { resetPassword } from "@/app/actions/auth/password-reset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ResetState = null | { message?: string; error?: string; validationErrors?: Record<string, string[]> };

async function actionWrapper(_prev: ResetState, fd: FormData): Promise<ResetState> {
  return await resetPassword(fd) as ResetState;
}

export function ResetPasswordForm({ sessionId }: { sessionId: string }) {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(actionWrapper, null);
  return (
    <div>
      {state && state.message && (
        <p className="mb-3 text-sm text-emerald-500">
          {state.message}
        </p>
      )}
      {state && state.error && (
        <p className="mb-3 text-sm text-red-500">{state.error}</p>
      )}
      <form action={formAction} className="grid gap-3">
        <input type="hidden" name="sessionId" value={sessionId} />
        <div className="grid gap-1">
          <Label htmlFor="code">Reset code</Label>
          <Input id="code" name="code" required />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Resetting..." : "Reset password"}
        </Button>
      </form>
      <p className="mt-4 text-sm opacity-80">
        Remembered your password?{" "}
        <Link
          href="/auth/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
