"use client"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", appointments: 20 },
  { month: "Feb", appointments: 15 },
  { month: "Mar", appointments: 25 },
  { month: "Apr", appointments: 18 },
  { month: "May", appointments: 30 },
  { month: "Jun", appointments: 22 },
]

export default function AppointmentTrends() {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
          <CardTitle className="text-base sm:text-lg dark:text-[hsl(var(--color-foreground))]">
            Appointment Trends
          </CardTitle>
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
            <LineChart data={data}>
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
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}