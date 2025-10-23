import {
  getTickets,
  getRegistrationsConfig,
} from "@/app/actions/loslcon/loslcon";
import PremiumTicket from "@/components/ui/premium-ticket";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const [tickets, config] = await Promise.all([
    getTickets(),
    getRegistrationsConfig(),
  ]);
  const registrationsOpen = !!config?.registrationsOpen;
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-primary">
            <span data-i18n="tickets.title">Choose Your Ticket</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            <span data-i18n="tickets.subtitle">
              Select the perfect ticket for your LOSL-CON 2025 experience. All
              tickets include access to talks, workshops, and networking
              opportunities.
            </span>
          </p>
        </div>
        {!registrationsOpen ? (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold" data-i18n="hero.closed">
              Registrations are closed
            </h2>
            <div className="mt-6 flex items-center justify-center gap-3">
              <ContactHoverCard />
              <a
                href="/devenir-sponsor"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-accent/10 transition-colors"
                data-i18n="tickets.cta.sponsor"
              >
                Become a Sponsor
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-12 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-items-center max-w-7xl mx-auto px-4">
            {tickets.map((t, index) => {
              const perks = (t.perks || "")
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean);
              const primary = t.fGradient || "#7c3aed";
              const secondary = t.sGradient || "#06b6d4";
              const href = `/register?ticket=${encodeURIComponent(t.id)}`;

              // Add visual variety based on ticket index/type
              const isPopular =
                index === 1 || t.type?.toLowerCase().includes("standard");
              const isPremium =
                t.price > 10000 || t.type?.toLowerCase().includes("vip");

              return (
                <div key={t.id} className="w-full max-w-sm h-full flex">
                  <PremiumTicket
                    name={t.name}
                    description={t.description}
                    type={t.type?.toUpperCase?.() || t.type}
                    price={t.price}
                    currency="XOF"
                    perks={perks}
                    primary={primary}
                    secondary={secondary}
                    href={t.soldout ? undefined : href}
                    popular={isPopular}
                    isPremium={isPremium}
                    disabled={t.soldout}
                    disabledText={"Sold out"}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
        </div>
      </div>
    </main>
  );
}

function ContactHoverCard() {
  return (
    <div className="inline-block">
      <div className="group relative">
        <button
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          data-i18n="common.contactUs"
        >
          Contact us
        </button>
        <div className="absolute left-1/2 top-full z-10 mt-2 w-72 -translate-x-1/2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
          <div className="text-sm font-semibold" data-i18n="common.contactUs">
            Contact us
          </div>
          <ul className="mt-2 text-sm space-y-1">
            <li>
              <a
                href="https://wa.me/22879633874"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                <span data-i18n="common.channels.whatsapp">WhatsApp</span>:
                +22879633874
              </a>
            </li>
            <li>
              <a href="mailto:community@loslc.tech" className="underline">
                <span data-i18n="common.channels.email">Email</span>:
                community@loslc.tech
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
