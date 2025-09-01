import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/dal/session";
import { getRegistrationById, markRegistrationAttended } from "@/app/actions/loslcon/loslcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    redirect("/auth/login");
  }
  const { id } = await params;
  const reg = await getRegistrationById(id);
  if ("error" in reg) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
    {reg.error}
        </div>
        <div className="mt-4">
          <Link href="/admin/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
      </main>
    );
  }
  const r = reg;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Registration</h1>
        <Link href="/admin/dashboard"><Button variant="outline">Back</Button></Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-3">Details</h2>
          <div className="grid gap-2 text-sm">
            <div><span className="opacity-70">Name:</span> <span className="font-medium">{r.firstname} {r.lastname}</span></div>
            <div><span className="opacity-70">Email:</span> <span>{r.email}</span></div>
            <div><span className="opacity-70">Phone:</span> <span>{r.phone_number}</span></div>
            <div><span className="opacity-70">Ticket ID:</span> <span className="font-mono text-xs">{r.ticket_id}</span></div>
            <div><span className="opacity-70">Transaction:</span> <span className="font-mono text-xs">{r.transaction_id || "—"}</span></div>
            <div><span className="opacity-70">Confirmed:</span> <span>{r.confirmed ? "Yes" : "No"}</span></div>
            <div><span className="opacity-70">Attended:</span> <span>{r.attended ? "Yes" : "No"}</span></div>
            <div><span className="opacity-70">Created:</span> <span>{new Date(r.createdAt).toLocaleString()}</span></div>
            <div><span className="opacity-70">Registration ID:</span> <span className="font-mono text-xs break-all">{r.id}</span></div>
          </div>
        </div>

        <div className="rounded-lg border p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">Actions</h2>
          {r.attended ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">Already marked as attended.</div>
          ) : (
            <form
              action={async (fd: FormData) => {
                "use server";
                fd.set("id", r.id);
                await markRegistrationAttended(fd);
                // refresh page
                redirect(`/admin/registrations/${r.id}`);
              }}
            >
              <Button type="submit">Mark as attended</Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
