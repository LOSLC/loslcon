import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteTicket, updateTicket } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";

export function TicketCard({ t }: { t: { id: string; type: string; name: string; description: string; perks: string; fGradient?: string | null; sGradient?: string | null; price: number } }) {
  const perks = t.perks
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
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
              <span>
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "XOF",
                  maximumFractionDigits: 0,
                }).format(t.price)}
              </span>
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
        <form
          action={async (fd: FormData) => {
            "use server";
            fd.set("id", t.id);
            await deleteTicket(fd);
            redirect("/admin/dashboard");
          }}
        >
          <Button type="submit" variant="outline">
            Delete
          </Button>
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
}

export function TicketsGrid({ tickets }: { tickets: Array<{ id: string; type: string; name: string; description: string; perks: string; fGradient?: string | null; sGradient?: string | null; price: number }> }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Tickets</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {tickets.map((t) => (
          <TicketCard key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
}
