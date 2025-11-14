"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MapPin, Loader2, XCircle } from "lucide-react";
import { confirmAttendance } from "@/app/actions/loslcon/loslcon";
import { ensureI18n } from "@/i18n/config";

export default function AttendanceConfirmationPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Set to true to close attendance confirmations
  const isClosed = true;

  useEffect(() => {
    params.then((p) => setRegistrationId(p.registrationId));
    ensureI18n();
  }, [params]);

  const handleConfirm = async () => {
    if (!registrationId || isClosed) return;
    setLoading(true);
    setError(null);
    try {
      const result = await confirmAttendance(registrationId);
      if ("error" in result) {
        setError(result.error || "Une erreur est survenue.");
      } else if ("alreadyConfirmed" in result) {
        setAlreadyConfirmed(true);
      } else {
        setConfirmed(true);
      }
    } catch (e) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Subtle background accents */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 ring-1 ring-primary/20 text-primary">
              LOSL-CON 2025
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-i18n="attendance.title">
              Confirme ta présence
            </h1>
          </div>

          {/* Main card */}
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center">
                {isClosed ? (
                  <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                    <XCircle className="h-6 w-6" />
                    <span data-i18n="attendance.closed">
                      Les confirmations de présence sont fermées
                    </span>
                  </div>
                ) : confirmed || alreadyConfirmed ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-6 w-6" />
                    <span data-i18n={alreadyConfirmed ? "attendance.alreadyConfirmed" : "attendance.thankYou"}>
                      {alreadyConfirmed ? "Tu as déjà confirmé ta présence !" : "Merci d'avoir confirmé !"}
                    </span>
                  </div>
                ) : (
                  <span data-i18n="attendance.title">Confirme ta présence</span>
                )}
              </CardTitle>
              {isClosed ? (
                <CardDescription className="text-center text-base leading-relaxed pt-2" data-i18n="attendance.closedMessage">
                  La date limite pour confirmer ta présence est passée. Si tu as des questions, contacte-nous.
                </CardDescription>
              ) : !confirmed && !alreadyConfirmed && (
                <CardDescription className="text-center text-base leading-relaxed pt-2" data-i18n="attendance.subtitle">
                  L&#39;événement approche ! Clique sur le bouton uniquement si tu es certain(e) de venir – cela nous aide à mieux préparer les places, badges et dépenses.
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Date</div>
                    <div className="font-semibold">22 novembre 2025</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <MapPin className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Lieu</div>
                    <div className="font-semibold">Institut Français du Togo</div>
                    <div className="text-sm text-muted-foreground">Lomé</div>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && !isClosed && (
                <div className="rounded-lg border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Action button */}
              {!isClosed && !confirmed && !alreadyConfirmed && (
                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmation...
                    </>
                  ) : (
                    <span data-i18n="attendance.confirmButton">Je confirme ma présence</span>
                  )}
                </Button>
              )}

              {/* Success message */}
              {!isClosed && (confirmed || alreadyConfirmed) && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200 text-center">
                  ✅ Nous avons bien enregistré ta confirmation. À très bientôt !
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer info */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Des questions ? Contacte-nous à{" "}
            <a href="mailto:community@loslc.tech" className="underline hover:text-primary">
              community@loslc.tech
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
