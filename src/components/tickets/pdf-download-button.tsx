"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  targetSelector: string;
  filename?: string;
  className?: string;
};

export function PdfDownloadButton({ targetSelector, filename = "ticket.pdf", className }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    const el = document.querySelector(targetSelector) as HTMLElement | null;
    if (!el || downloading) return;
    setDownloading(true);
    try {
      // Ensure fonts are loaded to avoid html-to-image font parsing issues
      try {
        const df = (document as unknown as { fonts?: { ready?: Promise<void> } }).fonts;
        if (df?.ready) {
          await df.ready;
        }
      } catch {}
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const pixelRatio = Math.min(3, Math.max(1.5, window.devicePixelRatio || 2));
      const cs = window.getComputedStyle(el);
      const bodyBg = window.getComputedStyle(document.body).backgroundColor || "#ffffff";
      const fontFamily =
        cs.fontFamily ||
        'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica Neue, Arial, Noto Sans, sans-serif';
      const fontSize = cs.fontSize || "16px";
      const fontWeight = cs.fontWeight || "400";
  const computedFont: string | undefined = (cs as unknown as { font?: string })?.font;
      const styleFallback: Record<string, string> = {};
      if (computedFont && typeof computedFont === "string" && computedFont.trim().length > 0) {
        styleFallback.font = computedFont;
      } else {
        styleFallback.fontFamily = fontFamily;
        styleFallback.fontSize = fontSize;
        styleFallback.fontWeight = fontWeight as string;
      }

    async function capture(skipFonts: boolean) {
        return await toPng(el as HTMLElement, {
          pixelRatio,
          cacheBust: true,
          backgroundColor: bodyBg,
      style: styleFallback as Record<string, string>,
          skipFonts,
        });
      }

      let dataUrl: string;
  try {
    dataUrl = await capture(false);
  } catch {
        // Fallback path: avoid font embedding which can fail on some browsers/environments
        dataUrl = await capture(true);
      }

  const rect = el.getBoundingClientRect();
  const srcW = Math.max(1, Math.round(rect.width * pixelRatio));
  const srcH = Math.max(1, Math.round(rect.height * pixelRatio));

  // Map CSS pixels to PDF points (1px ≈ 0.75pt at 96 DPI)
  const pxToPt = (px: number) => (px * 72) / 96;
  const wPt = pxToPt(srcW);
  const hPt = pxToPt(srcH);
  const orientation = srcW >= srcH ? "landscape" : "portrait";

  const pdf = new jsPDF({ orientation, unit: "pt", format: [wPt, hPt] });
  pdf.addImage(dataUrl, "PNG", 0, 0, wPt, hPt, undefined, "FAST");
      pdf.save(filename);
    } catch (e) {
      console.error("PDF download failed", e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button onClick={handleDownload} disabled={downloading} className={className}>
      {downloading ? "Downloading…" : "Download PDF"}
    </Button>
  );
}
