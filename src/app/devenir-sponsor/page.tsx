import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Sparkles, CheckCircle2, Megaphone, Users, Mic2 } from "lucide-react";

const RATE_XOF_PER_USD = 600;

const tiers = [
	{ key: "gold", xof: 600_000 },
	{ key: "silver", xof: 300_000 },
	{ key: "bronze", xof: 100_000 },
	{ key: "custom", xof: null as number | null },
] as const;

function formatMoney(amount: number, currency: string) {
	try {
		return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
	} catch {
		// Fallback for XOF (some environments may not support XOF currency style reliably)
		return `${amount.toLocaleString()} ${currency}`;
	}
}

export const metadata = {
	title: "Devenez sponsor – LOSL-CON 2025",
	description: "Soutenez la conférence et bénéficiez d’une visibilité privilégiée",
};

export default function SponsorPage() {
	return (
		<main className="container mx-auto max-w-6xl px-4 py-16 sm:py-20 overflow-hidden">
			<header className="relative mx-auto max-w-3xl text-center">
				{/* Soft glow background */}
				<span aria-hidden className="pointer-events-none absolute inset-0 -z-10">
					<span className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.accent/18),transparent_60%)] blur-3xl" />
				</span>
				<h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
					<span data-i18n="sponsor.title">Devenez sponsor – LOSL-CON 2025</span>
				</h1>
				<p className="mt-4 text-base sm:text-lg text-muted-foreground" data-i18n="sponsor.subtitle">
					Accédez à une audience engagée. Gagnez en visibilité. Recrutez vos futurs talents.
				</p>
			</header>

			{/* Tier cards */}
			<section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
				{tiers.map((t) => {
					const usd = t.xof ? Math.round(t.xof / RATE_XOF_PER_USD) : null;
					const isGold = t.key === "gold";
					const isSilver = t.key === "silver";
					const isBronze = t.key === "bronze";
					const colors = isGold
						? {
								ring: "ring-amber-400/40",
								badge: "bg-gradient-to-r from-amber-300 to-amber-500 text-black",
								icon: "text-amber-300",
								halo:
									"bg-[radial-gradient(80%_80%_at_50%_0%,rgba(245,158,11,0.25),transparent_70%)]",
						  }
						: isSilver
						? {
								ring: "ring-slate-300/40",
								badge: "bg-gradient-to-r from-slate-200 to-slate-400 text-black",
								icon: "text-slate-200",
								halo:
									"bg-[radial-gradient(80%_80%_at_50%_0%,rgba(203,213,225,0.22),transparent_70%)]",
						  }
						: isBronze
						? {
								ring: "ring-orange-400/40",
								badge: "bg-gradient-to-r from-orange-300 to-orange-600 text-black",
								icon: "text-orange-300",
								halo:
									"bg-[radial-gradient(80%_80%_at_50%_0%,rgba(234,88,12,0.22),transparent_70%)]",
						  }
						: {
								ring: "ring-primary/30",
								badge: "bg-gradient-to-r from-primary/80 to-primary/60",
								icon: "text-primary",
								halo:
									"bg-[radial-gradient(80%_80%_at_50%_0%,rgba(59,130,246,0.18),transparent_70%)]",
						  };

					const Icon = isGold ? Trophy : isSilver ? Medal : isBronze ? Award : Sparkles;

					const benefits: string[] = isGold
						? [
								"Logo XXL sur scène & site",
								"Message d’ouverture (3–5 min)",
								"Espace stand premium",
								"10 Pass VIP",
								"Campagnes sur nos réseaux",
						  ]
						: isSilver
						? [
								"Grand logo sur scène & site",
								"Participation à un panel",
								"Espace stand dédié",
								"6 Pass",
								"Mention newsletter",
						  ]
						: isBronze
						? [
								"Logo sur site & écrans",
								"3 Pass",
								"Merci sur réseaux sociaux",
								"Ajout goodies dans le swag",
								"Listing sur la page sponsors",
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

					return (
						<Card
							key={t.key}
							className={`relative flex h-full flex-col overflow-hidden bg-card/60 backdrop-blur ring-1 ${colors.ring}`}
						>
							{/* Decorative halo */}
							<span aria-hidden className="pointer-events-none absolute inset-0 -z-10">
								<span className={`absolute inset-0 ${colors.halo}`} />
							</span>

							<CardHeader className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className={`rounded-lg bg-white/5 p-2 ${colors.icon}`}>
											<Icon className="h-5 w-5" />
										</span>
										<CardTitle className="text-2xl capitalize">
											<span data-i18n={`sponsor.tiers.${t.key}.name`}>{t.key}</span>
										</CardTitle>
									</div>
									{isGold && (
										<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge}`}>
											<span data-i18n="sponsor.badges.top">Top visibilité</span>
										</span>
									)}
									{isSilver && (
										<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge}`}>
											<span data-i18n="sponsor.badges.popular">Populaire</span>
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
									{benefits.map((b, i) => {
										const key = `sponsor.tiers.${t.key}.benefit${i + 1}` as const;
										return (
											<li key={i} className="flex items-start gap-2">
												<CheckCircle2 className={`mt-0.5 h-4 w-4 flex-none ${colors.icon}`} />
												<span data-i18n={key}>{b}</span>
											</li>
										);
									})}
								</ul>
								<div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
									{isGold && (
										<>
											<span className="inline-flex items-center gap-1">
												<Megaphone className="h-3.5 w-3.5" />{" "}
												<span data-i18n="sponsor.features.mediaBoost">Media boost</span>
											</span>
											<span className="inline-flex items-center gap-1">
												<Users className="h-3.5 w-3.5" />{" "}
												<span data-i18n="sponsor.features.talentReach">Talent reach</span>
											</span>
											<span className="inline-flex items-center gap-1">
												<Mic2 className="h-3.5 w-3.5" />{" "}
												<span data-i18n="sponsor.features.sceneTime">Scene time</span>
											</span>
										</>
									)}
								</div>
								<div className="mt-auto pt-4">
									<Button asChild className="w-full">
										<a href={mailto} data-i18n={`sponsor.cta.${t.key}`}>
											Je deviens sponsor
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</section>
			<section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
				<h2 className="text-xl sm:text-2xl font-semibold" data-i18n="sponsor.contact.heading">
					Pour toute demande ou proposition de sponsoring, contactez-nous à :
				</h2>
				<p className="mt-3 text-muted-foreground">
					<a href="mailto:community@loslc.tech" className="font-medium text-primary hover:underline">
						community@loslc.tech
					</a>
				</p>
			</section>
		</main>
	);
}
