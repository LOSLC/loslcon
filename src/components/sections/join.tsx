import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/lib/links";

export function Join() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold" data-i18n="join.heading">Inscriptions ouvertes</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed" data-i18n="join.text">
            Choisissez votre ticket et inscrivez-vous dès maintenant pour garantir votre place.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href="/register">
                <span data-i18n="join.ctaCommunity">S’inscrire maintenant</span>
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/tickets">
                <span data-i18n="join.ctaWaitlist">Voir les tickets</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="justify-self-center">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 shadow-xl backdrop-blur-md text-center">
            <Image src="/qrcode.png" alt="QR code" width={256} height={256} className="mx-auto rounded ring-1 ring-white/20" />
            <p className="mt-3 text-xs text-muted-foreground" data-i18n="join.scan">Scannez le QR pour vous inscrire</p>
          </div>
        </div>
      </div>
    </section>
  );
}
