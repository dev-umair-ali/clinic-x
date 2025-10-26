"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, CalendarClock, CalendarX, CalendarCheck } from 'lucide-react';
import { AppointmentOverviewCard } from "../app/doctor/doctor-charts/appointment-overview-card";

export default function AppointmentsOverviewSection() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Appointments Overview
        </h2>
        <button
          onClick={() => handleNavigation("/admin/appointments")}
          className="bg-[#1DA68F] text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          View Calendar <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <AppointmentOverviewCard
          title="Scheduled"
          value="43"
          icon={<Calendar className="w-6 h-6 text-white" />}
          iconBgColor="bg-teal-500"
          trendPercentage="5%"
          trendType="up"
          trendColor="text-teal-500"
          barChartColor="bg-blue-100 dark:bg-blue-900/30"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=scheduled")
          }
        />
        <AppointmentOverviewCard
          title="Rescheduled"
          value="12"
          icon={<CalendarClock className="w-6 h-6 text-white" />}
          iconBgColor="bg-yellow-500"
          trendPercentage="5%"
          trendType="down"
          trendColor="text-red-500"
          barChartColor="bg-yellow-200 dark:bg-yellow-200/30"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=rescheduled")
          }
        />
        <AppointmentOverviewCard
          title="Cancelled"
          value="8"
          icon={<CalendarX className="w-6 h-6 text-white" />}
          iconBgColor="bg-red-500"
          trendPercentage="12%"
          trendType="up"
          trendColor="text-teal-500"
          barChartColor="bg-red-200 dark:bg-red-200/30"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=cancelled")
          }
        />
        <AppointmentOverviewCard
          title="Completed"
          value="43"
          icon={<CalendarCheck className="w-6 h-6 text-white" />}
          iconBgColor="bg-blue-500"
          trendPercentage="5%"
          trendType="up"
          trendColor="text-teal-500"
          barChartColor="bg-blue-100 dark:bg-blue-900/30"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=completed")
          }
        />
      </div>
    </div>
  );
}
