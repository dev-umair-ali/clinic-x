"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import DashboardHome from "@/app/doctor/patients/DashboardHome";
import { MainProvider } from "@/app/doctor/patients/context/Globalcontext";

export default function DoctorPatientsPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <MainProvider>
        <div className="flex-1 overflow-y-auto p-6">
          <DashboardHome />
        </div>
      </MainProvider>
    </ProtectedRoute>
  );
}
