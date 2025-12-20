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
          setViewMode("calendar");
          onCalendar();
        }}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex-1 sm:flex-none justify-center ${
          viewMode === "calendar"
            ? "bg-card text-foreground border-border"
            : "bg-card text-muted-foreground border-border hover:bg-muted/50"
        }`}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Calendar View</span>
        <span className="sm:hidden">Calendar</span>
      </button>
      <button
        onClick={() => {
          setViewMode("list");
          onList();
        }}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex-1 sm:flex-none justify-center ${
          viewMode === "list"
            ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700"
            : "bg-card text-muted-foreground border-border hover:bg-muted/50"
        }`}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">Appointment List View</span>
        <span className="sm:hidden">List View</span>
      </button>
    </div>
  );
}