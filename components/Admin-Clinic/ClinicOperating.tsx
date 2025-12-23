"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface ClinicOperatingProps {
  data: {
    openingTime: string
    closingTime: string
    workingDays: string[]
  }
  onChange: (field: string, val: string) => void
  onToggleDay: (day: string) => void
}

export default function ClinicOperating({ data, onChange, onToggleDay }: ClinicOperatingProps) {
  return (
    <Card className="border-[hsl(var(--border))] shadow-sm">
      <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
          <Clock className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
          Operating Hours
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-[hsl(var(--card))]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="openingTime" className="text-[hsl(var(--foreground))]">
              Opening Time <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="openingTime"
              type="time"
              value={data.openingTime}
              onChange={(e) => onChange("openingTime", e.target.value)}
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closingTime" className="text-[hsl(var(--foreground))]">
              Closing Time <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="closingTime"
              type="time"
              value={data.closingTime}
              onChange={(e) => onChange("closingTime", e.target.value)}
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              required
            />
          </div>
        </div>

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
      </CardContent>
    </Card>
  )
}