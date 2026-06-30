"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { DASHBOARD_ROUTES } from "@/lib/constants/demoCredentials";
import type { User } from "@/lib/slices/authSlice";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, initialized } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated || !user?.role) {
      router.replace("/login");
      return;
    }

    const role = user.role as User["role"];
    const destination = DASHBOARD_ROUTES[role];
    router.replace(destination || "/login");
  }, [initialized, isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Clinic X</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
