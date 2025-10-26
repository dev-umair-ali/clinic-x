"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StackedBarChartProps {
  data: { name: string; voiceToText: number; aiSummary: number; textAnalysis: number }[]
  voiceToTextColor: string
  aiSummaryColor: string
  textAnalysisColor: string
}

export function StackedBarChart({
  data,
  voiceToTextColor,
  aiSummaryColor,
  textAnalysisColor,
}: StackedBarChartProps) {
  return (
    <ChartContainer
      config={{
        voiceToText: {
          label: "Voice-to-Text",
          color: voiceToTextColor,
        },
        aiSummary: {
          label: "AI Summary",
          color: aiSummaryColor,
        },
        textAnalysis: {
          label: "Text Analysis",
          color: textAnalysisColor,
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
        <Bar dataKey="voiceToText" stackId="a" fill={voiceToTextColor} radius={[4, 4, 0, 0]} />
        <Bar dataKey="aiSummary" stackId="a" fill={aiSummaryColor} radius={[4, 4, 0, 0]} />
        <Bar dataKey="textAnalysis" stackId="a" fill={textAnalysisColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
