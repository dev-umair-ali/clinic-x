import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileAudio } from "lucide-react";
import { BarChartGrouped } from "./bar-chart-grouped";
import { DoctorDashboardData } from "@/lib/api/services/dashboardService";

export function PatientNotesCard({
  dashboardData,
}: {
  dashboardData: DoctorDashboardData["patientNotesGraph"] | null;
}) {
  return (
    <Card className="rounded-2xl border border-[hsl(var(--border))] shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--color-brand-teal)/0.12)]">
            <FileAudio className="h-4 w-4 text-[hsl(var(--color-brand-teal))]" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg">Patient Notes Mix</CardTitle>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Voice vs manual documentation by patient
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <BarChartGrouped
          data={dashboardData || []}
          voiceNotesColor="hsl(var(--color-brand-teal))"
          manualNotesColor="hsl(var(--color-chart-blue))"
        />
        <div className="flex justify-center gap-6 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-brand-teal))] mr-2" />
            Voice Notes
          </div>
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--color-chart-blue))] mr-2" />
            Manual Notes
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
