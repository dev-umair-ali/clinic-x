"use client"
import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Paid", value: 65, color: "hsl(var(--color-chart-blue))" },
  { name: "Pending", value: 25, color: "hsl(var(--color-chart-orange))" },
  { name: "Overdue", value: 10, color: "hsl(var(--color-chart-red))" },
]

export default function RevenueBreakdown() {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
          <CardTitle className="text-base sm:text-lg dark:text-[hsl(var(--color-foreground))]">
            Revenue Breakdown
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <ChartContainer
              config={{
                paid: { label: "Paid", color: "hsl(var(--color-chart-blue))" },
                pending: { label: "Pending", color: "hsl(var(--color-chart-orange))" },
                overdue: { label: "Overdue", color: "hsl(var(--color-chart-red))" },
              }}
              className="w-36 h-36 sm:w-48 sm:h-48"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-[hsl(var(--color-foreground))]">
                  $24.5K
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-chart-blue))]"></div>
              <span className="text-sm text-[hsl(var(--color-muted-foreground))]">Paid</span>
            </div>
            <span className="text-sm font-medium text-[hsl(var(--color-foreground))]">65%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-chart-orange))]"></div>
              <span className="text-sm text-[hsl(var(--color-muted-foreground))]">Pending</span>
            </div>
            <span className="text-sm font-medium text-[hsl(var(--color-foreground))]">25%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-chart-red))]"></div>
              <span className="text-sm text-[hsl(var(--color-muted-foreground))]">Overdue</span>
            </div>
            <span className="text-sm font-medium text-[hsl(var(--color-foreground))]">10%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}