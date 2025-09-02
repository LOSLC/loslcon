"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  // tuneables
  maxParticles?: number;
  desktopFrameCap?: number; // fps
  mobileFrameCap?: number; // fps
};

type Vec2 = { x: number; y: number };

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

// Simple critically-damped spring integrator
function spring(current: number, target: number, vel: number, dt: number, stiffness = 500, damping = 2) {
  // x'' + 2ζω x' + ω^2 x = ω^2 target
  const omega = Math.sqrt(stiffness);
  const zeta = damping; // >1 overdamped, ~=1 critically damped
  const f = -2 * zeta * omega * vel - omega * omega * (current - target);
  const newVel = vel + f * dt;
  const newPos = current + newVel * dt;
  return [newPos, newVel] as const;
}

export function InteractiveHeroBackground({
  children,
  className,
  maxParticles = 120,
  desktopFrameCap = 60,
  mobileFrameCap = 30,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const dprRef = React.useRef(1);
  const sizeRef = React.useRef({ w: 1, h: 1 });
  const targetRef = React.useRef<Vec2>({ x: 0.5, y: 0.35 });
  const posRef = React.useRef<Vec2>({ x: 0.5, y: 0.35 });
  const velRef = React.useRef<Vec2>({ x: 0, y: 0 });
  const lastTs = React.useRef<number | null>(null);
  const frameBudgetMs = React.useRef(1000 / desktopFrameCap);
  const [mounted, setMounted] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [colors, setColors] = React.useState({
    a: "rgba(99,102,241,0.8)", // primary-ish
    b: "rgba(20,184,166,0.6)", // accent-ish
    glow: "rgba(255,255,255,0.8)",
    bg: "rgba(0,0,0,0)",
  });

  // Particles for subtle depth
  const particlesRef = React.useRef<{ x: number; y: number; z: number; vx: number; vy: number }[]>([]);
  const ripplesRef = React.useRef<{ x: number; y: number; r: number; life: number }[]>([]);

  React.useEffect(() => setMounted(true), []);

  // derive CSS variable colors
  React.useEffect(() => {
    if (!mounted) return;
    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue("--color-primary").trim() || "oklch(0.5997 0.1495 259.7518)";
    const accent = root.getPropertyValue("--color-accent").trim() || "oklch(0.6492 0.0927 256.1288)";
    const fg = root.getPropertyValue("--color-foreground").trim() || "white";
    const bg = root.getPropertyValue("--color-background").trim() || "black";
    setColors({
      a: primary,
      b: accent,
      glow: fg,
      bg,
    });
  }, [mounted]);

  // init canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      const dpr = (window.devicePixelRatio || 1);
      dprRef.current = dpr;
      sizeRef.current = { w: r.width, h: r.height };
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => ro.disconnect();
  }, []);

  // input handling
  React.useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    const onPointer = (cx: number, cy: number) => {
      const rect = parent.getBoundingClientRect();
      targetRef.current.x = clamp01((cx - rect.left) / rect.width);
      targetRef.current.y = clamp01((cy - rect.top) / rect.height);
    };

    const onMouseMove = (e: MouseEvent) => { if (!isMobile) onPointer(e.clientX, e.clientY); };
    const onTouchMove = (e: TouchEvent) => { const t = e.touches[0]; if (t) onPointer(t.clientX, t.clientY); };
    const onClick = (e: MouseEvent) => {
      if (reduced) return;
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      ripplesRef.current.push({ x, y, r: 0, life: 1 });
    };
    const onTouchStart = (e: TouchEvent) => {
      if (reduced) return;
      const t = e.touches[0]; if (!t) return;
      const rect = parent.getBoundingClientRect();
      const x = (t.clientX - rect.left) / rect.width;
      const y = (t.clientY - rect.top) / rect.height;
      ripplesRef.current.push({ x, y, r: 0, life: 1 });
    };

  parent.addEventListener("mousemove", onMouseMove);
  const touchMoveListener: EventListener = (e) => onTouchMove(e as unknown as TouchEvent);
  parent.addEventListener("touchmove", touchMoveListener, { passive: true });
    parent.addEventListener("click", onClick);
    parent.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("touchmove", touchMoveListener);
      parent.removeEventListener("click", onClick);
      parent.removeEventListener("touchstart", onTouchStart as unknown as EventListener);
    };
  }, [isMobile, reduced]);

  // particles init
  React.useEffect(() => {
    const N = Math.max(24, isMobile ? Math.floor(maxParticles * 0.35) : maxParticles);
    const pts = new Array(N).fill(0).map(() => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 0.7 + 0.3, // depth 0.3 - 1
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005,
    }));
    particlesRef.current = pts;
  }, [isMobile, maxParticles]);

  // animation loop
  React.useEffect(() => {
    if (reduced) return; // CSS fallback only
    frameBudgetMs.current = 1000 / (isMobile ? mobileFrameCap : desktopFrameCap);
    let accum = 0;
    const step = (ts: number) => {
      if (!ctxRef.current || !canvasRef.current) return;
      if (lastTs.current == null) lastTs.current = ts;
      const dtMs = ts - lastTs.current;
      lastTs.current = ts;
      accum += dtMs;
      const budget = frameBudgetMs.current;
      if (accum < budget) { rafRef.current = requestAnimationFrame(step); return; }
      const dt = Math.min(0.05, accum / 1000); // clamp dt
      accum = 0;

      // physics: spring towards target
      const [nx, vx] = spring(posRef.current.x, targetRef.current.x, velRef.current.x, dt, 420, 1.1);
      const [ny, vy] = spring(posRef.current.y, targetRef.current.y, velRef.current.y, dt, 420, 1.1);
      posRef.current.x = nx; posRef.current.y = ny; velRef.current.x = vx; velRef.current.y = vy;

      const ctx = ctxRef.current;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      // subtle background gradient
      const gx = posRef.current.x * w;
      const gy = posRef.current.y * h * 0.9;
      const grad = ctx.createRadialGradient(gx, gy, Math.min(w, h) * 0.12, gx, gy, Math.max(w, h) * 0.75);
  grad.addColorStop(0, `${colors.a}`);
  grad.addColorStop(0.35, `${colors.b}`);
      grad.addColorStop(1, "transparent");
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(24px)";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // parallax particles
      const pts = particlesRef.current;
      ctx.filter = "blur(0px)";
      ctx.globalAlpha = isMobile ? 0.35 : 0.5;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx * (isMobile ? 0.6 : 1);
        p.y += p.vy * (isMobile ? 0.6 : 1);
  if (p.x < 0 || p.x > 1) { p.vx = -p.vx; p.x = clamp01(p.x); }
  if (p.y < 0 || p.y > 1) { p.vy = -p.vy; p.y = clamp01(p.y); }
        const px = p.x * w + (posRef.current.x - 0.5) * 24 * p.z;
        const py = p.y * h + (posRef.current.y - 0.5) * 24 * p.z;
        const r = (1.5 + 2.5 * p.z) * (isMobile ? 0.8 : 1);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.fill();
      }

      // ripples (mobile/desktop click)
      ctx.globalAlpha = 0.8;
      ctx.globalCompositeOperation = "screen";
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.r += (isMobile ? 240 : 300) * dt;
        r.life -= 0.9 * dt;
        if (r.life <= 0) { ripplesRef.current.splice(i, 1); continue; }
        const x = r.x * w; const y = r.y * h;
        const g2 = ctx.createRadialGradient(x, y, Math.max(0, r.r - 40), x, y, r.r);
        g2.addColorStop(0, `${colors.glow}`);
        g2.addColorStop(1, "transparent");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [desktopFrameCap, mobileFrameCap, isMobile, reduced, colors]);

  return (
    <div ref={containerRef} className={cn("relative h-screen w-full overflow-hidden isolate bg-background", className)}>
      {/* Canvas layer for interactive effects (desktop + mobile) */}
      {!reduced && (
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" aria-hidden />
      )}
      {/* CSS-only graceful fallback when reduced motion */}
      {reduced && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-70 blur-2xl" style={{
            background: `radial-gradient(520px 520px at 50% 35%, ${colors.a}, ${colors.b} 40%, transparent 70%)`,
            mixBlendMode: "screen",
          }} />
        </div>
      )}
      {/* subtle parallax foreground sheen */}
      <div className="pointer-events-none absolute inset-0 -z-5" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Optional: simple perf helper for manual checks in dev
export function estimateFrameBudget(frames: number = 60): Promise<{ avgMs: number; maxMs: number }> {
  return new Promise((resolve) => {
    let count = 0; let last = performance.now();
    let sum = 0; let max = 0;
    const tick = () => {
      const now = performance.now();
      const dt = now - last; last = now;
      if (count > 0) { sum += dt; if (dt > max) max = dt; }
      count++;
      if (count >= frames + 1) resolve({ avgMs: sum / frames, maxMs: max });
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
