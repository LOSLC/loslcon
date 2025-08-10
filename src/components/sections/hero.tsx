import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/lib/links";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/event-cover.png"
          alt="Event cover"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/85 via-blue-900/70 to-background mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        {/* Subtle grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"
        />
        {/* Floating tech shapes */}
        <svg
          aria-hidden
          viewBox="0 0 1208 1024"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-30"
        >
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>
          <g fill="url(#g1)">
            <circle cx="200" cy="150" r="2" />
            <circle cx="600" cy="300" r="3" />
            <circle cx="1000" cy="200" r="2" />
            <rect x="300" y="500" width="4" height="4" rx="1" />
            <rect x="900" y="650" width="4" height="4" rx="1" />
          </g>
        </svg>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-24 sm:py-36 text-center text-background">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/40 backdrop-blur">
          <span data-i18n="hero.highlight" className="text-foreground">
            Les inscriptions commencent bientôt
          </span>
        </div>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          <span
            className="bg-gradient-to-r from-sky-300 via-white to-sky-300 bg-clip-text text-transparent"
            data-i18n="hero.title"
          >
            LOSL-CON 2025
          </span>
        </h1>
        <div className="mt-5 max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl text-white/95  bg-black/20 backdrop-blur border rounded lg:rounded-lg px-4 py-3 inline-block">
            <span data-i18n="hero.subtitle">
              Conférence dédiée à la cybersécurité, l’open source et Linux
            </span>
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="shadow-lg">
            <a href={LINKS.community} target="_blank" rel="noreferrer">
              <span data-i18n="hero.cta">Rejoindre la communauté</span>
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="accent"
            className="relative overflow-hidden shadow-lg ring-1 ring-accent/40 hover:ring-accent/60 transition shadow-[0_0_28px_-6px_var(--color-accent)] hover:shadow-[0_0_36px_-5px_var(--color-accent)]"
          >
            <a href="/devenir-sponsor">
              <span className="relative z-[1]" data-i18n="nav.sponsor">
                Devenir sponsor
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80"
              >
                <span className="absolute -inset-10 bg-[conic-gradient(at_top_right,theme(colors.accent/60),transparent_30%)] blur-2xl" />
                <span className="absolute inset-0 pointer-events-none [--mask:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:var(--mask)] [mask-image:var(--mask)]">
                  <span className="absolute left-[-25%] top-[-45%] h-[190%] w-1/3 rotate-[14deg] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm opacity-90 will-change-[transform,opacity] animate-[shimmer_1.8s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
                </span>
              </span>
            </a>
          </Button>
          <a
            href={LINKS.home}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 bg-white/5 px-5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            <span data-i18n="nav.home">Accueil LOSL-C</span>
          </a>
        </div>
      </div>
    </section>
  );
}
