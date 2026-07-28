"use client";

import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Paid", value: 65, color: "hsl(var(--color-brand-teal))" },
  { name: "Pending", value: 25, color: "hsl(var(--color-chart-orange))" },
  { name: "Overdue", value: 10, color: "hsl(var(--color-status-error))" },
];

export default function RevenueBreakdown() {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-chart-orange)/0.12)]">
            <CreditCard className="h-4 w-4 text-[hsl(var(--color-chart-orange))]" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg text-[hsl(var(--foreground))]">
              Revenue Health
            </CardTitle>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Collection status across network
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <ChartContainer
              config={{
                paid: { label: "Paid", color: "hsl(var(--color-brand-teal))" },
                pending: { label: "Pending", color: "hsl(var(--color-chart-orange))" },
                overdue: { label: "Overdue", color: "hsl(var(--color-status-error))" },
              }}
              className="h-44 w-44"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="hsl(var(--card))"
                    strokeWidth={3}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[hsl(var(--foreground))]">{total}%</span>
              <span className="text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                covered
              </span>
            </div>
          </div>
          <div className="flex-1 w-full space-y-3">
            {data.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-[hsl(var(--foreground))]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-[hsl(var(--foreground))]">{item.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
