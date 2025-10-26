"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  totalValue: string
  centerLabel: string
}

export function DonutChart({ data, totalValue, centerLabel }: DonutChartProps) {
  return (
    <div className="relative h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8" // This fill is a fallback, actual colors come from Cell
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{totalValue}</span>
        <span className="text-sm text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  )
}
