import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DEFAULT_LOCALE } from "@/i18n/settings";
import { AutoTranslate } from "@/components/i18n/auto-translate";

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
  icons: [{ rel: "icon", url: "logo.png" }],
  openGraph: {
    title: "LOSL-CON 2025",
    description: "Conférence dédiée à la cybersécurité, l’open source et Linux",
    images: [
      {
        url: "event-cover.jpg",
        width: 1200,
        height: 630,
        alt: "LOSL-CON 2025",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE} className="dark">
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#0b1020" />
      </head>
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <AutoTranslate />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
