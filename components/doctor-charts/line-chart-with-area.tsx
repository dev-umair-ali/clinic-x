"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface LineChartWithAreaProps {
  data: { name: string; total: number; pending: number }[]
  totalColor: string
  pendingColor: string
}

export function LineChartWithArea({
  data,
  totalColor,
  pendingColor,
}: LineChartWithAreaProps) {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Total Prescriptions",
          color: totalColor,
        },
        pending: {
          label: "Pending Refills",
          color: pendingColor,
        },
      }}
      className="h-[200px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 0,
            bottom: 0,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
            domain={[0, 16]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="total"
            type="monotone"
            stroke="#3b82f6"
            fill={`url(#colorTotal)`}
            strokeWidth={3}
            dot={false}
          />
          <Area
            dataKey="pending"
            type="monotone"
            stroke="#ef4444"
            fill={`url(#colorPending)`}
            strokeWidth={3}
            dot={false}
          />
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
