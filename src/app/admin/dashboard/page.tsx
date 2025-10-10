import { createTicket, getRegistrationsConfig, getTickets } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/dal/session";
import { listConnectedUsers, listRegistrations } from "@/core/dal/admin";
import { RegistrationSearch } from "../../../components/admin/registration-search";
import { Button } from "@/components/ui/button";
import { RegistrationSettingsForm } from "@/components/admin/registration-settings-form";
import { BroadcastForm } from "@/components/admin/dashboard/broadcast-form";
import { SummaryStats, PerTicketTable } from "@/components/admin/dashboard/stats";
import { TicketsGrid } from "@/components/admin/dashboard/tickets";
import { ConnectedUsersTable, RegistrationsTable } from "@/components/admin/dashboard/users-and-registrations";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      headers
        .map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? ""))
        .join(","),
    );
  }
  return lines.join("\n");
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    redirect("/auth/login");
  }

  const [sessions, regs, config, tickets] = await Promise.all([
    listConnectedUsers(),
    listRegistrations(),
    getRegistrationsConfig(),
    getTickets(),
  ]);

  const regsCsv = toCsv(regs);
  const sessionsCsv = toCsv(sessions);

  // Stats
  const totalRegs = regs.length;
  const confirmedRegs = regs.filter((r) => r.confirmed).length;
  const unconfirmedRegs = totalRegs - confirmedRegs;
  const attendedRegs = regs.filter((r) => r.attended).length;
  const perTicket = tickets.map((t) => {
    const rs = regs.filter((r) => r.ticket_id === t.id);
    const total = rs.length;
    const confirmed = rs.filter((r) => r.confirmed).length;
    const unconfirmed = total - confirmed;
    const attended = rs.filter((r) => r.attended).length;
    return { t, total, confirmed, unconfirmed, attended };
  });

  // Fuzzy-ish search (case-insensitive substring across multiple fields)
  const sp = (await searchParams) ?? {};
  const qRaw = sp.q;
  const q = (Array.isArray(qRaw) ? qRaw.join(" ") : qRaw ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const ticketNameById = new Map(tickets.map((t) => [t.id, t.name] as const));
  const filteredRegs = q
    ? regs.filter((r) => {
        const hay = [
          r.firstname,
          r.lastname,
          r.email,
          r.phone_number,
          ticketNameById.get(r.ticket_id) ?? r.ticket_id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
    : regs;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

  <BroadcastForm />

      {/* Stats */}
      <section className="mt-6 grid gap-4">
        <SummaryStats
          totalRegs={totalRegs}
          confirmedRegs={confirmedRegs}
          unconfirmedRegs={unconfirmedRegs}
          attendedRegs={attendedRegs}
        />
        <PerTicketTable perTicket={perTicket} />
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <form
          action={async (fd: FormData) => {
            "use server";
            await createTicket(fd);
            // naive refresh
            redirect("/admin/dashboard");
          }}
          className="rounded-lg border p-4"
        >
          <h2 className="text-lg font-semibold mb-3">Create ticket</h2>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                name="type"
                placeholder="standard | vip"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="perks">Perks (comma separated)</Label>
              <Input id="perks" name="perks" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="fGradient">First gradient</Label>
                <Input id="fGradient" name="fGradient" placeholder="#8b5cf6" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sGradient">Second gradient</Label>
                <Input id="sGradient" name="sGradient" placeholder="#06b6d4" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="price">Price (XOF)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                defaultValue={0}
                required
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input id="soldout" name="soldout" type="checkbox" />
              <span>Mark as sold out</span>
            </label>
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </div>
        </form>

        <RegistrationSettingsForm
          defaultOpen={config?.registrationsOpen ?? false}
          defaultCloseDate={
            config?.registrationsCloseDate
              ? new Date(config.registrationsCloseDate).toISOString()
              : null
          }
        />
      </section>

  <TicketsGrid tickets={tickets} />

  <ConnectedUsersTable sessions={sessions} />

      {/* Registrations search + table */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <RegistrationSearch />
      </div>
      <RegistrationsTable registrations={filteredRegs} tickets={tickets} />
    </main>
  );
}
