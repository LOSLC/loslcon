"use client";
import { useEffect } from "react";
import { ensureI18n } from "@/i18n/config";

export function AutoTranslate() {
  const i18n = ensureI18n();
  useEffect(() => {
    const apply = () => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-i18n]");
      nodes.forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        const year = new Date().getFullYear();
        el.textContent = i18n.t(key, { year });
      });
    };
    apply();
    i18n.on("languageChanged", apply);
    return () => void i18n.off("languageChanged", apply);
  }, [i18n]);
  return null;
}
