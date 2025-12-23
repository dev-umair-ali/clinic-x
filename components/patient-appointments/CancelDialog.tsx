"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Appointment } from "@/lib/slices/appointmentSlice";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  appointment: Appointment | null;
  onConfirm: () => void;
}

export default function CancelDialog({ open, onOpenChange, appointment, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-xl max-w-lg mx-auto rounded-lg">
        <div className="p-3">
          <DialogHeader className="flex flex-row items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--color-status-error)/0.1)] rounded-full flex items-center justify-center" />
              <DialogTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
                Appointment Cancel
              </DialogTitle>
            </div>
          </DialogHeader>

          {appointment && (
            <div className="space-y-4">
              <div className="bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.1)] rounded-lg p-4">
                <h4 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                  {appointment.type}
                </h4>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mb-2">
                  Dr. {appointment.doctorName} - Internal Medicine
                </p>
                <p className="text-[hsl(var(--color-brand-teal))] text-sm font-medium">
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at {appointment.time}
                </p>
              </div>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">
                Are you sure you want to cancel this appointment?
              </p>
              <Button onClick={onConfirm} className="w-full bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-dark))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg font-medium">
                Yes, Cancel Appointment
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}