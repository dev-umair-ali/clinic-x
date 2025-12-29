"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { Clock, User, FileText, Calendar as CalendarIcon, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { appointmentService } from "@/lib/api/services/appointmentService"
import type { RootState } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAvailableTimeSlots, type TimeSlot, type DoctorAvailability } from "@/lib/utils/timeSlots"

interface AppointmentBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  patientId: string
  onSuccess?: () => void
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  selectedDate,
  patientId,
  onSuccess,
}: AppointmentBookingModalProps) {
  const { user: authUser } = useSelector((state: RootState) => state.auth)
  const { toast } = useToast()

  const [doctors, setDoctors] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [internalSelectedDate, setInternalSelectedDate] = useState(selectedDate)
  const [availability, setAvailability] = useState<DoctorAvailability | null>(null)
  const [existingAppointments, setExistingAppointments] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("Consultation")
  const [notes, setNotes] = useState("")
  
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const appointmentTypes = ["Consultation", "Follow-up", "Emergency", "Check-up"]

  // Debug: Log user and patient info on mount
  useEffect(() => {
    console.log("🔍 AppointmentBookingModal - User Info:", {
      authUserId: authUser?.id,
      authUserMongoId: authUser?._id,
      authUserName: authUser?.name,
      authUserRole: authUser?.role,
      authUserObject: authUser,
      patientIdProp: patientId,
      selectedDate: format(selectedDate, "yyyy-MM-dd"),
      willUsePatientId: authUser?.id || authUser?._id || patientId,
    })
  }, [authUser, patientId])

  useEffect(() => {
    if (isOpen) {
      fetchDoctors()
      setInternalSelectedDate(selectedDate)
      setSelectedDoctor("")
      setSelectedTime("")
      setAppointmentType("Consultation")
      setNotes("")
      setError("")
      setTimeSlots([])
    }
  }, [isOpen, selectedDate])

  useEffect(() => {
    if (selectedDoctor && isOpen) {
      fetchDoctorAvailabilityAndAppointments()
    } else {
      setTimeSlots([])
      setSelectedTime("")
    }
  }, [selectedDoctor, internalSelectedDate, isOpen])

  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const response = await appointmentService.getAllDoctors()
      console.log("Doctors response:", response) // Debug log
      
      if (response?.success && response?.data) {
        const doctorsData = Array.isArray(response.data) ? response.data : []
        console.log("Doctors data:", doctorsData) // Debug log
        setDoctors(doctorsData)
        
        if (doctorsData.length === 0) {
          setError("No doctors available in the system")
        }
      } else {
        setError("Failed to load doctors: Invalid response format")
      }
    } catch (err: any) {
      console.error("Error fetching doctors:", err) // Debug log
      const errorMessage = err?.message || "Failed to load doctors"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingDoctors(false)
    }
  }

  const fetchDoctorAvailabilityAndAppointments = async () => {
    if (!selectedDoctor) return
    
    setLoadingSlots(true)
    setError("")
    
    try {
      console.log("🔍 Fetching availability for doctor:", selectedDoctor)
      
      const availabilityResponse = await appointmentService.getDoctorAvailability(selectedDoctor)
      console.log("📅 Availability response:", availabilityResponse)
      
      const dateStr = format(internalSelectedDate, "yyyy-MM-dd")
      console.log("📆 Fetching appointments for date:", dateStr, "Doctor ID:", selectedDoctor)
      
      let appointmentsData: any[] = []
      try {
        const appointmentsResponse = await appointmentService.getDoctorAppointmentsForDate(selectedDoctor, dateStr)
        console.log("📋 Appointments response:", appointmentsResponse)
        appointmentsData = appointmentsResponse?.success ? (appointmentsResponse.data || []) : []
      } catch (aptError: any) {
        console.error("❌ Error fetching appointments:", aptError)
        console.error("❌ Error details:", {
          message: aptError.message,
          status: aptError.status,
          response: aptError.response,
          originalError: aptError.originalError
        })
        // Continue with empty appointments array - don't block booking
        appointmentsData = []
      }
      
      const availabilityData = availabilityResponse?.success ? availabilityResponse.data : null
      
      console.log("✅ Availability data:", availabilityData)
      console.log("✅ Appointments data:", appointmentsData)
      
      // Log appointment times for debugging
      if (appointmentsData.length > 0) {
        console.log("📋 Appointment times:", appointmentsData.map((apt: any) => {
          const date = new Date(apt.dateTime)
          return {
            dateTime: apt.dateTime,
            time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
            status: apt.status
          }
        }))
      }
      
      setAvailability(availabilityData)
      setExistingAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
      
      if (availabilityData) {
        const slots = getAvailableTimeSlots(availabilityData, internalSelectedDate, appointmentsData)
        console.log("🎯 Generated slots:", slots)
        
        // Log booked slots specifically
        const bookedSlots = slots.filter(s => !s.available)
        console.log("🚫 Booked slots:", bookedSlots.length, bookedSlots.map(s => s.displayTime))
        console.log("✅ Available slots:", slots.filter(s => s.available).length)
        
        setTimeSlots(slots)
        
        if (slots.length === 0) {
          setError("No available slots for this date")
        } else if (slots.every(slot => !slot.available)) {
          setError("All slots are booked for this date")
        }
      } else {
        setError("Doctor availability not configured")
        setTimeSlots([])
      }
    } catch (err: any) {
      console.error("❌ Error fetching availability:", err)
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to load available time slots"
      setError(errorMsg)
      setTimeSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("🎯 handleSubmit - Patient ID Check:", {
      authUser: authUser,
      authUserId: authUser?.id,
      authUserMongoId: authUser?._id,
      patientIdProp: patientId,
      patientRefValue: authUser?.id || authUser?._id || patientId,
      typeofAuthUserId: typeof authUser?.id,
      typeofAuthUserMongoId: typeof authUser?._id,
      typeofPatientIdProp: typeof patientId,
    });

    if (!selectedDoctor || selectedDoctor.trim() === "") {
      setError("Please select a doctor")
      setLoading(false)
      return
    }

    if (!selectedTime || selectedTime.trim() === "") {
      setError("Please select a time slot")
      setLoading(false)
      return
    }

    const patientRefValue = authUser?.id || authUser?._id || patientId
    if (!patientRefValue || patientRefValue.trim() === "") {
      setError("Patient ID is missing. Please log in again.")
      console.error("❌ Patient ID validation failed:", {
        authUserId: authUser?.id,
        authUserMongoId: authUser?._id,
        patientIdProp: patientId,
        patientRefValue,
      });
      setLoading(false)
      return
    }

    const dateStr = format(internalSelectedDate, "yyyy-MM-dd")

    // Backend expects separate date and time fields
    // Send date as string (YYYY-MM-DD) to avoid timezone conversion
    const appointmentData = {
      doctorRef: selectedDoctor.trim(),
      patientRef: patientRefValue.trim(),
      date: dateStr, // Send as string, not ISO
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
    }

    console.log("📋 Appointment Data Being Sent:", {
      doctorRef: appointmentData.doctorRef,
      patientRef: appointmentData.patientRef,
      date: appointmentData.date,
      time: appointmentData.time,
      service: appointmentData.service,
    })

    try {
      await appointmentService.createAppointment(appointmentData)
      
      toast({
        title: "Success",
        description: "Appointment booked successfully",
        variant: "default",
      })
      
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to book appointment. Please try again.")
      
      toast({
        title: "Error",
        description: err?.message || "Failed to book appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 bg-background border-border overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <CalendarIcon className="h-5 w-5" />
            </div>
            Book Appointment
          </DialogTitle>
          <p className="text-sm text-primary-foreground/90 mt-2">
            {format(internalSelectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="doctor" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Select Doctor
            </Label>
            <Select
              value={selectedDoctor}
              onValueChange={(value) => {
                setSelectedDoctor(value)
                setSelectedTime("")
              }}
              disabled={loadingDoctors}
            >
              <SelectTrigger className={cn("w-full bg-background border-border", !selectedDoctor && "text-muted-foreground")}>
                <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Select a doctor"} />
              </SelectTrigger>
              <SelectContent>
                {doctors.length > 0 ? (
                  doctors.map((doctor: any) => {
                    const doctorId = doctor._id || doctor.id || doctor.doctorId
                    const doctorName = doctor.name || 
                                      doctor.fullName || 
                                      (doctor.firstName && doctor.lastName ? `${doctor.firstName} ${doctor.lastName}` : null) ||
                                      doctor.firstName ||
                                      doctor.lastName ||
                                      "Unknown Doctor"
                    
                    return (
                      <SelectItem key={doctorId} value={doctorId}>
                        Dr. {doctorName} {doctor.specialization ? `- ${doctor.specialization}` : ""}
                      </SelectItem>
                    )
                  })
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {loadingDoctors ? "Loading..." : "No doctors available"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              Appointment Date
            </Label>
            <input
              type="date"
              id="date"
              value={format(internalSelectedDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                setInternalSelectedDate(newDate)
                setSelectedTime("") // Reset time when date changes
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {selectedDoctor && (
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Available Time Slots (30 minutes)
                </span>
                {availability?.timeZone && (
                  <span className="text-xs text-muted-foreground font-normal">
                    {availability.timeZone}
                  </span>
                )}
              </Label>
              
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                  Loading available slots...
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors border-2",
                        selectedTime === slot.time
                          ? "bg-primary text-primary-foreground border-primary"
                          : slot.available
                          ? "bg-background hover:bg-muted border-border"
                          : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                      )}
                    >
                      {slot.displayTime}
                      {!slot.available && slot.reason && (
                        <span className="block text-xs mt-1">({slot.reason})</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {error || "No slots available"}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Appointment Type
            </Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or symptoms..."
              className="min-h-[80px] resize-none bg-background border-border"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={loading || !selectedDoctor || !selectedTime}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
  )
}
