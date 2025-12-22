"use client";

import {
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardKPIs() {
  const cards = [
    {
      label: "Outstanding Bills",
      value: "$12,340",
      icon: <FileText className="h-5 w-5 text-[hsl(var(--color-status-error))]" />,
      change: "+2.1%",
      changeColor:
        "bg-[hsl(var(--color-status-error)/0.1))] text-[hsl(var(--color-status-error))] dark:bg-[hsl(var(--color-status-error)/0.2))] dark:text-[hsl(var(--color-status-error))]",
    },
    {
      label: "Revenue Trend",
      value: "$47,500",
      icon: <DollarSign className="h-5 w-5 text-[hsl(var(--color-chart-green))]" />,
      change: "+8.2%",
      changeColor:
        "bg-[hsl(var(--color-chart-green)/0.1))] text-[hsl(var(--color-chart-green))] dark:bg-[hsl(var(--color-chart-green)/0.2))] dark:text-[hsl(var(--color-chart-green))]",
    },
    {
      label: "Payment Methods",
      value: "5 Active",
      icon: <Clock className="h-5 w-5 text-[hsl(var(--color-chart-blue))]" />,
      change: "+1",
      changeColor:
        "bg-[hsl(var(--color-chart-blue)/0.1))] text-[hsl(var(--color-chart-blue))] dark:bg-[hsl(var(--color-chart-blue)/0.2))] dark:text-[hsl(var(--color-chart-blue))]",
    },
    {
      label: "Paid Invoices",
      value: "1,249",
      icon: <AlertCircle className="h-5 w-5 text-[hsl(var(--color-chart-green))]" />,
      change: "+5.4%",
      changeColor:
        "bg-[hsl(var(--color-chart-green)/0.1))] text-[hsl(var(--color-chart-green))] dark:bg-[hsl(var(--color-chart-green)/0.2))] dark:text-[hsl(var(--color-chart-green))]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="shadow-sm border-[hsl(var(--border))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--card))]"
        >
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              {card.label}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-1">
              {card.value}
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.changeColor}`}
            >
              {card.change}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}