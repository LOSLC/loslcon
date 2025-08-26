import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock, Terminal } from "lucide-react";
import Image from "next/image";

export function About() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl text-foreground font-bold" data-i18n="about.heading">À propos de LOSL-CON</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed" data-i18n="about.body">
          LOSL-CON est un événement communautaire centré sur la liberté numérique, la sécurité et l’adoption des technologies open source & Linux.
        </p>
      </div>
      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex h-full flex-col gap-6">
          <Card className="border border-border overflow-hidden rounded-lg">
            <CardHeader className="bg-card/40 backdrop-blur rounded-t-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle data-i18n="about.values.freedom.title">Liberté numérique</CardTitle>
              </div>
              <CardDescription data-i18n="about.values.freedom.desc">
                Promouvoir l’autonomie technologique, la confidentialité et le contrôle de ses données.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border overflow-hidden rounded-lg">
            <CardHeader className="bg-card/40 backdrop-blur rounded-t-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                <CardTitle data-i18n="about.values.security.title">Sécurité</CardTitle>
              </div>
              <CardDescription data-i18n="about.values.security.desc">
                Renforcer les pratiques de cybersécurité et la résilience des systèmes.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border overflow-hidden rounded-lg">
            <CardHeader className="bg-card/40 backdrop-blur rounded-t-lg">
              <div className="flex items-center gap-2">
                <Terminal className="h-6 w-6 text-primary" />
                <CardTitle data-i18n="about.values.open.title">Open source & Linux</CardTitle>
              </div>
              <CardDescription data-i18n="about.values.open.desc">
                Encourager l’usage, la contribution et le partage autour de l’open source et Linux.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Image src="/event-cover.png" alt="Affiche de l'événement" className="rounded" width={500} height={300} />
      </div>
    </section>
  );
}
