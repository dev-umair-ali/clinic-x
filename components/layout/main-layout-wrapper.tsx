"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/lib/store"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { initializeAuth } from "@/lib/slices/authSlice"

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    dispatch(initializeAuth());
  }, [dispatch]);

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
    </SidebarProvider>
  )
}
