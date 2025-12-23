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
          <CardTitle className="text-base sm:text-lg dark:text-[hsl(var(--color-foreground))]">
            Patient Growth Trend
          </CardTitle>
          <select
            className="text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]
                       text-sm bg-transparent border-none cursor-pointer hover:underline"
          >
            <option>All Clinics</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            patients: {
              label: "Patients",
              color: "hsl(var(--color-chart-green))",
            },
          }}
          className="h-48 sm:h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--color-muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--color-muted-foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="patients"
                stroke="hsl(var(--color-chart-green))"
                fill="hsl(var(--color-chart-green))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}