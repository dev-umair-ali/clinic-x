"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { Clock, User, FileText, Calendar as CalendarIcon, AlertCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { appointmentService, DoctorAppointment } from "@/lib/api/services/appointmentService"
import type { RootState } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAvailableTimeSlots, type TimeSlot, type DoctorAvailability } from "@/lib/utils/timeSlots";

interface EditAppointmentModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  appointment: DoctorAppointment | null
  onSaved: () => void
  onError: (message: string) => void
}

export default function EditAppointmentModal({
  open,
  setOpen,
  appointment,
  onSaved,
  onError,
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
      console.log("📝 Editing appointment:", appointment)
      console.log("📝 appointment.doctor:", appointment.doctor)
      console.log("📝 appointment.doctorRef:", (appointment as any).doctorRef)
      console.log("📝 appointment.doctorName:", (appointment as any).doctorName)
      
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
      
      // Set doctor info - try multiple fields
      const doctorData = (appointment as any).doctorRef || (appointment as any).doctor || appointment.doctor
      const doctorNameFallback = (appointment as any).doctorName
      
      console.log("📝 doctorData:", doctorData)
      console.log("📝 doctorNameFallback:", doctorNameFallback)
      
      if (doctorData) {
        const doctorObj = {
          _id: typeof doctorData === 'object' ? doctorData._id : doctorData,
          name: typeof doctorData === 'object' 
            ? `${doctorData.firstName || ''} ${doctorData.lastName || ''}`.trim() || doctorNameFallback || 'Unknown Doctor'
            : doctorNameFallback || 'Unknown Doctor',
          ...(typeof doctorData === 'object' ? doctorData : {})
        }
        console.log("📝 Setting doctorInfo:", doctorObj)
        setDoctorInfo(doctorObj)
      } else if (doctorNameFallback) {
        console.log("📝 Setting doctorInfo from name only:", doctorNameFallback)
        setDoctorInfo({
          _id: appointment.doctor, // Use doctor ID
          name: doctorNameFallback,
        })
      }
      
      setError("")
    }
  }, [open, appointment])

  // Fetch time slots when doctor and date are available
  useEffect(() => {
    if (doctorInfo?._id && selectedDate && open) {
      fetchDoctorAvailabilityAndAppointments()
    }
  }, [doctorInfo?._id, selectedDate, open])

  const fetchDoctorAvailabilityAndAppointments = async () => {
    if (!doctorInfo?._id) return

    setLoadingSlots(true)
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      
      // Fetch doctor availability
      const availabilityRes = await appointmentService.getDoctorAvailability(doctorInfo._id)
      
      if (availabilityRes?.success && availabilityRes.data) {
        setAvailability(availabilityRes.data)
        
        // Fetch existing appointments for this doctor on this specific date
        const appointmentsRes = await appointmentService.getDoctorAppointmentsForDate(doctorInfo._id, dateStr)
        
        let existingApts = appointmentsRes?.success ? (appointmentsRes.data || []) : []
        
        // Exclude the current appointment being edited to allow rescheduling to same time
        if (appointment?._id) {
          existingApts = existingApts.filter((apt: any) => 
            apt._id !== appointment._id && apt.id !== appointment._id
          )
        }
        
        setExistingAppointments(existingApts)
        
        // Generate time slots - correct parameter order: availability, selectedDate, existingAppointments
        const slots = getAvailableTimeSlots(
          availabilityRes.data,
          selectedDate,
          existingApts
        )
        
        setTimeSlots(slots)
      }
    } catch (err: any) {
      console.error("Error fetching availability:", err)
      setError("Failed to load available time slots")
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSave = async () => {
    if (!appointment?._id) {
      setError("Invalid appointment")
      return
    }

    if (!selectedTime) {
      setError("Please select a time")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Parse the selected time
      const [hours, minutes] = selectedTime.split(':').map(Number)
      
      // Create new date with selected date and time
      const appointmentDateTime = new Date(selectedDate)
      appointmentDateTime.setHours(hours, minutes, 0, 0)

      // Determine if this is a reschedule (date/time changed)
      const originalDateValue = appointment.dateTime || appointment.date || new Date().toISOString()
      const originalDateTime = new Date(originalDateValue)
      const isRescheduled = appointmentDateTime.getTime() !== originalDateTime.getTime()

      const updateData: any = {
        dateTime: appointmentDateTime.toISOString(),
        date: appointmentDateTime.toISOString(),
        time: selectedTime,
        service: appointmentType,
        notes: notes,
        status: isRescheduled && status === 'scheduled' ? 'rescheduled' : status,
        timeZone: appointment.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      }

      console.log("📤 Updating appointment:", updateData)

      const res = await appointmentService.updateAppointment(appointment._id, updateData)

      if (res?.success) {
        toast({
          title: "Success",
          description: isRescheduled 
            ? "Appointment rescheduled successfully" 
            : "Appointment updated successfully",
        })
        setOpen(false)
        onSaved()
      } else {
        throw new Error(res?.message || "Failed to update appointment")
      }
    } catch (err: any) {
      console.error("❌ Error updating appointment:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to update appointment"
      setError(errorMessage)
      onError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!appointment?._id) return

    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await appointmentService.updateAppointment(appointment._id, {
        status: "cancelled"
      })

      if (res?.success) {
        toast({
          title: "Success",
          description: "Appointment cancelled successfully",
        })
        setOpen(false)
        onSaved()
      } else {
        throw new Error(res?.message || "Failed to cancel appointment")
      }
    } catch (err: any) {
      console.error("❌ Error cancelling appointment:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to cancel appointment"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative pb-4 border-b">
          <DialogTitle className="text-xl font-semibold pr-8">
            Edit Appointment
          </DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-0 top-0 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Doctor Information */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Doctor
            </Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
              <p className="font-medium">{doctorInfo?.name || appointment.doctorName || "Unknown Doctor"}</p>
              {doctorInfo?.specialization && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{doctorInfo.specialization}</p>
              )}
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Appointment Type
            </Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
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

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <CalendarIcon className="h-4 w-4" />
              Date
            </Label>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                setSelectedDate(newDate)
                setSelectedTime("") // Reset time when date changes
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Time Slots (30 minutes)
              </span>
              {availability?.timeZone && (
                <span className="text-xs text-muted-foreground font-normal">
                  {availability.timeZone}
                </span>
              )}
            </Label>
            {loadingSlots ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading available time slots...
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 border rounded-md">
                No available time slots for this date
              </div>
            ) : (
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
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
            disabled={loading || appointment.status === "cancelled"}
          >
            Cancel Appointment
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            disabled={loading || !selectedTime}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}