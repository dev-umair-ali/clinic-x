import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { SparklineChart } from "./sparkline-chart"

interface StatsCardProps {
  title: string
  value: string | number
  change: string
  changeType: "positive" | "negative"
  icon: React.ReactNode
  color: string
  chartData: { name: string; value: number }[]
  chartColor: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  chartData,
  chartColor,
}: StatsCardProps) {
  const ChangeIcon = changeType === "positive" ? ArrowUpRight : ArrowDownRight
  const changeColorClass = changeType === "positive" ? "text-custom-dashboard-green-DEFAULT" : "text-custom-dashboard-red-DEFAULT"

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-custom-dashboard-gray-500">{title}</CardTitle>
        <div className={cn("rounded-full p-2 text-white", color.startsWith('bg-') ? color : `bg-custom-${color}`)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-custom-dashboard-gray-900">{value}</div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-xs">
            <ChangeIcon className={cn("h-4 w-4", changeColorClass)} />
            <span className={cn("font-medium", changeColorClass)}>{change}</span>
            <span className="text-custom-dashboard-gray-500 ml-1">vs. last week</span>
          </div>
          <div className="h-10 w-20">
            <SparklineChart data={chartData} color={chartColor.startsWith('bg-') ? chartColor : `bg-custom-${chartColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
