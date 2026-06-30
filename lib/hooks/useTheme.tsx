"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { fetchClinicTheme, DEFAULT_THEME } from "@/lib/slices/themeSlice";

/* ----------  TOKEN MAP  ---------- */
const TOKEN_MAP = {
  /* brand */
  "--color-brand-teal": "primary",
  "--color-brand-teal-dark": "accent",
  "--color-brand-teal-light": "secondary",

  /* status */
  "--color-status-success": "secondary",
  "--color-status-success-dark": "accent",
  "--color-status-success-light": "secondary",
  "--color-status-error": "accent",
  "--color-status-error-dark": "accent",
  "--color-status-warning": "secondary",
  "--color-status-info": "secondary",

  /* charts / ui accents */
  "--color-chart-blue": "secondary",
  "--color-chart-purple": "secondary",
  "--color-chart-orange": "secondary",
  "--color-chart-green": "secondary",
  "--color-chart-red": "accent",

  /* sidebar gradients */
  "--gradient-sidebar-start": "accent",
  "--gradient-sidebar-end": "primary",
  "--gradient-teal-perf-start": "secondary",
  "--gradient-teal-perf-end": "primary",

  /* extra dashboard colours */
  "--color-gold-dark": "accent",
  "--color-pink-vibrant": "secondary",

  /* light tints */
  "--color-bg-teal-tint": "secondary",
  "--color-bg-orange-tint": "secondary",
  "--color-bg-blue-tint": "secondary",
  "--color-bg-pink-tint": "secondary",

  /* white alphas */
  "--color-white-alpha-10": "primary",
  "--color-white-alpha-20": "primary",
  "--color-white-alpha-60": "primary",
  "--color-white-alpha-80": "primary",
  "--color-white-alpha-90": "primary",
  "--color-teal-gradient-mid": "secondary",
} as const;

/** Convert hex (#61C2B4) to HSL components ("167 69% 39%") for hsl(var(--token)). */
function toHslComponents(color: string): string {
  if (!color) return color;
  const trimmed = color.trim();
  if (!trimmed.startsWith("#")) return trimmed;

  const hex = trimmed.slice(1);
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${Math.round(l * 100)}%`;

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Apply theme colors to CSS custom properties
 */
export function applyThemeColors(
  primary: string,
  secondary: string,
  accent: string,
  logo: string | null = null
) {
  const p = toHslComponents(primary);
  const s = toHslComponents(secondary);
  const a = toHslComponents(accent);

  Object.entries(TOKEN_MAP).forEach(([token, src]) => {
    const value = src === "primary" ? p : src === "secondary" ? s : a;
    document.documentElement.style.setProperty(token, value);
  });

  // Apply scrollbar thumb color
  document.documentElement.style.setProperty("--scroll-thumb", p);

  // Apply logo if provided
  if (logo) {
    const img = document.getElementById("main-logo") as HTMLImageElement | null;
    if (img) img.src = logo;
  }
}

/**
 * Global Theme Provider Component
 * Automatically loads and applies clinic theme based on user's clinicId
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.theme.current);
  useEffect(() => {
    // Only load clinic theme for clinic-associated roles
    const clinicRoles = ["clinic", "doctor", "assistant", "patient"];
    if (user && user.clinicId && clinicRoles.includes(user.role)) {
      // Fetch clinic theme from backend
      dispatch(fetchClinicTheme(user.clinicId));
    } else {
      // Use default theme for admin or users without clinicId
      applyThemeColors(
        DEFAULT_THEME.primary,
        DEFAULT_THEME.secondary,
        DEFAULT_THEME.accent,
        DEFAULT_THEME.logo
      );
    }
  }, [user, dispatch]);

  // Apply theme whenever it changes
  useEffect(() => {
    applyThemeColors(theme?.primary, theme?.secondary, theme?.accent, theme?.logo);
  }, [theme]);

  return <>{children}</>;
}

/**
 * Custom hook to access current theme
 */
export function useTheme() {
  const theme = useSelector((state: RootState) => state.theme.current);
  const loading = useSelector((state: RootState) => state.theme.loading);
  const error = useSelector((state: RootState) => state.theme.error);
  const isDefault = useSelector((state: RootState) => state.theme.isDefault);

  return { theme, loading, error, isDefault };
}
