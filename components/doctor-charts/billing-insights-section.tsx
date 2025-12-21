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
        <h2 className="text-xl font-semibold text-foreground">Billing Insights</h2>
        <Button className="bg-[#1DA68F] text-white hover:bg-teal-700 transition-colors flex items-center gap-2 rounded-lg">
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
          iconBgColor="bg-red-50 dark:bg-red-900/20"
          iconColor="text-red-600 dark:text-red-400"
          chartData={pendingBillsData}
          chartColor="hsl(var(--custom-dashboard-green-DEFAULT))" // Green
        />
        <BillingInsightCard
          title="Insurance Claims"
          value="$8,320"
          count={15}
          change="-2%"
          changeType="negative"
          icon={<FileText />}
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          chartData={insuranceClaimsData}
          chartColor="hsl(var(--custom-dashboard-red-DEFAULT))" // Red
        />
        <BillingInsightCard
          title="Co-Pay Collected"
          value="$3,890"
          count={45}
          change="+8%"
          changeType="positive"
          icon={<DollarSign />}
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
          chartData={coPayCollectedData}
          chartColor="hsl(var(--custom-dashboard-green-DEFAULT))" // Green
        />
        <BillingInsightCard
          title="Pending Co-Pay"
          value="$1,250"
          count={8}
          change="-2%"
          changeType="negative"
          icon={<CreditCard />}
          iconBgColor="bg-orange-50 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
          chartData={pendingCoPayData}
          chartColor="hsl(var(--custom-dashboard-red-DEFAULT))" // Red
        />
      </div>
    </div>
  );
}
