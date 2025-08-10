"use client";
import { ensureI18n } from "@/i18n/config";
import { useEffect, useState } from "react";

export function T({ k, vars }: { k: string; vars?: Record<string, unknown> }) {
  const i18n = ensureI18n();
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((n) => n + 1);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, [i18n]);

  return <>{i18n.t(k, vars)}</>;
}
