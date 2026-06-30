"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useAppHooks";
import { fetchAdminDashboard } from "@/lib/slices/dashboardSlice";
import HeaderBanner from "@/components/Admin-dashboard-components/HeaderBanner";
import StatCards from "@/components/Admin-dashboard-components/StatCards";
import TimeFilter from "@/components/Admin-dashboard-components/TimeFilter";
import AppointmentTrends from "@/components/Admin-dashboard-components/AppointmentTrends";
import RevenueBreakdown from "@/components/Admin-dashboard-components/RevenueBreakdown";
import PatientGrowth from "@/components/Admin-dashboard-components/PatientGrowth";
import ClinicPerformance from "@/components/Admin-dashboard-components/ClinicPerformance";
import DoctorPerformance from "@/components/Admin-dashboard-components/DoctorPerformance";
import RecentActivity from "@/components/Admin-dashboard-components/RecentActivity";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { data: dashboardData, loading, error } = useAppSelector((state) => state.dashboard.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

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
console.log("Admin Dashboard Data:", dashboardData);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* 1  Header + CTAs */}
        <HeaderBanner />

        {/* 2  KPI Cards */}
        <StatCards dashboardData={dashboardData?.counts} />
        {/* Data available: dashboardData?.counts */}

        {/* 3  Time Filter */}
        {/* <TimeFilter /> */}

        {/* 4  Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Data available: dashboardData?.clinicPerformance */}
          {/* <RevenueBreakdown /> */}
        </div>

        {/* 5  Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <ClinicPerformance dashboardData={dashboardData?.clinicPerformance} />
          <AppointmentTrends dashboardData={dashboardData?.appointmentsTrend} />
          <DoctorPerformance dashboardData={dashboardData?.doctorPerformance} />
          {/* Data available: dashboardData?.doctorPerformance */}
          <PatientGrowth dashboardData={dashboardData?.patientGrowth} />
          {/* Data available: dashboardData?.patientGrowth */}
        </div>

        {/* 6  Charts Row 3 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <RecentActivity dashboardData={dashboardData?.recentActivity} />
          {/* Data available: dashboardData?.recentActivity */}
        </div>
      </div>
    </div>
  );
}
