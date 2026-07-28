"use client";

import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function DoctorVisitVolumeCard({
  data,
}: {
  data?: { day: string; visits: number; followUps?: number }[];
}) {
  const chartData = Array.isArray(data) && data.length ? data : [];

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-chart-blue)/0.12)]">
            <Activity className="h-4 w-4 text-[hsl(var(--color-chart-blue))]" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg">Weekly Visit Volume</CardTitle>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Your clinical load this week
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            visits: { label: "Visits", color: "hsl(var(--color-brand-teal))" },
            followUps: { label: "Follow-ups", color: "hsl(var(--color-chart-blue))" },
          }}
          className="h-56 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="followFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={28}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="hsl(var(--color-brand-teal))"
                strokeWidth={2.5}
                fill="url(#visitsFill)"
              />
              <Area
                type="monotone"
                dataKey="followUps"
                stroke="hsl(var(--color-chart-blue))"
                strokeWidth={2}
                fill="url(#followFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-3 flex justify-center gap-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))]" />
            Visits
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-chart-blue))]" />
            Follow-ups
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
