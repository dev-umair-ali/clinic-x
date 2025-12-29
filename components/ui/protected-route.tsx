"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "doctor" | "patient"| "assistant" | "clinic")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        admin: "/admin/dashboard",
        doctor: "/doctor/dashboard",
        patient: "/patient/dashboard",
        assistant: "/ assistant/dashboard",
        clinic: "/clinic/dashboard",
      };
      router.push(dashboardRoutes[user.role]);
      return;
    }
  }, [isMounted, isAuthenticated, user, allowedRoles, router]);

  // Render loading state until client-side is mounted
  if (!isMounted) {
    return <div suppressHydrationWarning><div>Loading...</div></div>;
  }

  if (
    !isAuthenticated ||
    (allowedRoles && user && !allowedRoles.includes(user.role))
  ) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
