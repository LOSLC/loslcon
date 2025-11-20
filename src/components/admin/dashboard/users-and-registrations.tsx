"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConfirmDeleteRegistration } from "@/components/admin/confirm-delete-registration";
import { updateRegistration, deleteRegistration, markRegistrationHadFood } from "@/app/actions/loslcon/loslcon";
import { useRouter } from "next/navigation";

export function ConnectedUsersTable({ sessions }: { sessions: Array<{ sessionId: string; fullName: string; email: string; createdAt: string | number | Date; expiresAt: string | number | Date }> }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Connected users</h2>
        <a href="/admin/dashboard/export?type=sessions">
          <Button variant="outline">Export CSV</Button>
        </a>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
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
      </div>
    </section>
  );
}

export function RegistrationsTable({
  registrations,
  tickets,
  currentPage = 1,
  totalPages = 1,
}: {
  registrations: Array<{ 
    id: string; 
    firstname: string; 
    lastname: string; 
    email: string; 
    phone_number: string; 
    ticket_id: string; 
    confirmed: boolean; 
    attended: boolean;
    attendanceConfirmed: boolean;
    hadFood: boolean;
    createdAt: string | number | Date 
  }>;
  tickets: Array<{ id: string; name: string; price: number }>;
  currentPage?: number;
  totalPages?: number;
}) {
  const router = useRouter();
  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">Event registrations</h2>
        {/* RegistrationSearch remains on page to keep server/client boundaries simple */}
      </div>
      <div className="mb-3 flex items-center justify-between">
        <a href="/admin/dashboard/export?type=registrations">
          <Button variant="outline">Export CSV</Button>
        </a>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead>Attended</TableHead>
              <TableHead>Will Attend</TableHead>
              <TableHead>Had Food</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((r) => (
              <TableRow 
                key={r.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin/registrations/${r.id}`)}
              >
                <TableCell>
                  {r.firstname} {r.lastname}
                </TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.phone_number}</TableCell>
                <TableCell className="font-mono text-xs">{r.ticket_id}</TableCell>
                <TableCell>{r.confirmed ? "Yes" : "No"}</TableCell>
                <TableCell>{r.attended ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {r.attendanceConfirmed ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Yes</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <form
                    action={async (fd: FormData) => {
                      fd.set("id", r.id);
                      await markRegistrationHadFood(fd);
                      router.refresh();
                    }}
                    className="inline"
                  >
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="hadFood" 
                        defaultChecked={r.hadFood}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="cursor-pointer"
                      />
                      <span className="text-xs">{r.hadFood ? "Yes" : "No"}</span>
                    </label>
                  </form>
                </TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <details className="inline-block text-left">
                    <summary className="cursor-pointer text-sm opacity-80 select-none">Manage</summary>
                    <div className="mt-3 grid gap-2 p-3 rounded-md border bg-background/60">
                      <ConfirmDeleteRegistration
                        id={r.id}
                        action={async (fd: FormData) => {
                          fd.set("id", r.id);
                          await deleteRegistration(fd);
                          router.push("/admin/dashboard");
                        }}
                      />
                      <form
                        action={async (fd: FormData) => {
                          fd.set("id", r.id);
                          await updateRegistration(fd);
                          router.refresh();
                        }}
                        className="grid grid-cols-2 gap-2"
                      >
                        <select name="ticket_id" defaultValue={r.ticket_id} className="col-span-2 rounded-md border bg-background px-2 py-1 text-sm">
                          {tickets.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} — {new Intl.NumberFormat(undefined, { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(t.price)}
                            </option>
                          ))}
                        </select>
                        <label className="col-span-2 inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" name="confirmed" defaultChecked={r.confirmed} />
                          <span>Confirmed</span>
                        </label>
                        <div className="col-span-2 flex justify-end mt-1.5">
                          <Button type="submit" size="sm" variant="outline">Save</Button>
                        </div>
                      </form>
                      <Link href={`/admin/registrations/${r.id}`} className="text-xs underline opacity-80">View details</Link>
                    </div>
                  </details>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">Next</Button>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
