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
          <CardTitle className="text-base sm:text-lg dark:text-[hsl(var(--color-foreground))]">
            Clinic Performance
          </CardTitle>
          <select className="text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]
                             text-sm bg-transparent border-none cursor-pointer hover:underline">
            <option>All Clinics</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            appointments: {
              label: "Appointments",
              color: "hsl(var(--color-chart-green))",
            },
          }}
          className="h-48 sm:h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="clinic"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--color-muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--color-muted-foreground))" }}
              />
              <Bar
                dataKey="appointments"
                fill="hsl(var(--color-chart-green))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[hsl(var(--color-chart-green))] rounded-full"></div>
            <span className="text-sm text-[hsl(var(--color-muted-foreground))]">
              Appointments
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}