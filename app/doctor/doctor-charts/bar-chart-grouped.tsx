"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartGroupedProps {
  data: { name: string; voiceNotes: number; manualNotes: number }[]
  voiceNotesColor: string
  manualNotesColor: string
}

export function BarChartGrouped({ data, voiceNotesColor, manualNotesColor }: BarChartGroupedProps) {
  return (
    <ChartContainer
      config={{
        voiceNotes: {
          label: "Voice Notes",
          color: voiceNotesColor,
        },
        manualNotes: {
          label: "Manual Notes",
          color: manualNotesColor,
        },
      }}
      className="min-h-[200px] w-full"
    >
      <BarChart data={data} barCategoryGap={4}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--custom-dashboard-gray-200))" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs text-custom-dashboard-gray-500"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs text-custom-dashboard-gray-500"
          domain={[0, 16]} // Hardcode domain to match image
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="voiceNotes" fill={voiceNotesColor} radius={[4, 4, 0, 0]} />
        <Bar dataKey="manualNotes" fill={manualNotesColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
