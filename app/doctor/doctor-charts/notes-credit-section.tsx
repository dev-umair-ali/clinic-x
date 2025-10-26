import { PatientNotesCard } from "./patient-notes-card"
import { CreditUsageCard } from "./credit-usage-card"

export function NotesCreditSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PatientNotesCard />
      <CreditUsageCard />
    </div>
  )
}
