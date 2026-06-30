"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { initializeAuth } from "@/lib/slices/authSlice"
import { checkCalendarConnection } from "@/lib/slices/googleCalendarSlice"
import { GoogleCalendarConnectionDialog } from "@/components/google-calendar-connection-dialog"

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Initialize auth state and set axios headers
    dispatch(initializeAuth());
  }, [dispatch]);

  // Check Google Calendar connection for doctors
  useEffect(() => {
    if (isMounted && isAuthenticated && user?.role === "doctor") {
      const doctorId = (user as any)?.doctorId
      if (doctorId) {
        dispatch(checkCalendarConnection(doctorId))
      }
    }
  }, [isMounted, isAuthenticated, user, dispatch])

  // Prevent hydration mismatch by rendering simple version on server
  if (!isMounted) {
    if (isAuthPage) {
      return <div suppressHydrationWarning>{children}</div>
    }
    return <div suppressHydrationWarning>{children}</div>
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
      {/* Global Google Calendar Connection Dialog for doctors */}
      {user?.role === "doctor" && <GoogleCalendarConnectionDialog />}
    </SidebarProvider>
  )
}
