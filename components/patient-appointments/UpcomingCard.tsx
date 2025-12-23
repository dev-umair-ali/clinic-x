"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onReschedule: () => void;
  onCancel: () => void;
}

export default function UpcomingCard({ onReschedule, onCancel }: Props) {
  return (
    <Card className="bg-[hsl(var(--card))] shadow-sm h-full border border-[hsl(var(--border))]">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Upcoming Appointment
          </h2>
        </div>

        <div className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg flex-1">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-1">
                Annual Physical Exam
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-2">
                Dr. Sarah Smith - Internal Medicine
              </p>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">
                July 30, 2024 at 4:00 PM
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[hsl(var(--color-status-success-light))] text-[hsl(var(--color-status-success))] dark:bg-[hsl(var(--color-status-success)/0.2)] dark:text-[hsl(var(--color-status-success))]">
                Confirmed
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onReschedule}
              variant="outline"
              className="text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] bg-transparent"
            >
              Reschedule
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}