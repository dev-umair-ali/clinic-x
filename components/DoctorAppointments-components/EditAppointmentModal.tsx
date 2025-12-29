"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { Clock, Calendar as CalendarIcon, AlertCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { appointmentService, DoctorAppointment } from "@/lib/api/services/appointmentService"
import type { RootState } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAvailableTimeSlots, type TimeSlot, type DoctorAvailability } from "@/lib/utils/timeSlots"

interface EditAppointmentModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  appointment: DoctorAppointment | null
  onSaved: () => void
  onError: (message: string) => void
  doctorId?: string // Optional: for doctor portal to pass logged-in doctor's ID directly
}

export default function EditAppointmentModal({
  open,
  setOpen,
  appointment,
  onSaved,
  onError,
  doctorId, // If provided, use this instead of extracting from appointment
}: EditAppointmentModalProps) {
  const { user: authUser } = useSelector((state: RootState) => state.auth)
  const { toast } = useToast()

  const [doctorInfo, setDoctorInfo] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availability, setAvailability] = useState<DoctorAvailability | null>(null)
  const [existingAppointments, setExistingAppointments] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("Consultation")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("scheduled")
  
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const appointmentTypes = ["Consultation", "Follow-up", "Emergency", "Check-up"]
  const statusOptions = ["scheduled", "rescheduled", "completed", "cancelled"]

  // Initialize form with appointment data
  useEffect(() => {
    if (open && appointment) {
      // Set date - handle both dateTime and date fields
      const dateValue = appointment.dateTime || appointment.date || new Date().toISOString()
      const aptDate = new Date(dateValue)
      setSelectedDate(aptDate)
      
      // Set time
      setSelectedTime(appointment.time || format(aptDate, "HH:mm"))
      
      // Set appointment type
      setAppointmentType(appointment.service || appointment.type || "Consultation")
      
      // Set notes
      setNotes(appointment.notes || "")
      
      // Set status
      setStatus(appointment.status || "scheduled")
      
      // If doctorId is provided directly (doctor portal), use it
      if (doctorId) {
        setDoctorInfo({
          _id: doctorId,
          name: 'Current Doctor', // Placeholder name
        })
      } else {
        // Otherwise, extract doctor info from appointment (patient portal)
        const doctorData = (appointment as any).doctorRef || (appointment as any).doctor || appointment.doctor
        const doctorNameFallback = (appointment as any).doctorName
        
        if (doctorData) {
          const doctorObj = {
            _id: typeof doctorData === 'object' ? doctorData._id : doctorData,
            name: typeof doctorData === 'object' 
              ? `${doctorData.firstName || ''} ${doctorData.lastName || ''}`.trim() || doctorNameFallback || 'Unknown Doctor'
              : doctorNameFallback || 'Unknown Doctor',
            ...(typeof doctorData === 'object' ? doctorData : {})
          }
          setDoctorInfo(doctorObj)
        } else if (doctorNameFallback) {
          setDoctorInfo({
            _id: appointment.doctor,
            name: doctorNameFallback,
          })
        }
      }
    }
  }, [open, appointment, doctorId])

  // Fetch doctor availability and existing appointments
  useEffect(() => {
    if (!open || !doctorInfo?._id) return

    const fetchDoctorAvailabilityAndAppointments = async () => {
      setLoadingSlots(true)
      setError("")
      
      try {
        const doctorId = doctorInfo._id
        const dateStr = format(selectedDate, "yyyy-MM-dd")
        
        // Fetch availability
        const availabilityRes = await appointmentService.getDoctorAvailability(doctorId)
        
        if (availabilityRes?.success && availabilityRes.data) {
          const availabilityData = availabilityRes.data
          setAvailability(availabilityData)
          
          // Fetch existing appointments for this date
          const appointmentsRes = await appointmentService.getDoctorAppointmentsForDate(doctorId, dateStr)
          
          const appointmentsData = appointmentsRes?.success ? (appointmentsRes.data || []) : []
          
          // Filter out the current appointment being edited
          const filteredAppointments = appointmentsData.filter(
            (apt: any) => apt._id !== appointment?._id
          )
          
          setExistingAppointments(Array.isArray(filteredAppointments) ? filteredAppointments : [])
          
          // Generate time slots with availability checking
          if (availabilityData) {
            const slots = getAvailableTimeSlots(availabilityData, selectedDate, filteredAppointments)
            setTimeSlots(slots)
          }
        }
      } catch (err) {
        console.error("Error fetching availability:", err)
        setError("Failed to load availability")
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchDoctorAvailabilityAndAppointments()
  }, [open, doctorInfo, selectedDate, appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!appointment?._id) {
      setError("Appointment ID is missing")
      return
    }

    if (!selectedTime) {
      setError("Please select a time slot")
      return
    }

    setLoading(true)
    setError("")

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      
      // Update appointment with new data
      const updateData: any = {
        date: dateStr,
        time: selectedTime,
        service: appointmentType,
        notes: notes || undefined,
        status: status === "rescheduled" || status === "scheduled" ? "rescheduled" : status,
      }

      const response = await appointmentService.updateAppointment(appointment._id, updateData)
      
      if (response?.success) {
        toast({
          title: "Success",
          description: "Appointment updated successfully",
          variant: "default",
        })
        
        setOpen(false)
        onSaved()
      } else {
        throw new Error(response?.message || "Failed to update appointment")
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to update appointment"
      setError(errorMsg)
      onError(errorMsg)
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 bg-background border-border overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <CalendarIcon className="h-5 w-5" />
              </div>
              Reschedule Appointment
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-primary-foreground hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {doctorInfo && (
            <p className="text-sm text-primary-foreground/90 mt-2">
              Doctor: {doctorInfo.name}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              Appointment Date
            </Label>
            <input
              type="date"
              id="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                setSelectedDate(newDate)
                setSelectedTime("") // Reset time when date changes
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time Slots */}
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
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
                Loading slots...
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

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
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

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes..."
              className="min-h-[80px] bg-background border-border resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedTime}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                "Update Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
