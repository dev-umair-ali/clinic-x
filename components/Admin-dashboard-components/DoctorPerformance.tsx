"use client";

import { Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const BAR_COLORS = [
  "hsl(var(--color-brand-teal))",
  "hsl(var(--color-chart-blue))",
  "hsl(var(--color-chart-orange))",
  "hsl(var(--color-chart-purple))",
  "hsl(var(--color-chart-green))",
];

export default function DoctorPerformance({
  dashboardData,
  title = "Doctor Performance",
}: {
  dashboardData?: any;
  title?: string;
}) {
  const raw = Array.isArray(dashboardData) ? dashboardData : [];
  const data = raw.map((d: any) => ({
    ...d,
    label: d.name || d.clinic || d.doctor || "—",
  }));
  const top = Math.max(...data.map((d: any) => Number(d.appointments) || 0), 0);

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-brand-teal)/0.12)]">
              <Stethoscope className="h-4 w-4 text-[hsl(var(--color-brand-teal))]" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg text-[hsl(var(--foreground))]">
                {title}
              </CardTitle>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Appointments by clinician
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-[hsl(var(--color-brand-teal)/0.1)] px-2.5 py-1 text-xs font-medium text-[hsl(var(--color-brand-teal))]">
            Peak {top}
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
            <BarChart data={data} barCategoryGap="18%" margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="doctorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--color-brand-teal-dark))" stopOpacity={0.75} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="appointments" radius={[8, 8, 4, 4]} maxBarSize={42}>
                {data.map((_: any, i: number) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
              {data.some((d: any) => d.completed != null) && (
                <Bar
                  dataKey="completed"
                  fill="hsl(var(--color-chart-blue))"
                  radius={[8, 8, 4, 4]}
                  maxBarSize={42}
                  fillOpacity={0.55}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))]" />
            Total
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
