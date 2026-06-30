"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchAvailability, saveAvailability } from "@/lib/slices/availabilitySlice"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster";

interface TimeSlot {
  id: string
  start: string
  end: string
}

interface DaySchedule {
  [key: string]: TimeSlot[]
}

function DoctorSettingsContent() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { user: authUser } = useSelector((state: RootState) => state.auth)
  const doctorId = (authUser as any)?.doctorId

  const {
    timeZone: availabilityTimeZone,
    availableDays,
    availabilityId,
    isLoading: isLoadingAvailability,
    isSaving: isSavingAvailability
  } = useSelector((state: RootState) => state.availability)

  const [selectedDays, setSelectedDays] = useState({
    sun: false,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
  })

  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("EST - Eastern Time (UTC-5)")
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  const [schedule, setSchedule] = useState<DaySchedule>({
    sunday: [],
    monday: [{ id: "1", start: "09:00 AM", end: "05:00 PM" }],
    tuesday: [{ id: "2", start: "09:00 AM", end: "05:00 PM" }],
    wednesday: [{ id: "3", start: "09:00 AM", end: "05:00 PM" }],
    thursday: [{ id: "4", start: "09:00 AM", end: "05:00 PM" }],
    friday: [{ id: "5", start: "09:00 AM", end: "05:00 PM" }],
    saturday: [],
  })

  const days = [
    { key: "sun", label: "Sun", full: "sunday" },
    { key: "mon", label: "Mon", full: "monday" },
    { key: "tue", label: "Tue", full: "tuesday" },
    { key: "wed", label: "Wed", full: "wednesday" },
    { key: "thu", label: "Thu", full: "thursday" },
    { key: "fri", label: "Fri", full: "friday" },
    { key: "sat", label: "Sat", full: "saturday" },
  ]

  const generateTimeOptions = () => {
    const times: string[] = []
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const minutes = ['00', '30']
    const periods = ['AM', 'PM']

    periods.forEach(period => {
      hours.forEach(hour => {
        minutes.forEach(minute => {
          times.push(`${hour.toString().padStart(2, '0')}:${minute} ${period}`)
        })
      })
    })

    return times
  }

  const timeOptions = generateTimeOptions()

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: "09:00 AM",
      end: "05:00 PM",
    }
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot],
    }))
  }

  const removeTimeSlot = (day: string, slotId: string) => {
    setSchedule((prev) => {
      const updatedSlots = prev[day]?.filter((slot) => slot.id !== slotId) || []

      // If removing the last time slot, also unselect the day
      if (updatedSlots.length === 0) {
        const dayKey = day.substring(0, 3) as keyof typeof selectedDays
        setSelectedDays((prevDays) => ({ ...prevDays, [dayKey]: false }))
      }

      return {
        ...prev,
        [day]: updatedSlots,
      }
    })
  }

  const updateTimeSlot = (day: string, slotId: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day]?.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)) || [],
    }))
  }

  // Convert Redux availability to local schedule format
  const copyToAllDays = (sourceDay: string) => {
    setSchedule((prev) => {
      const sourceSlots = prev[sourceDay] || []

      if (sourceSlots.length === 0) {
        toast({
          title: "No Time Slots",
          description: "Please add at least one time slot before copying",
          variant: "destructive"
        })
        return prev
      }

      const newSchedule: DaySchedule = {}
      let counter = 0

      days.forEach((day) => {
        newSchedule[day.full] = sourceSlots.map((slot) => ({
          id: `${Date.now()}-${counter++}-${Math.random()}`,
          start: slot.start,
          end: slot.end
        }))
      })

      toast({
        title: "Success",
        description: `Copied ${sourceDay}'s schedule to all days`,
        variant: "default",
      })

      return newSchedule
    })

    setSelectedDays({
      sun: true,
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
    })
  }

  // Convert Redux availability to local schedule format
  useEffect(() => {
    if (availableDays && availableDays.length > 0) {
      const newSchedule: DaySchedule = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      }
      const newSelectedDays = {
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
      }

      availableDays.forEach((dayData) => {
        const dayLower = dayData.day.toLowerCase()
        if (!newSchedule[dayLower]) {
          newSchedule[dayLower] = []
        }
        newSchedule[dayLower].push({
          id: Date.now().toString() + Math.random(),
          start: dayData.from,
          end: dayData.to
        })

        const dayKey = dayLower.substring(0, 3) as keyof typeof newSelectedDays
        newSelectedDays[dayKey] = true
      })

      setSchedule(newSchedule)
      setSelectedDays(newSelectedDays)
    }

    if (availabilityTimeZone) {
      setSelectedTimeZone(availabilityTimeZone)
    }
  }, [availableDays, availabilityTimeZone])

  // Save availability to backend using Redux
  const handleSaveAvailability = async () => {
    try {
      const availableDaysData = Object.entries(schedule)
        .filter(([day]) => {
          const dayKey = day.substring(0, 3) as keyof typeof selectedDays
          return selectedDays[dayKey]
        })
        .flatMap(([day, slots]) =>
          slots.map(slot => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            from: slot.start,
            to: slot.end
          }))
        )

      if (availableDaysData.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please select at least one day and time slot",
          variant: "destructive"
        })
        return
      }

      await dispatch(saveAvailability({
        availabilityId: availabilityId?.toString() || "",
        data: {
          timeZone: selectedTimeZone,
          availableDays: availableDaysData
        }
      })).unwrap()

      toast({
        title: "Success",
        description: "Availability updated successfully",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability",
        variant: "destructive"
      })
    }
  }

  // Load availability when component mounts
  useEffect(() => {
    dispatch(fetchAvailability(doctorId))
  }, [dispatch, doctorId])

  const handleBack = () => {
    router.push("/doctor/dashboard")
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <Toaster />
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <div className="flex-1 p-6 bg-[hsl(var(--background))] min-h-screen">
          <div className="flex items-center gap-2 mb-6 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors w-fit" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Back</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">Settings</h1>
              <p className="text-[hsl(var(--muted-foreground))]">Manage your availability and calendar settings</p>
            </div>
          </div>

          <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-6">
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-6">Manage Availability</h2>

            {/* Google Calendar Connection Status */}
            {/* <div className="mb-6 p-4 bg-[hsl(var(--muted))]/30 rounded-lg border border-[hsl(var(--border))]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-[hsl(var(--foreground))]">Google Calendar Connection</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {isCalendlyConnected ? "Connected to Google Calendar" : "Not connected to Google Calendar"}
                  </p>
                </div>
                <Button
                  variant={isCalendlyConnected ? "outline" : "default"}
                  onClick={isCalendlyConnected ? handleShowDisconnectDialog : () => setShowCalendlyDialog(true)}
                  className={isCalendlyConnected ? "text-[hsl(var(--color-status-error))] border-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-light))]" : ""}
                >
                  {isCalendlyConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div> */}

            {isLoadingAvailability ? (
              <div className="text-center py-8">
                <p className="text-[hsl(var(--muted-foreground))]">Loading availability...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">Time Zone</Label>
                  <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                    <SelectTrigger className="w-full sm:w-64 bg-[hsl(var(--background))] border-[hsl(var(--border))]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                      <SelectItem value="EST - Eastern Time (UTC-5)" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                        EST - Eastern Time (UTC-5)
                      </SelectItem>
                      <SelectItem value="CST - Central Time (UTC-6)" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                        CST - Central Time (UTC-6)
                      </SelectItem>
                      <SelectItem value="MST - Mountain Time (UTC-7)" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                        MST - Mountain Time (UTC-7)
                      </SelectItem>
                      <SelectItem value="PST - Pacific Time (UTC-8)" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                        PST - Pacific Time (UTC-8)
                      </SelectItem>
                      <SelectItem value="AKST - Alaska Time (UTC-9)" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                        AKST - Alaska Time (UTC-9)
                      </SelectItem>
                      <SelectItem value="HST - Hawaii Time (UTC-10)" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                        HST - Hawaii Time (UTC-10)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">Available Hours</h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal))/20] hover:bg-[hsl(var(--color-brand-teal))/10] bg-[hsl(var(--background))]"
                      onClick={() =>
                        setSelectedDays((prev) => {
                          const allSelected = Object.values(prev).every(Boolean)
                          return {
                            sun: !allSelected,
                            mon: !allSelected,
                            tue: !allSelected,
                            wed: !allSelected,
                            thu: !allSelected,
                            fri: !allSelected,
                            sat: !allSelected,
                          }
                        })
                      }
                    >
                      Select All
                    </Button>
                    {days.map((day) => (
                      <Button
                        key={day.key}
                        variant="outline"
                        size="sm"
                        className={`${selectedDays[day.key as keyof typeof selectedDays]
                          ? "bg-[hsl(var(--color-brand-teal))/10] text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal))/20]"
                          : "text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]/50"
                          }`}
                        onClick={() => setSelectedDays((prev) => ({ ...prev, [day.key]: !prev[day.key as keyof typeof prev] }))}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {days.map((day) => (
                      <div
                        key={day.full}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                        onMouseEnter={() => setHoveredDay(day.full)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <div className="w-full sm:w-20 text-sm text-[hsl(var(--foreground))] capitalize font-medium">{day.full}</div>
                        <div className="flex-1 space-y-2">
                          {schedule[day.full]?.map((slot) => (
                            <div key={slot.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <Select
                                value={slot.start}
                                onValueChange={(value) => updateTimeSlot(day.full, slot.id, "start", value)}
                              >
                                <SelectTrigger className="w-full sm:w-32 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] max-h-60">
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time} className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-[hsl(var(--muted-foreground))] text-sm hidden sm:inline">To</span>
                              <Select
                                value={slot.end}
                                onValueChange={(value) => updateTimeSlot(day.full, slot.id, "end", value)}
                              >
                                <SelectTrigger className="w-full sm:w-32 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] max-h-60">
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time} className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(day.full, slot.id)}
                                className="text-[hsl(var(--color-status-error))] hover:text-[hsl(var(--color-status-error-dark))] hover:bg-[hsl(var(--color-status-error-light))] dark:hover:bg-[hsl(var(--color-status-error))/20] w-full sm:w-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          {(!schedule[day.full] || schedule[day.full].length === 0) && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addTimeSlot(day.full)}
                                className="text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] hover:bg-[hsl(var(--color-brand-teal-light))] w-full sm:w-auto"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Time
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white w-full sm:w-auto"
                  onClick={handleSaveAvailability}
                  disabled={isSavingAvailability || isLoadingAvailability}
                >
                  {isSavingAvailability ? "Saving..." : "Update Availability"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function DoctorSettings() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[hsl(var(--muted-foreground))]">Loading...</div>}>
      <DoctorSettingsContent />
    </Suspense>
  )
}