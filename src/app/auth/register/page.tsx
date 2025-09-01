"use client";
import * as React from "react";
import { useActionState } from "react";
import { createAccount as performCreateAccount } from "@/app/actions/auth/auth";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type RegisterState = null | {
  id?: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
};

async function registerActionWrapper(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  return await performCreateAccount(formData) as RegisterState;
}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(registerActionWrapper, null);

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Create account</h1>
      <form action={formAction}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create account"}
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
          Please check your inputs.
        </p>
      ) : null}
    {state && state.id && !state.error ? (
        <p style={{ marginTop: 12, color: "#0a7d2d" }}>
          Account created. Check your email to verify.
        </p>
      ) : null}
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
