"use client";
import { BsBuildingsFill } from "react-icons/bs";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { useAppSelector } from "@/lib/hooks/useAppHooks";

export default function StatCards({ dashboardData }: { dashboardData?: { totalDoctors: number; totalStaff: number; totalClinics: number; totalPatients: number } }) {
  const { user } = useAppSelector((state) => state.auth);
  const role = (user as any)?.role;

  const hoverGradient =
    "hover:bg-gradient-to-r hover:from-[hsl(var(--color-brand-teal)/0.9)] hover:to-[hsl(var(--color-brand-teal-dark)/0.9)]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* Card 1 – Total Clinics */}
      {role === "admin" && (
        <div
          className={`group bg-[hsl(var(--color-card))] dark:bg-[hsl(var(--color-card))]
                   rounded-2xl p-4 sm:p-6 shadow-sm
                   transition ${hoverGradient}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[hsl(var(--color-chart-teal)/0.2)] dark:bg-[hsl(var(--color-chart-teal)/0.3)] p-3 rounded-lg group-hover:bg-white/20">
              <BsBuildingsFill className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--color-chart-teal))] dark:text-[hsl(var(--color-chart-teal))] group-hover:text-white" />
            </div>
            <span className="text-xs sm:text-sm bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] px-2 py-1 rounded text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] group-hover:bg-white/20 group-hover:text-white">
              +2
            </span>
          </div>
          <div className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm sm:text-base group-hover:text-white">Total Clinics</div>
          <div className="text-2xl sm:text-3xl font-bold mb-1 text-[hsl(var(--color-chart-teal))] dark:text-white group-hover:text-white" suppressHydrationWarning>{dashboardData?.totalClinics ?? 0}</div>
        </div>
      )}

      {/* Card 2 – Total Staff */}
      <div
        className={`group bg-[hsl(var(--color-card))] dark:bg-[hsl(var(--color-card))]
                   rounded-2xl p-4 sm:p-6 shadow-sm
                   transition ${hoverGradient}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-[hsl(var(--color-chart-orange)/0.2)] dark:bg-[hsl(var(--color-chart-orange)/0.3)] p-3 rounded-lg group-hover:bg-white/20">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))] group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] px-2 py-1 rounded text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] group-hover:bg-white/20 group-hover:text-white">
            +2
          </span>
        </div>
        <div className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm sm:text-base group-hover:text-white">Total Staff</div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-[hsl(var(--color-chart-orange))] dark:text-white group-hover:text-white" suppressHydrationWarning>{dashboardData?.totalStaff ?? 0}</div>
      </div>

      {/* Card 3 – Total Revenue */}
      <div
        className={`group bg-[hsl(var(--color-card))] dark:bg-[hsl(var(--color-card))]
                   rounded-2xl p-4 sm:p-6 shadow-sm
                   transition ${hoverGradient}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-[hsl(var(--color-chart-blue)/0.2)] dark:bg-[hsl(var(--color-chart-blue)/0.3)] p-3 rounded-lg group-hover:bg-white/20">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] px-2 py-1 rounded text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] group-hover:bg-white/20 group-hover:text-white">
            +22
          </span>
        </div>
        <div className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm sm:text-base group-hover:text-white">Total Doctors</div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-[hsl(var(--color-chart-blue))] dark:text-white group-hover:text-white" suppressHydrationWarning>{dashboardData?.totalDoctors ?? 0}</div>
      </div>

      {/* Card 4 – Total Patients */}
      <div
        className={`group bg-[hsl(var(--color-card))] dark:bg-[hsl(var(--color-card))]
                   rounded-2xl p-4 sm:p-6 shadow-sm
                   transition ${hoverGradient}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-[hsl(var(--color-chart-pink)/0.2)] dark:bg-[hsl(var(--color-chart-pink)/0.3)] p-3 rounded-lg group-hover:bg-white/20">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--color-chart-pink))] dark:text-[hsl(var(--color-chart-pink))] group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] px-2 py-1 rounded text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] group-hover:bg-white/20 group-hover:text-white">
            +222
          </span>
        </div>
        <div className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm sm:text-base group-hover:text-white">Total Patients</div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-[hsl(var(--color-chart-pink))] dark:text-white group-hover:text-white" suppressHydrationWarning>{dashboardData?.totalPatients ?? 0}</div>
      </div>
    </div>
  );
}