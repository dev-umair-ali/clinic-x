"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonutChart } from "./donut-chart";

export function PaymentCollectionSection() {
  const paymentData = [
    { name: "Paid", value: 65, color: "hsl(var(--color-chart-blue))" }, // Blue
    { name: "Pending", value: 25, color: "hsl(var(--color-status-warning))" }, // Yellow
    { name: "Denied", value: 10, color: "hsl(var(--color-chart-red))" }, // Red
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Payment Distribution */}
      <Card className="rounded-xl w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-[15px] font-semibold text-[hsl(var(--foreground))]">
            Payment Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center justify-between px-6 pb-6 pt-2 gap-4 lg:gap-6">
          <DonutChart
            data={paymentData}
            totalValue="$24.5K"
            centerLabel="Total"
          />
          <div className="flex items-center text-sm text-[hsl(var(--foreground))] divide-x divide-[hsl(var(--border))]">
            <div className="flex items-center pr-4">
              <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-chart-blue))] mr-2" />
              Paid <span className="ml-1 font-semibold">65%</span>
            </div>
            <div className="flex items-center px-4">
              <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-status-warning))] mr-2" />
              Pending <span className="ml-1 font-semibold">25%</span>
            </div>
            <div className="flex items-center pl-4">
              <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-chart-red))] mr-2" />
              Denied <span className="ml-1 font-semibold">10%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Collection Goal */}
      <Card className="rounded-xl w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-[15px] font-semibold text-[hsl(var(--foreground))]">
            Weekly Collection Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 pt-2">
          <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mb-2">
            Progress
          </p>
          <div className="flex justify-between text-sm sm:text-[15px] font-medium text-[hsl(var(--foreground))] mb-2">
            <span>$18,450</span>
            <span>$25,000</span>
          </div>
          <Progress
            value={74}
            className="h-[6px] bg-[hsl(var(--muted))] [&>*]:bg-[hsl(var(--color-brand-teal))] rounded-full"
          />
          <div className="flex justify-end mt-2 text-xs sm:text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">74% completed</span>
          </div>
          <span className="text-[hsl(var(--color-brand-teal))] text-xs sm:text-sm font-medium">
            +8% vs last week
          </span>
        </CardContent>
      </Card>
    </div>
  );
}