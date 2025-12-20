"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

export default function TimeFilter() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("Last 7 Days")
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)

  const handleSelect = (option: string) => {
    if (option === "Custom") {
      setShowCalendar(true)
    } else {
      setSelected(option)
      setShowCalendar(false)
      setOpen(false)
    }
  }

  return (
    <div className="flex justify-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            {selected}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" sideOffset={5} className="w-64 p-2">
          {!showCalendar && (
            <div className="space-y-1">
              {["Last 7 Days", "Last 20 Days", "Last 30 Days", "Last 90 Days", "Custom"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selected === opt ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {showCalendar && (
            <div className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={customDate}
                onSelect={(date) => {
                  setCustomDate(date)
                  if (date) {
                    setSelected(date.toDateString())
                    setShowCalendar(false)
                    setOpen(false)
                  }
                }}
                className="rounded-md border shadow-md w-full sm:w-auto"
                classNames={{ day_selected: "bg-[#1DA68F] text-white hover:bg-[#1DA68F]/90 focus:bg-[#1DA68F]/90" }}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}