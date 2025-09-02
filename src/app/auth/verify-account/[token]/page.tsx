import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAccount, resendVerificationEmail } from "@/app/actions/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

export default async function VerifyAccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const result = await verifyAccount(token);
  const isError = "error" in result;
  const qpMessage = typeof sp.message === "string" ? sp.message : undefined;
  const qpError = typeof sp.error === "string" ? sp.error : undefined;

  async function resend(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    if (!email) return;
    const out = await resendVerificationEmail(email);
    const qs = new URLSearchParams();
    if ("error" in out) {
  qs.set("error", String((out as { error?: unknown }).error ?? ""));
      redirect(`/auth/verify-account/${token}?${qs.toString()}`);
    }
    if ("message" in out) {
  qs.set("message", String((out as { message?: unknown }).message ?? ""));
      redirect(`/auth/verify-account/${token}?${qs.toString()}`);
    }
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>{isError ? "Verification failed" : "Account verified"}</CardTitle>
          <CardDescription>
            {isError ? result.error : result.message}
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-2">
          {isError && (
            <div role="alert" className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
              {result.error}
            </div>
          )}
          {!isError && (
            <div role="status" className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              {result.message}
            </div>
          )}
          {qpError && (
            <div role="alert" className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
              {qpError}
            </div>
          )}
          {qpMessage && (
            <div role="status" className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              {qpMessage}
            </div>
          )}
        </div>
        {!isError ? (
          <CardFooter className="justify-end gap-2">
            <Button asChild>
              <Link href="/auth/login">Continue to login</Link>
            </Button>
          </CardFooter>
        ) : (
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can request a new verification email below.
              </p>
              <form action={resend} className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button type="submit">Resend verification email</Button>
                  <Button asChild variant="outline">
                    <Link href="/auth/login">Back to login</Link>
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
