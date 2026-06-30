"use client";

import { useState, useEffect } from "react";
import { themeService } from "@/lib/api/services/themeService";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useAppHooks";
import { fetchDoctorDashboard } from "@/lib/slices/dashboardSlice";
import type { RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { HeaderBanner } from "@/components/doctor-charts/header-banner";
import AppointmentsOverviewSection from "@/components/appointments-overview-section";
import { NotesCreditSection } from "@/components/doctor-charts/notes-credit-section";
import { MedicalDashboard } from "@/components/doctor-charts/medical-dashboard";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const user = { name: "Steven Adesanya" };
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { data: dashboardData, loading: dashboardLoading } = useAppSelector(
    (state) => state.dashboard.doctor
  );
  const router = useRouter();

  const [showMedicalDashboard, setShowMedicalDashboard] = useState(false);

  useEffect(() => {
    const doctorId = (authUser as any)?.doctorId || "";
    const clinicId = (authUser as any)?.clinicId || "";

    if (doctorId) {
      dispatch(fetchDoctorDashboard(doctorId));
    }

    if (clinicId) {
      themeService.getClinicTheme(clinicId).catch(() => null);
    }
  }, [authUser, dispatch]);

  const handleGoToAppointments = () => {
    router.push(`/doctor/appointments`);
  };

  const handleBackToDashboard = () => {
    setShowMedicalDashboard(false);
  };

  if (showMedicalDashboard) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <MedicalDashboard onBack={handleBackToDashboard} />
      </ProtectedRoute>
    );
  }

  if (dashboardLoading && !dashboardData) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))] flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="p-4">
            <HeaderBanner
              userName={
                authUser?.firstName + " " + authUser?.lastName || user.name
              }
              date="Today"
              onGoToAppointments={handleGoToAppointments}
            />
          </div>

          <AppointmentsOverviewSection
            dashboardData={dashboardData?.appointmentsOverview}
          />

          <NotesCreditSection
            dashboardData={dashboardData?.patientNotesGraph ?? null}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
