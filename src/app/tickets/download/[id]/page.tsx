import { getTicketInfo } from "@/app/actions/loslcon/loslcon";
import QRCode from "qrcode";
import { appConfig } from "@/core/utils/config";
import { PdfDownloadButton } from "@/components/tickets/pdf-download-button";

export const dynamic = "force-dynamic";

function fmtCurrency(xof: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(xof);
  } catch {
    return `${xof} XOF`;
  }
}

export default async function TicketDownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const info = await getTicketInfo(id);

  if ("error" in info) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
    {info.error}
        </div>
      </main>
    );
  }

  type TicketInfo = Awaited<ReturnType<typeof getTicketInfo>>;
  const { details, ticket } = info as Exclude<TicketInfo, { error: string }>;

  const accentA = ticket.fGradient || "oklch(0.72 0.16 257)";
  const accentB = ticket.sGradient || "oklch(0.58 0.17 16)";

  const bgGradient = `linear-gradient(135deg, ${accentA}, ${accentB})`;

  // QR code as SVG string; encode the admin registration URL for check-in scanning
  const adminRegUrl = `${appConfig.appBaseUrl}/admin/registrations/${id}`;
  const qrSvg = await QRCode.toString(adminRegUrl, {
    type: "svg",
    margin: 0,
    color: {
      dark: "#0f172a",
      light: "#00000000",
    },
    errorCorrectionLevel: "M",
    scale: 6,
  });

  return (
  <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Your Ticket</h1>
          <p className="mt-2 text-sm opacity-80">Please don&apos;t share this link. It&apos;s unique and personal.</p>
        </div>

        <section
          className="relative rounded-3xl p-[1px] shadow-2xl"
          style={{ backgroundImage: bgGradient }}
        >
          <div className="relative rounded-3xl bg-background/70 ring-1 ring-white/10 shadow-2xl ticket-capture">
            {/* subtle highlights */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div
                className="absolute -top-1/3 -left-1/3 h-64 w-64 rounded-full"
                style={{ background: bgGradient, filter: "blur(40px)", opacity: 0.18 }}
              />
              <div
                className="absolute -bottom-1/3 -right-1/3 h-72 w-72 rounded-full"
                style={{ background: bgGradient, filter: "blur(50px)", opacity: 0.16 }}
              />
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr,0.8fr] md:p-10">
              <div>
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{ticket.name}</h2>
                    <p className="mt-1 text-sm opacity-80">Premium access to LOSL-CON</p>
                  </div>
                  <div className="rounded-lg bg-white/5 px-3 py-1.5 text-sm ring-1 ring-white/10">
                    {fmtCurrency(ticket.price)}
                  </div>
                </header>

                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="opacity-70">Attendee:</span>
                    <span className="font-medium">{details.firstName} {details.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-70">Event:</span>
                    <span className="font-medium">LOSL-CON</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-70">Date:</span>
                    <span className="font-medium">22 November 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-70">Venue:</span>
                    <span className="font-medium">Institut Français du Togo</span>
                  </div>
                  <div className="flex items-center gap-2 break-all">
                    <span className="opacity-70">Registration ID:</span>
                    <span className="font-mono text-xs opacity-90">{id}</span>
                  </div>
                  {details.confirmed ? (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-500 ring-1 ring-emerald-500/20">
                      Confirmed
                    </div>
                  ) : (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-500 ring-1 ring-amber-500/20">
                      Pending payment
                    </div>
                  )}
                </div>

                <p className="mt-6 text-xs opacity-70">
                  This ticket is personal. Do not share this page or its QR code. Keep it safe.
                </p>
              </div>

              <div className="md:justify-self-end">
                <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 backdrop-blur">
                  <div
                    className="[&_svg]:h-48 [&_svg]:w-48 [&_svg_path]:fill-slate-900"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col items-center gap-2">
          <PdfDownloadButton targetSelector=".ticket-capture" filename={`ticket-${id}.pdf`} />
          <p className="text-center text-xs opacity-70">Tip: You can print this page or capture it as an image.</p>
        </div>
      </div>
    </main>
  );
}
