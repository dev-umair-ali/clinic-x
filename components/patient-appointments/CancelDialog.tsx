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
      <DialogContent className="bg-white dark:bg-gray-800 border-0 shadow-xl max-w-lg mx-auto rounded-lg">
        <div className="p-3">
          <DialogHeader className="flex flex-row items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" />
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Appointment Cancel
              </DialogTitle>
            </div>
          </DialogHeader>

          {appointment && (
            <div className="space-y-4">
              <div className="bg-[#D1F2EB] dark:bg-[#1DA68F]/10 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {appointment.type}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Dr. {appointment.doctorName} - Internal Medicine
                </p>
                <p className="text-[#1DA68F] text-sm font-medium">
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at {appointment.time}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Are you sure you want to cancel this appointment?
              </p>
              <Button onClick={onConfirm} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium">
                Yes, Cancel Appointment
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}