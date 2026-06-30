import { PatientNotesCard } from "./patient-notes-card"
import { DoctorDashboardData } from "@/lib/api/services/dashboardService"

export function NotesCreditSection( { dashboardData }: { dashboardData: DoctorDashboardData["patientNotesGraph"] | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PatientNotesCard dashboardData={dashboardData} />
    </div>
  )
}
