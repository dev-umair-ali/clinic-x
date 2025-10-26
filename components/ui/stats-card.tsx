'use client'

import type React from "react"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative"
  icon?: React.ReactNode
  color?: string
  chartData?: { name: string; value: number }[]
  chartColor?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  color = "bg-blue-500",
  chartData,
  chartColor = "#3b82f6" // fallback Tailwind blue
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-200 flex flex-col justify-between h-full w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm mt-1 ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>

      {chartData && (
        <div className="h-14 sm:h-16 mt-3 sm:mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
