"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", patients: 1800 },
  { month: "Feb", patients: 1900 },
  { month: "Mar", patients: 2100 },
  { month: "Apr", patients: 2000 },
  { month: "May", patients: 2300 },
  { month: "Jun", patients: 2200 },
]

export default function PatientGrowth() {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg dark:text-white">Patient Growth Trend</CardTitle>
          {/* Same dropdown as ClinicPerformance – you can extract later */}
          <select className="text-teal-600 dark:text-teal-400 text-sm bg-transparent border-none cursor-pointer hover:underline">
            <option>All Clinics</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ patients: { label: "Patients", color: "#14B8A6" } }}
          className="h-48 sm:h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Area type="monotone" dataKey="patients" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}