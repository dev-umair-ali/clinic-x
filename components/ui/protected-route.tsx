"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { AnimatedLoader } from "@/components/ui/animatedLoader"
import { DASHBOARD_ROUTES } from "@/lib/constants/demoCredentials"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "doctor" | "patient" | "assistant" | "clinic")[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user, initialized } = useSelector((state: RootState) => state.auth)
  const theme = useSelector((state: RootState) => state.theme.current) // Get theme from Redux
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !initialized) return

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      const destination = DASHBOARD_ROUTES[user.role]
      router.replace(destination || "/login")
      return
    }
  }, [isMounted, initialized, isAuthenticated, user, allowedRoles, router])

  // Show loader with theme colors from Redux (if available)
  if (!isMounted || !initialized) {
    return (
      <AnimatedLoader 
        primary={theme?.primary}
        secondary={theme?.secondary}
        accent={theme?.accent}
      />
    )
  }

  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return (
      <AnimatedLoader 
        primary={theme?.primary}
        secondary={theme?.secondary}
        accent={theme?.accent}
      />
    )
  }

  return <>{children}</>
}