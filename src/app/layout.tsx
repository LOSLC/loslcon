import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DEFAULT_LOCALE } from "@/i18n/settings";
import { AutoTranslate } from "@/components/i18n/auto-translate";
import NextTopLoader from "nextjs-toploader";
import { getCurrentUser } from "@/core/dal/session";
import { getRegistrationsConfig } from "@/app/actions/loslcon/loslcon";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOSL-CON 2025",
  description: "Conférence dédiée à la cybersécurité, l’open source et Linux",
  icons: [{ rel: "icon", url: "/logo.png" }],
  openGraph: {
    title: "LOSL-CON 2025",
    description: "Conférence dédiée à la cybersécurité, l’open source et Linux",
    images: [
      {
        url: "https://loslcon.loslc.tech/event-cover.jpg",
        width: 1200,
        height: 630,
        alt: "LOSL-CON 2025",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const config = await getRegistrationsConfig();
  return (
    <html lang={DEFAULT_LOCALE} className="dark">
      <head>
        {/* Force dark-only color scheme */}
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0b1020" />
      </head>
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <NextTopLoader
          color="#22c55e"
          showSpinner={false}
          height={3}
          crawlSpeed={200}
          crawl
          easing="ease"
        />
        <AutoTranslate />
        <Header isLoggedIn={!!user} registrationsOpen={!!config?.registrationsOpen} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
