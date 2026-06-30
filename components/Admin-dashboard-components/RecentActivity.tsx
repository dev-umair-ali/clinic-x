"use client"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentActivity( { dashboardData }: { dashboardData?: any }) {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
          <CardTitle className="text-base sm:text-lg dark:text-[hsl(var(--color-foreground))]">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboardData && dashboardData
            .map((activity: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[hsl(var(--color-accent)/0.5)] dark:bg-[hsl(var(--color-accent)/0.3)] rounded-lg"
              >
                <div className="w-2 h-2 bg-[hsl(var(--color-status-success))] rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[hsl(var(--color-foreground))] text-sm sm:text-base">
                  {activity.action?.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())} {activity.entityType?.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())} By {activity.actionBy}
                  </div>
                  <div className="text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))]">
                    {activity.timeAgo}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}