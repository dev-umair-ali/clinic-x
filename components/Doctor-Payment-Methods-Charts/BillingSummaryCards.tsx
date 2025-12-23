"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Payment Methods */}
      <Card className="shadow-sm border-[hsl(var(--border))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--card))]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Insurance", percent: 75, color: "bg-[hsl(var(--color-chart-blue))]" },
            { label: "Credit Card", percent: 22, color: "bg-[hsl(var(--color-chart-green))]" },
            { label: "Cash", percent: 5, color: "bg-[hsl(var(--color-chart-orange))]" },
          ].map((method, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-1">
                <span>{method.label}</span>
                <span className="font-semibold">{method.percent}%</span>
              </div>
              <div className="h-2 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] rounded-full">
                <div
                  className={`h-2 rounded-full ${method.color}`}
                  style={{ width: `${method.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card className="shadow-sm border-[hsl(var(--border))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--card))]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
          <p>
            This Month{" "}
            <span className="text-[hsl(var(--color-chart-green))] font-semibold float-right">
              +8.2%
            </span>
          </p>
          <p>
            Last Month{" "}
            <span className="float-right font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
              $43,800
            </span>
          </p>
          <p>
            YTD Total{" "}
            <span className="font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] float-right">
              $547,200
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Outstanding Bills */}
      <Card className="shadow-sm border-[hsl(var(--border))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--card))]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            Outstanding Bills
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
            0–30 days{" "}
            <span className="float-right text-[hsl(var(--color-chart-green))] font-semibold">
              $8,450
            </span>
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            23 invoices
          </p>
          <p className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
            31–60 days{" "}
            <span className="float-right text-[hsl(var(--color-chart-orange))] font-semibold">
              $2,890
            </span>
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            6 invoices
          </p>
          <p className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
            60+ days{" "}
            <span className="float-right text-[hsl(var(--color-status-error))] font-semibold">
              $1,000
            </span>
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            3 invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
}