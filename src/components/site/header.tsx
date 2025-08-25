"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LINKS } from "@/lib/links";
import { ensureI18n } from "@/i18n/config";
import { Menu, X } from "lucide-react";
import { createPortal } from "react-dom";

export function Header() {
  const [navBg, setNavBg] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setNavBg(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    ensureI18n();
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md ${navBg ? "supports-[backdrop-filter]:bg-background/40 bg-background/60 border-b border-white/10" : "bg-[#000000]"}`}>
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="LOSL-C" width={36} height={36} className="rounded" />
          <span className="sr-only">LOSL-C</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/devenir-sponsor" className="text-sm transition-all hover:-translate-x-2 duration-500 text-foreground/90 hover:text-primary hidden sm:inline-block">
            <span data-i18n="nav.sponsor">Devenir sponsor</span>
          </Link>
          <Link href={LINKS.home} className="text-sm text-foreground/90 hover:text-foreground" target="_blank" rel="noreferrer">
            {/* t('nav.home') from i18n in client via data-i18n attr */}
            <span data-i18n="nav.home">LOSL-C</span>
          </Link>
          <Link href={LINKS.community} className="text-sm text-foreground/90 hover:text-foreground" target="_blank" rel="noreferrer">
            <span data-i18n="nav.joinCommunity">Rejoindre la communauté</span>
          </Link>
          <div className="h-6 w-px bg-border mx-2" />
          <LanguageSwitcher />
          <Button asChild size="sm" className="ml-2">
            <a href={LINKS.community} target="_blank" rel="noreferrer">
              <span data-i18n="nav.joinCommunity">Rejoindre la communauté</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="accent"
            className="hidden sm:inline-flex relative overflow-hidden ring-1 ring-accent/40 hover:ring-accent/60 transition shadow-[0_0_20px_-5px_var(--color-accent)] hover:shadow-[0_0_28px_-4px_var(--color-accent)]"
          >
            <a href="/devenir-sponsor">
              <span className="relative z-[1]" data-i18n="nav.sponsor">Devenir sponsor</span>
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
                <span className="absolute -inset-8 bg-[conic-gradient(at_top_right,theme(colors.accent/60),transparent_30%)] blur-xl" />
                <span className="absolute left-[-20%] top-[-40%] h-[180%] w-1/3 rotate-[14deg] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm animate-[shimmer_1.8s_linear_infinite]" />
              </span>
            </a>
          </Button>
        </nav>
        {/* Mobile nav trigger */}
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [open, mounted]);
  return (
    <div className="md:hidden">
      <Button
        aria-label="Open menu"
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="bg-background/60"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mounted && open
        ? createPortal(
          <div className="fixed inset-0 z-[100]">
            <div
              className="absolute inset-0 bg-black/70"
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-white/10 shadow-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="LOSL-C" width={28} height={28} className="rounded" />
                  <span className="text-sm font-medium">LOSL-CON</span>
                </div>
                <Button aria-label="Close menu" variant="outline" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="mt-2 grid gap-2">
                <Link href={LINKS.home} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent/20">
                  <span data-i18n="nav.home">Accueil LOSL-C</span>
                </Link>
                <Link href={LINKS.community} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent/20">
                  <span data-i18n="nav.joinCommunity">Rejoindre la communauté</span>
                </Link>
                <Link href="/devenir-sponsor" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent/20">
                  <span data-i18n="nav.sponsor">Devenir sponsor</span>
                </Link>
              </nav>
              <div className="mt-3 h-px bg-border" />
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <a href={LINKS.community} target="_blank" rel="noreferrer">
                      <span data-i18n="nav.joinCommunity">Rejoindre</span>
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="accent">
                    <a href="/devenir-sponsor">
                      <span data-i18n="nav.sponsor">Sponsor</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </div>
  );
}
