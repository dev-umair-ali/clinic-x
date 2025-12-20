"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Payment Methods */}
      <Card className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Insurance", percent: 75, color: "bg-blue-500" },
            { label: "Credit Card", percent: 22, color: "bg-green-500" },
            { label: "Cash", percent: 5, color: "bg-orange-500" },
          ].map((method, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm text-foreground dark:text-gray-100 mb-1">
                <span>{method.label}</span>
                <span className="font-semibold">{method.percent}%</span>
              </div>
              <div className="h-2 bg-muted dark:bg-gray-700 rounded-full">
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
      <Card className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-foreground dark:text-gray-100">
          <p>
            This Month{" "}
            <span className="text-green-600 font-semibold float-right">
              +8.2%
            </span>
          </p>
          <p>
            Last Month{" "}
            <span className="float-right font-semibold text-foreground dark:text-gray-100">
              $43,800
            </span>
          </p>
          <p>
            YTD Total{" "}
            <span className="font-bold text-foreground dark:text-gray-100 float-right">
              $547,200
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Outstanding Bills */}
      <Card className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
            Outstanding Bills
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="text-foreground dark:text-gray-100">
            0–30 days{" "}
            <span className="float-right text-green-600 font-semibold">
              $8,450
            </span>
          </p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            23 invoices
          </p>
          <p className="text-foreground dark:text-gray-100">
            31–60 days{" "}
            <span className="float-right text-orange-500 font-semibold">
              $2,890
            </span>
          </p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            6 invoices
          </p>
          <p className="text-foreground dark:text-gray-100">
            60+ days{" "}
            <span className="float-right text-red-600 font-semibold">
              $1,000
            </span>
          </p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            3 invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
}