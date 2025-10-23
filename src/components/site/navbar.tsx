"use client";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LINKS } from "@/lib/links";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export function Navbar({ isLoggedIn = false, registrationsOpen = true }: { isLoggedIn?: boolean; registrationsOpen?: boolean }) {
  return (
    <div className="hidden md:flex w-full items-center justify-end gap-4">
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="gap-1">
          {registrationsOpen && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild data-i18n="nav.tickets">
                <Link href="/tickets">Tickets</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <NavigationMenuLink asChild data-i18n="nav.sponsor">
              <Link href="/devenir-sponsor">Devenir sponsor</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild data-i18n="nav.home">
              <Link href={LINKS.home} target="_blank" rel="noreferrer">LOSL-C</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild data-i18n="nav.joinCommunity">
              <Link href={LINKS.community} target="_blank" rel="noreferrer">Rejoindre la communauté</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="h-6 w-px bg-border" />
      <LanguageSwitcher />
      {isLoggedIn ? (
        <Link href="/admin/dashboard" className="rounded-md px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90">
          Dashboard
        </Link>
      ) : (
        registrationsOpen ? (
          <Link href="/register" className="rounded-md px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90" data-i18n="nav.register">
            Register
          </Link>
        ) : null
      )}
    </div>
  );
}
