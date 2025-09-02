"use client";
import { CheckCircle2, Users, Lightbulb, Trophy, Coffee, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stagger, Item } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const items = [
  { 
    key: "talks", 
    i18n: "expect.items.talks",
    title: "Conférences inspirantes",
    desc: "Des talks captivants par des experts reconnus sur les dernières innovations en cybersécurité, open source et Linux.",
    icon: Users,
    color: "text-blue-500"
  },
  { 
    key: "workshops", 
    i18n: "expect.items.workshops",
    title: "Ateliers pratiques",
    desc: "Des sessions hands-on pour apprendre de nouvelles compétences et maîtriser les outils essentiels.",
    icon: BookOpen,
    color: "text-green-500"
  },
  { 
    key: "networking", 
    i18n: "expect.items.networking",
    title: "Networking & Échanges",
    desc: "Rencontrez la communauté tech togolaise, créez des connexions et découvrez de nouvelles opportunités.",
    icon: Coffee,
    color: "text-orange-500"
  },
  { 
    key: "innovation", 
    i18n: "expect.items.innovation",
    title: "Innovation & Découvertes",
  desc: "Explorez les technologies émergentes et les projets innovants qui façonnent l&#39;avenir du tech au Togo.",
    icon: Lightbulb,
    color: "text-yellow-500"
  },
];

export function Expect() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/30">
      {/* Background decoration */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
  <div className="text-center mb-10 sm:mb-16">
          <Item>
            <Badge className="inline-flex items-center gap-2 bg-primary/15 text-primary ring-1 ring-primary/30 px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm mb-4 sm:mb-6">
              <Trophy className="h-4 w-4 text-primary" />
              <span data-i18n="expect.badge">Programme 2025</span>
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent" data-i18n="expect.heading">
              Une expérience tech complète
            </h2>
          </Item>
          <Item>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" data-i18n="expect.subtitle">
              Plongez dans un programme riche conçu pour tous les niveaux, des débutants aux experts confirmés.
            </p>
          </Item>
        </div>

  <Stagger className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
          {items.map((item) => (
            <Item key={item.key}>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                <Card className="group h-full bg-card/50 border-border/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl bg-background/50 ${item.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <item.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" data-i18n={item.i18n}>
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed" data-i18n={`${item.i18n}_desc`}>
                          {item.desc}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                          <span data-i18n={`${item.i18n}_included`}>Inclus dans votre ticket</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Item>
          ))}
        </Stagger>

        <Item>
          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50 backdrop-blur">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-i18n="expect.schedule.morning">Matin</div>
                <div className="text-sm text-muted-foreground" data-i18n="expect.schedule.morning_desc">Conférences & Talks</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-i18n="expect.schedule.afternoon">Après-midi</div>
                <div className="text-sm text-muted-foreground" data-i18n="expect.schedule.afternoon_desc">Ateliers & Networking</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-i18n="expect.schedule.evening">Soirée</div>
                <div className="text-sm text-muted-foreground" data-i18n="expect.schedule.evening_desc">Networking & Clôture</div>
              </div>
            </div>
          </div>
        </Item>
      </div>
    </section>
  );
}
