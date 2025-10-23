import { getTickets, register, getRegistrationsConfig } from "@/app/actions/loslcon/loslcon";
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
import { Ticket } from "@/core/db/schemas";

export const dynamic = "force-dynamic";

export default async function EventRegistrationPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const config = await getRegistrationsConfig();
  const registrationsOpen = !!config?.registrationsOpen;
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

  if (!registrationsOpen) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">
            <span data-i18n="hero.closed">Registrations are closed</span>
          </h1>
          <p className="mt-2 text-muted-foreground" data-i18n="register.subtitle">
            Secure your spot at the premier open-source conference in Lomé. Fill out your details and choose a ticket.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <ContactHoverCard />
            <a href="/devenir-sponsor" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-accent/10 transition-colors" data-i18n="tickets.cta.sponsor">
              Become a Sponsor
            </a>
          </div>
        </div>
      </main>
    );
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
            <span data-i18n="register.badge">Limited seats available</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span data-i18n="register.title" className="text-wrap">Register for LOSL-CON 2025</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            <span data-i18n="register.subtitle">Secure your spot at the premier open-source conference in Lomé. Fill out your details and choose a ticket.</span>
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
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>
                <span data-i18n="register.form.details.title">Your details</span>
              </CardTitle>
              <CardDescription>
                <span data-i18n="register.form.details.desc">We’ll use this info to generate your ticket.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="firstname">
                  <span data-i18n="register.form.firstName">First name</span>
                </Label>
                <Input id="firstname" name="firstname" autoComplete="given-name" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastname">
                  <span data-i18n="register.form.lastName">Last name</span>
                </Label>
                <Input id="lastname" name="lastname" autoComplete="family-name" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">
                  <span data-i18n="register.form.email">Email</span>
                </Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone_number">
                  <span data-i18n="register.form.phone">Phone number</span>
                </Label>
                <PhoneField id="phone_number" required />
              </div>
            </CardContent>
          </Card>

          {/* Tickets card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>
                <span data-i18n="register.form.tickets.title">Choose your ticket</span>
              </CardTitle>
              <CardDescription>
                <span data-i18n="register.form.tickets.desc">Select one option below.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground" data-i18n="register.form.tickets.empty">No tickets available at the moment. Please check back later.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {tickets.map((t) => {
                    const bg = t.fGradient && t.sGradient
                      ? `linear-gradient(135deg, ${t.fGradient}, ${t.sGradient})`
                      : undefined;
                    const isSoldOut = Boolean((t as Ticket).soldout);
                    return (
                      <label
                        key={t.id}
                        className={
                          [
                            "group relative block rounded-xl border border-border/70 bg-background p-4 shadow-xs transition-all",
                            !isSoldOut && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
                            isSoldOut && "opacity-60 grayscale cursor-not-allowed",
                          ]
                            .filter(Boolean)
                            .join(" ")
                        }
                      >
                        <input
                          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                          type="radio"
                          name="ticket_id"
                          value={t.id}
                          required
                          defaultChecked={preselect === t.id}
                          disabled={isSoldOut}
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
                                {isSoldOut ? <span data-i18n="tickets.badges.soldout">Sold out</span> : String(t.type || "").toUpperCase()}
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
          <div className="md:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <p className="text-xs text-muted-foreground sm:mr-auto" data-i18n="register.form.legal">
              By registering, you agree to our event guidelines.
            </p>
            <Button type="submit" className="w-full sm:w-auto">
              <span data-i18n="register.form.submit">Register</span>
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

function ContactHoverCard() {
  return (
    <div className="inline-block">
      <div className="group relative">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-i18n="common.contactUs">
          Contact us
        </button>
        <div className="absolute left-1/2 top-full z-10 mt-2 w-72 -translate-x-1/2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
          <div className="text-sm font-semibold" data-i18n="common.contactUs">Contact us</div>
          <ul className="mt-2 text-sm space-y-1">
            <li>
              <a href="https://wa.me/22879633874" target="_blank" rel="noreferrer" className="underline">
                <span data-i18n="common.channels.whatsapp">WhatsApp</span>: +22879633874
              </a>
            </li>
            <li>
              <a href="mailto:community@loslc.tech" className="underline">
                <span data-i18n="common.channels.email">Email</span>: community@loslc.tech
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
