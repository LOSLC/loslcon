"use client";
import Image from "next/image";
import { PARTNERS } from "@/lib/partners";
import { useEffect, useRef, useState } from "react";

export function Partners() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dupe, setDupe] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);

  // Measure overflow and toggle duplication
  useEffect(() => {
    const wrap = wrapperRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const compute = () => {
      const total = track.scrollWidth; // depends on current dupe state
      const single = dupe ? total / 2 : total;
      const overflow = single > wrap.clientWidth + 1;
      setHasOverflow(overflow);
      setDupe(overflow);
      if (!overflow) {
        // reset any transform if we won't animate
        track.style.transform = "translateX(0)";
        offsetRef.current = 0;
      }
    };
    compute();
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dupe]);

  // Animate only when overflowing (dupe true) and reduced motion not requested
  useEffect(() => {
    const wrap = wrapperRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const mqlReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const baseSpeed = 24; // px/sec
    let last = performance.now();

    const loop = (ts: number) => {
      const dt = (ts - last) / 1000;
      last = ts;
      const total = track.scrollWidth;
      const single = dupe ? total / 2 : total;
      // advance only if we are duplicating (infinite mode)
      if (dupe && single > 1) {
        offsetRef.current += baseSpeed * dt;
        if (offsetRef.current >= single) offsetRef.current -= single;
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafRef.current) return;
      last = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!rafRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    const sync = () => {
      if (mqlReduced.matches || !dupe) {
        stop();
        track.style.transform = "translateX(0)";
        offsetRef.current = 0;
      } else {
        start();
      }
    };
    sync();
    mqlReduced.addEventListener?.("change", sync);
    return () => {
      stop();
      mqlReduced.removeEventListener?.("change", sync);
    };
  }, [dupe]);

  if (!PARTNERS.length) return null;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            className="text-lg font-semibold text-white/90"
            data-i18n="partners.heading"
          >
            Our partners
          </h2>
          <a
            href="/partners"
            className="text-sm text-sky-300 hover:text-sky-200 transition"
            data-i18n="partners.viewAll"
          >
            View all
          </a>
        </div>
        <div ref={wrapperRef} className="overflow-hidden">
          <div
            ref={trackRef}
            className={`flex gap-6 ${hasOverflow ? "will-change-transform min-w-max" : "justify-center"}`}
          >
            {(dupe ? [...PARTNERS, ...PARTNERS] : PARTNERS).map((p, idx) => (
              <a
                key={`${p.name}-${idx}`}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                aria-label={p.name}
                className="group relative flex-shrink-0 p-4 transition-transform hover:scale-[1.02]"
              >
                <div className="relative h-16 w-28 sm:h-20 sm:w-32">
                  <Image
                    src={p.imageFile}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-contain opacity-80 grayscale contrast-100 group-hover:grayscale-0 group-hover:opacity-100 transition"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
