"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useAppHooks";
import { fetchAssistantDashboard } from "@/lib/slices/dashboardSlice";
import type { RootState } from "@/lib/store";
import HeaderBanner from "@/components/Admin-dashboard-components/HeaderBanner";
import StatCards from "@/components/Admin-dashboard-components/StatCards";
import AppointmentTrends from "@/components/Admin-dashboard-components/AppointmentTrends";
import PatientGrowth from "@/components/Admin-dashboard-components/PatientGrowth";
import RecentActivity from "@/components/Admin-dashboard-components/RecentActivity";

export default function AssistantDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, loading, error } = useAppSelector((state) => state.dashboard.assistant);

  useEffect(() => {
    const clinicId = (user as any)?.clinicId;
    if (clinicId) {
      dispatch(fetchAssistantDashboard(clinicId));
    }
  }, [dispatch, user]);

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Map assistant counts to StatCards expected format
  const statCardsData = dashboardData?.counts ? {
    totalDoctors: dashboardData.counts.totalDoctors,
    totalStaff: dashboardData.counts.todayAppointments, // Today's appointments as "staff metric"
    totalPatients: dashboardData.counts.totalPatients,
    totalClinics: dashboardData.counts.pendingAppointments, // Pending appointments as 4th metric
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* 1  Header + CTAs */}
        <HeaderBanner />

        {/* 2  KPI Cards */}
        <StatCards dashboardData={statCardsData} />

        {/* 3  Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <AppointmentTrends dashboardData={dashboardData?.appointmentsTrend} />
          <PatientGrowth dashboardData={dashboardData?.patientsTrend} />
        </div>

        {/* 4  Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <RecentActivity dashboardData={dashboardData?.recentActivity} />
        </div>
      </div>
    </div>
  );
}