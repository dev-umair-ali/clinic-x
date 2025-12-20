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
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Clock className="h-5 w-5 text-[#1DA68F]" />
          Work Schedule
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mb-3 block">
              Working Days <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => onToggleDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    data.workingDays.includes(day)
                      ? "bg-[#1DA68F] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shiftStart" className="text-gray-700 dark:text-gray-300">
                Shift Start Time
              </Label>
              <Input
                id="shiftStart"
                type="time"
                value={data.shiftStart}
                onChange={(e) => onChange("shiftStart", e.target.value)}
                className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shiftEnd" className="text-gray-700 dark:text-gray-300">
                Shift End Time
              </Label>
              <Input
                id="shiftEnd"
                type="time"
                value={data.shiftEnd}
                onChange={(e) => onChange("shiftEnd", e.target.value)}
                className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}