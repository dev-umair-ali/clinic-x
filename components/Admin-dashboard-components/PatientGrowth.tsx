"use client";

import { Users, TrendingUp } from "lucide-react";
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

export default function PatientGrowth({
  dashboardData,
  title = "Patient Growth",
}: {
  dashboardData?: any;
  title?: string;
}) {
  const data = Array.isArray(dashboardData) ? dashboardData : [];
  const latest = data[data.length - 1]?.patients ?? 0;
  const first = data[0]?.patients ?? 0;
  const growth = first ? Math.round(((latest - first) / first) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-chart-blue)/0.12)]">
              <Users className="h-4 w-4 text-[hsl(var(--color-chart-blue))]" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg text-[hsl(var(--foreground))]">
                {title}
              </CardTitle>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Active patient base over time
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-[hsl(var(--color-chart-blue))]">
              {latest}
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--color-status-success))]">
              <TrendingUp className="h-3 w-3" />
              +{growth}% growth
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6 pt-2">
        <ChartContainer
          config={{
            patients: {
              label: "Patients",
              color: "hsl(var(--color-chart-blue))",
            },
            newPatients: {
              label: "New",
              color: "hsl(var(--color-brand-teal))",
            },
          }}
          className="h-52 sm:h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="newPatientsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="hsl(var(--border))" />
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
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="patients"
                stroke="hsl(var(--color-chart-blue))"
                strokeWidth={2.5}
                fill="url(#patientsFill)"
              />
              {data.some((d: any) => d.newPatients != null) && (
                <Area
                  type="monotone"
                  dataKey="newPatients"
                  stroke="hsl(var(--color-brand-teal))"
                  strokeWidth={2}
                  fill="url(#newPatientsFill)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-chart-blue))]" />
            Total patients
          </span>
          {data.some((d: any) => d.newPatients != null) && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))]" />
              New this month
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
