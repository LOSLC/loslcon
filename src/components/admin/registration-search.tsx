"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function RegistrationSearch({ debounceMs = 450 }: { debounceMs?: number } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = React.useState<string>(params.get("q") ?? "");
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    setQ(params.get("q") ?? "");
     
  }, [params]);

  function navigate(next: string) {
    const usp = new URLSearchParams(Array.from(params.entries()));
    if (next) usp.set("q", next);
    else usp.delete("q");
    const target = `?${usp.toString()}`;
    // Avoid redundant navigation
    if (target === `?${params.toString()}`) return;
    router.replace(target, { scroll: false });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQ(v);
    // Debounce navigation to avoid re-rendering page on each keystroke
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => navigate(v), debounceMs);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (timer.current) window.clearTimeout(timer.current);
      navigate(q);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Input
        value={q}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Search registrations…"
        aria-label="Search registrations"
      />
    </div>
  );
}
