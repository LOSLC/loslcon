import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/dal/session";
import { listConnectedUsers, listRegistrations } from "@/core/dal/admin";
import { createTicket, getRegistrationsConfig, getTickets, updateTicket, deleteTicket } from "@/app/actions/loslcon/loslcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RegistrationSettingsForm } from "@/components/admin/registration-settings-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
  lines.push(headers.map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

export default async function AdminDashboardPage() {
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

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

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
              <Input id="type" name="type" placeholder="standard | vip" required />
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
              <Input id="price" name="price" type="number" min={0} defaultValue={0} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </div>
        </form>

        <RegistrationSettingsForm
          defaultOpen={config?.registrationsOpen ?? false}
          defaultCloseDate={config?.registrationsCloseDate ? new Date(config.registrationsCloseDate).toISOString() : null}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Tickets</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tickets.map((t) => {
            const perks = t.perks.split(",").map((p) => p.trim()).filter(Boolean);
            return (
              <div key={t.id} className="relative rounded-xl ring-1 ring-border overflow-hidden">
                <div
                  className="p-4"
                  style={{
                    background:
                      t.fGradient && t.sGradient
                        ? `linear-gradient(135deg, ${t.fGradient}, ${t.sGradient})`
                        : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{t.name}</div>
                      <div className="text-sm opacity-90">{t.description}</div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-background/70 px-2 py-1 text-xs">
                        <span className="font-medium uppercase tracking-wide">{t.type}</span>
                        <span className="opacity-70">•</span>
                        <span>{new Intl.NumberFormat(undefined, { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(t.price)}</span>
                      </div>
                    </div>
                  </div>
                  {perks.length > 0 && (
                    <ul className="mt-3 grid grid-cols-1 gap-1 text-sm">
                      {perks.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="inline-block size-1.5 rounded-full bg-primary/80" />
                          <span className="leading-tight">{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border-t p-3 flex items-center justify-end gap-2 bg-background/60">
                  <form action={async (fd: FormData) => { "use server"; fd.set("id", t.id); await deleteTicket(fd); redirect("/admin/dashboard"); }}>
                    <Button type="submit" variant="outline">Delete</Button>
                  </form>
                  <details className="w-full">
                    <summary className="cursor-pointer text-sm opacity-80 select-none">Edit</summary>
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        fd.set("id", t.id);
                        await updateTicket(fd);
                        redirect("/admin/dashboard");
                      }}
                      className="mt-3 grid grid-cols-2 gap-2"
                    >
                      <Input name="type" defaultValue={t.type} placeholder="standard | vip" required />
                      <Input name="name" defaultValue={t.name} required />
                      <Input className="col-span-2" name="description" defaultValue={t.description} required />
                      <Input className="col-span-2" name="perks" defaultValue={t.perks} required />
                      <Input name="fGradient" defaultValue={t.fGradient ?? ""} />
                      <Input name="sGradient" defaultValue={t.sGradient ?? ""} />
                      <Input name="price" type="number" min={0} defaultValue={t.price} required />
                      <div className="col-span-2 flex justify-end mt-2">
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Connected users</h2>
          <form action={async () => {
            "use server";
            // quick CSV download via data URL redirect
            const href = `data:text/csv;charset=utf-8,${encodeURIComponent(sessionsCsv)}`;
            redirect(href);
          }}>
            <Button type="submit" variant="outline">Export CSV</Button>
          </form>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.sessionId}>
                <TableCell>{s.fullName}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell className="font-mono text-xs">{s.sessionId}</TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(s.expiresAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event registrations</h2>
          <form action={async () => {
            "use server";
            const href = `data:text/csv;charset=utf-8,${encodeURIComponent(regsCsv)}`;
            redirect(href);
          }}>
            <Button type="submit" variant="outline">Export CSV</Button>
          </form>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead>Attended</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regs.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.firstname} {r.lastname}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.phone_number}</TableCell>
                <TableCell className="font-mono text-xs">{r.ticket_id}</TableCell>
                <TableCell>{r.confirmed ? "Yes" : "No"}</TableCell>
                <TableCell>{r.attended ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/registrations/${r.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
