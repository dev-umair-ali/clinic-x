"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  getDay, 
} from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "appointment" | "follow-up" | "consultation" | "check-up";
}

interface CalendarViewProps {
  events?: CalendarEvent[];
}

export function CalendarView({ events = [] }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate padding days for the start of the month to align with the first day of the week (Monday)
  const firstDayOfMonth = getDay(monthStart); // Sunday is 0, Monday is 1
  const startPaddingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
  const allDays: (Date | null)[] = [
    ...Array.from({ length: startPaddingDays }, () => null),
    ...(daysInMonth as Date[]), 
  ];

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        format(new Date(event.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  const weekDays = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];

  return (
    <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))]">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-[hsl(var(--muted))] rounded"
          >
            <ChevronLeft className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-[hsl(var(--muted))] rounded"
          >
            <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
        <select className="px-3 py-1 border border-[hsl(var(--border))] rounded text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 sm:p-4 overflow-x-auto">
        {/* Week Days Header */}
        <div className="min-w-[560px] sm:min-w-0 grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] sm:text-xs font-medium text-[hsl(var(--muted-foreground))] py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="min-w-[560px] sm:min-w-0 grid grid-cols-7 gap-1">
          {allDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[80px] p-2 border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]"
                ></div>
              );
            }

            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border border-[hsl(var(--border))] ${
                  isCurrentMonth
                    ? "bg-[hsl(var(--card))]"
                    : "bg-[hsl(var(--muted)/0.5)]"
                } ${
                  isCurrentDay
                    ? "bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] border-[hsl(var(--color-chart-blue)/0.3)] dark:border-[hsl(var(--color-chart-blue)/0.4)]"
                    : ""
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth
                      ? "text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted-foreground))]"
                  } ${isCurrentDay ? "text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]" : ""}`}
                >
                  {format(day, "d")}
                </div>
                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded text-[hsl(var(--primary-foreground))] ${
                        event.type === "appointment"
                          ? "bg-[hsl(var(--color-chart-blue))]"
                          : event.type === "follow-up"
                          ? "bg-[hsl(var(--color-status-success))]"
                          : event.type === "consultation"
                          ? "bg-[hsl(var(--color-chart-purple))]"
                          : "bg-[hsl(var(--color-chart-orange))]"
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}