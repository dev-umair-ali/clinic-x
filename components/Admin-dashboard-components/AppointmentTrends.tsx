"use client";

import { CalendarDays, TrendingUp } from "lucide-react";
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

export default function AppointmentTrends({
  dashboardData,
  title = "Appointment Trends",
}: {
  dashboardData?: any;
  title?: string;
}) {
  const data = Array.isArray(dashboardData) ? dashboardData : [];
  const total = data.reduce((sum: number, d: any) => sum + (Number(d.appointments) || 0), 0);
  const latest = data[data.length - 1]?.appointments ?? 0;
  const prev = data[data.length - 2]?.appointments ?? latest;
  const delta = prev ? Math.round(((latest - prev) / prev) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-brand-teal)/0.12)]">
              <CalendarDays className="h-4.5 w-4.5 text-[hsl(var(--color-brand-teal))]" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg text-[hsl(var(--foreground))]">
                {title}
              </CardTitle>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Last 6 months volume
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-[hsl(var(--color-brand-teal))]">
              {total}
            </div>
            <div
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                delta >= 0
                  ? "text-[hsl(var(--color-status-success))]"
                  : "text-[hsl(var(--color-status-error))]"
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              {delta >= 0 ? "+" : ""}
              {delta}% MoM
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6 pt-2">
        <ChartContainer
          config={{
            appointments: {
              label: "Appointments",
              color: "hsl(var(--color-brand-teal))",
            },
            completed: {
              label: "Completed",
              color: "hsl(var(--color-chart-blue))",
            },
          }}
          className="h-52 sm:h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="apptFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="completedStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 6"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={36}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="hsl(var(--color-brand-teal))"
                strokeWidth={2.5}
                fill="url(#apptFill)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
              />
              {data.some((d: any) => d.completed != null) && (
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--color-chart-blue))"
                  strokeWidth={2}
                  fill="url(#completedStroke)"
                  strokeDasharray="0"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))]" />
            Booked
          </span>
          {data.some((d: any) => d.completed != null) && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-chart-blue))]" />
              Completed
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
