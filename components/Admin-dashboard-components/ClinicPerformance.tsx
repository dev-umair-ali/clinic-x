"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function ClinicPerformance( { dashboardData }: { dashboardData?: any }) {
  
  // Use real data if available, otherwise fall back to mock data
  const chartData = dashboardData && dashboardData.length > 0 ? dashboardData : [];
  
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
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
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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