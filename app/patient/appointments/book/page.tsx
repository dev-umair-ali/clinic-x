"use client"

import { Textarea } from "@/components/ui/textarea"
import type React from "react"

import { ProtectedRoute } from "@/components/ui/protected-route"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    doctorId: user?.role === "doctor" ? user.id : "",
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
    if (date) setFormData({ ...formData, date })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!formData.patientId || !formData.doctorId || !formData.time || !formData.type) {
      setError("Please fill in all required fields.")
      setLoading(false)
      return
    }
    setLoading(false)
    /* your async logic here */
  }

  return (
    <ProtectedRoute allowedRoles={["patient", "doctor" ]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-6">
            Book New Appointment
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))]"
          >
            {error && (
              <div className="bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] border border-[hsl(var(--color-status-error)/0.2)] dark:border-[hsl(var(--color-status-error)/0.3)] text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.2)] border border-[hsl(var(--color-status-success)/0.2)] dark:border-[hsl(var(--color-status-success)/0.3)] text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))] px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Patient Select */}
            <div>
              <Label className="text-[hsl(var(--foreground))]">Patient</Label>
              <Select
                onValueChange={(v) => handleSelectChange("patientId", v)}
                value={formData.patientId}
                required
              >
                <SelectTrigger className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                  {patients.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="text-[hsl(var(--foreground))] focus:bg-[hsl(var(--muted))]"
                    >
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Select (non-doctor users) */}
            {user?.role !== "doctor" && (
              <div>
                <Label className="text-[hsl(var(--foreground))]">Doctor</Label>
                <Select
                  onValueChange={(v) => handleSelectChange("doctorId", v)}
                  value={formData.doctorId}
                  required
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                    {doctors.map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        className="text-[hsl(var(--foreground))] focus:bg-[hsl(var(--muted))]"
                      >
                        {d.name} ({d.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[hsl(var(--foreground))]">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
                        !formData.date && "text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                      className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-[hsl(var(--foreground))]">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                />
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <Label className="text-[hsl(var(--foreground))]">Appointment Type</Label>
              <Select
                onValueChange={(v) => handleSelectChange("type", v)}
                value={formData.type}
                required
              >
                <SelectTrigger className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                  {appointmentTypes.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="text-[hsl(var(--foreground))] focus:bg-[hsl(var(--muted))]"
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-[hsl(var(--foreground))]">Notes (Optional)</Label>
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

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
            >
              {loading ? "Booking Appointment..." : "Book Appointment"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}