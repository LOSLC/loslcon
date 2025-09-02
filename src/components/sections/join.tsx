"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stagger, Item } from "@/components/ui/reveal";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Star, Gift, Users2 } from "lucide-react";

export function Join() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* Subtle background accents to match other sections */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 relative">
        <Stagger>
          {/* Header Section */}
          <Item>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-primary/10 ring-1 ring-primary/20 text-primary">
                  <Clock className="h-3 w-3 mr-1" />
                  <span data-i18n="join.urgency">Places limitées</span>
                </Badge>
              </div>
              <h2
                className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                data-i18n="join.heading"
              >
                Rejoignez la LOSLCON 2025
              </h2>
              <p
                className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
                data-i18n="join.subtitle"
              >
                La plus grande conférence Linux et Open Source d&#39;Afrique
                centrale vous attend. Réservez votre place dès maintenant !
              </p>
            </div>
          </Item>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Left Column - Event Details */}
            <Item>
              <div className="space-y-6">
                {/* Event Info Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="bg-card/50 border-border/50 backdrop-blur">
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div
                          className="text-sm font-medium"
                          data-i18n="join.date"
                        >
                          22 Novembre 2025
                        </div>
                        <div
                          className="text-xs text-muted-foreground"
                          data-i18n="join.dateDesc"
                        >
                          Journée complète
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="bg-card/50 border-border/50 backdrop-blur">
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div
                          className="text-sm font-medium"
                          data-i18n="join.location"
                        >
                          Lomé, Togo
                        </div>
                        <div
                          className="text-xs text-muted-foreground"
                          data-i18n="join.venue"
                        >
                          Institut Français du Togo
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="bg-card/50 border-border/50 backdrop-blur">
                      <CardContent className="p-4 text-center">
                        <Users2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div
                          className="text-sm font-medium"
                          data-i18n="join.capacity"
                        >
                          150+ Participants
                        </div>
                        <div
                          className="text-xs text-muted-foreground"
                          data-i18n="join.networking"
                        >
                          Networking
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="bg-card/50 border-border/50 backdrop-blur">
                      <CardContent className="p-4 text-center">
                        <Gift className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div
                          className="text-sm font-medium"
                          data-i18n="join.benefits"
                        >
                          Goodies inclus
                        </div>
                        <div
                          className="text-xs text-muted-foreground"
                          data-i18n="join.swag"
                        >
                          Certificats & plus
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Call to Action */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button size="lg" className="font-semibold px-6">
                        <a href="/register" className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span data-i18n="join.ctaPrimary">
                            S&#39;inscrire maintenant
                          </span>
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button size="lg" variant="secondary" className="px-6">
                        <a href="/tickets">
                          <span data-i18n="join.ctaSecondary">
                            Voir les tickets
                          </span>
                        </a>
                      </Button>
                    </motion.div>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-i18n="join.standardRate"
                  >
                    Tarif standard en cours — réservez maintenant.
                  </p>
                </div>
              </div>
            </Item>

            {/* Right Column - QR Code */}
            <Item>
              <div className="flex justify-center">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="relative bg-card/50 border-border/50 backdrop-blur p-8 text-center">
                    <CardContent className="p-0">
                      <div className="mb-4">
                        <Badge className="bg-primary/10 ring-1 ring-primary/20 text-primary">
                          <span data-i18n="join.qrTitle">
                            Inscription rapide
                          </span>
                        </Badge>
                      </div>
                      <div className="relative">
                        <Image
                          src="/qrcode.png"
                          alt="QR code for registration"
                          width={200}
                          height={200}
                          className="mx-auto rounded ring-1 ring-border shadow"
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <p
                          className="text-sm font-medium"
                          data-i18n="join.scanTitle"
                        >
                          Scannez pour vous inscrire
                        </p>
                        <p
                          className="text-xs text-muted-foreground"
                          data-i18n="join.scanDesc"
                        >
                          Accès direct au formulaire d&#39;inscription
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </Item>
          </div>

          {/* Bottom Call to Action */}
          <Item>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span data-i18n="join.countdown">
                  Plus que quelques semaines avant l&#39;événement !
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                <span data-i18n="join.secure">🔒 Paiement sécurisé</span>
                <span data-i18n="join.refund">💯 Remboursement 48h</span>
                <span data-i18n="join.support">🎧 Support 24/7</span>
              </div>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
