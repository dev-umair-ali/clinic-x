"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Calendar, DollarSign, Pill, Stethoscope, TrendingUp, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ChatBot } from "./chat-bot"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2"

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Chart data matching screenshot
  const appointmentTrends = [
    { month: "Jan", appointments: 4 },
    { month: "Feb", appointments: 3 },
    { month: "Mar", appointments: 5 },
    { month: "Apr", appointments: 2 },
    { month: "May", appointments: 6 },
    { month: "Jun", appointments: 4 },
  ]

  // Updated prescription usage data to match screenshot
  const prescriptionUsage = [
    { month: "Jan", current: 2, previous: 3 },
    { month: "Feb", current: 4, previous: 2 },
    { month: "Mar", current: 1, previous: 3 },
    { month: "Apr", current: 3, previous: 3 },
    { month: "May", current: 5, previous: 4 },
    { month: "Jun", current: 3, previous: 3 },
  ]

  const billingData = [
    { name: "Paid", value: 65, color: "#3B82F6" },
    { name: "Pending", value: 25, color: "#F59E0B" },
    { name: "Overdue", value: 10, color: "#EF4444" },
  ]

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header - exact match */}
          <div className="mb-6 bg-[#1da68f3c] p-6 sm:p-8 rounded-md">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back, John Doe!</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Here's an overview of your healthcare information and recent activity.
            </p>
          </div>

          {/* Top Stats Cards - exact layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Next Appointment - mint green background */}
            <Card className="bg-emerald-400 dark:bg-emerald-500 text-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 dark:text-emerald-50 text-xs font-medium mb-2">Next Appointment</p>
                  <p className="text-2xl font-bold mb-2">July 30</p>
                  <p className="text-emerald-100 dark:text-emerald-50 text-xs">8:00 AM • Dr. Smith</p>
                </div>
              </CardContent>
            </Card>

            {/* Pending Bills */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">Pending Bills</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$245.00</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">2 outstanding invoices</p>
                </div>
              </CardContent>
            </Card>

            {/* Active Prescriptions */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-md">
                    <Pill className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">3</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">1 refill due soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Last Visit */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-md">
                    <Stethoscope className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-2">Last Visit</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">June 15</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Routine checkup</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Section - exact layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Upcoming Appointment */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 dark:text-gray-300" />
                  <CardTitle className="text-base font-semibold dark:text-white">Upcoming Appointment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">Annual Physical Exam</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">Dr. Sarah Smith • Internal Medicine</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">July 30, 2024 at 4:00 PM</p>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 text-xs px-3 py-1">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Overview */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 dark:text-gray-300" />
                  <CardTitle className="text-base font-semibold dark:text-white">Billing Overview</CardTitle>
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
                      <span className="text-xl font-bold dark:text-white">$24.5K</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="dark:text-gray-300">Paid 65%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="dark:text-gray-300">Pending 25%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="dark:text-gray-300">Overdue 10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lower Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Prescription Summary */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 dark:text-gray-300" />
                  <CardTitle className="text-base font-semibold dark:text-white">Prescription Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Refill Due</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Expired</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Lisinopril 10mg</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Dr. Smith • Daily</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 text-xs px-3 py-1"
                    >
                      Refill Due
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Metformin 500mg</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Dr. Johnson • Twice daily</p>
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 text-xs px-3 py-1">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 dark:text-gray-300" />
                  <CardTitle className="text-base font-semibold dark:text-white">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Appointment scheduled</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        AI chatbot booked your appointment for July 30th at 4:00 PM
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Bill payment received</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        Payment of $125.00 processed successfully
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Prescription refilled</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        Lisinopril prescription sent to pharmacy
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Trends */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 dark:text-gray-300" />
                  <CardTitle className="text-base font-semibold dark:text-white">Appointment Trends</CardTitle>
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
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        domain={[0, 8]}
                      />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 4, fill: "#10B981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Prescription Usage */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 dark:text-gray-300" />
                  <CardTitle className="text-base font-semibold dark:text-white">Prescription Usage</CardTitle>
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
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        domain={[0, 6]}
                      />
                      <Bar dataKey="current" fill="#10B981" radius={[2, 2, 0, 0]} maxBarSize={20} />
                      <Bar dataKey="previous" fill="#3B82F6" radius={[2, 2, 0, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Button - responsive */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        >
          <HiMiniChatBubbleBottomCenterText className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Chat Bot - fully responsive */}
        <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </ProtectedRoute>
  )
}
