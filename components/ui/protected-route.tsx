"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "doctor" | "patient"| "receptionist")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
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
        receptionist: "/clinic/dashboard",
      };
      router.push(dashboardRoutes[user.role]);
      return;
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (
    !isAuthenticated ||
    (allowedRoles && user && !allowedRoles.includes(user.role))
  ) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
