"use client";

import { Users, DollarSign, TrendingUp, Plus, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { BsBuildingsFill } from "react-icons/bs";
import { CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
const appointmentTrendsData = [
  { month: "Jan", appointments: 20 },
  { month: "Feb", appointments: 15 },
  { month: "Mar", appointments: 25 },
  { month: "Apr", appointments: 18 },
  { month: "May", appointments: 30 },
  { month: "Jun", appointments: 22 },
];

const revenueBreakdownData = [
  { name: "Paid", value: 65, color: "#3B82F6" },
  { name: "Pending", value: 25, color: "#F59E0B" },
  { name: "Overdue", value: 10, color: "#EF4444" },
];

const patientGrowthData = [
  { month: "Jan", patients: 1800 },
  { month: "Feb", patients: 1900 },
  { month: "Mar", patients: 2100 },
  { month: "Apr", patients: 2000 },
  { month: "May", patients: 2300 },
  { month: "Jun", patients: 2200 },
];

const clinicPerformanceData = [
  { clinic: "Jan", appointments: 180 },
  { clinic: "Feb", appointments: 150 },
  { clinic: "Mar", appointments: 120 },
  { clinic: "Apr", appointments: 200 },
  { clinic: "May", appointments: 90 },
  { clinic: "Jun", appointments: 160 },
];

const doctorPerformanceData = [
  { month: "Jan", consultations: 120, surgeries: 80 },
  { month: "Feb", consultations: 100, surgeries: 90 },
  { month: "Mar", surgeries: 110 },
  { month: "Apr", consultations: 140, surgeries: 70 },
  { month: "May", consultations: 90, surgeries: 100 },
  { month: "Jun", consultations: 130, surgeries: 85 },
];

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Last 7 Days");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSelect = (option: string) => {
    if (option === "Custom") {
      setShowCalendar(true);
    } else {
      setSelected(option);
      setShowCalendar(false);
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-teal-500 dark:bg-teal-600 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {user?.firstName && user?.lastName
                  ? `${
                      user.firstName.charAt(0).toUpperCase() +
                      user.firstName.slice(1)
                    } ${
                      user.lastName.charAt(0).toUpperCase() +
                      user.lastName.slice(1)
                    }`
                  : user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "User"}
              </h1>
              <p className="text-teal-100 dark:text-teal-200 text-sm sm:text-base">
                Here's an overview of your healthcare information and recent
                activity.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* <button
                onClick={() => handleNavigation("/assistant/patients/add")}
                className="bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Doctor
              </button> */}
              <button
                onClick={() => handleNavigation("/assistant/patients/add")}
                className="bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Patient
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 dark:bg-orange-900/30 p-3 rounded-lg group-hover:bg-white/20">
                <BsBuildingsFill className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 dark:text-teal-500 group-hover:text-white" />
              </div>
              <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
                +2
              </span>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
              Total Doctors
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1 text-teal-500 dark:text-white group-hover:text-white">
              156
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg group-hover:bg-white/20">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#947311] dark:text-[#947311] group-hover:text-white" />
              </div>
              <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
                +2
              </span>
            </div>
            <div className="text-[#999B9D] dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
              Total Doctors
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#947311] dark:text-white group-hover:text-white">
              156
            </div>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#3B82F6]/20 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-white/20">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6] dark:text-blue-400 group-hover:text-white" />
              </div>
              <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
                +22
              </span>
            </div>
            <div className="text-[#999B9D] dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
              Total Revenue
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#3B82F6] dark:text-white group-hover:text-white">
              $127,450
            </div>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
            <div className="flex items-center justify-between mb-4">
              <div className=" bg-[#D022C4]/20 dark:bg-pink-900/30 p-3 rounded-lg group-hover:bg-white/20">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#D022C4] dark:text-pink-400 group-hover:text-white" />
              </div>
              <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
                +222
              </span>
            </div>
            <div className="text-[#999B9D] dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
              Total Patients
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#D022C4] dark:text-white group-hover:text-white">
              2,847
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base">
                {selected}
                <ChevronDown className="w-4 h-4" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end" /** aligns content to the left edge of trigger */
              sideOffset={5}
              className="w-64 p-2"
            >
              {/* Options List */}
              {!showCalendar && (
                <div className="space-y-1">
                  {[
                    "Last 7 Days",
                    "Last 20 Days",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Custom",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selected === option
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Calendar */}
              {showCalendar && (
                <div className="flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={(date) => {
                      setCustomDate(date);
                      if (date) {
                        setSelected(date.toDateString());
                        setShowCalendar(false);
                        setOpen(false);
                      }
                    }}
                    className="rounded-md border shadow-md w-full sm:w-auto"
                    classNames={{
                      day_selected:
                        "bg-[#1DA68F] text-white hover:bg-[#1DA68F]/90 focus:bg-[#1DA68F]/90",
                    }}
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Appointment Trends Chart */}
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base sm:text-lg dark:text-white">
                  Appointment Trends
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  appointments: {
                    label: "Appointments",
                    color: "#14B8A6",
                  },
                }}
                className="h-48 sm:h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentTrendsData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#14B8A6"
                      strokeWidth={3}
                      dot={{ fill: "#14B8A6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Revenue Breakdown Chart */}
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base sm:text-lg dark:text-white">
                  Revenue Breakdown
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <ChartContainer
                    config={{
                      paid: { label: "Paid", color: "#3B82F6" },
                      pending: { label: "Pending", color: "#F59E0B" },
                      overdue: { label: "Overdue", color: "#EF4444" },
                    }}
                    className="w-36 h-36 sm:w-48 sm:h-48"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {revenueBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        $24.5K
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#3B82F6" }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Paid
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    65%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#F59E0B" }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Pending
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    25%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#EF4444" }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Overdue
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    10%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Patient Growth Trend */}
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg dark:text-white">
                  Patient Growth Trend
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-teal-600 dark:text-teal-400 text-sm hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1">
                      All Clinics
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem>Active</DropdownMenuItem>
                    <DropdownMenuItem>Inactive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  patients: {
                    label: "Patients",
                    color: "#14B8A6",
                  },
                }}
                className="h-48 sm:h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patientGrowthData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stroke="#14B8A6"
                      fill="#14B8A6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Clinic Performance */}
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg dark:text-white">
                  Clinic Performance
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-teal-600 dark:text-teal-400 text-sm hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1">
                      All Clinics
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem>Active</DropdownMenuItem>
                    <DropdownMenuItem>Inactive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  appointments: {
                    label: "Appointments",
                    color: "#14B8A6",
                  },
                }}
                className="h-48 sm:h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clinicPerformanceData}>
                    <XAxis
                      dataKey="clinic"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Bar
                      dataKey="appointments"
                      fill="#14B8A6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Appointments
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Doctor Performance */}
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base sm:text-lg dark:text-white">
                  Doctor Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  consultations: {
                    label: "Consultations",
                    color: "#14B8A6",
                  },
                  surgeries: {
                    label: "Surgeries",
                    color: "#F97316",
                  },
                }}
                className="h-48 sm:h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorPerformanceData} barCategoryGap="20%">
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Bar
                      dataKey="consultations"
                      fill="#14B8A6"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="surgeries"
                      fill="#F97316"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base sm:text-lg dark:text-white">
                  Recent Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Dr. Sarah Johnson onboarded to Downtown Clinic
                    </div>
                    <div className="text-xs sm:text-sm text-[#999B9D] dark:text-gray-400">
                      2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Dr. Sarah Johnson onboarded to Downtown Clinic
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Dr. Sarah Johnson onboarded to Downtown Clinic
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Dr. Sarah Johnson onboarded to Downtown Clinic
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
