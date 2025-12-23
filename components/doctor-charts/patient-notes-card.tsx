import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChartGrouped } from "./bar-chart-grouped"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function PatientNotesCard() {
  const patientNotesData = [
    { name: "Mon", voiceNotes: 8, manualNotes: 6 },
    { name: "Tue", voiceNotes: 12, manualNotes: 8 },
    { name: "Wed", voiceNotes: 6, manualNotes: 8 },
    { name: "Thu", voiceNotes: 15, manualNotes: 10 },
    { name: "Fri", voiceNotes: 9, manualNotes: 7 },
    { name: "Sat", voiceNotes: 14, manualNotes: 10 },
    { name: "Sun", voiceNotes: 7, manualNotes: 5 },
  ]

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Patient Notes
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
        <BarChartGrouped
          data={patientNotesData}
          voiceNotesColor="hsl(var(--color-brand-teal))"
          manualNotesColor="hsl(var(--custom-dashboard-blue-DEFAULT))"
        />
        <div className="flex justify-center gap-6 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-brand-teal))] mr-2" /> Voice Notes
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--custom-dashboard-blue-DEFAULT))] mr-2" /> Manual Notes
          </div>
        </div>
      </CardContent>
    </Card>
  )
}