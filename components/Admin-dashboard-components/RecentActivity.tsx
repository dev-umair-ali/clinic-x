"use client"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentActivity() {
  return (
    <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <CardTitle className="text-base sm:text-lg dark:text-white">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  Dr. Sarah Johnson onboarded to Downtown Clinic
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">2 hours ago</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}