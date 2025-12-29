"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { format } from "date-fns"
import { Clock, User, FileText, Calendar as CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createAppointment } from "@/lib/slices/appointmentSlice"
import { fetchPatients } from "@/lib/slices/patientSlice"
import type { CreateAppointmentRequest } from "@/lib/api/services/appointmentService"
import { appointmentService } from "@/lib/api/services/appointmentService"
import type { RootState, AppDispatch } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAvailableTimeSlots, type TimeSlot, type DoctorAvailability } from "@/lib/utils/timeSlots"

interface AppointmentBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  doctorId: string
  onSuccess?: () => void
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  selectedDate,
  doctorId,
  onSuccess,
}: AppointmentBookingModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { patients } = useSelector((state: RootState) => state.patients)
  const { toast } = useToast()

  const [internalSelectedDate, setInternalSelectedDate] = useState(selectedDate)
  const [formData, setFormData] = useState({
    patientId: "",
    time: "",
    type: "Consultation",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeZone, setTimeZone] = useState<string>("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const appointmentTypes = ["Consultation", "Follow-up", "Emergency", "Check-up"]

  useEffect(() => {
    if (isOpen) {
      setInternalSelectedDate(selectedDate)
      dispatch(fetchPatients())
      
      // Reset form when modal opens
      setFormData({
        patientId: "",
        time: "",
        type: "Consultation",
        notes: "",
      })
      setError("")
    }
  }, [isOpen, dispatch, selectedDate])

  // Separate effect for fetching availability when date changes
  useEffect(() => {
    if (!isOpen) return
    // Fetch doctor's availability and existing appointments
    const fetchAvailabilityAndAppointments = async () => {
      setLoadingSlots(true)
      try {
        // Fetch availability
        const availabilityRes = await appointmentService.getDoctorAvailability(doctorId)
        
        if (availabilityRes?.success && availabilityRes.data) {
          setTimeZone(availabilityRes.data.timeZone)
          
          // Fetch existing appointments for this doctor on selected date
          const dateStr = format(internalSelectedDate, "yyyy-MM-dd")
          const appointmentsRes = await appointmentService.getDoctorAppointmentsForDate(doctorId, dateStr)
          
          const existingApts = appointmentsRes?.success ? (appointmentsRes.data || []) : []
          
          // Generate time slots with availability checking
          const slots = getAvailableTimeSlots(
            availabilityRes.data,
            internalSelectedDate,
            existingApts
          )
          
          setTimeSlots(slots)
        }
      } catch (err) {
        console.error("❌ Error fetching availability:", err)
        // Fallback to basic time slots if fetch fails
        const fallbackSlots = Array.from({ length: 17 }, (_, i) => {
          const hour = Math.floor(9 + i / 2)
          const minute = i % 2 === 0 ? "00" : "30"
          const time24 = `${hour.toString().padStart(2, "0")}:${minute}`
          const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
          const ampm = hour >= 12 ? 'PM' : 'AM'
          const displayTime = `${hour12}:${minute} ${ampm}`
          return { time: time24, displayTime, available: true }
        })
        setTimeSlots(fallbackSlots)
      } finally {
        setLoadingSlots(false)
      }
    }
    
    fetchAvailabilityAndAppointments()
  }, [isOpen, doctorId, internalSelectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.patientId || !formData.time) {
      setError("Please select a patient and time")
      setLoading(false)
      return
    }

    const dateStr = format(internalSelectedDate, "yyyy-MM-dd")
    
    // Backend expects doctorRef, patientRef, date (string), and time (string)
    const appointmentData: CreateAppointmentRequest = {
      doctorRef: doctorId,
      patientRef: formData.patientId,
      date: dateStr, // Send as YYYY-MM-DD string
      time: formData.time,
      service: formData.type || "Consultation",
      status: "scheduled",
      notes: formData.notes || undefined,
    }

    try {
      await dispatch(createAppointment(appointmentData)).unwrap()
      
      toast({
        title: "Success",
        description: "Appointment created successfully",
        variant: "default",
      })
      
      // Call onSuccess first (parent will refresh data), then close
      if (onSuccess) {
        onSuccess();
      }
      onClose()
    } catch (err: any) {
      console.error("Appointment creation error:", err);
      setError(err?.message || "Failed to book appointment. Please try again.")
      
      toast({
        title: "Error",
        description: err?.message || "Failed to create appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-background border-border overflow-hidden">
        {/* Header with gradient */}
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <CalendarIcon className="h-5 w-5" />
            </div>
            New Appointment
          </DialogTitle>
          <p className="text-sm text-primary-foreground/90 mt-2">
            {format(internalSelectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </DialogHeader>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              {error}
            </div>
          )}

          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Patient
            </Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) => {
                setFormData({ ...formData, patientId: value });
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-full bg-background border-border focus:ring-2 focus:ring-primary/20",
                  !formData.patientId && "text-muted-foreground"
                )}
              >
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(patients) && patients.length > 0 ? (
                  patients.map((patient: any) => (
                    <SelectItem key={patient.id || patient._id} value={patient.id || patient._id}>
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

          {/* Date Selection */}
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
                setFormData({ ...formData, time: "" }) // Reset time when date changes
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Available Time Slots (30 minutes)
              </span>
              {timeZone && (
                <span className="text-xs text-muted-foreground font-normal">
                  {timeZone}
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
                    onClick={() => {
                      setFormData({ ...formData, time: slot.time })
                    }}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors border-2",
                      formData.time === slot.time
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
                No slots available for this date
              </div>
            )}
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Appointment Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="w-full bg-background border-border focus:ring-2 focus:ring-primary/20">
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

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              className="min-h-[80px] resize-none bg-background border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
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
