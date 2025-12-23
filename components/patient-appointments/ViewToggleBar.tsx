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
            ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]"
            : "text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))]"
        }`}
      >
        <Calendar className="h-4 w-4" /> Calendar View
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        onClick={() => setViewMode("list")}
        className={`flex items-center gap-2 ${
          viewMode === "list"
            ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal-dark))]"
            : "text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))]"
        }`}
      >
        <List className="h-4 w-4" /> Appointment List View
      </Button>
    </div>
  );
}