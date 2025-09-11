import SponsorCarousel from "@/components/sections/sponsor-carousel";

export const metadata = {
  title: "Devenez sponsor – LOSL-CON 2025",
  description:
    "Soutenez la conférence et bénéficiez d’une visibilité privilégiée",
};

export default function SponsorPage() {
  return (
    <main className="overflow-hidden">
      <SponsorCarousel />
      <div className="container mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
          <h2
            className="text-xl sm:text-2xl font-semibold"
            data-i18n="sponsor.contact.heading"
          >
            Pour toute demande ou proposition de sponsoring, contactez-nous à :
          </h2>
          <p className="mt-3 text-muted-foreground">
            <a
              href="mailto:community@loslc.tech"
              className="font-medium text-primary hover:underline"
            >
              community@loslc.tech
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
