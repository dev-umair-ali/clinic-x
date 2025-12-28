"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { ProtectedRoute } from "@/components/ui/protected-route"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { createAppointment } from "@/lib/slices/appointmentSlice"
import { fetchPatients } from "@/lib/slices/patientSlice"
import type { CreateAppointmentRequest } from "@/lib/api/services/appointmentService"
import type { RootState, AppDispatch } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { doctorService } from "@/lib/api/services/doctorService"

export default function BookAppointmentPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { patients } = useSelector((state: RootState) => state.patients)
  const { doctors } = useSelector((state: RootState) => state.doctors)
  const { user } = useSelector((state: RootState) => state.auth)

  // Get date from URL parameter if provided
  const dateParam = searchParams.get('date')
  const initialDate = dateParam ? new Date(dateParam) : new Date()

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "", // Will be set based on user
    date: initialDate,
    time: "",
    type: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [doctorMongoId, setDoctorMongoId] = useState<string>("")

  const appointmentTypes = ["Consultation", "Follow-up", "Emergency", "Check-up"]

  // Fetch patients on mount
  useEffect(() => {
    dispatch(fetchPatients())
  }, [dispatch])

  // Fetch current doctor's MongoDB ID from the backend
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (user?.role === "doctor" && !formData.doctorId) {
        try {
          const response = await doctorService.getCurrentDoctor()
          if (response.success && response.data.user.id) {
            setFormData(prev => ({ ...prev, doctorId: response.data.user.id }))
            setDoctorMongoId(response.data.user.id)
          }
        } catch (error) {
          console.error("Failed to fetch doctor profile:", error)
        }
      }
    }
    fetchDoctorProfile()
  }, [user, formData.doctorId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      setError(`Please fill in all required fields. Missing: ${!formData.patientId ? 'Patient ' : ''}${!formData.doctorId ? 'Doctor ' : ''}${!formData.date ? 'Date ' : ''}${!formData.time ? 'Time' : ''}`)
      setLoading(false)
      return
    }

    // Combine date and time into ISO datetime string
    const dateStr = format(formData.date, "yyyy-MM-dd")
    const dateTime = new Date(`${dateStr}T${formData.time}:00`).toISOString()

    const appointmentData: CreateAppointmentRequest = {
      doctorId: formData.doctorId,
      patientId: formData.patientId,
      dateTime: dateTime,
      status: "scheduled",
      notes: formData.notes || undefined,
    }

    try {
      const result = await dispatch(createAppointment(appointmentData)).unwrap()
      setSuccess("Appointment booked successfully!")
      setFormData({
        patientId: "",
        doctorId: user?.role === "doctor" ? user.id : "",
        date: new Date(),
        time: "",
        type: "",
        notes: "",
      })
      setTimeout(() => {
        router.push(user?.role === "patient" ? "/patient/appointments" : "/doctor/appointments")
      }, 1500)
    } catch (err: any) {
      console.error('Appointment creation error:', err) // Debug log
      setError(err?.message || err || "Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["patient", "doctor"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-6">Book New Appointment</h1>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))]">
            {error && (
              <div className="bg-[hsl(var(--color-status-error)/0.1)] border border-[hsl(var(--color-status-error)/0.2)] text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-[hsl(var(--color-status-success)/0.1)] border border-[hsl(var(--color-status-success)/0.2)] text-[hsl(var(--color-status-success))] px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="patientId" className="text-[hsl(var(--foreground))]">Patient</Label>
              <Select
                onValueChange={(value) => handleSelectChange("patientId", value)}
                value={formData.patientId}
                required
              >
                <SelectTrigger className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients && patients.length > 0 ? (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                      No patients available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {user?.role !== "doctor" && ( // Only show doctor select if not a doctor user
              <div>
                <Label htmlFor="doctorId" className="text-[hsl(var(--foreground))]">Doctor</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("doctorId", value)}
                  value={formData.doctorId}
                  required
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="text-[hsl(var(--foreground))]">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
                        !formData.date && "text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                    <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time" className="text-[hsl(var(--foreground))]">Time</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]" />
              </div>
            </div>

            <div>
              <Label htmlFor="type" className="text-[hsl(var(--foreground))]">Appointment Type</Label>
              <Select onValueChange={(value) => handleSelectChange("type", value)} value={formData.type} required>
                <SelectTrigger className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                  <SelectValue placeholder="Select appointment type" />
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

            <div>
              <Label htmlFor="notes" className="text-[hsl(var(--foreground))]">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific notes for the appointment..."
                rows={3}
                className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal-dark))]">
              {loading ? "Booking Appointment..." : "Book Appointment"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}