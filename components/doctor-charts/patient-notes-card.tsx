import { Card, CardContent } from "@/components/ui/card"
import { BarChartGrouped } from "./bar-chart-grouped"

import { DoctorDashboardData } from "@/lib/api/services/dashboardService"

export function PatientNotesCard( { dashboardData }: { dashboardData: DoctorDashboardData["patientNotesGraph"] | null }) {
  return (
    <Card className="shadow-sm">
      <CardContent>
        <BarChartGrouped
          data={dashboardData || []}
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