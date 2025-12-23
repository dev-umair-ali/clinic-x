"use client"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", consultations: 120, surgeries: 80 },
  { month: "Feb", consultations: 100, surgeries: 90 },
  { month: "Mar", consultations: 110, surgeries: 95 },
  { month: "Apr", consultations: 140, surgeries: 70 },
  { month: "May", consultations: 90, surgeries: 100 },
  { month: "Jun", consultations: 130, surgeries: 85 },
]

export default function DoctorPerformance() {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
          <CardTitle className="text-base sm:text-lg dark:text-[hsl(var(--color-foreground))]">
            Doctor Performance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consultations: {
              label: "Consultations",
              color: "hsl(var(--color-chart-green))",
            },
            surgeries: {
              label: "Surgeries",
              color: "hsl(var(--color-chart-orange))",
            },
          }}
          className="h-48 sm:h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
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
              <Bar
                dataKey="consultations"
                fill="hsl(var(--color-chart-green))"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="surgeries"
                fill="hsl(var(--color-chart-orange))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}