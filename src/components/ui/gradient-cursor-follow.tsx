"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number; // tilt strength in degrees
  radius?: number; // gradient radius in px
};

export function GradientCursorFollow({ children, className, strength = 10, radius = 520 }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const planeRef = React.useRef<HTMLDivElement | null>(null);
  const pos = React.useRef({ x: 0.5, y: 0.35 }); // normalized (0..1)
  const target = React.useRef({ x: 0.5, y: 0.35 });
  const raf = React.useRef<number | null>(null);
  const rectRef = React.useRef<DOMRect | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  // Detect mobile and reduced-motion
  React.useEffect(() => {
    const mqlMobile = window.matchMedia("(max-width: 640px)");
    const mqlReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setAll = () => {
      setIsMobile(mqlMobile.matches);
      setReduced(mqlReduced.matches);
    };
    setAll();
    const onMobile = () => setIsMobile(mqlMobile.matches);
    const onReduced = () => setReduced(mqlReduced.matches);
    mqlMobile.addEventListener?.("change", onMobile);
    mqlReduced.addEventListener?.("change", onReduced);
    return () => {
      mqlMobile.removeEventListener?.("change", onMobile);
      mqlReduced.removeEventListener?.("change", onReduced);
    };
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
  // Skip on mobile or when user prefers reduced motion
  if (isMobile || reduced) return;

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    updateRect();

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = rectRef.current;
      if (!rect) return;
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      target.current.x = Math.min(1, Math.max(0, x));
      target.current.y = Math.min(1, Math.max(0, y));
    };

    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
  const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointerMove(t.clientX, t.clientY);
    };
  const handleTouchMoveListener: EventListener = (e) => handleTouchMove(e as unknown as TouchEvent);

    const handleResize = () => updateRect();

    el.addEventListener("mousemove", handleMouseMove);
  el.addEventListener("touchmove", handleTouchMoveListener, { passive: true });
    window.addEventListener("resize", handleResize);

  // const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      // Smoothly approach target
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      const px = `${(pos.current.x * 100).toFixed(2)}%`;
      const py = `${(pos.current.y * 100).toFixed(2)}%`;
      const rx = (0.5 - pos.current.y) * strength; // invert for natural tilt
      const ry = (pos.current.x - 0.5) * strength;

      if (planeRef.current) {
        const style = planeRef.current.style as CSSStyleDeclaration & { setProperty: (name: string, value: string) => void };
        style.setProperty("--gx", px);
        style.setProperty("--gy", py);
  if (!reduced) {
          planeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      el.removeEventListener("mousemove", handleMouseMove);
    el.removeEventListener("touchmove", handleTouchMoveListener);
      window.removeEventListener("resize", handleResize);
    };
  }, [strength, isMobile, reduced]);

  const gradient = `radial-gradient(${radius}px ${radius}px at var(--gx,50%) var(--gy,35%), oklch(0.5997 0.1495 259.7518 / 0.8), oklch(0.6492 0.0927 256.1288 / 0.7) 40%, transparent 70%)`;

  return (
    <div
      ref={containerRef}
      className={cn("relative h-screen w-full overflow-hidden isolate bg-background", className)}
      style={{ perspective: 1000 }}
    >
      {/* Desktop interactive layer */}
      {!isMobile && !reduced && (
        <div
          ref={planeRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-[-20%] blur-3xl opacity-80"
            style={{
              backgroundImage: gradient,
              transition: "transform 120ms ease-out",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-[-30%] blur-[96px] opacity-50"
            style={{
              backgroundImage: `radial-gradient(${radius * 0.8}px ${radius * 0.8}px at calc(var(--gx,50%) + 8%) calc(var(--gy,35%) + 6%), oklch(0.5461 0.2152 262.8809 / 0.45), transparent 70%)`,
              mixBlendMode: "overlay",
            }}
          />
        </div>
      )}

      {/* Mobile-friendly lightweight animation */}
      {(isMobile || reduced) && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
            <div
              className="absolute h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60"
              style={{
                left: "50%",
                top: "45%",
                backgroundImage: `radial-gradient(${Math.round(radius * 0.9)}px ${Math.round(radius * 0.9)}px at 40% 50%, oklch(0.6492 0.0927 256.1288 / 0.55), transparent 70%)`,
                mixBlendMode: "screen",
              }}
            />
            <div
              className="absolute h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 blur-[90px] opacity-40"
              style={{
                left: "50%",
                top: "50%",
                backgroundImage: `radial-gradient(${Math.round(radius * 0.7)}px ${Math.round(radius * 0.7)}px at 60% 55%, oklch(0.5461 0.2152 262.8809 / 0.45), transparent 70%)`,
                mixBlendMode: "overlay",
              }}
            />
          </div>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
