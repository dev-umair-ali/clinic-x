"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface BillingInsightCardProps {
  title: string;
  value: string;
  count: number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  chartData: { name: string; value: number }[];
  chartColor: string;
}

// Helper to generate SVG path for sparkline
const generateSparklinePath = (data: { name: string; value: number }[], width: number, height: number) => {
  if (data.length < 2) return "";
  
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const xRatio = width / (data.length - 1);
  const yRatio = height / (maxVal - minVal || 1); // Avoid division by zero

  const points = data.map((d, i) => {
    const x = i * xRatio;
    const y = height - (d.value - minVal) * yRatio;
    return `${x},${y}`;
  }).join(" ");

  return `M${points}`;
};

export function BillingInsightCard({
  title,
  value,
  count,
  change,
  changeType,
  icon,
  iconBgColor,
  iconColor,
  chartData,
  chartColor,
}: BillingInsightCardProps) {
  const TrendIcon = changeType === "positive" ? ArrowUp : ArrowDown;
  const trendTextColorClass = changeType === "positive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  const trendBgColorClass = changeType === "positive" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20";

  const sparklineHeight = 24; // Fixed height for the sparkline SVG
  const sparklineWidth = 60; // Fixed width for the sparkline SVG

  return (
    <Card className="shadow-sm border border-border rounded-2xl">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}>
            {React.cloneElement(icon as React.ReactElement, { className: `h-5 w-5 ${iconColor}` })}
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${trendTextColorClass} ${trendBgColorClass} px-2 py-0.5 rounded-full`}>
            <TrendIcon className="h-3 w-3" />
            <span>{change}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold text-foreground leading-none">
          {value} <span className="text-xs font-normal text-muted-foreground ml-1">({count})</span>
        </div>
        <div className="flex justify-end pr-1">
          <svg width={sparklineWidth} height={sparklineHeight} viewBox={`0 0 ${sparklineWidth} ${sparklineHeight}`}>
            <path
              d={generateSparklinePath(chartData, sparklineWidth, sparklineHeight)}
              fill="none"
              stroke={chartColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
