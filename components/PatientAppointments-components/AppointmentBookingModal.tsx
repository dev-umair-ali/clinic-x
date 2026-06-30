"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Clock,
  User,
  FileText,
  Calendar as CalendarIcon,
  AlertCircle,
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
import { appointmentService } from "@/lib/api/services/appointmentService";
import type { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  getAvailableTimeSlots,
  type TimeSlot,
  type DoctorAvailability,
} from "@/lib/utils/timeSlots";
import { DatePicker } from "../ui/date-picker";
import { Toaster } from "@/components/ui/toaster";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  patientId: string;
  onSuccess?: () => void;
  fetchList: () => void;
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  selectedDate,
  patientId,
  onSuccess,
  fetchList,
}: AppointmentBookingModalProps) {
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const role = authUser?.role;

  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [internalSelectedDate, setInternalSelectedDate] =
    useState(selectedDate);
  const [availability, setAvailability] = useState<DoctorAvailability | null>(
    null,
  );
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("Consultation");
  const [notes, setNotes] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Emergency",
    "Check-up",
  ];

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      fetchPatients();
      setInternalSelectedDate(selectedDate);
      setSelectedDoctor("");
      setSelectedTime("");
      setAppointmentType("Consultation");
      setNotes("");
      setError("");
      setTimeSlots([]);
    }
  }, [isOpen, selectedDate]);

  useEffect(() => {
    if (selectedDoctor && isOpen) {
      fetchDoctorAvailabilityAndAppointments();
    } else {
      setTimeSlots([]);
      setSelectedTime("");
    }
  }, [selectedDoctor, internalSelectedDate, isOpen]);

  useEffect(() => {
    if (selectedPatient && isOpen && role === "doctor") {
      fetchDoctorItSelfAvailabilityAndAppointments();
    }
  }, [selectedPatient, internalSelectedDate, isOpen]);

  const fetchDoctors: () => Promise<void> = async () => {
    setLoadingDoctors(true);
    try {
      const response = await appointmentService.getAllDoctors(
        authUser?.clinicId || "",
      );

      if (response) {
        const doctorsData = Array.isArray(response) ? response : [];
        setDoctors(doctorsData);

        if (doctorsData.length === 0) {
          setError("No doctors available in the system");
        }
      } else {
        setError("Failed to load doctors: Invalid response format");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to load doctors";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await appointmentService.getAllPatient(
        authUser?.clinicId || "",
      );

      if (response) {
        const patientsData = Array.isArray(response) ? response : [];
        setPatients(patientsData);

        if (patientsData.length === 0) {
          setError("No patients available in the system");
        }
      } else {
        setError("Failed to load patients: Invalid response format");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to load patients";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchDoctorAvailabilityAndAppointments = async () => {
    if (!selectedDoctor) return;

    setLoadingSlots(true);
    setError("");

    try {
      const availabilityResponse =
        await appointmentService.getDoctorAvailability(selectedDoctor);
      const dateStr = format(internalSelectedDate, "yyyy-MM-dd");

      let appointmentsData: any[] = [];
      try {
        const appointmentsResponse =
          await appointmentService.getDoctorAppointmentsForDate(
            selectedDoctor,
            dateStr,
          );
        appointmentsData = appointmentsResponse?.success
          ? appointmentsResponse.data || []
          : [];
      } catch (aptError: any) {
        console.error("❌ Error fetching appointments:", aptError);
        appointmentsData = [];
      }
      const availabilityData = availabilityResponse?.success
        ? availabilityResponse.data
        : null;
      setAvailability(availabilityData);
      setExistingAppointments(
        Array.isArray(appointmentsData) ? appointmentsData : [],
      );

      if (availabilityData) {
        const slots = getAvailableTimeSlots(
          availabilityData,
          internalSelectedDate,
          appointmentsData,
        );
        const bookedSlots = slots.filter((s) => !s.available);

        setTimeSlots(slots);

        if (slots.length === 0) {
          setError("No available slots for this date");
        } else if (slots.every((slot) => !slot.available)) {
          setError("All slots are booked for this date");
        }
      } else {
        setError("Doctor availability not configured");
        setTimeSlots([]);
      }
    } catch (err: any) {
      console.error("❌ Error fetching availability:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load available time slots";
      setError(errorMsg);
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchDoctorItSelfAvailabilityAndAppointments = async () => {
    if (!authUser) return;

    setLoadingSlots(true);
    setError("");

    try {
      const availabilityResponse =
        await appointmentService.getDoctorAvailability(authUser.doctorId || "");
      const dateStr = format(internalSelectedDate, "yyyy-MM-dd");

      let appointmentsData: any[] = [];
      try {
        const appointmentsResponse =
          await appointmentService.getDoctorAppointmentsForDate(
            authUser.doctorId || "",
            dateStr,
          );
        appointmentsData = appointmentsResponse?.success
          ? appointmentsResponse.data || []
          : [];
      } catch (aptError: any) {
        console.error("❌ Error fetching appointments:", aptError);
        appointmentsData = [];
      }
      const availabilityData = availabilityResponse?.success
        ? availabilityResponse.data
        : null;
      setAvailability(availabilityData);
      setExistingAppointments(
        Array.isArray(appointmentsData) ? appointmentsData : [],
      );

      if (availabilityData) {
        const slots = getAvailableTimeSlots(
          availabilityData,
          internalSelectedDate,
          appointmentsData,
        );
        const bookedSlots = slots.filter((s) => !s.available);

        setTimeSlots(slots);

        if (slots.length === 0) {
          setError("No available slots for this date");
        } else if (slots.every((slot) => !slot.available)) {
          setError("All slots are booked for this date");
        }
      } else {
        setError("Doctor availability not configured");
        setTimeSlots([]);
      }
    } catch (err: any) {
      console.error("❌ Error fetching availability:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load available time slots";
      setError(errorMsg);
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (role === "patient" || role === "clinic" || role === "assistant") {
      if (!selectedDoctor || selectedDoctor.trim() === "") {
        setError("Please select a doctor");
        setLoading(false);
        return;
      }
    }

    if (!selectedTime || selectedTime.trim() === "") {
      setError("Please select a time slot");
      setLoading(false);
      return;
    }

    const dateStr = format(internalSelectedDate, "yyyy-MM-dd");

    const appointmentData = {
      doctorRef: "",
      patientRef: "",
      date: dateStr,
      time: selectedTime.trim(),
      service: appointmentType || "General Consultation",
      status: "scheduled" as const,
      notes: notes || undefined,
      smsReminder: false,
      emailReminder: false,
      totalCharge: 0,
      copay: false,
      payNow: 0,
      remainingDue: 0,
      title: `Clinic appointment with`,
    };

    if (role === "patient") {
      const patientRefValue = authUser?.patientId || "";
      appointmentData.patientRef = patientRefValue;
      appointmentData.doctorRef = selectedDoctor.trim();
    }

    if (role === "doctor") {
      const doctorRefValue = authUser?.doctorId || "";
      appointmentData.doctorRef = doctorRefValue;
      appointmentData.patientRef = selectedPatient.trim();
    }

    if (role === "clinic" || role === "assistant") {
      appointmentData.doctorRef = selectedDoctor.trim();
      appointmentData.patientRef = selectedPatient.trim();
    }

    try {
      if (!role) {
        throw new Error("User role is missing");
      }
      await appointmentService.createAppointment(role, appointmentData);

      toast({
        title: "Success",
        description: "Appointment booked successfully",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to book appointment. Please try again.");

      toast({
        title: "Error",
        description: err?.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px] p-0 gap-0 bg-[hsl(var(--card))] border-[hsl(var(--border))] overflow-hidden max-h-[90vh] overflow-y-auto">
          <DialogHeader
            className="p-6"
            style={{
              background: `linear-gradient(to right, hsl(var(--color-brand-teal)), hsl(var(--color-brand-teal-dark)))`,
            }}
          >
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-white">
              <div
                className="backdrop-blur-sm p-2 rounded-lg"
                style={{ backgroundColor: "hsl(var(--color-white-alpha-20))" }}
              >
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              Book Appointment
            </DialogTitle>
            <p className="text-sm text-white/90 mt-2">
              {format(internalSelectedDate, "EEEE, MMMM d, yyyy")}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.2)] text-[hsl(var(--destructive))] px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {(role === "patient" ||
              role === "clinic" ||
              role === "assistant") && (
                <div className="space-y-2">
                  <Label
                    htmlFor="doctor"
                    className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--foreground))]"
                  >
                    <User className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    Select Doctor
                  </Label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={(value) => {
                      setSelectedDoctor(value);
                      setSelectedTime("");
                    }}
                    disabled={loadingDoctors}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full bg-[hsl(var(--background))] border-[hsl(var(--border))]",
                        !selectedDoctor && "text-[hsl(var(--muted-foreground))]",
                      )}
                    >
                      <SelectValue
                        placeholder={
                          loadingDoctors ? "Loading doctors..." : "Select a doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                      {doctors.length > 0 ? (
                        doctors.map((doctor: any) => {
                          const doctorId =
                            doctor._id || doctor.id || doctor.doctorId;
                          const doctorName =
                            doctor.name ||
                            doctor.fullName ||
                            (doctor.firstName && doctor.lastName
                              ? `${doctor.firstName} ${doctor.lastName}`
                              : null) ||
                            doctor.firstName ||
                            doctor.lastName ||
                            "Unknown Doctor";

                          return (
                            <SelectItem
                              key={doctorId}
                              value={doctorId}
                              className="text-[hsl(var(--popover-foreground))]"
                            >
                              Dr. {doctorName}{" "}
                              {doctor.specialization
                                ? `- ${doctor.specialization}`
                                : ""}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                          {loadingDoctors ? "Loading..." : "No doctors available"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

            {(role === "doctor" || role === "clinic" || role === "assistant") && (
              <div className="space-y-2">
                <Label
                  htmlFor="patient"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Patient
                </Label>
                <Select
                  value={selectedPatient}
                  onValueChange={(value) => {
                    setSelectedPatient(value);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full bg-background border-border focus:ring-2 focus:ring-primary/20",
                      !selectedPatient && "text-muted-foreground",
                    )}
                  >
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(patients) && patients.length > 0 ? (
                      patients.map((patient: any) => (
                        <SelectItem
                          key={patient.id || patient._id}
                          value={patient.id || patient._id}
                        >
                          {patient.firstName} {patient.lastName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No patients available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--foreground))]"
              >
                <CalendarIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                Appointment Date
              </Label>
              {/* <DatePicker
              date={internalSelectedDate}
              onDateChange={(date) => {
                if (!date) return;
                setInternalSelectedDate(date);
                setSelectedTime("");
              }}
              minDate={new Date()}
              className="w-full"
            /> */}

              <input
                type="date"
                id="date"
                value={format(internalSelectedDate, "yyyy-MM-dd")}
                onChange={(e) => {
                  const newDate = new Date(e.target.value)
                  setInternalSelectedDate(newDate)
                  setSelectedTime("")
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
                  <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  Available Time Slots (30 minutes)
                </span>
                {availability?.timeZone && (
                  <span className="text-xs text-[hsl(var(--muted-foreground))] font-normal">
                    {availability.timeZone}
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
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors border-2",
                        selectedTime === slot.time
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
                  {error || "No slots available"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--foreground))]"
              >
                <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                Appointment Type
              </Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger className="w-full bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or symptoms..."
                className="min-h-[80px] resize-none bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
                disabled={loading || !selectedTime}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </div>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>

  );
}
