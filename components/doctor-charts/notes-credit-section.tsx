import { PatientNotesCard } from "./patient-notes-card";
import { DoctorVisitVolumeCard } from "./doctor-visit-volume-card";
import { DoctorDashboardData } from "@/lib/api/services/dashboardService";

export function NotesCreditSection({
  dashboardData,
  visitVolume,
}: {
  dashboardData: DoctorDashboardData["patientNotesGraph"] | null;
  visitVolume?: { day: string; visits: number; followUps?: number }[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PatientNotesCard dashboardData={dashboardData} />
      <DoctorVisitVolumeCard data={visitVolume} />
    </div>
  );
}
