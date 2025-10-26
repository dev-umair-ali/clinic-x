"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
// import { createAppointment } from "@/lib/slices/appointmentSlice"
// import type { Appointment } from "@/lib/api/services/appointmentService"
import type { RootState } from "@/lib/store"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Clock, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"

// Dummy data for services and doctors
const services = [
  { id: "1", name: "General Checkup", price: 100 },
  { id: "2", name: "Dental Cleaning", price: 120 },
  { id: "3", name: "Eye Exam", price: 80 },
  { id: "4", name: "Physical Therapy", price: 150 },
  { id: "5", name: "Check Up on Cavity", price: 150 },
]

const doctors = [
  { id: "doctor1", name: "Dr. Sarah Smith", specialty: "Internal Medicine" },
  { id: "doctor2", name: "Dr. John Doe", specialty: "Dentistry" },
  { id: "doctor3", name: "Dr. Emily White", specialty: "Ophthalmology" },
  { id: "doctor4", name: "Dr. Ahmed", specialty: "Physical Therapy" },
  { id: "doctor5", name: "Dr. Sarah Ahmed", specialty: "General Practice" },
]

const paymentMethods = [
  { id: "discover", name: "Discover", icon: "/discover-card-logo.png" },
  { id: "visa", name: "Visa", icon: "/visa-card-logo.png" },
  { id: "mastercard", name: "MasterCard", icon: "/mastercard-logo.png" },
  { id: "amex", name: "American Express", icon: "/american-express-logo.png" },
  { id: "paypal", name: "Paypal", icon: "/paypal-logo.png" },
]

interface CalendarProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date) => void
}

function CustomCalendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{format(currentMonth, "MMM yyyy")}</h3>
        <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                h-8 w-8 text-sm rounded-full flex items-center justify-center transition-colors
                ${
                  isSelected
                    ? "bg-[#1DA68F] text-white"
                    : isCurrentDay
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state: RootState) => state.auth)
  const [step, setStep] = useState<"book" | "billing" | "confirm">("book")

  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined)
  const [smsReminders, setSmsReminders] = useState(true)
  const [emailReminders, setEmailReminders] = useState(false)
  const [coPayOption, setCoPayOption] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)

  // Card details state
  const [cardHolderName, setCardHolderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const selectedService = useMemo(() => services.find((s) => s.id === selectedServiceId), [selectedServiceId])

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []
    return ["01:00 PM - 02:00 PM", "03:00 PM - 04:00 PM", "06:00 PM - 07:00 PM "]
  }, [selectedDate])

  const totalCharge = selectedService ? selectedService.price : 0
  const payNowAmount = coPayOption ? totalCharge / 2 : totalCharge
  const remainingDue = coPayOption ? totalCharge / 2 : 0

  const handleBookAppointment = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot || !currentUser) {
      alert("Please fill all appointment details and ensure you are logged in.")
      return
    }
    setStep("billing")
  }

  // const handleConfirmPayment = async () => {
  //   // if (!selectedPaymentMethod) {
  //   //   alert("Please select a payment method.")
  //   //   return
  //   // }

  //   // const newAppointment: Appointment = {
  //   //   _id: uuidv4(),
  //   //   patient: currentUser!.id,
  //   //   doctor: doctors[0].id,
  //   //   dateTime: format(selectedDate!, "yyyy-MM-dd") + " " + selectedTimeSlot!,
  //   //   status: "scheduled",
  //   //   createdAt: new Date().toISOString(),
  //   //   updatedAt: new Date().toISOString(),
  //   // }

  //   // try {
  //   //   await dispatch(createAppointment(newAppointment)).unwrap()
  //   //   setStep("confirm")
  //   // } catch (error) {
  //   //   console.error("Failed to create appointment:", error)
  //   // }
  //   // setStep("confirm")
  // }

  const handleReschedule = () => {
    setStep("book")
    setSelectedServiceId(undefined)
    setSelectedDate(undefined)
    setSelectedTimeSlot(undefined)
    setSelectedPaymentMethod(undefined)
  }

  const handleCancel = () => {
    // For demo purposes, just go back to booking
    setStep("book")
  }

  const currentAppointmentDetails = useMemo(() => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) return null
    return {
      type: selectedService.name,
      doctorName: doctors[0].name,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTimeSlot,
    }
  }, [selectedService, selectedDate, selectedTimeSlot])

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
        <div
          className={`w-full ${
            step === "confirm"
              ? "max-w-lg mx-auto" // Increased width from max-w-md to max-w-lg for the thank you section
              : step === "billing"
                ? "max-w-lg" // Removed left margin, now truly left-aligned
                : "max-w-md" // Removed left margin, now truly left-aligned
          }`}
        >
          {step === "billing" && (
            <button
              onClick={() => setStep("book")}
              className="flex items-center text-[#1DA68F] dark:text-[#1DA68F] mb-4 text-sm font-medium hover:text-[#1DA68F]/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          )}

          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className={`${step === "billing" ? "p-6 sm:p-8" : "p-4 sm:p-6"}`}>
              {step !== "confirm" && (
                <div className="mb-6">
                  <h1
                    className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 ${step === "billing" ? "text-center" : ""}`}
                  >
                    {step === "book" ? "Book New Appointment" : "Appointment Billing"}
                  </h1>
                  {step === "book" && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fill the fields to book new Appointment</p>
                  )}
                </div>
              )}

              {step === "book" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Service
                    </label>
                    <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                      <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {services.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id}
                            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Choose Date
                    </label>
                    <div className="relative">
                      <Input
                        value={selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
                        placeholder="dd/mm/yyyy"
                        readOnly
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="h-11 cursor-pointer bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                      {showCalendar && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1">
                          <CustomCalendar
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                              setSelectedDate(date)
                              setShowCalendar(false)
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Time
                    </label>
                    <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                      <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Available slots" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {availableTimeSlots.map((slot) => (
                          <SelectItem
                            key={slot}
                            value={slot}
                            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 "
                          >
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reminder Preferences</h3>
                    <div className="flex items-center justify-between py-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">SMS Reminders</label>
                      <Switch
                        checked={smsReminders}
                        onCheckedChange={setSmsReminders}
                        className="data-[state=checked]:bg-[#1DA68F] data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Email Reminders</label>
                      <Switch
                        checked={emailReminders}
                        onCheckedChange={setEmailReminders}
                        className="data-[state=checked]:bg-[#1DA68F] data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-11 bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white font-medium transition-colors"
                    onClick={handleBookAppointment}
                    disabled={!selectedService || !selectedDate || !selectedTimeSlot}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === "billing" && currentAppointmentDetails && (
                <div className="space-y-6">
                  <Card className="bg-[#E8F5F3] dark:bg-[#1DA68F]/10 border-[#1DA68F]/20 dark:border-[#1DA68F]/30 p-4">
                    <div className="text-center">
                      <div className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {currentAppointmentDetails.type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {currentAppointmentDetails.doctorName}
                      </div>
                      <div className="text-sm text-[#1DA68F] dark:text-[#1DA68F] font-medium">
                        {format(new Date(currentAppointmentDetails.date), "MMM dd, yyyy")} at{" "}
                        {currentAppointmentDetails.time}
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gray-50 dark:bg-gray-700/50 p-6">
                    <div className="text-center mb-6">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Charge</div>
                      <div className="text-3xl font-bold text-[#1DA68F]">${totalCharge.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-600">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Co-Pay Option (50% now)</label>
                      <Switch
                        checked={coPayOption}
                        onCheckedChange={setCoPayOption}
                        className="data-[state=checked]:bg-[#1DA68F] data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Pay now:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">${payNowAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Remaining due at visit:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">${remainingDue.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                  {selectedPaymentMethod === "mastercard" ? (
                    <div className="space-y-6">
                      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 text-center">
                        Enter Card Details
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Holder Name
                        </label>
                        <Input
                          value={cardHolderName}
                          onChange={(e) => setCardHolderName(e.target.value)}
                          placeholder="Enter Holder Name"
                          className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number
                        </label>
                        <Input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Enter Card Number"
                          className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <Input
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="02/23"
                            className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                          <Input
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="127"
                            className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full h-11 bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white font-medium transition-colors"
                        // onClick={handleConfirmPayment}
                      >
                        Continue to Pay ${payNowAmount.toFixed(2)}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 text-center">
                        Select the Payment method you want to use
                      </h3>

                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <Card
                            key={method.id}
                            className={`p-4 cursor-pointer transition-all border ${
                              selectedPaymentMethod === method.id
                                ? "border-[#1DA68F] bg-[#E8F5F3] dark:bg-[#1DA68F]/10 ring-1 ring-[#1DA68F]"
                                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                            }`}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <div className="flex items-center">
                              <RadioGroup value={selectedPaymentMethod} className="mr-3">
                                <RadioGroupItem
                                  value={method.id}
                                  checked={selectedPaymentMethod === method.id}
                                  className="border-gray-400 dark:border-gray-500 data-[state=checked]:border-[#1DA68F] data-[state=checked]:bg-[#1DA68F]"
                                />
                              </RadioGroup>
                              <div className="flex items-center">
                                <img
                                  src={method.icon || "/placeholder.svg"}
                                  alt={method.name}
                                  className="h-6 w-6 mr-3 object-contain"
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {method.name}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <Button
                        className={`w-full h-11 transition-colors ${
                          selectedPaymentMethod
                            ? "bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!selectedPaymentMethod}
                        // onClick={() => selectedPaymentMethod && handleConfirmPayment()}
                      >
                        Continue
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {step === "confirm" && currentAppointmentDetails && (
                <div className="text-center space-y-6 w-full">
                  <div className="flex flex-col items-center">
                    <img src="/card-checkmark.png" alt="Payment Success" className="mb-4 w-30 h-30 object-contain" />

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Thank You!</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Payment done Successfully</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 px-4 max-w-sm">
                      The Following Item is being booked if you want to cancel or reschedule your appointment, kindly
                      click below.
                    </p>
                  </div>

                  <Card className="bg-[#E8F5F3] dark:bg-[#1DA68F]/10 border-[#1DA68F]/20 dark:border-[#1DA68F]/30 p-4 text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {currentAppointmentDetails.type}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#1DA68F]">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(currentAppointmentDetails.date), "MMMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{currentAppointmentDetails.time}</span>
                      </div>
                    </div>
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-11 bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white font-medium transition-colors"
                      onClick={handleReschedule}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent transition-colors"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
