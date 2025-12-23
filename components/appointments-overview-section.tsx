"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, CalendarClock, CalendarX, CalendarCheck } from 'lucide-react';
import { AppointmentOverviewCard } from "./doctor-charts/appointment-overview-card";

export default function AppointmentsOverviewSection() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-[hsl(var(--card))] rounded-2xl p-6 shadow-sm border border-[hsl(var(--border))]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Appointments Overview
        </h2>
        <button
          onClick={() => handleNavigation("/admin/appointments")}
          className="bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-lg text-sm hover:bg-[hsl(var(--color-brand-teal-dark))] transition-colors flex items-center gap-2"
        >
          View Calendar <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Scheduled card – original iconBgColor: bg-teal-500 */}
        <AppointmentOverviewCard
          title="Scheduled"
          value="43"
          icon={<Calendar className="w-6 h-6 text-white" />}
          iconBgColor="bg-[hsl(var(--color-brand-teal))]"
          trendPercentage="5%"
          trendType="up"
          trendColor="text-[hsl(var(--color-brand-teal))]"
          barChartColor="bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.3)]"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=scheduled")
          }
        />
        {/* Rescheduled card – original iconBgColor: bg-yellow-500 */}
        <AppointmentOverviewCard
          title="Rescheduled"
          value="12"
          icon={<CalendarClock className="w-6 h-6 text-white" />}
          iconBgColor="bg-[hsl(var(--color-status-warning))]"
          trendPercentage="5%"
          trendType="down"
          trendColor="text-[hsl(var(--color-status-error))]"
          barChartColor="bg-[hsl(var(--color-status-warning)/0.2)] dark:bg-[hsl(var(--color-status-warning)/0.3)]"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=rescheduled")
          }
        />
        {/* Cancelled card – original iconBgColor: bg-red-500 */}
        <AppointmentOverviewCard
          title="Cancelled"
          value="8"
          icon={<CalendarX className="w-6 h-6 text-white" />}
          iconBgColor="bg-[hsl(var(--color-status-error))]"
          trendPercentage="12%"
          trendType="up"
          trendColor="text-[hsl(var(--color-brand-teal))]"
          barChartColor="bg-[hsl(var(--color-status-error)/0.2)] dark:bg-[hsl(var(--color-status-error)/0.3)]"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=cancelled")
          }
        />
        {/* Completed card – original iconBgColor: bg-blue-500 */}
        <AppointmentOverviewCard
          title="Completed"
          value="43"
          icon={<CalendarCheck className="w-6 h-6 text-white" />}
          iconBgColor="bg-[hsl(var(--color-chart-blue))]"
          trendPercentage="5%"
          trendType="up"
          trendColor="text-[hsl(var(--color-brand-teal))]"
          barChartColor="bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.3)]"
          onClick={() =>
            handleNavigation("/admin/appointments?filter=completed")
          }
        />
      </div>
    </div>
  );
}