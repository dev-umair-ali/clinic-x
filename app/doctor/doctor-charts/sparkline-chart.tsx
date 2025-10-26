"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface SparklineChartProps {
  data: { name: string; value: number }[]
  color: string
}

export function SparklineChart({ data, color }: SparklineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
