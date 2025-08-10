"use client";
import { useEffect, useState } from "react";
import { ensureI18n, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/i18n/config";
import { cn } from "@/lib/utils";

function setLangCookie(lang: string) {
  document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

function getLangCookie(): string | undefined {
  const m = document.cookie.match(/(?:^|; )lang=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const i18n = ensureI18n();
  const [lng, setLng] = useState<string>(i18n.language || DEFAULT_LOCALE);

  useEffect(() => {
    const saved = typeof document !== "undefined" ? getLangCookie() : undefined;
    const isSupported = (val: string | undefined): val is (typeof SUPPORTED_LOCALES)[number] =>
      !!val && (SUPPORTED_LOCALES as readonly string[]).includes(val);
    const initial = isSupported(saved) ? saved : DEFAULT_LOCALE;
    if (i18n.language !== initial) {
      i18n.changeLanguage(initial);
    }
    setLng(initial);
  }, [i18n]);

  const change = async (next: string) => {
    if (next === lng) return;
    await i18n.changeLanguage(next);
    setLng(next);
    setLangCookie(next);
  };

  return (
    <div className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <button
        type="button"
        aria-pressed={lng === "fr"}
        className={cn(
          "px-2 py-1 rounded-md border",
          lng === "fr" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
        onClick={() => change("fr")}
      >
        FR
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        type="button"
        aria-pressed={lng === "en"}
        className={cn(
          "px-2 py-1 rounded-md border",
          lng === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
        onClick={() => change("en")}
      >
        EN
      </button>
    </div>
  );
}
