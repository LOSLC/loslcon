import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items: Array<{ key: string; i18n: string }> = [
  { key: "talks", i18n: "expect.items.talks" },
  { key: "workshops", i18n: "expect.items.workshops" },
  { key: "networking", i18n: "expect.items.networking" },
  { key: "discovery", i18n: "expect.items.discovery" },
];

export function Expect() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-center" data-i18n="expect.heading">Ce qui vous attend</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Card key={it.key} className="bg-card/50">
            <CardContent className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <span data-i18n={it.i18n}>Item</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
