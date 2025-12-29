"use client";
import { Calendar, List } from "lucide-react";

export default function ViewToggle({
  viewMode,
  setViewMode,
  onCalendar,
  onList,
}: {
  viewMode: "calendar" | "list";
  setViewMode: (v: "calendar" | "list") => void;
  onCalendar: () => void;
  onList: () => void;
}) {
  return (
    <div className="flex gap-2 sm:gap-4">
      <button
        onClick={() => {
          setViewMode("list");
          onList();
        }}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex-1 sm:flex-none justify-center ${
          viewMode === "list"
            ? "bg-[hsl(var(--color-brand-teal)/0.1)] dark:bg-[hsl(var(--color-brand-teal)/0.2)] text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal)/0.3)] dark:border-[hsl(var(--color-brand-teal)/0.4)]"
            : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
        }`}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">Appointment List View</span>
        <span className="sm:hidden">List View</span>
      </button>
      <button
        onClick={() => {
          setViewMode("calendar");
          onCalendar();
        }}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex-1 sm:flex-none justify-center ${
          viewMode === "calendar"
            ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
            : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
        }`}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Calendar View</span>
        <span className="sm:hidden">Calendar</span>
      </button>
    </div>
  );
}