import {  Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { CalendarIcon, Clock } from "lucide-react"
import { AppointmentDetails } from "./types"

interface Props {
  details: AppointmentDetails
  onReschedule: () => void
  onCancel: () => void
}

export default function ConfirmStep({ details, onReschedule, onCancel }: Props) {
  return (
    <div className="text-center space-y-6 w-full">
      <div className="flex flex-col items-center">
        <img src="/card-checkmark.png" alt="Payment Success" className="mb-4 w-30 h-30 object-contain" />
        <h2 className="text-2xl font-bold mb-1">Thank You!</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Payment done Successfully</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] px-4 max-w-sm">
          The Following Item is being booked if you want to cancel or reschedule your appointment, kindly click below.
        </p>
      </div>

      <Card className="p-4 text-left border-[hsl(var(--color-brand-teal))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal))/0.1]">
        <div className="font-medium mb-3 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{details.type}</div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]">
          <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" />{details.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{details.time}</span>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11" onClick={onReschedule}>Reschedule</Button>
        <Button variant="outline" className="flex-1 h-11" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}