"use client";
import { Button } from "@/components/ui/button";
import { ScrollCurtains } from "@/components/ui/scroll-curtains";
import { Stagger, Item } from "@/components/ui/reveal";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function FlipUnit({ value, labelKey, short }: { value: number; labelKey: string; short: string }) {
  const formatted = value.toString().padStart(2, "0");
  return (
    <div className="w-16 sm:w-20 rounded-xl bg-white/10 ring-1 ring-white/20 px-0 py-0 backdrop-blur text-white shadow-lg overflow-hidden">
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <motion.div
          key={formatted}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="text-2xl sm:text-3xl font-extrabold tabular-nums leading-none origin-top [transform-style:preserve-3d]"
        >
          {formatted}
        </motion.div>
        <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-white/80 text-center overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="sm:hidden">{short}</span>
          <span className="hidden sm:inline" data-i18n={labelKey}>
            {short}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  // Countdown to event date: 22 November 2025 at 00:00:00 UTC (Africa/Lome ~ UTC)
  const targetTs = useMemo(() => Date.parse("2025-11-22T00:00:00Z"), []);
  const [now, setNow] = useState<number>(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, targetTs - now);
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Static stunning background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Layered radial gradients */}
        <div className="absolute inset-0 opacity-80 mix-blend-screen">
          <div className="absolute left-1/2 top-[36%] h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 blur-3xl" style={{
            backgroundImage: `radial-gradient(600px 600px at 50% 40%, oklch(0.5997 0.1495 259.7518 / 0.85), transparent 70%)`,
          }} />
          <div className="absolute left-[20%] top-[22%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-70" style={{
            backgroundImage: `radial-gradient(480px 480px at 50% 50%, oklch(0.6492 0.0927 256.1288 / 0.6), transparent 70%)`,
          }} />
          <div className="absolute left-[78%] top-[28%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 blur-[120px] opacity-60" style={{
            backgroundImage: `radial-gradient(420px 420px at 50% 50%, oklch(0.5461 0.2152 262.8809 / 0.5), transparent 70%)`,
          }} />
        </div>
        {/* Soft vignette and grid accent */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),transparent_40%,transparent_70%,rgba(0,0,0,0.35))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>
      <ScrollCurtains />
      <div className="container mx-auto max-w-6xl px-4 py-20 sm:py-28 md:py-36 text-center text-background">
        <Stagger>
          <Item>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium ring-1 ring-emerald-400/40 backdrop-blur">
                <span data-i18n="hero.highlight" className="text-foreground">
                Les inscriptions sont ouvertes
              </span>
            </div>
          </Item>
          <Item>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              <span
                className="bg-gradient-to-r from-sky-300 via-white to-sky-300 bg-clip-text text-transparent"
                data-i18n="hero.title"
              >
                LOSL-CON 2025
              </span>
            </h1>
          </Item>
          <Item>
            <div className="mt-5 max-w-3xl mx-auto">
              <p className="text-lg sm:text-xl text-white/95  bg-black/20 lg:border-none rounded-lg px-4 py-3 inline-block">
                <span
                  data-i18n="hero.subtitle"
                  className="font-inter font-semibold bg-gradient-to-r from-sky-300 via-white to-sky-300 bg-clip-text text-transparent"
                >
                  Conférence dédiée à la cybersécurité, l&#39;open source et Linux
                </span>
              </p>
            </div>
          </Item>
          {/* Date/Place + Countdown container */}
          <Item>
            <div className="mx-auto mt-6 inline-block rounded-2xl bg-primary/10 ring-1 ring-border/50 backdrop-blur px-4 py-4 sm:px-6 sm:py-5">
              {/* Date & Place */}
              <p className="text-sm sm:text-base text-white/90 text-center">
                <span data-i18n="hero.date">22 novembre 2025</span>
                <span className="mx-2">•</span>
                <span data-i18n="hero.place">Institut Français du Togo</span>
              </p>
              {/* Countdown */}
              <div className="mt-4 sm:mt-5 flex justify-center">
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { v: days, k: "days", short: "d" },
                    { v: hours, k: "hours", short: "h" },
                    { v: minutes, k: "minutes", short: "m" },
                    { v: seconds, k: "seconds", short: "s" },
                  ].map((u) => (
                    <FlipUnit key={u.k} value={mounted ? u.v : 0} labelKey={`hero.countdown.${u.k}`} short={u.short} />
                  ))}
                </div>
              </div>
            </div>
          </Item>
          <Item>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="lg" className="shadow-lg">
                  <a href="/register">
                    <span data-i18n="join.ctaCommunity">S&#39;inscrire maintenant</span>
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  variant="accent"
                  className="relative overflow-hidden ring-1 ring-accent/40 hover:ring-accent/60 transition shadow-[0_0_28px_-6px_var(--color-accent)] hover:shadow-[0_0_36px_-5px_var(--color-accent)]"
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
              </motion.div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/tickets"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 bg-white/5 px-5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                <span data-i18n="join.ctaWaitlist">Voir les tickets</span>
              </motion.a>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
