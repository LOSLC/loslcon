"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LINKS } from "@/lib/links";
import { ensureI18n } from "@/i18n/config";
import { Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type HeaderProps = {
  isLoggedIn?: boolean;
};

export function Header({ isLoggedIn = false }: HeaderProps) {
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
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md ${
        navBg
          ? "supports-[backdrop-filter]:bg-background/40 bg-background/60 border-b border-white/10"
          : "bg-[#000000]"
      }`}
    >
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <div
          className="flex items-center gap-2 rounded-md px-2 py-1 select-none"
          aria-label="Brand"
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="LOSL-CON"
              width={36}
              height={36}
              className="rounded"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 items-center gap-6 lg:gap-8 justify-end overflow-x-auto whitespace-nowrap">
          <Link
            href="/tickets"
            className="rounded-md px-2 py-1 text-sm text-foreground/90 hover:text-primary"
          >
            <span data-i18n="nav.tickets">Tickets</span>
          </Link>
          <Link
            href="/devenir-sponsor"
            className="rounded-md px-2 py-1 text-sm text-foreground/90 hover:text-primary"
          >
            <span data-i18n="nav.sponsor">Devenir sponsor</span>
          </Link>
          <Link
            href={LINKS.home}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-2 py-1 text-sm text-foreground/90 hover:text-foreground"
          >
            <span data-i18n="nav.home">LOSL-C</span>
          </Link>
          <Link
            href={LINKS.community}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-2 py-1 text-sm text-foreground/90 hover:text-foreground"
          >
            <span data-i18n="nav.joinCommunity">Rejoindre la communauté</span>
          </Link>

          <div className="h-6 w-px bg-border mx-3" />
          <LanguageSwitcher />

          {/* Auth-aware CTAs */}
          {isLoggedIn ? (
            <Button asChild size="sm" className="ml-3">
              <a href="/admin/dashboard">
                <span>Dashboard</span>
              </a>
            </Button>
          ) : (
            <Button asChild size="sm" className="ml-3">
              <a href="/register">
                <span data-i18n="nav.register">Register</span>
              </a>
            </Button>
          )}
        </nav>

        {/* Mobile nav trigger */}
        <MobileNav isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}

function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
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

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  const mobileLinks = [
    { href: "/tickets", label: "Tickets" },
    ...(isLoggedIn
      ? [{ href: "/admin/dashboard", label: "Dashboard" } as const]
      : [{ href: "/register", label: "Register" } as const]),
    { href: "/devenir-sponsor", label: "Devenir sponsor" },
    { href: LINKS.home, label: "Accueil LOSL-C", target: "_blank" },
    {
      href: LINKS.community,
      label: "Rejoindre la communauté",
      target: "_blank",
    },
  ];

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

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[100]">
                <motion.div
                  className="absolute inset-0 bg-black/70"
                  aria-hidden
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-white/10 shadow-2xl p-4 flex flex-col gap-3"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Menu"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                    mass: 0.9,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="LOSL-C"
                        width={28}
                        height={28}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">LOSL-CON</span>
                    </div>
                    <Button
                      aria-label="Close menu"
                      variant="outline"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="mt-2 grid gap-2">
                    {mobileLinks.map(({ href, label, target }) => (
                      <Link
                        key={label}
                        href={href}
                        target={target}
                        rel={target ? "noreferrer" : undefined}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 hover:bg-accent/20"
                      >
                        <span>{label}</span>
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-3 h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <LanguageSwitcher />
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <a
                          href={LINKS.community}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Rejoindre
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <a href="/devenir-sponsor">Sponsor</a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
