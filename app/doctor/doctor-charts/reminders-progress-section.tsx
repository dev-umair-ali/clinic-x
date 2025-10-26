import { TaskRemindersCard } from "./task-reminder-card"
import { ProgressTrackingCard } from "./progress-tracking-card"

export function RemindersProgressSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TaskRemindersCard />
      <div className="space-y-6">
        <ProgressTrackingCard
          title="Medication Adherence"
          value="82%"
          description="You've taken 23 out of 28 scheduled doses this month"
          progress={82}
          gradient="linear-gradient(96.13deg, #2463EA 3.57%, #1D4ED9 99.36%)"
        />
        <ProgressTrackingCard
          title="Refill Tracking"
          value="3/8"
          description="You've refilled 3 out of 8 active prescriptions this month"
          progress={(3 / 8) * 100}
          gradient="linear-gradient(94.25deg, #126A5C 0%, #1DA68F 100%)"
        />
      </div>
    </div>
  )
}
