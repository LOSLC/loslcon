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

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <div className="hidden md:flex w-full items-center justify-end gap-4">
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <Link href="/tickets" legacyBehavior passHref>
              <NavigationMenuLink data-i18n="nav.tickets">Tickets</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/devenir-sponsor" legacyBehavior passHref>
              <NavigationMenuLink data-i18n="nav.sponsor">Devenir sponsor</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={LINKS.home} target="_blank" rel="noreferrer" legacyBehavior passHref>
              <NavigationMenuLink data-i18n="nav.home">LOSL-C</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={LINKS.community} target="_blank" rel="noreferrer" legacyBehavior passHref>
              <NavigationMenuLink data-i18n="nav.joinCommunity">Rejoindre la communauté</NavigationMenuLink>
            </Link>
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
        <Link href="/register" className="rounded-md px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90" data-i18n="nav.register">
          Register
        </Link>
      )}
    </div>
  );
}
