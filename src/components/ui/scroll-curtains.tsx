"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type ScrollCurtainsProps = {
  className?: string;
  /** Animation duration in ms for opening. Default 1200 */
  duration?: number;
  /** Delay before starting in ms. Default 150 */
  delay?: number;
  /** Max Y-rotation in degrees for 3D effect. Default 14 */
  depth?: number;
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function ScrollCurtains({ className, duration = 1200, delay = 150, depth = 14 }: ScrollCurtainsProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const raf = React.useRef<number | null>(null);
  const start = React.useRef<number | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mqlReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mqlReduced.matches;

    const tick = (ts: number) => {
      if (start.current === null) start.current = ts + delay;
      const t = Math.max(0, ts - start.current);
      const p = reduced ? 1 : Math.min(1, t / Math.max(1, duration));
      const eased = reduced ? 1 : easeInOutCubic(p);
  el.style.setProperty("--open", String(eased));
  el.style.setProperty("--rot", String((1 - eased) * depth));
      if (p < 1 && !reduced) raf.current = requestAnimationFrame(tick);
      else raf.current = null;
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [duration, delay, depth]);

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 z-[60] [--open:0] [--rot:14]", className)}
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
    >
      {/* left curtain */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2 origin-left"
        style={{
          transform:
            "translateZ(0) translateX(calc(var(--open) * -100%)) rotateY(calc(var(--rot) * 1deg)) skewY(calc((1 - var(--open)) * 0.6deg))",
          backgroundColor: "oklch(0.2555 0.0521 264.2858)",
          backgroundImage: [
            // uneven wide folds (primary)
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.20) 0 22px, rgba(0,0,0,0.05) 22px 44px)",
            // offset folds (secondary) to break uniformity
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 18px, rgba(0,0,0,0.06) 18px 36px)",
            // subtle micro texture
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 3px, rgba(0,0,0,0.02) 3px 6px)",
            // specular highlight near seam
            "radial-gradient(120% 100% at 100% 50%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 36%, transparent 64%)",
            // edge vignette for depth
            "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 10%, transparent 26%, transparent 74%, rgba(0,0,0,0.22) 90%, rgba(0,0,0,0.45) 100%)",
            // top/bottom shading to imply sag and weight
            "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.30) 100%)"
          ].join(","),
          boxShadow:
            "inset -34px 0 68px rgba(0,0,0,0.30), inset -10px 0 26px rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.15)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />
      {/* right curtain */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 origin-right"
        style={{
          transform:
            "translateZ(0) translateX(calc(var(--open) * 100%)) rotateY(calc(var(--rot) * -1deg)) skewY(calc((1 - var(--open)) * -0.6deg))",
          backgroundColor: "oklch(0.2555 0.0521 264.2858)",
          backgroundImage: [
            // uneven wide folds (primary)
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.20) 0 24px, rgba(0,0,0,0.05) 24px 48px)",
            // offset folds (secondary) to break uniformity (different scale than left)
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 16px, rgba(0,0,0,0.06) 16px 32px)",
            // subtle micro texture
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 3px, rgba(0,0,0,0.02) 3px 6px)",
            // specular highlight near seam
            "radial-gradient(120% 100% at 0% 50%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 36%, transparent 64%)",
            // edge vignette for depth
            "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 10%, transparent 26%, transparent 74%, rgba(0,0,0,0.22) 90%, rgba(0,0,0,0.45) 100%)",
            // top/bottom shading
            "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.30) 100%)"
          ].join(","),
          boxShadow:
            "inset 34px 0 68px rgba(0,0,0,0.30), inset 10px 0 26px rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.15)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}
