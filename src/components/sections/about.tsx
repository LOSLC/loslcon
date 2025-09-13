"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Terminal, Users, Code, Award } from "lucide-react";
import Image from "next/image";
import { Stagger, Item } from "@/components/ui/reveal";

export function About() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Enhanced background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-card/30" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Item>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium ring-1 ring-primary/20 backdrop-blur mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span data-i18n="about.badge" className="text-primary">
                Événement Tech 2025
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent" data-i18n="about.heading">
              À propos de LOSL-CON 2025
            </h2>
          </Item>
          <Item>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto" data-i18n="about.body">
              LOSL-CON 2025 rassemble la communauté tech togolaise autour de la cybersécurité, l&#39;open source et Linux. Une journée d&#39;apprentissage, de networking et d&#39;innovation technologique.
            </p>
          </Item>
          <Item>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
                <div className="text-2xl font-bold text-primary" data-i18n="about.stats.speakers">5</div>
                <div className="text-sm text-muted-foreground" data-i18n="about.stats.speakers_label">Speakers experts</div>
              </div>
              <div className="p-4 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
                <div className="text-2xl font-bold text-primary" data-i18n="about.stats.attendees">300–500</div>
                <div className="text-sm text-muted-foreground" data-i18n="about.stats.attendees_label">Participants</div>
              </div>
              <div className="p-4 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
                <div className="text-2xl font-bold text-primary" data-i18n="about.stats.workshops">3</div>
                <div className="text-sm text-muted-foreground" data-i18n="about.stats.workshops_label">Ateliers pratiques</div>
              </div>
              <div className="p-4 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
                <div className="text-2xl font-bold text-primary" data-i18n="about.stats.hours">8h</div>
                <div className="text-sm text-muted-foreground" data-i18n="about.stats.hours_label">De contenu</div>
              </div>
            </div>
          </Item>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Stagger className="space-y-6">
            {[
              {
                Icon: Shield,
                titleKey: "about.values.security.title",
                descKey: "about.values.security.desc",
                title: "Cybersécurité & Protection",
                desc: "Découvrez les dernières tendances en sécurité informatique et apprenez à protéger vos systèmes contre les menaces modernes.",
                color: "text-red-500"
              },
              {
                Icon: Code,
                titleKey: "about.values.opensource.title", 
                descKey: "about.values.opensource.desc",
                title: "Open Source & Collaboration",
                desc: "Explorez l&#39;écosystème open source, contribuez aux projets communautaires et découvrez les outils qui façonnent l&#39;avenir du développement.",
                color: "text-green-500"
              },
              {
                Icon: Terminal,
                titleKey: "about.values.linux.title",
                descKey: "about.values.linux.desc", 
                title: "Linux & Infrastructure",
                desc: "Maîtrisez les systèmes Linux, l&#39;administration serveur et les technologies cloud qui alimentent l&#39;infrastructure moderne.",
                color: "text-blue-500"
              }
            ].map(({ Icon, titleKey, descKey, title, desc, color }) => (
              <Item key={titleKey}>
                <Card className="group border border-border/50 bg-card/30 backdrop-blur hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-background/50 ${color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2" data-i18n={titleKey}>
                          {title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed" data-i18n={descKey}>
                          {desc}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Item>
            ))}
          </Stagger>

          <Item>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
              <div className="relative bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-6">
                <Image 
                  src="/event-cover.png" 
                  alt="Affiche LOSL-CON 2025" 
                  className="rounded-lg shadow-2xl w-full h-auto" 
                  width={500} 
                  height={300} 
                />
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold mb-2" data-i18n="about.event_info.title">
                    22 Novembre 2025
                  </h3>
                  <p className="text-muted-foreground" data-i18n="about.event_info.location">
                    Institut Français du Togo, Lomé
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span data-i18n="about.event_info.networking">Networking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span data-i18n="about.event_info.certificates">Certificats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Item>
        </div>
      </div>
    </section>
  );
}
