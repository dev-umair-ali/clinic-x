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
      icon: <FileText className="h-5 w-5 text-red-500" />,
      change: "+2.1%",
      changeColor:
        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
    },
    {
      label: "Revenue Trend",
      value: "$47,500",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      change: "+8.2%",
      changeColor:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      label: "Payment Methods",
      value: "5 Active",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      change: "+1",
      changeColor:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      label: "Paid Invoices",
      value: "1,249",
      icon: <AlertCircle className="h-5 w-5 text-green-500" />,
      change: "+5.4%",
      changeColor:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800"
        >
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
              {card.label}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground dark:text-gray-100 mb-1">
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