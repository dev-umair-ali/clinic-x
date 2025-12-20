"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  DoctorAppointment,
  appointmentService,
} from "@/lib/api/services/appointmentService";

const timeSlots = [
  "01:00 PM - 02:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Day {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

function getDaysInMonth(date: Date): Day[] {
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
    days.push({
      date: d,
      isCurrentMonth: true,
      fullDate: new Date(y, m, d),
    });
  }

  const rem = 42 - days.length;
  for (let i = 1; i <= rem; i++) {
    const d = new Date(y, m + 1, i);
    days.push({ date: i, isCurrentMonth: false, fullDate: d });
  }

  return days;
}

export default function EditAppointmentModal({
  open,
  setOpen,
  appointment,
  onSaved,
  onError,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  appointment: DoctorAppointment | null;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [patientName, setPatientName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // ✅ FIXED: Safe patient name resolution (NO TypeScript error)
  if (open && appointment) {
    const resolvedPatientName =
      appointment.patientName ||
      (typeof appointment.patient === "object"
        ? appointment.patient.name
        : "");

    if (patientName !== resolvedPatientName) {
      setPatientName(resolvedPatientName);

      const dt = new Date(appointment.dateTime);
      setSelectedDate(dt);
      setCalendarMonth(dt);

      const hrs = dt.getHours();
      const mins = dt.getMinutes();
      const period = hrs >= 12 ? "PM" : "AM";
      const h12 = hrs % 12 || 12;

      const slot = `${h12.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")} ${period}`;

      setSelectedTimeSlot(slot);
    }
  }

  if (!appointment) return null;

  const navMonth = (dir: "prev" | "next") =>
    setCalendarMonth((prev) => {
      const n = new Date(prev);
      n.setMonth(prev.getMonth() + (dir === "prev" ? -1 : 1));
      return n;
    });

  const days = getDaysInMonth(calendarMonth);

  const handleSave = async () => {
    if (!appointment._id) return onError("Invalid appointment");
    if (!selectedTimeSlot) return onError("Select a time slot");

    const dateTime = new Date(selectedDate);
    const [time, period] = selectedTimeSlot.split(" ");
    const [h, m] = time.split(":");

    let hr = parseInt(h);
    if (period === "PM" && hr !== 12) hr += 12;
    if (period === "AM" && hr === 12) hr = 0;

    dateTime.setHours(hr, parseInt(m), 0, 0);

    try {
      const res = await appointmentService.updateAppointment(
        appointment._id,
        { dateTime: dateTime.toISOString() }
      );

      if (res && res.success) {
        setOpen(false);
        onSaved();
      } else {
        throw new Error(res?.message || "Update failed");
      }
    } catch (e: any) {
      onError(e.message || "Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          !fixed top-0 right-0 h-full
          w-full sm:w-[400px] max-w-full sm:max-w-[400px]
          overflow-y-auto p-0
          bg-white dark:bg-gray-900
          border-l border-gray-200 dark:border-gray-700
          shadow-lg rounded-none
          transition-transform duration-300
          translate-x-0 data-[state=closed]:translate-x-full
        "
        style={{ transform: "none", left: "auto" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Patient Name
            </label>
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Available Time Slots
            </label>
            <Select
              value={selectedTimeSlot}
              onValueChange={setSelectedTimeSlot}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
