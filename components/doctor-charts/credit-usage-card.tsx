import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StackedBarChart } from "./stacked-bar-chart"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function CreditUsageCard() {
  const creditUsageData = [
    { name: "Week 1", voiceToText: 6, aiSummary: 3, textAnalysis: 2 },
    { name: "Week 2", voiceToText: 8, aiSummary: 4, textAnalysis: 3 },
    { name: "Week 3", voiceToText: 5, aiSummary: 2, textAnalysis: 1 },
    { name: "Week 4", voiceToText: 10, aiSummary: 5, textAnalysis: 4 },
  ]

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Credit Usage & Savings
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
            >
              Weekly <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Weekly</DropdownMenuItem>
            <DropdownMenuItem>Monthly</DropdownMenuItem>
            <DropdownMenuItem>Quarterly</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <StackedBarChart
          data={creditUsageData}
          voiceToTextColor="hsl(var(--color-brand-teal))"
          aiSummaryColor="hsl(var(--custom-dashboard-blue-DEFAULT))"
          textAnalysisColor="hsl(var(--color-status-warning))"
        />
        <div className="flex justify-center gap-6 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-brand-teal))] mr-2" /> Voice-to-Text
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--custom-dashboard-blue-DEFAULT))] mr-2" /> AI Summary
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-status-warning))] mr-2" /> Text Analysis
          </div>
        </div>
      </CardContent>
    </Card>
  )
}