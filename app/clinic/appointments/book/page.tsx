"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { ProtectedRoute } from "@/components/ui/protected-route"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
// import { createAppointment } from "@/lib/slices/appointmentSlice"
// import type { Appointment } from "@/lib/api/services/appointmentService"
import type { RootState } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BookAppointmentPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { patients } = useSelector((state: RootState) => state.patients)
  const { doctors } = useSelector((state: RootState) => state.doctors)
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: user?.role === "doctor" ? user.id : "", // Pre-fill if doctor
    date: new Date(),
    time: "",
    type: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const appointmentTypes = ["Consultation", "Follow-up", "Emergency", "Check-up"]

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
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time || !formData.type) {
      setError("Please fill in all required fields.")
      setLoading(false)
      return
    }

    const selectedPatient = patients.find((p) => p.id === formData.patientId)
    const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)

    if (!selectedPatient || !selectedDoctor) {
      setError("Invalid patient or doctor selected.")
      setLoading(false)
      return
    }

    // const newAppointment: Appointment = {
    //   id: `apt${Date.now()}`,
    //   patientId: formData.patientId,
    //   patientName: selectedPatient.name,
    //   patientAvatar: selectedPatient.avatar,
    //   doctorId: formData.doctorId,
    //   doctorName: selectedDoctor.name,
    //   date: formData.date.toISOString().split("T")[0], // YYYY-MM-DD
    //   time: formData.time,
    //   type: formData.type,
    //   status: "scheduled", // Default status
    //   notes: formData.notes,
    // }

    // try {
    //   await dispatch(createAppointment(newAppointment)).unwrap()
    //   setSuccess("Appointment booked successfully!")
    //   setFormData({
    //     patientId: "",
    //     doctorId: user?.role === "doctor" ? user.id : "",
    //     date: new Date(),
    //     time: "",
    //     type: "",
    //     notes: "",
    //   })
    //   setTimeout(() => {
    //     router.push(user?.role === "patient" ? "/patient/appointments" : "/doctor/appointments")
    //   }, 1500)
    // } catch (err) {
    //   setError("Failed to book appointment. Please try again.")
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <ProtectedRoute allowedRoles={["patient", "doctor", "clinic"]}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h1>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="patientId">Patient</Label>
              <Select
                onValueChange={(value) => handleSelectChange("patientId", value)}
                value={formData.patientId}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {user?.role !== "doctor" && ( // Only show doctor select if not a doctor user
              <div>
                <Label htmlFor="doctorId">Doctor</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("doctorId", value)}
                  value={formData.doctorId}
                  required
                >
                  <SelectTrigger className="w-full">
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
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <Select onValueChange={(value) => handleSelectChange("type", value)} value={formData.type} required>
                <SelectTrigger className="w-full">
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
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific notes for the appointment..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Booking Appointment..." : "Book Appointment"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
