"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { log } from "console"

interface LoaderProps {
  primary?: string
  secondary?: string
  accent?: string
}

// Helper to get CSS variable value
const getCSSVar = (name: string, fallback: string) => {
  if (typeof document === "undefined") return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export function AnimatedLoader({ 
  primary: propPrimary, 
  secondary: propSecondary, 
  accent: propAccent 
}: LoaderProps = {}) {
  // Get theme from Redux as fallback
  const theme = useSelector((state: RootState) => state.theme.current)
  
  // Force re-render when theme changes (for CSS variable updates)
  const [, forceUpdate] = useState({})
  
  // Priority: Props > Redux Theme > CSS Variables > Default values
  // This ensures we show API colors immediately if available
  const colors = {
    primary: propPrimary || theme?.primary || getCSSVar("--color-brand-teal", "777 69% 69%"),
    secondary: propSecondary || theme?.secondary || getCSSVar("--color-brand-teal-light", "777 70% 89%"),
    accent: propAccent || theme?.accent || getCSSVar("--color-brand-teal-dark", "167 69% 29%"),
  }


  useEffect(() => {
    // Listen for custom theme change event from ThemeProvider
    const handleThemeChange = () => forceUpdate({})
    
    window.addEventListener("themechange", handleThemeChange)
    
    // Also observe style changes as fallback
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["style"] 
    })

    // Initial check after a small delay to ensure ThemeProvider has run
    const timeout = setTimeout(handleThemeChange, 0)

    return () => {
      window.removeEventListener("themechange", handleThemeChange)
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  // Convert hex/RGB to HSL string if needed, or use as-is
  const formatColor = (color: string) => {
    // If already in HSL format (contains spaces and %), wrap with hsl()
    if (color.includes("%")) return `hsl(${color})`
    // Otherwise assume it's a valid CSS color
    return color
  }

  const primaryColor = formatColor(colors.primary)
  const secondaryColor = formatColor(colors.secondary)
  const accentColor = formatColor(colors.accent)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="flex flex-col items-center gap-8">
        {/* Debug - shows which colors are being used (remove after testing) */}
        {/* <div className="text-xs font-mono text-muted-foreground bg-black/10 px-2 py-1 rounded">
          P:{colors.primary} | S:{colors.secondary} | A:{colors.accent}
        </div> */}

        {/* Advanced animated loader with multiple layers */}
        <div className="relative w-24 h-24">
          {/* Outer rotating ring - Primary color */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              animationDuration: "3s",
              borderTopColor: primaryColor,
              borderRightColor: primaryColor.replace(")", " / 0.5)").replace("hsl(", "hsla("),
            }}
          ></div>

          {/* Middle counter-rotating ring - Accent shades */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
            style={{
              animationDuration: "4s",
              animationDirection: "reverse",
              borderBottomColor: accentColor,
              borderLeftColor: accentColor.replace(")", " / 0.3)").replace("hsl(", "hsla("),
            }}
          ></div>

          {/* Inner pulsing dot - Secondary */}
          <div
            className="absolute inset-8 rounded-full animate-pulse"
            style={{
              backgroundColor: secondaryColor.replace(")", " / 0.4)").replace("hsl(", "hsla("),
            }}
          ></div>

          {/* Center glowing dot - Primary */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 12px ${primaryColor.replace(")", " / 0.6)").replace("hsl(", "hsla(")}`,
            }}
          ></div>
        </div>

        {/* Loading text with animation */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="text-lg font-semibold bg-clip-text text-transparent animate-pulse"
            style={{
              backgroundImage: `linear-gradient(94.25deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            Loading
          </p>
          <div className="flex gap-1">
            {[0, 0.2, 0.4].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: primaryColor,
                  animationDelay: `${delay}s`,
                }}
              ></span>
            ))}
          </div>
        </div>

        {/* Subtle progress indicator with primary gradient */}
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              animation: "shimmer 2s infinite",
              backgroundSize: "200% 100%",
              backgroundImage: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}