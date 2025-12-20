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
  type: "appointment" | "follow-up" | "consultation" | "check-up"; // Added check-up
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
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
              className="text-center text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
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
                  className="min-h-[80px] p-2 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                ></div>
              );
            }

            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border border-gray-100 dark:border-gray-700 ${
                  isCurrentMonth
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-900"
                } ${
                  isCurrentDay
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : ""
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-600"
                  } ${isCurrentDay ? "text-blue-600 dark:text-blue-400" : ""}`}
                >
                  {format(day, "d")}
                </div>
                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded text-white ${
                        event.type === "appointment"
                          ? "bg-blue-500 dark:bg-blue-600"
                          : event.type === "follow-up"
                          ? "bg-green-500 dark:bg-green-600"
                          : event.type === "consultation"
                          ? "bg-purple-500 dark:bg-purple-600"
                          : "bg-orange-500 dark:bg-orange-600" // For 'check-up' or other types
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
