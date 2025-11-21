import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/dal/session";
import { createManualRegistration, getTickets } from "@/app/actions/loslcon/loslcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function NewRegistrationPage() {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    redirect("/");
  }

  const tickets = await getTickets();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Registration</h1>

        <form
          action={async (fd: FormData) => {
            "use server";
            const id = await createManualRegistration(fd);
            redirect(`/admin/registrations/${id}`);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name *</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                required
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name *</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              required
              placeholder="+228 90 00 00 00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_id">Ticket Type *</Label>
            <select
              id="ticket_id"
              name="ticket_id"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a ticket</option>
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "XOF",
                    maximumFractionDigits: 0,
                  }).format(t.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Create Registration</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
