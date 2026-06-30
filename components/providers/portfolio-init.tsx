"use client";

import { useEffect } from "react";
import { IS_PORTFOLIO_MODE } from "@/lib/config/portfolio";
import { resolveStaticFetch } from "@/lib/api/staticMockRouter";

const API_PATH_PREFIXES = [
  "/billing/",
  "/upload/",
  "/doctor/connection/",
  "/doctor/availability",
  "/doctor/transcription/",
  "/doctors/me",
  "/api/upload",
];

function shouldMockFetch(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    const path = parsed.pathname;

    // Never intercept Next.js internals or static assets
    if (
      path.startsWith("/_next") ||
      path.startsWith("/__next") ||
      path === "/" ||
      path.startsWith("/login") ||
      path.startsWith("/signup")
    ) {
      return false;
    }

    return API_PATH_PREFIXES.some(
      (prefix) => path.startsWith(prefix) || path.includes(prefix)
    );
  } catch {
    return false;
  }
}

/**
 * Patches window.fetch in portfolio mode for direct fetch() calls
 * (billing, uploads, calendar) — does NOT touch Next.js navigation.
 */
export function PortfolioInit() {
  useEffect(() => {
    if (!IS_PORTFOLIO_MODE || typeof window === "undefined") return;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;

      if (shouldMockFetch(url)) {
        await new Promise((r) => setTimeout(r, 80));
        const path = new URL(url, window.location.origin).pathname;
        const { json } = resolveStaticFetch(init?.method || "GET", path, init?.body);
        return new Response(JSON.stringify(json), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
