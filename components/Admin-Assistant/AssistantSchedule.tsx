"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface Props {
  data: {
    workingDays: string[]
    shiftStart: string
    shiftEnd: string
  }
  onChange: (field: string, val: string) => void
  onToggleDay: (day: string) => void
}

export default function AssistantSchedule({ data, onChange, onToggleDay }: Props) {
  return (
    <Card className="border-[hsl(var(--border))] shadow-sm">
      <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
          <Clock className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
          Work Schedule
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-[hsl(var(--card))]">
        <div className="space-y-6">
          <div>
            <Label className="text-[hsl(var(--foreground))] mb-3 block">
              Working Days <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => onToggleDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    data.workingDays.includes(day)
                      ? "bg-[hsl(var(--color-brand-teal))] text-white"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shiftStart" className="text-[hsl(var(--foreground))]">
                Shift Start Time
              </Label>
              <Input
                id="shiftStart"
                type="time"
                value={data.shiftStart}
                onChange={(e) => onChange("shiftStart", e.target.value)}
                className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shiftEnd" className="text-[hsl(var(--foreground))]">
                Shift End Time
              </Label>
              <Input
                id="shiftEnd"
                type="time"
                value={data.shiftEnd}
                onChange={(e) => onChange("shiftEnd", e.target.value)}
                className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}