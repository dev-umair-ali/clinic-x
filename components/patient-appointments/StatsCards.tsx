"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";

export default function StatsCards() {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <Card className="bg-[hsl(var(--card))] shadow-sm flex-1 border border-[hsl(var(--border))]">
        <CardContent className="p-4 h-full flex items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[hsl(var(--color-chart-blue)/0.1)] rounded-lg">
              <Clock className="h-5 w-5 text-[hsl(var(--color-chart-blue))]" />
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Total Visits This Year
              </p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">32</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[hsl(var(--card))] shadow-sm flex-1 border border-[hsl(var(--border))]">
        <CardContent className="p-4 h-full flex items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[hsl(var(--color-status-success-light))] rounded-lg">
              <DollarSign className="h-5 w-5 text-[hsl(var(--color-status-success))]" />
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Appointments Scheduled
              </p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">03</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}