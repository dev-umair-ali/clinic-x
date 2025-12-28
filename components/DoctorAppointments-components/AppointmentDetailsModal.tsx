"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { format } from "date-fns"
import {
  Clock,
  User,
  FileText,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { fetchPatients } from "@/lib/slices/patientSlice"
import type { RootState, AppDispatch } from "@/lib/store"
import { cn } from "@/lib/utils"
import { appointmentService } from "@/lib/api/services/appointmentService"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AppointmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
  onSuccess?: () => void
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: AppointmentDetailsModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { patients } = useSelector((state: RootState) => state.patients)
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const appointmentTypes = ["Consultation", "Follow-up", "Emergency", "Check-up"]

  // Helper function to safely get appointment date
  const getAppointmentDate = () => {
    if (!appointment) return new Date();
    
    const dateValue = appointment.dateTime || appointment.date;
    if (!dateValue) return new Date();
    
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(9 + i / 2)
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour.toString().padStart(2, "0")}:${minute}`
  })

  useEffect(() => {
    if (isOpen && appointment) {
      dispatch(fetchPatients())
      
      // Parse the appointment date/time safely
      const appointmentDate = getAppointmentDate()
      const dateStr = format(appointmentDate, "yyyy-MM-dd")
      const timeStr = format(appointmentDate, "HH:mm")

      setFormData({
        patientId: appointment.patientId || appointment.patient?.id || appointment.patient?._id || "",
        date: dateStr,
        time: timeStr,
        type: appointment.type || appointment.service || "Consultation",
        notes: appointment.notes || "",
      })
      setError("")
      setIsEditing(false)
    }
  }, [isOpen, appointment, dispatch])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.time || !formData.date) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    const dateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()
    const appointmentId = appointment._id || appointment.id;

    if (!appointmentId) {
      setError("Invalid appointment ID");
      setLoading(false);
      return;
    }

    try {
      await appointmentService.rescheduleAppointment(appointmentId, dateTime, formData.notes)
      
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully",
        variant: "default",
      })
      
      // Call onSuccess and let parent handle closing
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || "Failed to update appointment. Please try again.")
      
      toast({
        title: "Error",
        description: err?.message || "Failed to reschedule appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setLoading(true)
    setError("")

    const appointmentId = appointment._id || appointment.id;

    if (!appointmentId) {
      setError("Invalid appointment ID");
      setLoading(false);
      setShowCancelDialog(false);
      return;
    }

    try {
      await appointmentService.cancelAppointment(appointmentId)
      
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
        variant: "default",
      })
      
      // Call onSuccess and let parent handle closing
      onSuccess?.()
      setShowCancelDialog(false)
    } catch (err: any) {
      setError(err?.message || "Failed to cancel appointment. Please try again.")
      setShowCancelDialog(false)
      
      toast({
        title: "Error",
        description: err?.message || "Failed to cancel appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const patientName = appointment?.patientName || 
    appointment?.patient?.name ||
    `${appointment?.patient?.firstName || ""} ${appointment?.patient?.lastName || ""}`.trim() ||
    "Unknown Patient"

  // Don't render if no appointment data
  if (!appointment && isOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-background border-border overflow-hidden">
          {/* Header with gradient */}
          <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <CalendarIcon className="h-5 w-5" />
              </div>
              {isEditing ? "Edit Appointment" : "Appointment Details"}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-primary-foreground/90">
                {format(getAppointmentDate(), "EEEE, MMMM d, yyyy")}
              </p>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getStatusColor(appointment?.status)
                )}
              >
                {appointment?.status || "Scheduled"}
              </span>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                {error}
              </div>
            )}

            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="font-medium">{patientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {format(getAppointmentDate(), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{appointment?.type || appointment?.service || "Consultation"}</p>
                    </div>
                  </div>

                  {appointment?.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {appointment?.status !== "cancelled" && appointment?.status !== "completed" && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(true)}
                      className="flex-1 gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Patient Display (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="patient" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Patient
                  </Label>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{patientName}</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    Date
                  </Label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Time
                  </Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                  >
                    <SelectTrigger className="w-full bg-background border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    onClick={() => setIsEditing(false)}
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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Appointment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment with <strong>{patientName}</strong> on{" "}
              <strong>{format(getAppointmentDate(), "MMMM d, yyyy 'at' h:mm a")}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Cancelling..." : "Yes, Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
