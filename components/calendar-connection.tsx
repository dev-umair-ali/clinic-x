"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster";

interface CalendlyConnectionProps {
  userId: string
  doctorId: string
  onConnectionChange?: (isConnected: boolean) => void
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    logo?: string | null;
  };
}

/**
 * Checks the Google Calendar connection status for a doctor
 * @param doctorId - The ID of the doctor
 * @returns Promise<boolean> - True if connected, false otherwise
 */
export async function checkGoogleCalendarStatus(doctorId: string): Promise<boolean> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000"
    const token = localStorage.getItem("clinic-ai-token")

    const response = await fetch(`${baseURL}/doctor/connection/google/status/${doctorId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data?.googleCalendarConnected ?? false
  } catch (error) {
    console.error("Error checking Google Calendar status:", error)
    return false
  }
}

function CalendlyConnectionContent({ userId, doctorId, onConnectionChange, theme }: CalendlyConnectionProps) {
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isGoogleConnecting, setIsGoogleConnecting] = useState<boolean>(false)
  const [hasHandledCallback, setHasHandledCallback] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check connection status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId || !doctorId) return

      setIsLoading(true)
      try {
        const googleConnected = await checkGoogleCalendarStatus(doctorId)
        setIsGoogleConnected(googleConnected)
        onConnectionChange?.(googleConnected)
      } catch (error) {
        console.error("Error fetching Google Calendar status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
  }, [doctorId, onConnectionChange, userId])

  // Handle OAuth callback
  useEffect(() => {
    if (hasHandledCallback) return

    const success = searchParams?.get("success") || searchParams?.get("google_success")
    const error = searchParams?.get("error") || searchParams?.get("google_error")
    const code = searchParams?.get("code")
    const state = searchParams?.get("state")

    if (code && state && !success && !error) {
      console.warn("OAuth callback received but backend may not have processed it:", { code, state })
    }

    if (success === "true") {
      setHasHandledCallback(true)

      toast({
        title: "Success",
        description: "Google Calendar has been successfully connected!",
        variant: "default",
      })

      const refreshStatus = async () => {
        if (doctorId) {
          try {
            const connected = await checkGoogleCalendarStatus(doctorId)
            setIsGoogleConnected(connected)
            onConnectionChange?.(connected)
          } catch (error) {
            console.error("Error refreshing calendar status:", error)
          }
        }
      }
      refreshStatus()

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.delete("google_success")
        url.searchParams.delete("success")
        url.searchParams.delete("code")
        url.searchParams.delete("state")
        window.history.replaceState({}, "", url.toString())
      }
    } else if (error) {
      setHasHandledCallback(true)

      toast({
        title: "Connection Failed",
        description: error || "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive",
      })

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.delete("google_error")
        url.searchParams.delete("error")
        url.searchParams.delete("code")
        url.searchParams.delete("state")
        window.history.replaceState({}, "", url.toString())
      }
    }
  }, [searchParams, doctorId, toast, onConnectionChange, hasHandledCallback])

  const handleGoogleConnect = () => {
    if (!doctorId) {
      toast({
        title: "Error",
        description: "Doctor ID is missing. Please try again.",
        variant: "destructive",
      })
      return
    }

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000"
    const token = localStorage.getItem("clinic-ai-token")

    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Please login before connecting Google Calendar.",
        variant: "destructive",
      })
      return
    }

    // Show toast before redirect
    toast({
      title: "Redirecting to Google",
      description: "You will be redirected to Google to authorize calendar access.",
      variant: "default",
    })

    // Pass the JWT token in query string
    const redirectUrl = `${baseURL}/doctor/connection/connect-google-calendar?token=${token}&doctorId=${doctorId}`

    // Browser redirect
    window.location.href = redirectUrl
  }

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <Button disabled>Loading...</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div
        className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--color-chart-blue)/0.1)] backdrop-blur-sm"
        style={theme ? {
          borderColor: theme.primary,
          background: theme.secondary,
        } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-chart-blue)/0)] to-[hsl(var(--color-brand-teal)/0)] group-hover:from-[hsl(var(--color-chart-blue)/0.05)] group-hover:to-[hsl(var(--color-brand-teal)/0.05)] transition-all duration-300 pointer-events-none" />

        <div className="relative flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[hsl(var(--color-status-error)/0.3)] rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative h-14 w-14 rounded-full bg-[hsl(var(--color-status-error))] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-[hsl(var(--color-white-alpha-20))]">
                <svg className="w-7 h-7 text-[hsl(var(--sidebar-foreground))]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H18V2h-2v1H8V2H6v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-[hsl(var(--foreground))] text-base leading-tight">Google Calendar</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
                {isGoogleConnected ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--color-status-success))] animate-pulse" />
                    Connected
                  </span>
                ) : (
                  <span className="text-[hsl(var(--muted-foreground))]">Not connected</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isGoogleConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[hsl(var(--color-status-success))] flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[hsl(var(--color-status-success)/0.1)] border border-[hsl(var(--color-status-success)/0.2)]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  Connected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    const connected = await checkGoogleCalendarStatus(doctorId)
                    setIsGoogleConnected(connected)
                    onConnectionChange?.(connected)
                    toast({
                      title: "Status Updated",
                      description: connected
                        ? "Google Calendar is still connected."
                        : "Google Calendar connection was lost.",
                      variant: connected ? "default" : "destructive",
                    })
                  }}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 transition-all duration-200"
                >
                  Refresh
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGoogleConnect}
                disabled={isGoogleConnecting}
                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--sidebar-foreground))] font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isGoogleConnecting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-[hsl(var(--sidebar-foreground))] border-t-transparent animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  "Connect"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CalendlyConnection(props: CalendlyConnectionProps) {
  return (
    <Suspense fallback={<Button disabled>Loading...</Button>}>
      <CalendlyConnectionContent {...props} />
    </Suspense>
  )
}