"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { initializeAuth } from "@/lib/slices/authSlice"

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  useEffect(() => {
    // Initialize auth state and set axios headers
    dispatch(initializeAuth());
  }, [dispatch]);

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
