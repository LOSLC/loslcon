"use client";
import * as React from "react";
import { useActionState, useEffect } from "react";
import { login as performLogin } from "@/app/actions/auth/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type LoginState =
  | null
  | { error?: string; validationErrors?: Record<string, string[]>; sessionId?: string };

async function loginActionWrapper(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  return await performLogin(formData) as LoginState;
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginActionWrapper, null);
  const router = useRouter();

  useEffect(() => {
    if (state && state.sessionId) {
      router.replace("/admin/dashboard");
    }
  }, [state, router]);

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Login</h1>
      <form action={formAction}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/auth/reset-password-request"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Button type="submit" disabled={pending} className="mt-2">
            {pending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    {state && state.error ? (
        <p style={{ marginTop: 12, color: "#b00020" }}>
      {state.error}
        </p>
      ) : null}
    {state && state.validationErrors ? (
        <p style={{ marginTop: 12, color: "#b00020" }}>
          Please check your credentials.
        </p>
      ) : null}
  {/* Redirect will occur on success; no message needed here */}
      <p className="mt-6 text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </main>
  );
}
