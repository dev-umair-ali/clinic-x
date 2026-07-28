"use client";

import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useAppHooks";
import { fetchPatientDashboard } from "@/lib/slices/dashboardSlice";
import type { RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import {
  Calendar,
  Stethoscope,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ChatBot } from "./chat-bot";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { PatientOnboardingGuard } from "@/components/ui/patient-onboarding-guard";

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { data: dashboardData, loading: dashboardLoading } = useAppSelector((state) => state.dashboard.patient);
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
console.log("Patient Dashboard Data:", dashboardData);
  useEffect(() => {
    const patientId = (user as any)?.patientId || (user as any)?._id;
    if (patientId) {
      dispatch(fetchPatientDashboard(patientId));
    }
  }, [dispatch, user]);

  const appointmentTrends = dashboardData?.appointmentTrends || [];


  if (dashboardLoading && !dashboardData) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <PatientOnboardingGuard>
          <div className="min-h-screen bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))] p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </PatientOnboardingGuard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <PatientOnboardingGuard>
        <div className="min-h-screen bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))] p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 bg-[hsl(var(--color-brand-teal-light))] p-6 sm:p-8 rounded-md">
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back,{" "}
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "Patient"}
                !
              </h1>
              <p className="text-white/90 text-sm">
                Here's an overview of your healthcare information and recent
                activity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Card 1 – Next Appointment */}
              <div
                className={`group bg-[hsl(var(--color-card))] dark:bg-[hsl(var(--color-card))]
               rounded-2xl p-6 shadow-sm
               transition hover:bg-gradient-to-r
               hover:from-[hsl(var(--color-brand-teal)/0.9)]
               hover:to-[hsl(var(--color-brand-teal-dark)/0.9)]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="bg-[hsl(var(--color-brand-teal)/0.2)] dark:bg-[hsl(var(--color-brand-teal)/0.3)]
                      p-3 rounded-lg group-hover:bg-white/20"
                  >
                    <Calendar
                      className="h-6 w-6 text-[hsl(var(--color-brand-teal))]
                             dark:text-[hsl(var(--color-brand-teal))]
                             group-hover:text-white"
                    />
                  </div>
                </div>
                <div>
                  <p
                    className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]
                   text-xs font-medium mb-2 group-hover:text-white"
                  >
                    Next Appointment
                  </p>
                  <p
                    className="text-2xl font-bold mb-2 text-[hsl(var(--foreground))]
                   dark:text-[hsl(var(--foreground))]
                   group-hover:text-white"
                  >
                    {dashboardData?.nextAppointment?.date || "No upcoming"}
                  </p>
                  <p
                    className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]
                   text-xs group-hover:text-white"
                  >
                    {dashboardData?.nextAppointment?.time || ""} {dashboardData?.nextAppointment?.doctor?.name ? `• ${dashboardData.nextAppointment.doctor.name}` : ""}
                  </p>
                </div>
              </div>

              {/* Card 2 – Last Visit */}
              <div
                className={`group bg-[hsl(var(--color-card))] dark:bg-[hsl(var(--color-card))]
               rounded-2xl p-6 shadow-sm
               transition hover:bg-gradient-to-r
               hover:from-[hsl(var(--color-brand-teal)/0.9)]
               hover:to-[hsl(var(--color-brand-teal-dark)/0.9)]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="bg-[hsl(var(--color-chart-purple)/0.1)] dark:bg-[hsl(var(--color-chart-purple)/0.15)]
                      p-2 rounded-md group-hover:bg-white/20"
                  >
                    <Stethoscope
                      className="h-5 w-5 text-[hsl(var(--color-chart-purple))]
                                dark:text-[hsl(var(--color-chart-purple))]
                                group-hover:text-white"
                    />
                  </div>
                </div>
                <div>
                  <p
                    className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]
                   text-xs font-medium mb-2 group-hover:text-white"
                  >
                    Last Visit
                  </p>
                  <p
                    className="text-2xl font-bold mb-2 text-[hsl(var(--foreground))]
                   dark:text-[hsl(var(--foreground))]
                   group-hover:text-white"
                  >
                    {dashboardData?.lastVisit?.date || "No visits"}
                  </p>
                  <p
                    className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]
                   text-xs group-hover:text-white"
                  >
                    {dashboardData?.lastVisit?.type || ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="rounded-2xl shadow-sm border border-[hsl(var(--border))] dark:bg-[hsl(var(--card))] overflow-hidden">
                <CardHeader className="pb-2 px-6 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-brand-teal)/0.12)]">
                        <TrendingUp className="h-4 w-4 text-[hsl(var(--color-brand-teal))]" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))]">
                          Your Appointment History
                        </CardTitle>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                          Visits booked vs completed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 px-4 pb-6">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={appointmentTrends}
                        margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="patientApptFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="patientCompletedFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.28} />
                            <stop offset="100%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 11,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          width={28}
                          allowDecimals={false}
                          tick={{
                            fontSize: 11,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid hsl(var(--border))",
                            background: "hsl(var(--card))",
                            fontSize: 12,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="appointments"
                          stroke="hsl(var(--color-brand-teal))"
                          strokeWidth={2.5}
                          fill="url(#patientApptFill)"
                          activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="hsl(var(--color-chart-blue))"
                          strokeWidth={2}
                          fill="url(#patientCompletedFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 flex justify-center gap-5 text-xs text-[hsl(var(--muted-foreground))]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))]" />
                      Booked
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-chart-blue))]" />
                      Completed
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm border border-[hsl(var(--border))] dark:bg-[hsl(var(--card))] overflow-hidden">
                <CardHeader className="pb-2 px-6 pt-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-chart-purple)/0.12)]">
                      <BarChart3 className="h-4 w-4 text-[hsl(var(--color-chart-purple))]" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))]">
                        Care Engagement
                      </CardTitle>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                        How complete your care plan is
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-2 space-y-4">
                  {(dashboardData?.healthScore || [
                    { label: "Checkups", value: 85 },
                    { label: "Labs", value: 70 },
                    { label: "Meds", value: 92 },
                    { label: "Follow-ups", value: 78 },
                  ]).map((item: { label: string; value: number }, idx: number) => {
                    const colors = [
                      "hsl(var(--color-brand-teal))",
                      "hsl(var(--color-chart-blue))",
                      "hsl(var(--color-chart-orange))",
                      "hsl(var(--color-chart-purple))",
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[hsl(var(--foreground))]">{item.label}</span>
                          <span className="font-semibold" style={{ color }}>
                            {item.value}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${item.value}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
          >
            <HiMiniChatBubbleBottomCenterText className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </PatientOnboardingGuard>
    </ProtectedRoute>
  );
}
