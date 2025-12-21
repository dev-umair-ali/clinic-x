"use client";
import { Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  viewMode: "calendar" | "list";
  setViewMode: (v: "calendar" | "list") => void;
}

export default function ViewToggleBar({ viewMode, setViewMode }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === "calendar" ? "default" : "outline"}
        onClick={() => setViewMode("calendar")}
        className={`flex items-center gap-2 ${
          viewMode === "calendar"
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        }`}
      >
        <Calendar className="h-4 w-4" /> Calendar View
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        onClick={() => setViewMode("list")}
        className={`flex items-center gap-2 ${
          viewMode === "list"
            ? "bg-[#1DA68F] text-white hover:bg-[#168f73]"
            : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        }`}
      >
        <List className="h-4 w-4" /> Appointment List View
      </Button>
    </div>
  );
}