import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-xl text-balance text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or removed.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/login">Go to login</Link>
        </Button>
      </div>
    </main>
  );
}
