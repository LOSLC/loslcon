"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stagger, Item } from "@/components/ui/reveal";
import { LINKS } from "@/lib/links";
import { motion } from "framer-motion";
import { Rocket, Code2, Cpu, Shield, Network, Sparkles } from "lucide-react";

export function Expo() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-muted/20 to-background overflow-hidden">
      {/* Background accents */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-16 right-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <Stagger>
          {/* Header */}
          <Item>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-5">
                <div className="relative inline-flex">
                  <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-lg bg-accent/30 blur-md opacity-70" />
                  <Badge className="relative px-3 py-1.5 bg-accent/30 ring-2 ring-accent/60 text-white shadow-lg backdrop-blur">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    <span data-i18n="expo.badge" className="font-semibold tracking-wide uppercase">Nouveau</span>
                  </Badge>
                </div>
              </div>
              <h2
                className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent"
                data-i18n="expo.heading"
              >
                Foire des projets open‑source
              </h2>
              <p
                className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
                data-i18n="expo.subtitle"
              >
                À l’occasion de LOSL‑CON 2025, exposez votre projet et mettez‑le en lumière.
              </p>
            </div>
          </Item>

          {/* Categories + Benefits grid */}
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <Item>
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-6">
                <div className="text-sm font-semibold text-muted-foreground mb-4" data-i18n="expo.whoTitle">
                  Pour qui ?
                </div>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center gap-2"><Code2 className="h-4 w-4 text-primary" />
                    <span data-i18n="expo.types.lib">Librairie / Framework</span>
                  </li>
                  <li className="flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" />
                    <span data-i18n="expo.types.ai">IA / ML</span>
                  </li>
                  <li className="flex items-center gap-2"><Network className="h-4 w-4 text-primary" />
                    <span data-i18n="expo.types.iot">IoT / Hardware</span>
                  </li>
                  <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />
                    <span data-i18n="expo.types.security">Outils cybersécurité</span>
                  </li>
                  <li className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" />
                    <span data-i18n="expo.types.other">Et tout autre projet open‑source</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground" data-i18n="expo.whoNote">
                  Étudiants, makers, équipes, communautés : vous êtes les bienvenus.
                </p>
              </div>
            </Item>

            <Item>
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-6">
                <div className="text-sm font-semibold text-muted-foreground mb-4" data-i18n="expo.whyTitle">
                  Pourquoi exposer ?
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">✨</span>
                    <p>
                      <span className="font-medium" data-i18n="expo.benefits.visibilityTitle">Gagnez en visibilité</span>
                      <span className="text-muted-foreground"> — </span>
                      <span data-i18n="expo.benefits.visibilityDesc">Présentez votre projet devant une audience engagée.</span>
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">🤝</span>
                    <p>
                      <span className="font-medium" data-i18n="expo.benefits.supportTitle">Trouvez du soutien</span>
                      <span className="text-muted-foreground"> — </span>
                      <span data-i18n="expo.benefits.supportDesc">Bénéficiez de retours, de contributions et de connexions.</span>
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">🚀</span>
                    <p>
                      <span className="font-medium" data-i18n="expo.benefits.showcaseTitle">Montrez votre savoir‑faire</span>
                      <span className="text-muted-foreground"> — </span>
                      <span data-i18n="expo.benefits.showcaseDesc">Démontrez votre expertise aux partenaires et recruteurs.</span>
                    </p>
                  </li>
                </ul>
                <div className="mt-6">
                  <div className="flex flex-wrap gap-3 items-center">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild size="lg" className="px-6">
                        <a href={LINKS.expo} target="_blank" rel="noreferrer">
                          <Rocket className="h-4 w-4 mr-2" />
                          <span data-i18n="expo.cta">Postuler maintenant</span>
                        </a>
                      </Button>
                    </motion.div>
                    <Button asChild variant="secondary">
                      <a href="/foire">
                        <span data-i18n="expo.knowMore">En savoir plus</span>
                      </a>
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground" data-i18n="expo.deadline">
                    Les places sont limitées — postulez dès maintenant.
                  </p>
                </div>
              </div>
            </Item>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
