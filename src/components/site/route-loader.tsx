"use client";
import { useEffect } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css";

// Minimal route loader: reacts to pathname/search changes
export function RouteLoader() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickleSpeed: 200 });
  }, []);

  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search?.toString()]);

  return null;
}
