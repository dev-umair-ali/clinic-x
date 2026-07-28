"use client";

import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentActivity({
  dashboardData,
  title = "Recent Activity",
}: {
  dashboardData?: any;
  title?: string;
}) {
  const items = Array.isArray(dashboardData) ? dashboardData : [];

  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-status-success)/0.12)]">
            <Activity className="h-4 w-4 text-[hsl(var(--color-status-success))]" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg text-[hsl(var(--foreground))]">
              {title}
            </CardTitle>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Live operational feed
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-3">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[hsl(var(--color-brand-teal)/0.5)] to-transparent" />
          {items.length === 0 && (
            <p className="text-sm text-[hsl(var(--muted-foreground))] pl-10">
              No recent activity
            </p>
          )}
          {items.map((activity: any, index: number) => {
            const action = activity.action || activity.description || "Update";
            const entity = activity.entityType || activity.entityName || "";
            const actor =
              activity.actorName ||
              activity.actionBy ||
              activity.actorUser?.firstName ||
              "System";
            return (
              <div
                key={index}
                className="relative flex items-start gap-3 rounded-xl border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--muted)/0.35)] p-3 pl-3 transition hover:border-[hsl(var(--color-brand-teal)/0.35)] hover:bg-[hsl(var(--color-brand-teal)/0.06)]"
              >
                <div className="relative z-10 mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-brand-teal))] ring-4 ring-[hsl(var(--card))]" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {typeof action === "string"
                      ? action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()
                      : action}
                    {entity ? (
                      <span className="text-[hsl(var(--muted-foreground))] font-normal">
                        {" "}
                        · {String(entity)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                    {actor}
                    {activity.timeAgo ? ` · ${activity.timeAgo}` : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
