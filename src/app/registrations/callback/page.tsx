import { confirmPayment } from "@/app/actions/loslcon/loslcon";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const id = typeof sp.id === "string" ? sp.id : undefined;

  if (id) {
    const res = await confirmPayment(id);
    if ("ticketDownloadUrl" in res) {
      redirect(String(res.ticketDownloadUrl));
    }
    // fall through to show error below
  }

  const msg = !id
    ? "Missing transaction id."
    : status && status.toLowerCase() !== "approved"
    ? `Payment status: ${status}`
    : "Payment was not successful.";

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Payment status</h1>
      <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {msg}
      </div>
      <p className="mt-3 text-sm opacity-80">
        If you believe this is a mistake, please try again or contact support.
      </p>
    </main>
  );
}
