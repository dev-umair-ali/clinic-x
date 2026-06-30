"use client"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function AppointmentTrends( { dashboardData }: { dashboardData?: any }) {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
          <CardTitle className="text-base sm:text-lg">
            Appointment Trends
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
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
            <LineChart
              data={dashboardData}
              margin={{
                top: 10,
                right: 10,
                left: 0,   // 🔥 remove left gap
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--color-muted-foreground))" }}
              />

              {/* Hide Y axis on mobile */}
              <YAxis
                hide
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--color-muted-foreground))" }}
              />

              <Line
                type="monotone"
                dataKey="appointments"
                stroke="hsl(var(--color-chart-green))"
                strokeWidth={3}
                dot={{
                  fill: "hsl(var(--color-chart-green))",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
