"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Trash2,
  X,
  Clock,
  CalendarIcon,
  ArrowLeft,
} from "lucide-react";
import { appointmentService } from "@/lib/api/services/appointmentService";
import type { DoctorAppointment } from "@/lib/api/services/appointmentService";

interface Props {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onSaved: () => void;
  onError: (msg: string) => void;
    setShowPatientDetails: () => void;
}

const timeSlots = [
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function EditAppointmentModal({
  open,
  onClose,
  appointment,
  onSaved,
  onError,
  setShowPatientDetails,
}: Props) {
  /* ------- state ------- */
  const [step, setStep] = useState<"edit" | "calendar" | "slots">("edit");
  const [patientName, setPatientName] = useState(
    appointment?.patientName || (typeof appointment?.patient === 'object' ? appointment.patient?.name : '') || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    appointment ? new Date(appointment.dateTime) : undefined
  );
  const [selectedSlot, setSelectedSlot] = useState(
    formatTimeSlot(appointment?.dateTime || "")
  );
  const [calendarMonth, setCalendarMonth] = useState(
    appointment ? new Date(appointment.dateTime) : new Date()
  );
  const [status, setStatus] = useState<"scheduled" | "completed" | "cancelled">(
    (appointment?.status as "scheduled" | "completed" | "cancelled") || "scheduled"
  );

  /* ------- helpers ------- */
  function formatTimeSlot(dt: string | undefined): string {
    if (!dt) return "";
    const d = new Date(dt);
    const h = d.getHours();
    const m = d.getMinutes();
    const period = h >= 12 ? "PM" : "AM";
    const hh = (h % 12 || 12).toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm} ${period}`;
  }

  function buildISO(date: Date, slot: string): string {
    const [time, period] = slot.split(" ");
    const [hh, mm] = time.split(":").map(Number);
    const h24 = period === "PM" && hh !== 12 ? hh + 12 : period === "AM" && hh === 12 ? 0 : hh;
    const d = new Date(date);
    d.setHours(h24, mm, 0, 0);
    return d.toISOString();
  }

  /* ------- calendar grid ------- */
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
    const days: { date: number; isCurrent: boolean; fullDate: Date }[] = [];

    // prev month tail
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month, -startOffset + i + 1);
      days.push({ date: d.getDate(), isCurrent: false, fullDate: d });
    }
    // current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: d, isCurrent: true, fullDate: new Date(year, month, d) });
    }
    // next month head
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d.getDate(), isCurrent: false, fullDate: d });
    }
    return days;
  }, [calendarMonth]);

  const navigateMonth = (dir: "prev" | "next") =>
    setCalendarMonth((prev) => {
      const n = new Date(prev);
      n.setMonth(prev.getMonth() + (dir === "prev" ? -1 : 1));
      return n;
    });

  /* ------- save ------- */
  const handleSave = async () => {
    if (!appointment?._id) {
      onError("Invalid appointment");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      onError("Please complete all steps");
      return;
    }
    try {
      const dateTime = buildISO(selectedDate, selectedSlot);
      const res = await appointmentService.updateAppointment(appointment._id, { dateTime, status });
      if (res.success) {
        onSaved();
        onClose();
        setShowPatientDetails(true)
      } else {
        onError(res.message || "Update failed");
      }
    } catch (e: any) {
      onError(e.message || "Network error");
    }
  };

  /* ----------  RENDER  ---------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!fixed top-0 right-0 h-full w-full sm:w-[400px] max-w-none overflow-y-auto
                   bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700
                   p-0 shadow-xl rounded-none"
        style={{ left: "auto", transform: "none" }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {/* step indicator */}
          <div className="flex items-center gap-2">
            {step !== "edit" && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setStep(step === "slots" ? "calendar" : "edit")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {step === "edit" && "Edit Details"}
              {step === "calendar" && "Select Date"}
              {step === "slots" && "Select Time Slot"}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
              onClick={onClose}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 flex-1">
          {/* ---------- 1. EDIT DETAILS ---------- */}
          {step === "edit" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Patient Name
                </label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="Emma Wilson"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Date & Time
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{patientName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    GMT + 05:00 Asia/Karachi (PKT)
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</div>
                      <button
                        onClick={() => setStep("calendar")}
                        className="font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 text-left"
                      >
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Select date"}
                      </button>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Slot</div>
                      <button
                        onClick={() => setStep("slots")}
                        className="font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 text-left"
                      >
                        {selectedSlot || "Select slot"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Update Status:
                </label>
                <Select
                  value={status}
                  onValueChange={(v: string) =>
                    setStatus(v as "scheduled" | "completed" | "cancelled")
                  }
                >
                  <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <SelectItem value="scheduled" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">Scheduled</SelectItem>
                    <SelectItem value="completed"  className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">Completed</SelectItem>
                    <SelectItem value="cancelled"  className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ---------- 2. CALENDAR VIEW ---------- */}
          {step === "calendar" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                </button>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </h3>
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4 text-gray-900 dark:text-white" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="p-1 text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const isSelected =
                    day.isCurrent &&
                    selectedDate?.getDate() === day.date &&
                    selectedDate?.getMonth() === calendarMonth.getMonth() &&
                    selectedDate?.getFullYear() === calendarMonth.getFullYear();

                  const isAvailable = day.isCurrent; // TODO: plug real availability

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isAvailable) return;
                        setSelectedDate(day.fullDate);
                        setStep("slots");
                      }}
                      disabled={!isAvailable}
                      className={cn(
                        "p-2 text-sm rounded transition-colors",
                        isSelected
                          ? "bg-teal-600 text-white"
                          : isAvailable
                          ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      )}
                    >
                      {day.date}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ---------- 3. TIME-SLOT PICKER ---------- */}
          {step === "slots" && (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors",
                      selectedSlot === slot
                        ? "bg-teal-600 text-white border-teal-600"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {step === "edit" && (
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
          {step === "calendar" && (
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => setStep("slots")}
              disabled={!selectedDate}
            >
              Next
            </Button>
          )}
          {step === "slots" && (
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}