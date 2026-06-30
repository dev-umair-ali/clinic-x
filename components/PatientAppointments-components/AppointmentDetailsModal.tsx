"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Clock,
  User,
  FileText,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchPatients } from "@/lib/slices/patientSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import { cn } from "@/lib/utils";
import { appointmentService } from "@/lib/api/services/appointmentService";
import { useToast } from "@/hooks/use-toast";
import {
  getAvailableTimeSlots,
  type TimeSlot,
  type DoctorAvailability,
} from "@/lib/utils/timeSlots";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DatePicker } from "../ui/date-picker";
import { Toaster } from "@/components/ui/toaster";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onSuccess?: () => void;
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: AppointmentDetailsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { toast } = useToast();
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const role = authUser?.role;

  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeZone, setTimeZone] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Emergency",
    "Check-up",
  ];

  const getAppointmentDate = () => {
    if (!appointment) return new Date();

    const dateValue = appointment.dateTime || appointment.date;
    if (!dateValue) return new Date();

    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const getDisplayTime = () => {
    if (!appointment) return "";

    if (appointment.time) {
      if (appointment.time.includes("AM") || appointment.time.includes("PM")) {
        return appointment.time;
      }

      const timeMatch = appointment.time.match(/^(\d{1,2}):(\d{2})$/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
      }

      return appointment.time;
    }

    const appointmentDate = getAppointmentDate();
    return format(appointmentDate, "h:mm a");
  };

  useEffect(() => {
    if (isOpen && appointment) {
      const fetchTimezoneAndSlots = async () => {
        setLoadingSlots(true);
        try {
          let doctorId: string | null = null;

          if (appointment.timeZone) {
            setTimeZone(appointment.timeZone);
          }

          if (appointment.doctorRef || appointment.doctor) {
            doctorId =
              typeof (appointment.doctorRef || appointment.doctor) === "object"
                ? (appointment.doctorRef || appointment.doctor)._id
                : appointment.doctorRef || appointment.doctor;

            if (doctorId) {
              const response =
                await appointmentService.getDoctorAvailability(doctorId);
              if (response?.success && response.data) {
                if (!appointment.timeZone) {
                  setTimeZone(response.data.timeZone);
                }

                const currentDateStr =
                  formData.date || format(getAppointmentDate(), "yyyy-MM-dd");

                let existingApts = response.data.existingAppointments || [];
                if (appointment._id) {
                  existingApts = existingApts.filter(
                    (apt: any) =>
                      apt._id !== appointment._id && apt.id !== appointment._id,
                  );
                }

                const date = new Date(currentDateStr);
                const slots = getAvailableTimeSlots(
                  response.data,
                  date,
                  existingApts,
                );
                setTimeSlots(slots);
              }
            }
          }

          if (timeSlots.length === 0) {
            const fallbackSlots = Array.from({ length: 17 }, (_, i) => {
              const hour = Math.floor(9 + i / 2);
              const minute = i % 2 === 0 ? "00" : "30";
              const time24 = `${hour.toString().padStart(2, "0")}:${minute}`;
              const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              const ampm = hour >= 12 ? "PM" : "AM";
              const displayTime = `${hour12}:${minute} ${ampm}`;
              return { time: time24, displayTime, available: true };
            });
            setTimeSlots(fallbackSlots);
          }
        } catch (err) {
          console.error("Error fetching timezone and slots:", err);
          const fallbackSlots = Array.from({ length: 17 }, (_, i) => {
            const hour = Math.floor(9 + i / 2);
            const minute = i % 2 === 0 ? "00" : "30";
            const time24 = `${hour.toString().padStart(2, "0")}:${minute}`;
            const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            const ampm = hour >= 12 ? "PM" : "AM";
            const displayTime = `${hour12}:${minute} ${ampm}`;
            return { time: time24, displayTime, available: true };
          });
          setTimeSlots(fallbackSlots);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchTimezoneAndSlots();

      let timeStr: string;
      if (appointment.time) {
        const timeMatch = appointment.time.match(/^(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          timeStr = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
        } else {
          timeStr = appointment.time;
        }
      } else {
        const appointmentDate = getAppointmentDate();
        timeStr = format(appointmentDate, "HH:mm");
      }

      const appointmentDate = getAppointmentDate();
      const dateStr = format(appointmentDate, "yyyy-MM-dd");

      setFormData({
        patientId:
          appointment.patientId ||
          appointment.patient?.id ||
          appointment.patient?._id ||
          "",
        date: dateStr,
        time: timeStr,
        type: appointment.type || appointment.service || "Consultation",
        notes: appointment.notes || "",
      });
      setError("");
      setIsEditing(false);
    }
  }, [isOpen, appointment, dispatch]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.time || !formData.date) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const dateTime = new Date(
      `${formData.date}T${formData.time}:00`,
    ).toISOString();
    const appointmentId = appointment._id || appointment.id;

    if (!appointmentId) {
      setError("Invalid appointment ID");
      setLoading(false);
      return;
    }

    try {
      if (!role) {
        throw new Error("User role is missing");
      }
      await appointmentService.rescheduleAppointment(
        role,
        appointmentId,
        dateTime,
        formData.notes,
      );

      toast({
        title: "Success",
        description: "Appointment rescheduled successfully",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(
        err?.message || "Failed to update appointment. Please try again.",
      );

      toast({
        title: "Error",
        description: err?.message || "Failed to reschedule appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setError("");

    const appointmentId = appointment._id || appointment.id;

    if (!appointmentId) {
      setError("Invalid appointment ID");
      setLoading(false);
      setShowCancelDialog(false);
      return;
    }

    try {
      if (!role) {
        throw new Error("User role is missing");
      }
      await appointmentService.cancelAppointment(role, appointmentId);

      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
      setShowCancelDialog(false);
      onClose();
    } catch (err: any) {
      setError(
        err?.message || "Failed to cancel appointment. Please try again.",
      );
      setShowCancelDialog(false);

      toast({
        title: "Error",
        description: err?.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))]";
      case "rescheduled":
        return "bg-[hsl(var(--color-chart-orange)/0.1)] text-[hsl(var(--color-chart-orange))]";
      case "completed":
        return "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]";
      case "canceled":
        return "bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))]";
      default:
        return "bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))]";
    }
  };

  const doctorName =
    (appointment as any)?.doctorName ||
    (typeof (appointment as any)?.doctor === "object"
      ? `${(appointment as any)?.doctor?.firstName || ""} ${(appointment as any)?.doctor?.lastName || ""}`.trim()
      : "") ||
    (typeof (appointment as any)?.doctorRef === "object"
      ? `${(appointment as any)?.doctorRef?.firstName || ""} ${(appointment as any)?.doctorRef?.lastName || ""}`.trim()
      : "") ||
    "Unknown Doctor";

  if (!appointment && isOpen) {
    return null;
  }

  return (
    <>
    <Toaster />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-[hsl(var(--card))] border-[hsl(var(--border))] overflow-hidden flex flex-col max-h-[90vh] w-[calc(100%-2rem)] sm:w-full mx-auto">
          <DialogHeader
            className="p-6 flex-shrink-0"
            style={{
              background: `linear-gradient(to right, hsl(var(--color-brand-teal)), hsl(var(--color-brand-teal-dark)))`,
            }}
          >
            <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-white">
              <div
                className="backdrop-blur-sm p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: "hsl(var(--color-white-alpha-20))" }}
              >
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <span className="truncate">
                {isEditing ? "Edit Appointment" : "Appointment Details"}
              </span>
            </DialogTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
              <p className="text-sm text-white/90">
                {format(getAppointmentDate(), "EEEE, MMMM d, yyyy")}
              </p>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium w-fit",
                  getStatusColor(appointment?.status),
                )}
              >
                {appointment?.status || "Scheduled"}
              </span>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {error && (
              <div className="bg-[hsl(var(--color-brand-teal)/0.1)] border border-[hsl(var(--color-brand-teal)/0.2)] text-[hsl(var(--color-brand-teal))] px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--color-brand-teal))] flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Clinic Name
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))] break-words">
                      {appointment?.clinicRef?.clinicName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Clinic Address
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))] text-sm break-words">
                      {appointment?.clinicRef?.address?.street}{" "}
                      {appointment?.clinicRef?.address?.city},{" "}
                      {appointment?.clinicRef?.address?.state}{" "}
                      {appointment?.clinicRef?.address?.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Doctor
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))] break-words">
                      {doctorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Patient
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))] break-words">
                      {appointment?.patientRef?.firstName}{" "}
                      {appointment?.patientRef?.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Patient Phone No
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))] break-words">
                      {appointment?.patientRef?.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <Clock className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Time
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {getDisplayTime()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                  <FileText className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Appointment Type
                    </p>
                    <p className="font-medium text-[hsl(var(--foreground))] break-words">
                      {appointment?.type ||
                        appointment?.service ||
                        "Consultation"}
                    </p>
                  </div>
                </div>

                {appointment?.notes && (
                  <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-[hsl(var(--foreground))] break-words whitespace-pre-wrap">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {appointment?.status !== "canceled" &&
                  appointment?.status !== "completed" &&
                  appointment?.status !== "start_visit" && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-[hsl(var(--card))] pb-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="flex-1 gap-2 border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                      >
                        <Edit className="h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(true)}
                        className="flex-1 gap-2 text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal))] border-[hsl(var(--border))]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="doctor"
                    className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--foreground))]"
                  >
                    <User className="h-4 w-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                    Doctor
                  </Label>
                  <div className="flex items-center gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg border border-[hsl(var(--border))]">
                    <User className="h-5 w-5 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                    <p className="font-medium text-[hsl(var(--foreground))] break-words">
                      {doctorName}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--foreground))]"
                  >
                    <CalendarIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                    Date
                  </Label>

                  {/* <DatePicker
                    value={formData.date ? new Date(formData.date) : new Date()}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        date: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    minDate={new Date()}
                    className="w-full"
                  /> */}
                  <input
                    type="date"
                    id="date"
                    value={format(formData.date ? new Date(formData.date) : new Date(), "yyyy-MM-dd")}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        date: e.target.value ? format(new Date(e.target.value), "yyyy-MM-dd") : "",
                      })
                    }}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="time"
                    className="text-sm font-medium flex items-center gap-2 justify-between text-[hsl(var(--foreground))]"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                      Available Time Slots (30 minutes)
                    </span>
                    {timeZone && (
                      <span className="text-xs text-[hsl(var(--muted-foreground))] font-normal ml-2">
                        {timeZone}
                      </span>
                    )}
                  </Label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8 text-[hsl(var(--muted-foreground))]">
                      <div className="h-6 w-6 border-2 border-[hsl(var(--color-brand-teal)/0.3)] border-t-[hsl(var(--color-brand-teal))] rounded-full animate-spin mr-2" />
                      Loading available slots...
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))]">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() =>
                            setFormData({ ...formData, time: slot.time })
                          }
                          className={cn(
                            "px-3 py-2 rounded-md text-sm font-medium transition-colors border-2",
                            formData.time === slot.time
                              ? "bg-[hsl(var(--color-brand-teal))] text-white border-[hsl(var(--color-brand-teal))]"
                              : slot.available
                                ? "bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] cursor-not-allowed opacity-50",
                          )}
                        >
                          {slot.displayTime}
                          {!slot.available && slot.reason && (
                            <span className="block text-xs mt-1">
                              ({slot.reason})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[hsl(var(--muted-foreground))] text-sm">
                      No slots available for this date
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--foreground))]"
                  >
                    <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                    Appointment Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--color-brand-teal)/0.2)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                      {appointmentTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-[hsl(var(--popover-foreground))]"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-medium text-[hsl(var(--foreground))]"
                  >
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any additional notes..."
                    className="min-h-[80px] resize-none bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--color-brand-teal)/0.2)]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-[hsl(var(--card))] pb-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 text-white"
                    style={{
                      backgroundColor: `hsl(var(--color-brand-teal))`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `hsl(var(--color-brand-teal-dark))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `hsl(var(--color-brand-teal))`;
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] w-full max-w-md sm:max-w-lg mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--color-brand-teal))] flex-shrink-0" />
              <span className="break-words">Cancel Appointment?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--muted-foreground))]">
              Are you sure you want to cancel this appointment with Dr.{" "}
              <strong className="text-[hsl(var(--foreground))]">
                {doctorName}
              </strong>{" "}
              on{" "}
              <strong className="text-[hsl(var(--foreground))]">
                {format(getAppointmentDate(), "MMMM d, yyyy")}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              disabled={loading}
              className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] mt-0"
            >
              Keep Appointment
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={loading}
              className="text-white"
              style={{ backgroundColor: `hsl(var(--color-brand-teal))` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `hsl(var(--color-brand-teal)/0.9)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `hsl(var(--color-brand-teal))`;
              }}
            >
              {loading ? "Cancelling..." : "Yes, Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
