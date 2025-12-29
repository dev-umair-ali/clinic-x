"use client";
import { Clock, CheckCircle, FileText } from "lucide-react";

export default function StatsCards({
  data,
}: {
  data: Array<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {data.map((stat, idx) => (
        <div
          key={idx}
          className="bg-[hsl(var(--card))] rounded-lg p-4 sm:p-6 shadow-sm border border-[hsl(var(--border))]"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mb-1 truncate">
                {stat.title}
              </p>
              <p className="text-lg sm:text-2xl font-bold text-[hsl(var(--foreground))]">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}