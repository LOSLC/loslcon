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
import { Navbar } from "./navbar";

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
  <Navbar isLoggedIn={isLoggedIn} />

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

  const mobileLinks: Array<{ href: string; key: string; fallback: string; target?: string }> = [
    { href: "/tickets", key: "nav.tickets", fallback: "Tickets" },
    ...(isLoggedIn
      ? [{ href: "/admin/dashboard", key: "nav.dashboard", fallback: "Dashboard" }]
      : [{ href: "/register", key: "nav.register", fallback: "Register" }]),
    { href: "/devenir-sponsor", key: "nav.sponsor", fallback: "Devenir sponsor" },
    { href: LINKS.home, key: "nav.home", fallback: "LOSL-C Home", target: "_blank" },
    { href: LINKS.community, key: "nav.joinCommunity", fallback: "Rejoindre la communauté", target: "_blank" },
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
                  className="absolute inset-0 bg-background/95 backdrop-blur-lg"
                  aria-hidden
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Menu"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.18
                  }}
                >
                  <nav className="grid gap-4 text-center text-lg">
          {mobileLinks.map(({ href, key, fallback, target }) => (
                      <Link
            key={key}
                        href={href}
                        target={target}
                        rel={target ? "noreferrer" : undefined}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-6 py-3 bg-card/40 ring-1 ring-border hover:bg-card/60"
                      >
            <span data-i18n={key}>{fallback}</span>
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-4 flex items-center gap-4">
                    <LanguageSwitcher />
                    <Button aria-label="Close menu" variant="outline" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
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
