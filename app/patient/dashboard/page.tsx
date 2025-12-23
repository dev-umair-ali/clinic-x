"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Calendar, DollarSign, Pill, Stethoscope, TrendingUp, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ChatBot } from "./chat-bot";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { OnboardingModal } from "@/components/ui/onboarding-modal";

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    if (user && user.role === "patient" && !user.hasCompletedOnboarding) {
      setShowOnboardingModal(true);
    }
  }, [user]);

  const handleStartOnboarding = () => {
    setShowOnboardingModal(false);
    router.push("/patient/onboarding");
  };

  const appointmentTrends = [
    { month: "Jan", appointments: 4 },
    { month: "Feb", appointments: 3 },
    { month: "Mar", appointments: 5 },
    { month: "Apr", appointments: 2 },
    { month: "May", appointments: 6 },
    { month: "Jun", appointments: 4 },
  ];

  const prescriptionUsage = [
    { month: "Jan", current: 2, previous: 3 },
    { month: "Feb", current: 4, previous: 2 },
    { month: "Mar", current: 1, previous: 3 },
    { month: "Apr", current: 3, previous: 3 },
    { month: "May", current: 5, previous: 4 },
    { month: "Jun", current: 3, previous: 3 },
  ];

  const billingData = [
    { name: "Paid", value: 65, color: "hsl(var(--color-chart-blue))" },
    { name: "Pending", value: 25, color: "hsl(var(--color-chart-orange))" },
    { name: "Overdue", value: 10, color: "hsl(var(--color-status-error))" },
  ];

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <OnboardingModal
        isOpen={showOnboardingModal}
        onOpenChange={setShowOnboardingModal}
        onStartOnboarding={handleStartOnboarding}
      />

      <div className="min-h-screen bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 bg-[hsl(var(--color-brand-teal-light))] p-6 sm:p-8 rounded-md">
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-1">
              Welcome back, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "Patient"}!
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm">
              Here's an overview of your healthcare information and recent activity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-[hsl(var(--color-brand-teal))] text-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium mb-2">Next Appointment</p>
                  <p className="text-2xl font-bold mb-2">July 30</p>
                  <p className="text-white/80 text-xs">8:00 AM • Dr. Smith</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-[hsl(var(--color-status-success-light))] rounded-md">
                    <DollarSign className="h-5 w-5 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]" />
                  </div>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs font-medium mb-2">Pending Bills</p>
                  <p className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">$245.00</p>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs">2 outstanding invoices</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-[hsl(var(--color-chart-orange)/0.1)] rounded-md">
                    <Pill className="h-5 w-5 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]" />
                  </div>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs font-medium mb-2">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">3</p>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs">1 refill due soon</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-[hsl(var(--color-chart-purple)/0.1)] rounded-md">
                    <Stethoscope className="h-5 w-5 text-[hsl(var(--color-chart-purple))] dark:text-[hsl(var(--color-chart-purple))]" />
                  </div>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs font-medium mb-2">Last Visit</p>
                  <p className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">June 15</p>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs">Routine checkup</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                  <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Upcoming Appointment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] text-sm">Annual Physical Exam</h3>
                    <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-xs mt-1">Dr. Sarah Smith • Internal Medicine</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">July 30, 2024 at 4:00 PM</p>
                    <Badge className="bg-[hsl(var(--color-status-success-light))] text-[hsl(var(--color-status-success))] dark:bg-[hsl(var(--color-status-success-light))] dark:text-[hsl(var(--color-status-success))] hover:bg-[hsl(var(--color-status-success-light))] dark:hover:bg-[hsl(var(--color-status-success-light))] text-xs px-3 py-1">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-4 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] bg-transparent"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-4 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                  <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Billing Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={billingData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={1}
                          dataKey="value"
                        >
                          {billingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">$24.5K</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Total</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-chart-blue))]"></div>
                      <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Paid 65%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-chart-orange))]"></div>
                      <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Pending 25%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-status-error))]"></div>
                      <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Overdue 10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                  <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Prescription Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">3</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">1</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">Refill Due</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">2</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">Expired</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] rounded-md">
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] text-sm">Lisinopril 10mg</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">Dr. Smith • Daily</p>
                    </div>
                    <Badge className="bg-[hsl(var(--color-chart-orange)/0.1)] text-[hsl(var(--color-chart-orange))] dark:bg-[hsl(var(--color-chart-orange)/0.1)] dark:text-[hsl(var(--color-chart-orange))] hover:bg-[hsl(var(--color-chart-orange)/0.1)] dark:hover:bg-[hsl(var(--color-chart-orange)/0.1)] text-xs px-3 py-1">
                      Refill Due
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] rounded-md">
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] text-sm">Metformin 500mg</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">Dr. Johnson • Twice daily</p>
                    </div>
                    <Badge className="bg-[hsl(var(--color-status-success-light))] text-[hsl(var(--color-status-success))] dark:bg-[hsl(var(--color-status-success-light))] dark:text-[hsl(var(--color-status-success))] hover:bg-[hsl(var(--color-status-success-light))] dark:hover:bg-[hsl(var(--color-status-success-light))] text-xs px-3 py-1">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                  <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--color-status-success))] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] text-sm">Appointment scheduled</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">
                        AI chatbot booked your appointment for July 30th at 4:00 PM
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--color-status-success))] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] text-sm">Bill payment received</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">
                        Payment of $125.00 processed successfully
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--color-status-success))] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] text-sm">Prescription refilled</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">
                        Lisinopril prescription sent to pharmacy
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                  <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Appointment Trends</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appointmentTrends} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        domain={[0, 8]}
                      />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="hsl(var(--color-brand-teal))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--color-brand-teal))", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 4, fill: "hsl(var(--color-brand-teal))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                  <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Prescription Usage</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prescriptionUsage} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        domain={[0, 6]}
                      />
                      <Bar dataKey="current" fill="hsl(var(--color-brand-teal))" radius={[2, 2, 0, 0]} maxBarSize={20} />
                      <Bar dataKey="previous" fill="hsl(var(--color-chart-blue))" radius={[2, 2, 0, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
    </ProtectedRoute>
  );
}