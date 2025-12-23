"use client";

import { Button } from "@/components/ui/button";
import { BillingInsightCard } from "./billing-insight-card";
import { FileText, DollarSign, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';

export function BillingInsightsSection() {
  const pendingBillsData = [
    { name: "Jan", value: 10 }, { name: "Feb", value: 12 }, { name: "Mar", value: 8 },
    { name: "Apr", value: 15 }, { name: "May", value: 11 }, { name: "Jun", value: 13 },
  ];

  const insuranceClaimsData = [
    { name: "Jan", value: 8 }, { name: "Feb", value: 7 }, { name: "Mar", value: 9 },
    { name: "Apr", value: 6 }, { name: "May", value: 10 }, { name: "Jun", value: 8 },
  ];

  const coPayCollectedData = [
    { name: "Jan", value: 5 }, { name: "Feb", value: 6 }, { name: "Mar", value: 4 },
    { name: "Apr", value: 7 }, { name: "May", value: 5 }, { name: "Jun", value: 6 },
  ];

  const pendingCoPayData = [
    { name: "Jan", value: 3 }, { name: "Feb", value: 2 }, { name: "Mar", value: 4 },
    { name: "Apr", value: 3 }, { name: "May", value: 2 }, { name: "Jun", value: 3 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">Billing Insights</h2>
        <Button className="bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal-dark))] transition-colors flex items-center gap-2 rounded-lg">
          View Bills <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BillingInsightCard
          title="Pending Bills"
          value="$12,450"
          count={23}
          change="+8%"
          changeType="positive"
          icon={<AlertCircle />}
          iconBgColor="bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)]"
          iconColor="text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]"
          chartData={pendingBillsData}
          chartColor="hsl(var(--custom-dashboard-green-DEFAULT))"
        />
        <BillingInsightCard
          title="Insurance Claims"
          value="$8,320"
          count={15}
          change="-2%"
          changeType="negative"
          icon={<FileText />}
          iconBgColor="bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)]"
          iconColor="text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]"
          chartData={insuranceClaimsData}
          chartColor="hsl(var(--custom-dashboard-red-DEFAULT))"
        />
        <BillingInsightCard
          title="Co-Pay Collected"
          value="$3,890"
          count={45}
          change="+8%"
          changeType="positive"
          icon={<DollarSign />}
          iconBgColor="bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.2)]"
          iconColor="text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"
          chartData={coPayCollectedData}
          chartColor="hsl(var(--custom-dashboard-green-DEFAULT))"
        />
        <BillingInsightCard
          title="Pending Co-Pay"
          value="$1,250"
          count={8}
          change="-2%"
          changeType="negative"
          icon={<CreditCard />}
          iconBgColor="bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.2)]"
          iconColor="text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]"
          chartData={pendingCoPayData}
          chartColor="hsl(var(--custom-dashboard-red-DEFAULT))"
        />
      </div>
    </div>
  );
}