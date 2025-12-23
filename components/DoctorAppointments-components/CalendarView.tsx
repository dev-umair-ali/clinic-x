"use client";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "follow-up" | "consultation" | "check-up";
}

interface Day {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

export default function CalendarView({
  currentMonth,
  setCurrentMonth,
  calendarEvents,
}: {
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  calendarEvents: CalendarEvent[];
}) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (date: Date): Day[] => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startOffset = first.getDay();
    const days: Day[] = [];

    for (let i = 0; i < startOffset; i++) {
      const d = new Date(y, m, -startOffset + i + 1);
      days.push({ date: d.getDate(), isCurrentMonth: false, fullDate: d });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: d, isCurrentMonth: true, fullDate: new Date(y, m, d) });
    }
    const rem = 42 - days.length;
    for (let i = 1; i <= rem; i++) {
      const d = new Date(y, m + 1, i);
      days.push({ date: i, isCurrentMonth: false, fullDate: d });
    }
    return days;
  };

  const navigate = (dir: "prev" | "next") => {
    const n = new Date(currentMonth);
    n.setMonth(currentMonth.getMonth() + (dir === "prev" ? -1 : 1));
    setCurrentMonth(n);
  };

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  return (
    <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]">
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate("prev")}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--foreground))]">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => navigate("next")}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-[hsl(var(--muted-foreground))]">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dayStr = day.fullDate.toISOString().split("T")[0];
            const evts = calendarEvents.filter((e) => e.date === dayStr);
            return (
              <div
                key={idx}
                className={`p-1 sm:p-2 h-16 sm:h-20 border border-[hsl(var(--border))] ${
                  day.isCurrentMonth ? "bg-[hsl(var(--card))]" : "bg-[hsl(var(--muted)/0.5)]"
                } relative cursor-pointer hover:bg-[hsl(var(--muted)/0.5)] transition-colors`}
              >
                <span
                  className={`text-xs sm:text-sm ${
                    day.isCurrentMonth ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  {day.date}
                </span>
                {evts.length > 0 && day.isCurrentMonth && (
                  <div className="mt-1 space-y-1">
                    {evts.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          e.type === "follow-up"
                            ? "bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.3)] text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]"
                            : e.type === "consultation"
                            ? "bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.3)] text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]"
                            : "bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.3)] text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"
                        }`}
                      >
                        {e.title.split(" - ")[1] || e.type}
                      </div>
                    ))}
                    {evts.length > 2 && (
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">+{evts.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}