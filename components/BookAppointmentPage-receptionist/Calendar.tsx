"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"

interface Props {
  selectedDate: Date | undefined
  onDateSelect: (d: Date) => void
}

export default function Calendar({ selectedDate, onDateSelect }: Props) {
  const [current, setCurrent] = useState(new Date())
  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const weekDays   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

  return (
    <div className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrent(subMonths(current,1))} className="p-1 hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50 rounded">
          <ChevronLeft className="w-4 h-4 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
        </button>
        <h3 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{format(current,"MMM yyyy")}</h3>
        <button onClick={() => setCurrent(addMonths(current,1))} className="p-1 hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50 rounded">
          <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-center py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const selected = selectedDate && isSameDay(day, selectedDate)
          const today    = isToday(day)
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                h-8 w-8 text-sm rounded-full flex items-center justify-center transition
                ${selected ? "bg-[hsl(var(--color-brand-teal))] text-white" :
                  today   ? "bg-[hsl(var(--color-chart-blue))/0.1] text-[hsl(var(--color-chart-blue))] dark:bg-[hsl(var(--color-chart-blue))/0.1] dark:text-[hsl(var(--color-chart-blue))]" :
                            "hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"}
              `}
            >
              {format(day,"d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}