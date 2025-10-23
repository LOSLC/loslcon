"use client";
import { Button } from "@/components/ui/button";
import { ScrollCurtains } from "@/components/ui/scroll-curtains";
import { Stagger, Item } from "@/components/ui/reveal";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

function FlipUnit({
  value,
  labelKey,
  short,
}: { value: number; labelKey: string; short: string }) {
  const formatted = value.toString().padStart(2, "0");
  return (
    <div className="w-16 sm:w-20 rounded-xl bg-white/10 ring-1 ring-white/20 px-0 py-0 backdrop-blur text-white shadow-lg overflow-hidden [perspective:900px]">
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <motion.div
          key={formatted}
          initial={{ rotateX: -80, y: -2, opacity: 0.8, filter: "blur(0.3px)" }}
          animate={{ rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 18,
            mass: 1.1,
          }}
          className="text-2xl sm:text-3xl font-extrabold tabular-nums leading-none origin-top will-change-transform [transform-style:preserve-3d] drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
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

export function Hero({
  registrationsOpen = true,
}: { registrationsOpen?: boolean }) {
  const startTs = useMemo(() => Date.parse("2025-11-22T09:00:00Z"), []);
  const endTs = useMemo(() => Date.parse("2025-11-22T17:00:00Z"), []);
  const [now, setNow] = useState<number>(Date.now());
  const [mounted, setMounted] = useState(false);
  const driftConfigs = useMemo(() => {
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    const ease: [number, number, number, number] = [0.42, 0, 0.58, 1];
    const cfg = () => {
      const x = [0, rnd(-40, 40), rnd(-30, 30), rnd(-50, 50), 0];
      const y = [0, rnd(-30, 30), rnd(-45, 45), rnd(-35, 35), 0];
      const dx = rnd(22, 34);
      const dy = rnd(24, 38);
      return {
        animate: { x, y },
        transition: {
          x: {
            duration: dx,
            ease,
            repeat: Infinity,
            repeatType: "mirror" as const,
          },
          y: {
            duration: dy,
            ease,
            repeat: Infinity,
            repeatType: "mirror" as const,
          },
        },
      };
    };
    const beam = () => ({
      animate: { x: [0, 24, -16, 28, 0] },
      transition: {
        duration: rnd(24, 34),
        ease,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    });
    return {
      b1: cfg(),
      b2: cfg(),
      b3: cfg(),
      beam: beam(),
    };
  }, []);
  const reduceMotion = useReducedMotion();

  const starBgSmall = useMemo(() => {
    const parts: string[] = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 70 + 5; // bias towards upper area
      const a = (0.55 + Math.random() * 0.35).toFixed(2);
      parts.push(
        `radial-gradient(1px 1px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(255,255,255,${a}), transparent 2px)`,
      );
    }
    return parts.join(",");
  }, []);
  const starBgMedium = useMemo(() => {
    const parts: string[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 70 + 5;
      const a = (0.45 + Math.random() * 0.35).toFixed(2);
      parts.push(
        `radial-gradient(2px 2px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(255,255,255,${a}), transparent 3px)`,
      );
    }
    return parts.join(",");
  }, []);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const getVar = (name: string, fb: string) =>
      root.getPropertyValue(name).trim() || fb;
    const resolveColor = (cssColor: string) => {
      const el = document.createElement("span");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      el.style.color = cssColor;
      document.body.appendChild(el);
      const c = getComputedStyle(el).color;
      el.remove();
      return c || cssColor;
    };
    const brandColors = [
      resolveColor(getVar("--color-primary", "#38bdf8")),
      resolveColor(getVar("--color-accent", "#22c55e")),
      resolveColor(getVar("--color-ring", "#a78bfa")),
      resolveColor(getVar("--color-foreground", "#ffffff")),
    ];

    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: brandColors,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["square"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["square"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, []);

  const beforeStart = now < startTs;
  const duringEvent = now >= startTs && now < endTs;
  const afterEnd = now >= endTs;

  const remainingToStart = Math.max(0, startTs - now);
  const remainingToEnd = Math.max(0, endTs - now);

  const base = beforeStart ? remainingToStart : remainingToEnd;
  const days = Math.floor(base / (1000 * 60 * 60 * 24));
  const hours = Math.floor((base / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((base / (1000 * 60)) % 60);
  const seconds = Math.floor((base / 1000) % 60);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background (optimized) */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Layered radial gradients */}
        <div className="absolute inset-0 opacity-80">
          <>
            <motion.div
              className="absolute left-1/2 top-[36%] h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 blur-[60px] [will-change:transform]"
              style={{
                backgroundImage: `radial-gradient(600px 600px at 50% 40%, oklch(0.5997 0.1495 259.7518 / 0.85), transparent 70%)`,
              }}
              initial={{ x: 0, y: 0 }}
              animate={reduceMotion ? undefined : driftConfigs.b1.animate}
              transition={reduceMotion ? undefined : driftConfigs.b1.transition}
            />

            <motion.div
              className="absolute left-[20%] top-[22%] h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 blur-[60px] opacity-70 [will-change:transform]"
              style={{
                backgroundImage: `radial-gradient(480px 480px at 50% 50%, oklch(0.6492 0.0927 256.1288 / 0.6), transparent 70%)`,
              }}
              initial={{ x: 0, y: 0 }}
              animate={reduceMotion ? undefined : driftConfigs.b2.animate}
              transition={reduceMotion ? undefined : driftConfigs.b2.transition}
            />

            <motion.div
              className="absolute left-[78%] top-[28%] h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 blur-[80px] opacity-60 [will-change:transform]"
              style={{
                backgroundImage: `radial-gradient(420px 420px at 50% 50%, oklch(0.5461 0.2152 262.8809 / 0.5), transparent 70%)`,
              }}
              initial={{ x: 0, y: 0 }}
              animate={reduceMotion ? undefined : driftConfigs.b3.animate}
              transition={reduceMotion ? undefined : driftConfigs.b3.transition}
            />

            {/* Gentle rainbow beam */}
            <motion.div
              className="absolute inset-x-0 top-[12%] h-36 sm:h-40 opacity-20 blur-xl [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)] bg-[linear-gradient(90deg,theme(colors.fuchsia.400/.45),theme(colors.sky.400/.4),theme(colors.emerald.400/.45),theme(colors.amber.400/.4))]"
              initial={{ x: 0 }}
              animate={reduceMotion ? undefined : driftConfigs.beam.animate}
              transition={
                reduceMotion ? undefined : driftConfigs.beam.transition
              }
            />
          </>
        </div>
        {/* Starfield overlay (placed above color blobs, under vignettes) */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_38%,black,transparent)]"
            style={{
              backgroundImage: starBgSmall,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          />
          <div
            className="absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_38%,black,transparent)]"
            style={{
              backgroundImage: starBgMedium,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          />
        </div>
        {/* Soft vignette and grid accent */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_40%,transparent_70%,rgba(0,0,0,0.5))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>
      <ScrollCurtains />
      <div className="container mx-auto max-w-6xl px-4 py-20 sm:py-28 md:py-36 text-center">
        <Stagger>
          <Item>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-white/30 backdrop-blur bg-gradient-to-r from-fuchsia-500/15 via-emerald-500/15 to-sky-500/15">
              <span data-i18n="hero.highlight" className="text-white">
                {registrationsOpen
                  ? "Registrations are open!"
                  : "Registrations are closed"}
              </span>
            </div>
          </Item>
          <Item>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              <span className="relative inline-block">
                {/* Glow layer */}
                <span
                  aria-hidden
                  className="absolute inset-0 blur-md opacity-70 text-sky-300 select-none drop-shadow-[0_0_22px_rgba(56,189,248,0.55)]"
                  data-i18n="hero.title"
                >
                  LOSL-CON 2025
                </span>
                {/* Foreground text */}
                <span className="relative text-white" data-i18n="hero.title">
                  LOSL-CON 2025
                </span>
              </span>
            </h1>
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
              {/* Countdown / Live status */}
              <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2">
                {beforeStart && (
                  <p
                    className="text-xs sm:text-sm text-white/80"
                    data-i18n="hero.countdown.startsIn"
                  >
                    Starts in
                  </p>
                )}
                {duringEvent && (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40 px-2 py-0.5 text-xs font-semibold tracking-wide"
                      data-i18n="hero.countdown.live"
                    >
                      Live now
                    </span>
                    <span
                      className="text-xs sm:text-sm text-white/80"
                      data-i18n="hero.countdown.endsIn"
                    >
                      Ends in
                    </span>
                  </div>
                )}
                {afterEnd ? (
                  <p
                    className="text-sm sm:text-base text-white/80"
                    data-i18n="hero.countdown.ended"
                  >
                    Event ended
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {[
                      { v: days, k: "days", short: "d" },
                      { v: hours, k: "hours", short: "h" },
                      { v: minutes, k: "minutes", short: "m" },
                      { v: seconds, k: "seconds", short: "s" },
                    ].map((u) => (
                      <FlipUnit
                        key={u.k}
                        value={mounted ? u.v : 0}
                        labelKey={`hero.countdown.${u.k}`}
                        short={u.short}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Item>
          <Item>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild size="lg" className="shadow-lg">
                  <a href="/register">
                    <span data-i18n="join.ctaCommunity">
                      S&#39;inscrire maintenant
                    </span>
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
