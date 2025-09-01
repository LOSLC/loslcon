import { getTickets, register } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhoneField } from "@/components/forms/phone-field";

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
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Register for LOSL-CON 2025</h1>
      <div className="mt-4">
        {err && (
          <div
            role="alert"
            className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            {err}
          </div>
        )}
        {msg && (
          <div
            role="status"
            className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            {msg}
          </div>
        )}
      </div>
      <form
        action={action}
        className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="firstname">First name</Label>
          <Input id="firstname" name="firstname" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lastname">Last name</Label>
          <Input id="lastname" name="lastname" required />
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label htmlFor="phone_number">Phone number</Label>
          <PhoneField id="phone_number" required />
        </div>
        <div className="md:col-span-2">
          <Label className="mb-2 block">Choose your ticket</Label>
          <div className="grid gap-4 md:grid-cols-2">
            {tickets.map((t) => (
              <label
                key={t.id}
                className="relative block cursor-pointer rounded-xl border p-4 shadow-sm transition hover:shadow-lg hover:-translate-y-[2px]"
              >
                <input
                  className="peer absolute inset-0 cursor-pointer opacity-0"
                  type="radio"
                  name="ticket_id"
                  value={t.id}
                  required
                  defaultChecked={preselect === t.id}
                />
                <div
                  className="rounded-lg p-4 ring-1 ring-border peer-checked:ring-2 peer-checked:ring-primary"
                  style={{
                    background:
                      t.fGradient && t.sGradient
                        ? `linear-gradient(135deg, ${t.fGradient}, ${t.sGradient})`
                        : undefined,
                  }}
                >
                  <div className="text-lg font-semibold">{t.name}</div>
                  <div className="text-sm opacity-80">{t.description}</div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-background/70 px-3 py-1 text-sm">
                    <span className="font-medium">{t.type.toUpperCase()}</span>
                    <span className="opacity-70">•</span>
                    <span>
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "XOF",
                        maximumFractionDigits: 0,
                      }).format(t.price)}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </main>
  );
}
