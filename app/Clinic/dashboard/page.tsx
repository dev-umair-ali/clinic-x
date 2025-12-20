"use client";

import HeaderBanner from "@/components/Admin-dashboard-components/HeaderBanner";
import StatCards from "@/components/Admin-dashboard-components/StatCards";
import TimeFilter from "@/components/Admin-dashboard-components/TimeFilter";
import AppointmentTrends from "@/components/Admin-dashboard-components/AppointmentTrends";
import RevenueBreakdown from "@/components/Admin-dashboard-components/RevenueBreakdown";
import PatientGrowth from "@/components/Admin-dashboard-components/PatientGrowth";
import ClinicPerformance from "@/components/Admin-dashboard-components/ClinicPerformance";
import DoctorPerformance from "@/components/Admin-dashboard-components/DoctorPerformance";
import RecentActivity from "@/components/Admin-dashboard-components/RecentActivity";

export default function ClinicDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* 1  Header + CTAs */}
        <HeaderBanner />

        {/* 2  KPI Cards */}
        <StatCards />

        {/* 3  Time Filter */}
        <TimeFilter />

        {/* 4  Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <AppointmentTrends />
          <RevenueBreakdown />
        </div>

        {/* 5  Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <PatientGrowth />
          <ClinicPerformance />
        </div>

        {/* 6  Charts Row 3 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <DoctorPerformance />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
