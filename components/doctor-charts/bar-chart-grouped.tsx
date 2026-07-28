"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface BarChartGroupedProps {
  data: { name: string; voiceNotes: number; manualNotes: number }[];
  voiceNotesColor: string;
  manualNotesColor: string;
}

export function BarChartGrouped({
  data,
  voiceNotesColor,
  manualNotesColor,
}: BarChartGroupedProps) {
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
      className="min-h-[240px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="18%" margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="voiceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={voiceNotesColor} stopOpacity={1} />
              <stop offset="100%" stopColor={voiceNotesColor} stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="manualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={manualNotesColor} stopOpacity={1} />
              <stop offset="100%" stopColor={manualNotesColor} stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            width={28}
          />
          <ChartTooltip cursor={{ fill: "hsl(var(--muted)/0.4)" }} content={<ChartTooltipContent />} />
          <Bar dataKey="voiceNotes" fill="url(#voiceGrad)" radius={[8, 8, 4, 4]} maxBarSize={28} />
          <Bar dataKey="manualNotes" fill="url(#manualGrad)" radius={[8, 8, 4, 4]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
