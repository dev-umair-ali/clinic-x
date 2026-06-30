import type React from "react";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AppointmentOverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  trendPercentage: string;
  trendType: "up" | "down";
  trendColor: string;
  barChartColor: string;
  onClick?: () => void;
}

export function AppointmentOverviewCard({
  title,
  value,
  icon,
  iconBgColor,
  trendPercentage,
  trendType,
  trendColor,
  barChartColor,
  onClick,
}: AppointmentOverviewCardProps) {
  const TrendIcon = trendType === "up" ? ArrowUp : ArrowDown;

  const barHeights = [
    "h-4",
    "h-6",
    "h-3",
    "h-7",
    "h-5",
    "h-8",
    "h-4",
    "h-6",
    "h-3",
    "h-7",
    "h-5",
    "h-8",
  ];

  return (
    <div
      className="bg-card rounded-xl p-4 shadow-sm border border-border cursor-pointer hover:shadow-md hover:bg-muted/50 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}
        >
          {icon}
        </div>
        <div className="flex items-end h-10 gap-0.5">
          {barHeights.map((height, i) => (
            <div key={i} className={`w-1 ${height} ${barChartColor} rounded-sm`}></div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {/* <TrendIcon className="w-4 h-4" /> */}
          {/* <span>{trendPercentage} vs. last week</span> */}
        </div>
      </div>
    </div>
  );
}
