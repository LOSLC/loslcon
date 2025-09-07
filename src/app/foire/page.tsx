"use client";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LINKS } from "@/lib/links";
import { Rocket, Users, Eye, MessageSquare, Plug, Wifi, MonitorSmartphone, ShieldCheck, ListChecks } from "lucide-react";

export default function FairPage() {
  const [src, setSrc] = useState("/fair.jpg");

  return (
    <main className="relative isolate overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* soft bg accents */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] h-[40vmin] w-[40vmin] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40vmin] w-[40vmin] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <section className="container mx-auto max-w-6xl px-4 py-14 sm:py-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex mb-5 relative">
            <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-lg bg-accent/30 blur-md opacity-70" />
            <Badge className="relative bg-accent/30 ring-2 ring-accent/60 text-white">
              <Rocket className="h-3.5 w-3.5 mr-1" />
              <span data-i18n="fair.badge">Expo</span>
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent" data-i18n="fair.title">
            Foire des projets open‑source
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto" data-i18n="fair.subtitle">
            Exposez votre projet à LOSL‑CON 2025, gagnez en visibilité et connectez‑vous avec la communauté.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Left: content */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3" data-i18n="fair.who.title">Pour qui ?</h2>
                <p className="text-sm text-muted-foreground mb-4" data-i18n="fair.who.desc">
                  Développeurs, étudiants, makers, équipes et communautés open‑source.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center gap-2"><MonitorSmartphone className="h-4 w-4 text-primary" /><span data-i18n="fair.who.items.lib">Librairies, frameworks, outils</span></li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><span data-i18n="fair.who.items.security">Cybersécurité & forensics</span></li>
                  <li className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span data-i18n="fair.who.items.community">Projets de communauté</span></li>
                  <li className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" /><span data-i18n="fair.who.items.other">IA/ML, IoT, DevTools, et plus</span></li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3" data-i18n="fair.why.title">Pourquoi participer ?</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3"><Eye className="mt-0.5 h-4 w-4 text-primary" /><p><span className="font-medium" data-i18n="fair.why.visibility.title">Visibilité accrue</span><span className="text-muted-foreground"> — </span><span data-i18n="fair.why.visibility.desc">Présentez votre projet à une audience engagée.</span></p></li>
                  <li className="flex items-start gap-3"><MessageSquare className="mt-0.5 h-4 w-4 text-primary" /><p><span className="font-medium" data-i18n="fair.why.feedback.title">Retours & contributions</span><span className="text-muted-foreground"> — </span><span data-i18n="fair.why.feedback.desc">Échangez avec des pairs et potentiels contributeurs.</span></p></li>
                  <li className="flex items-start gap-3"><Users className="mt-0.5 h-4 w-4 text-primary" /><p><span className="font-medium" data-i18n="fair.why.network.title">Networking</span><span className="text-muted-foreground"> — </span><span data-i18n="fair.why.network.desc">Rencontrez partenaires, mentors et recruteurs.</span></p></li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3" data-i18n="fair.how.title">Comment ça marche</h2>
                <ol className="grid gap-3 text-sm sm:grid-cols-3">
                  <li className="rounded-lg border border-border/50 p-3"><span className="block text-xs text-muted-foreground mb-1" data-i18n="fair.how.step1.title">1. Postulez</span><span data-i18n="fair.how.step1.desc">Remplissez le formulaire avec une courte description.</span></li>
                  <li className="rounded-lg border border-border/50 p-3"><span className="block text-xs text-muted-foreground mb-1" data-i18n="fair.how.step2.title">2. Sélection</span><span data-i18n="fair.how.step2.desc">Nous évaluons l’impact, la clarté et la démonstrabilité.</span></li>
                  <li className="rounded-lg border border-border/50 p-3"><span className="block text-xs text-muted-foreground mb-1" data-i18n="fair.how.step3.title">3. Expo</span><span data-i18n="fair.how.step3.desc">Présentez votre projet le jour J avec un stand dédié.</span></li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3" data-i18n="fair.logistics.title">Logistique</h2>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center gap-2"><Plug className="h-4 w-4 text-primary" /><span data-i18n="fair.logistics.power">Prises électriques disponibles</span></li>
                  <li className="flex items-center gap-2"><Wifi className="h-4 w-4 text-primary" /><span data-i18n="fair.logistics.internet">Accès Internet (selon disponibilité)</span></li>
                  <li className="flex items-center gap-2"><MonitorSmartphone className="h-4 w-4 text-primary" /><span data-i18n="fair.logistics.demo">Préparez une démo courte et claire</span></li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><span data-i18n="fair.logistics.rules">Respect du code de conduite</span></li>
                </ul>
              </CardContent>
            </Card>

            <div className="pt-2">
              <Button asChild size="lg" className="px-6">
                <a href={LINKS.expo} target="_blank" rel="noreferrer">
                  <Rocket className="h-4 w-4 mr-2" />
                  <span data-i18n="fair.cta">Postuler maintenant</span>
                </a>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground" data-i18n="fair.note">Les places sont limitées — postulez dès maintenant.</p>
            </div>
          </div>

          {/* Right: side cover */}
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
              <Image
                src={src}
                alt="Open‑source Projects Fair cover"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
                onError={() => setSrc("/event-cover.jpg")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white/90 text-sm">
                <span data-i18n="fair.cover.caption">Exposez. Inspirez. Connectez.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
