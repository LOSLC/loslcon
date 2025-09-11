"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Crown,
  Trophy,
  Medal,
  Award,
  Sparkles,
  CheckCircle2,
  Megaphone,
  Users,
  Mic2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RATE_XOF_PER_USD = 600;

type TierKey = "diamond" | "gold" | "silver" | "bronze" | "custom";

const tiers: Array<{ key: TierKey; xof: number | null }> = [
  { key: "diamond", xof: 6_000_000 },
  { key: "gold", xof: 1_000_000 },
  { key: "silver", xof: 600_000 },
  { key: "bronze", xof: 200_000 },
  { key: "custom", xof: null },
];

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export function SponsorCarousel() {
  const slides = useMemo(() => {
    return tiers.map((t) => {
      const usd = t.xof ? Math.round(t.xof / RATE_XOF_PER_USD) : null;
      const isDiamond = t.key === "diamond";
      const isGold = t.key === "gold";
      const isSilver = t.key === "silver";
      const isBronze = t.key === "bronze";
      const colors = isDiamond
        ? {
            ring: "ring-cyan-400/50",
            badge: "bg-gradient-to-r from-cyan-200 to-cyan-400 text-black",
            icon: "text-cyan-300",
            halo: "bg-[radial-gradient(80%_80%_at_50%_0%,rgba(34,211,238,0.35),transparent_70%)]",
            pageBg:
              "radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.20), rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(7, 89, 133, 0.25), rgba(2, 6, 23, 0.15))",
          }
        : isGold
        ? {
            ring: "ring-amber-400/40",
            badge: "bg-gradient-to-r from-amber-300 to-amber-500 text-black",
            icon: "text-amber-300",
            halo: "bg-[radial-gradient(80%_80%_at_50%_0%,rgba(245,158,11,0.25),transparent_70%)]",
            pageBg:
              "radial-gradient(60% 60% at 50% 0%, rgba(245,158,11,0.18), rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(120, 53, 15, 0.20), rgba(23, 8, 2, 0.10))",
          }
        : isSilver
        ? {
            ring: "ring-slate-300/40",
            badge: "bg-gradient-to-r from-slate-200 to-slate-400 text-black",
            icon: "text-slate-200",
            halo: "bg-[radial-gradient(80%_80%_at_50%_0%,rgba(203,213,225,0.22),transparent_70%)]",
            pageBg:
              "radial-gradient(60% 60% at 50% 0%, rgba(203,213,225,0.18), rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(15, 23, 42, 0.25), rgba(2, 6, 23, 0.10))",
          }
        : isBronze
        ? {
            ring: "ring-orange-400/40",
            badge: "bg-gradient-to-r from-orange-300 to-orange-600 text-black",
            icon: "text-orange-300",
            halo: "bg-[radial-gradient(80%_80%_at_50%_0%,rgba(234,88,12,0.22),transparent_70%)]",
            pageBg:
              "radial-gradient(60% 60% at 50% 0%, rgba(234,88,12,0.18), rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(88, 28, 7, 0.18), rgba(23, 10, 2, 0.10))",
          }
        : {
            ring: "ring-primary/30",
            badge: "bg-gradient-to-r from-primary/80 to-primary/60",
            icon: "text-primary",
            halo: "bg-[radial-gradient(80%_80%_at_50%_0%,rgba(59,130,246,0.18),transparent_70%)]",
            pageBg:
              "radial-gradient(60% 60% at 50% 0%, rgba(59,130,246,0.18), rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(23, 37, 84, 0.22), rgba(2, 6, 23, 0.10))",
          };

      const Icon = isDiamond ? Crown : isGold ? Trophy : isSilver ? Medal : isBronze ? Award : Sparkles;

      const benefits: string[] = isDiamond
        ? [
            "Logo géant sur scène & site",
            "Keynote d'ouverture (10-15 min)",
            "Espace stand exclusif premium",
            "20 Pass VIP + accès backstage",
            "Campagne marketing dédiée",
            "Co-branding événement",
            "Interview vidéo exclusive",
          ]
        : isGold
        ? [
            "Logo XXL sur scène & site",
            "Message d'ouverture (5-8 min)",
            "Espace stand premium",
            "12 Pass VIP",
            "Campagnes sur nos réseaux",
            "Mention dans newsletter",
            "Accès VIP networking",
          ]
        : isSilver
        ? [
            "Grand logo sur scène & site",
            "Participation à un panel",
            "Espace stand dédié",
            "8 Pass",
            "Mention newsletter",
            "Post réseaux sociaux",
            "Accès networking",
          ]
        : isBronze
        ? [
            "Logo sur site & écrans",
            "4 Pass",
            "Merci sur réseaux sociaux",
            "Ajout goodies dans le swag",
            "Listing sur la page sponsors",
            "Accès cocktail networking",
          ]
        : [
            "Pack sur-mesure",
            "Budget flexible",
            "Idéal startups & communautés",
            "Objectifs co-construits",
            "Activation adaptée",
          ];

      const mailto = `mailto:community@loslc.tech?subject=${encodeURIComponent(
        `Sponsoring ${t.key.toUpperCase()} – LOSL-CON 2025`
      )}`;

      return { t, usd, colors, Icon, benefits, isDiamond, isGold } as const;
    });
  }, []);

  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const play = () => {
      timerRef.current = window.setInterval(() => {
        if (!pausedRef.current) {
          setIndex((i) => (i + 1) % slides.length);
        }
      }, 6000);
    };
    play();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const active = slides[index];

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ background: active.colors.pageBg }}
    >
      {/* Page header inside full-screen area */}
      <div className="pointer-events-none absolute left-1/2 top-8 z-20 w-full max-w-4xl -translate-x-1/2 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span data-i18n="sponsor.title">Devenez sponsor – LOSL-CON 2025</span>
        </h1>
        <p className="mt-3 text-sm sm:text-lg text-muted-foreground" data-i18n="sponsor.subtitle">
          Accédez à une audience engagée. Gagnez en visibilité. Recrutez vos futurs talents.
        </p>
      </div>
      {/* Slides */}
      <div
        className="h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${index * 100}%)` }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {slides.map(({ t, usd, colors, Icon, benefits, isDiamond, isGold }, i) => (
          <div key={t.key} className="h-screen w-full">
            <div className="relative flex h-full items-center justify-center p-4 sm:p-8">
              {/* Halo */}
              <span aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <span className={`absolute inset-0 ${colors.halo}`} />
              </span>

              <Card className={`mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-card/60 backdrop-blur ring-1 ${colors.ring}`}>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-lg bg-white/5 p-2 ${colors.icon}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-3xl capitalize">
                        <span data-i18n={`sponsor.tiers.${t.key}.name`}>{t.key}</span>
                      </CardTitle>
                    </div>
                    {t.key === "diamond" && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge}`}>
                        <span data-i18n="sponsor.badges.premium">Premium Elite</span>
                      </span>
                    )}
                    {t.key === "gold" && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge}`}>
                        <span data-i18n="sponsor.badges.top">Top visibilité</span>
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    {t.xof !== null ? (
                      <span>
                        {formatMoney(t.xof, "XOF")} <span aria-hidden>•</span> ≈ ${usd?.toLocaleString()} USD
                      </span>
                    ) : (
                      <span data-i18n="sponsor.tiers.custom.note">Contact personnalisé</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex grow flex-col">
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-none ${colors.icon}`} />
                        <span data-i18n={`sponsor.tiers.${t.key}.benefit${idx + 1}`}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {isDiamond && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.exclusive">Exclusivité totale</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Megaphone className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.cobranding">Co-branding</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Mic2 className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.keynote">Keynote exclusive</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.backstage">Accès backstage</span>
                        </span>
                      </>
                    )}
                    {isGold && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Megaphone className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.mediaBoost">Media boost</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.talentReach">Talent reach</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Mic2 className="h-3.5 w-3.5" /> <span data-i18n="sponsor.features.sceneTime">Scene time</span>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-auto pt-6">
                    <Button asChild className="w-full">
                      <a
                        href={`mailto:community@loslc.tech?subject=${encodeURIComponent(
                          `Sponsoring ${t.key.toUpperCase()} – LOSL-CON 2025`
                        )}`}
                        data-i18n={`sponsor.cta.${t.key}`}
                      >
                        Je deviens sponsor
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next controls (desktop/tablet) */}
      <div className="pointer-events-auto absolute top-1/2 right-4 z-20 -translate-y-1/2 hidden sm:flex flex-col gap-2">
        <button
          aria-label="Previous"
          className="rounded-full bg-background/70 p-2 backdrop-blur ring-1 ring-white/10 hover:bg-background/90 transition"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          aria-label="Next"
          className="rounded-full bg-background/70 p-2 backdrop-blur ring-1 ring-white/10 hover:bg-background/90 transition"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Dots (desktop/tablet) */}
      <div className="pointer-events-auto absolute bottom-6 left-1/2 z-10 -translate-x-1/2 hidden sm:block">
        <div className="flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 backdrop-blur">
          {slides.map((s, i) => (
            <button
              key={s.t.key}
              aria-label={`Go to ${s.t.key}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${i === index ? "bg-primary w-6" : "bg-foreground/30"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Mobile controls: dots + horizontal prev/next under the carousel */}
      <div className="pointer-events-auto absolute bottom-6 left-1/2 z-10 -translate-x-1/2 w-full max-w-sm px-4 sm:hidden">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 backdrop-blur">
            {slides.map((s, i) => (
              <button
                key={s.t.key}
                aria-label={`Go to ${s.t.key}`}
                className={`h-2.5 w-2.5 rounded-full transition-all ${i === index ? "bg-primary w-6" : "bg-foreground/30"}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Previous"
              className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-2 text-sm backdrop-blur ring-1 ring-white/10 hover:bg-background/90 transition"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </button>
            <button
              aria-label="Next"
              className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-2 text-sm backdrop-blur ring-1 ring-white/10 hover:bg-background/90 transition"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SponsorCarousel;
