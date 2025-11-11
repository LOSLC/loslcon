import { broadcastAttendanceConfirmation } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function AttendanceBroadcast() {
  return (
    <section className="mt-6 rounded-lg border p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Confirmer la présence des participants
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Envoie un email à tous les participants confirmés pour leur demander
            de confirmer leur présence à l&#39;événement. Cela permet de mieux
            estimer le nombre de badges, repas et places nécessaires.
          </p>
          <div className="text-xs text-muted-foreground space-y-1 mb-4">
            <div>
              📧 <strong>Destinataires :</strong> Tous les participants avec
              registration confirmée
            </div>
            <div>
              🇫 <strong>Langue :</strong> Email en français avec lien
              personnalisé
            </div>
            <div>
              ✉ <strong>Contenu :</strong> Message personnalisé avec détails de
              l&#39;événement et bouton de confirmation
            </div>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await broadcastAttendanceConfirmation();
            redirect("/admin/dashboard?sent=attendance");
          }}
        >
          <Button type="submit" className="min-w-[200px]">
            Envoyer les emails
          </Button>
        </form>
      </div>
    </section>
  );
}
