import { getTickets, register } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhoneField } from "@/components/forms/phone-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function EventRegistrationPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const tickets = await getTickets();
  const sp = await searchParams;
  const msg = typeof sp.message === "string" ? sp.message : undefined;
  const err = typeof sp.error === "string" ? sp.error : undefined;
  const preselect = typeof sp.ticket === "string" ? sp.ticket : undefined;

  async function action(formData: FormData) {
    "use server";
    // Extract values and map to register(details)
    const details = {
      firstName: String(formData.get("firstname") || "").trim(),
      lastName: String(formData.get("lastname") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phoneNumber: String(formData.get("phone_number") || "").trim(), // national number
      ticketId: String(formData.get("ticket_id") || "").trim(),
      countryCode: String(
        formData.get("country_code") || formData.get("country") || "",
      ).trim(), // ISO2 expected by backend
    } as const;
    const out = await register(details);
    const qs = new URLSearchParams();
    if ("validationErrors" in out) {
      const ve = out.validationErrors as Record<string, string[] | undefined>;
      const firstMsg =
        Object.values(ve)
          .flat()
          .find((m) => typeof m === "string" && m.trim().length > 0) ??
        "Please check your inputs.";
      qs.set("error", firstMsg);
      redirect(`/register?${qs.toString()}`);
    }
    if ("error" in out) {
      qs.set("error", String(out.error));
      redirect(`/register?${qs.toString()}`);
    }
    if ("message" in out) {
      qs.set("message", String(out.message));
      redirect(`/register?${qs.toString()}`);
    }
    if ("paymentUrl" in out) {
      redirect(String(out.paymentUrl));
    }
  }

  return (
    <main className="relative">
      {/* Subtle background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_400px_at_50%_-50%,hsl(var(--primary)/0.08),transparent)] dark:bg-[radial-gradient(1000px_400px_at_50%_-50%,hsl(var(--primary)/0.12),transparent)]"
      />

      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-primary/70" />
            Limited seats available
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Register for LOSL-CON 2025
          </h1>
          <p className="mt-2 text-muted-foreground">
            Secure your spot at the premier open-source conference in Lomé. Fill out your details and choose a ticket.
          </p>
        </header>

        <div className="mt-6">
          {err && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-900 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            >
              {err}
            </div>
          )}
          {msg && (
            <div
              role="status"
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 shadow-sm backdrop-blur dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
            >
              {msg}
            </div>
          )}
        </div>

        <form action={action} className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Details card */}
          <Card className="md:col-span-1 order-2 md:order-1">
            <CardHeader>
              <CardTitle>Your details</CardTitle>
              <CardDescription>We’ll use this info to generate your ticket.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" name="firstname" autoComplete="given-name" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" name="lastname" autoComplete="family-name" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone_number">Phone number</Label>
                <PhoneField id="phone_number" required />
              </div>
            </CardContent>
          </Card>

          {/* Tickets card */}
          <Card className="md:col-span-1 order-1 md:order-2">
            <CardHeader>
              <CardTitle>Choose your ticket</CardTitle>
              <CardDescription>Select one option below.</CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tickets available at the moment. Please check back later.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {tickets.map((t) => {
                    const bg = t.fGradient && t.sGradient
                      ? `linear-gradient(135deg, ${t.fGradient}, ${t.sGradient})`
                      : undefined;
                    return (
                      <label
                        key={t.id}
                        className="group relative block cursor-pointer rounded-xl border border-border/70 bg-background p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-ring"
                      >
                        <input
                          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                          type="radio"
                          name="ticket_id"
                          value={t.id}
                          required
                          defaultChecked={preselect === t.id}
                          aria-label={`Select ${t.name} ticket`}
                        />
                        <div
                          className="relative overflow-hidden rounded-lg p-4 ring-1 ring-border transition-all peer-checked:ring-2 peer-checked:ring-primary"
                          style={{ background: bg }}
                        >
                          {/* overlay for contrast when gradient exists */}
                          {bg && <div className="pointer-events-none absolute inset-0 bg-background/40 dark:bg-black/30" />}
                          <div className="relative z-10">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-base font-semibold leading-tight">{t.name}</div>
                                {t.description && (
                                  <div className="mt-1 text-xs text-foreground/80 line-clamp-3">{t.description}</div>
                                )}
                              </div>
                              <span className="rounded-md bg-background/70 px-2 py-1 text-[10px] font-medium tracking-wide">
                                {String(t.type || "").toUpperCase()}
                              </span>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                              <span className="text-2xl font-bold">
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "XOF",
                                  maximumFractionDigits: 0,
                                }).format(t.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit row */}
          <div className="md:col-span-2 mt-2">
            <div className="sticky bottom-3 z-20 md:static">
              <div className="rounded-xl border bg-background/80 px-3 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <p className="text-xs text-muted-foreground sm:mr-auto">
                    By registering, you agree to our event guidelines.
                  </p>
                  <Button type="submit" className="w-full sm:w-auto">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
