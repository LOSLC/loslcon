"use client"
import Image from "next/image";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import { ensureI18n } from "@/i18n/config";
import { useEffect, useState } from "react";

export function Footer() {
  // ensure i18n is loaded on client when hydrated
  ensureI18n();
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="border-t border-white/10 bg-background mt-16">
      <div className="container mx-auto max-w-6xl px-4 py-10 grid gap-6 sm:grid-cols-2 items-center">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="LOSL-C" width={40} height={40} className="rounded" />
          <span className="sr-only">LOSL-C</span>
        </div>
        <nav className="flex flex-wrap items-center gap-4 justify-start sm:justify-end">
          <Link href={LINKS.home} className="text-sm text-foreground/80 hover:text-foreground" target="_blank" rel="noreferrer">
            <span data-i18n="footer.links.home">Accueil LOSL-C</span>
          </Link>
          <Link href={LINKS.community} className="text-sm text-foreground/80 hover:text-foreground" target="_blank" rel="noreferrer">
            <span data-i18n="footer.links.community">Communauté</span>
          </Link>
          <Link href={LINKS.waitlist} className="text-sm text-foreground/80 hover:text-foreground" target="_blank" rel="noreferrer">
            <span data-i18n="footer.links.waitlist">Liste d’attente</span>
          </Link>
        </nav>
        <div className="sm:col-span-2 text-xs text-muted-foreground">
          <span data-i18n="footer.rights">© {year ?? new Date().getFullYear()} LOSL-C. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
