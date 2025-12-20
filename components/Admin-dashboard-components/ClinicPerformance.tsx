"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { clinic: "Jan", appointments: 180 },
  { clinic: "Feb", appointments: 150 },
  { clinic: "Mar", appointments: 120 },
  { clinic: "Apr", appointments: 200 },
  { clinic: "May", appointments: 90 },
  { clinic: "Jun", appointments: 160 },
]

export default function ClinicPerformance() {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg dark:text-white">Clinic Performance</CardTitle>
          <select className="text-teal-600 dark:text-teal-400 text-sm bg-transparent border-none cursor-pointer hover:underline">
            <option>All Clinics</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ appointments: { label: "Appointments", color: "#14B8A6" } }}
          className="h-48 sm:h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="clinic" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Bar dataKey="appointments" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Appointments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}