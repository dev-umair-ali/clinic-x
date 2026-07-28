"use client";

import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function ClinicPerformance({
  dashboardData,
  title = "Clinic Performance",
}: {
  dashboardData?: any;
  title?: string;
}) {
  const data = Array.isArray(dashboardData) && dashboardData.length > 0 ? dashboardData : [];

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-chart-orange)/0.12)]">
            <Building2 className="h-4 w-4 text-[hsl(var(--color-chart-orange))]" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg text-[hsl(var(--foreground))]">
              {title}
            </CardTitle>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Network clinics comparison
            </p>
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
            patients: {
              label: "Patients",
              color: "hsl(var(--color-chart-blue))",
            },
            revenue: {
              label: "Revenue index",
              color: "hsl(var(--color-chart-orange))",
            },
          }}
          className="h-52 sm:h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="16%" margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="clinicAppt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--color-brand-teal))" stopOpacity={0.65} />
                </linearGradient>
                <linearGradient id="clinicPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--color-chart-blue))" stopOpacity={0.65} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="clinic"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="appointments" fill="url(#clinicAppt)" radius={[8, 8, 4, 4]} maxBarSize={28} />
              {data.some((d: any) => d.patients != null) && (
                <Bar dataKey="patients" fill="url(#clinicPatients)" radius={[8, 8, 4, 4]} maxBarSize={28} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))]" />
            Appointments
          </span>
          {data.some((d: any) => d.patients != null) && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-chart-blue))]" />
              Patients
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
