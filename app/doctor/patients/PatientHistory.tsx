"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Pill,
  Search,
  ChevronDown,
  MoreHorizontal,
  Play,
  Pause,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Plus,
  Check,
} from "lucide-react"
import { MdOutlineModeEdit } from "react-icons/md"
import { BsFillSendFill } from "react-icons/bs"

interface PatientHistoryProps {
  onBack?: () => void
}

export default function PatientHistory({ onBack }: PatientHistoryProps) {
  const [activeTab, setActiveTab] = useState("appointments")
  const [appointmentFilter, setAppointmentFilter] = useState("upcoming")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedTime, setSelectedTime] = useState("04:00 PM - 06:00 PM")
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  const [showEditPatientPaid, setShowEditPatientPaid] = useState(false)
  const [editPatientPaidData, setEditPatientPaidData] = useState({
    amount: "",
    reason: "",
  })
  const [editPatientPaidModal, setEditPatientPaidModal] = useState(false)

  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<any>({})

  const handleEditRow = (rowId: string, currentData: any) => {
    if (editingRowId === rowId) {
      // Save changes and exit edit mode
      setEditingRowId(null)
      setEditingData({})
      // Here you would typically save to your backend
      console.log("Saving changes:", editingData)
    } else {
      // Enter edit mode
      setEditingRowId(rowId)
      setEditingData(currentData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdatePaymentStatus = (billId: string, status: string) => {
    console.log(`Updating payment status for bill ${billId} to ${status}`)
  }

  const handleEditBilling = (billId: string) => {
    console.log(`Editing billing record ${billId}`)
  }

  const handleDeleteBilling = (billId: string) => {
    console.log(`Deleting billing record ${billId}`)
  }

  const handleAddMoreBilling = () => {
    console.log("Adding new billing record")
  }

  const handleDeleteAppointment = () => {
    console.log("Deleting appointment")
    setShowEditModal(false)
  }

  const handleUpdateStatus = (status: string) => {
    console.log(`Updating status to ${status}`)
  }

  const handleSaveAppointment = () => {
    console.log("Saving appointment changes")
    setShowEditModal(false)
  }

  const appointments = [
    {
      id: 1,
      date: "15/01/2024",
      patient: "Emma Wilson",
      service: "Consultation",
      status: "Pending",
      time: "04:00 PM - 06:00 PM",
    },
    {
      id: 2,
      date: "15/01/2024",
      patient: "Emma Wilson",
      service: "Consultation",
      status: "Pending",
      time: "04:00 PM - 06:00 PM",
    },
    {
      id: 3,
      date: "15/01/2024",
      patient: "Emma Wilson",
      service: "Consultation",
      status: "Pending",
      time: "04:00 PM - 06:00 PM",
    },
  ]

  const prescriptions = [
    {
      id: 1,
      date: "15/01/2024",
      medication: "Amoxicillin 500mg",
      dosage: "500mg twice daily",
      prescriber: "Dr. Smith",
      status: "Active",
    },
    {
      id: 2,
      date: "15/01/2024",
      medication: "Amoxicillin 500mg",
      dosage: "500mg twice daily",
      prescriber: "Dr. Smith",
      status: "Active",
    },
    {
      id: 3,
      date: "15/01/2024",
      medication: "Amoxicillin 500mg",
      dosage: "500mg twice daily",
      prescriber: "Dr. Smith",
      status: "Active",
    },
    {
      id: 4,
      date: "15/01/2024",
      medication: "Amoxicillin 500mg",
      dosage: "500mg twice daily",
      prescriber: "Dr. Smith",
      status: "Active",
    },
    {
      id: 5,
      date: "15/01/2024",
      medication: "Amoxicillin 500mg",
      dosage: "500mg twice daily",
      prescriber: "Dr. Smith",
      status: "Active",
    },
    {
      id: 6,
      date: "15/01/2024",
      medication: "Amoxicillin 500mg",
      dosage: "500mg twice daily",
      prescriber: "Dr. Smith",
      status: "Active",
    },
  ]

  const patientNotes = [
    {
      id: 1,
      title: "Follow-up Consultation",
      status: "Transcribed",
      date: "2024-01-15",
      time: "3:45",
      size: "2.1 MB",
      transcription: "Patient reports improvement in symptoms. Blood pressure stable at 120/80...",
      isPlaying: false,
    },
    {
      id: 2,
      title: "Follow-up Consultation",
      status: "Pending",
      date: "2024-01-15",
      time: "3:45",
      size: "2.1 MB",
      transcription: "",
      isPlaying: false,
    },
  ]

  const billingHistory = [
    {
      id: 1,
      patient: "Emma Wilson",
      copay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      claimStatus: "Pending",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/Coinsurance",
      paymentStatus: "Pending",
      action: "send",
    },
    {
      id: 2,
      cptCode: "86800",
      description: "FOLIC ACID (SR)",
      charge: "$150.00",
      adjustment: "($118.12)",
      insurancePaid: "($10.27)",
      claimStatus: "Submitted",
      patientPaid: "--",
      date: "08/02/2024",
      patientResponsibility: "($08.27)",
      reason: "Deductible/Coinsurance",
      action: "edit",
    },
    {
      id: 3,
      cptCode: "86800",
      description: "FOLIC ACID (SR)",
      charge: "$150.00",
      adjustment: "($118.12)",
      insurancePaid: "($10.27)",
      claimStatus: "Approved",
      patientPaid: "($08.27)",
      date: "08/02/2024",
      patientResponsibility: "($08.27)",
      reason: "Deductible/Coinsurance",
      action: "check",
    },
    {
      id: 4,
      cptCode: "86800",
      description: "FOLIC ACID (SR)",
      charge: "$150.00",
      adjustment: "($118.12)",
      insurancePaid: "($10.27)",
      claimStatus: "Rejected",
      patientPaid: "--",
      date: "08/02/2024",
      patientResponsibility: "($08.27)",
      reason: "Deductible/Coinsurance",
      action: "delete",
    },
    {
      id: 5,
      patient: "Sarah Corner",
      copay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      claimStatus: "Pending",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/Coinsurance",
      paymentStatus: "Pending",
      action: "send",
    },
  ]

  const timeSlots = ["04:00 PM - 06:00 PM", "01:00 PM - 02:00 PM", "03:00 PM - 04:00 PM", "06:00 PM - 07:00 PM"]

  const handlePrescriptionView = (prescription: any) => {
    setSelectedPrescription(prescription)
    setShowPrescriptionModal(true)
  }

  const Calendar2024 = () => {
    const daysInMonth = [
      [28, 29, 30, 31, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, 30, 31],
      [1, 2, 3, 4, 5, 6, 7],
    ]

    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => console.log("Previous month")}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h3 className="font-medium text-foreground">Jan 2024</h3>
          <button onClick={() => console.log("Next month")}>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          <div className="text-muted-foreground py-1">Mon</div>
          <div className="text-muted-foreground py-1">Tue</div>
          <div className="text-muted-foreground py-1">Wed</div>
          <div className="text-muted-foreground py-1">Thu</div>
          <div className="text-muted-foreground py-1">Fri</div>
          <div className="text-muted-foreground py-1">Sat</div>
          <div className="text-muted-foreground py-1">Sun</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {daysInMonth.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <button
                key={`${weekIndex}-${dayIndex}`}
                className={`h-8 w-8 rounded flex items-center justify-center hover:bg-muted/50 transition-colors ${
                  day === 15
                    ? "bg-teal-500 text-white"
                    : day > 31 || (weekIndex === 0 && day > 7)
                      ? "text-muted-foreground/50"
                      : "text-foreground"
                }`}
                onClick={() => {
                  console.log(`Selected date: ${day}`)
                  setShowCalendar(false)
                }}
              >
                {day}
              </button>
            )),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-6 pb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 bg-[#1DA68F1A] text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 p-4 h-auto font-normal"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Patient Detail
        </Button>
      </div>
      <div className="px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground mb-1">Patient History</h1>
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/woman-profile.png" />
              <AvatarFallback className="bg-muted text-muted-foreground">SJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">Sarah Johnson</h3>
              <p className="text-sm text-muted-foreground">Patient ID: #PAT-2024-001</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-background border-b border-border h-auto p-0 rounded-none">
            <TabsTrigger
              value="appointments"
              className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground rounded-none text-sm font-medium"
            >
              <Calendar className="w-6 h-6" />
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground rounded-none text-sm font-medium"
            >
              <FileText className="w-6 h-6" />
              Patients Notes
            </TabsTrigger>
            <TabsTrigger
              value="prescriptions"
              className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground rounded-none text-sm font-medium"
            >
              <Pill className="w-6 h-6" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground rounded-none text-sm font-medium"
            >
              <DollarSign className="w-6 h-6" />
              Billing History
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="mt-0">
            <div className="bg-card">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 p-4 border-b border-border">
                <Button
                  variant={appointmentFilter === "upcoming" ? "default" : "outline"}
                  onClick={() => setAppointmentFilter("upcoming")}
                  className={`h-8 px-4 text-xs font-medium ${
                    appointmentFilter === "upcoming"
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "border-border text-foreground hover:bg-muted/50"
                  }`}
                >
                  Upcoming
                </Button>
                <Button
                  variant={appointmentFilter === "canceled" ? "default" : "outline"}
                  onClick={() => setAppointmentFilter("canceled")}
                  className={`h-8 px-4 text-xs font-medium ${
                    appointmentFilter === "canceled"
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "border-border text-foreground hover:bg-muted/50"
                  }`}
                >
                  Canceled
                </Button>
                <Button
                  variant={appointmentFilter === "all" ? "default" : "outline"}
                  onClick={() => setAppointmentFilter("all")}
                  className={`h-8 px-4 text-xs font-medium ${
                    appointmentFilter === "all"
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "border-border text-foreground hover:bg-muted/50"
                  }`}
                >
                  All
                </Button>
                <div className="ml-auto flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search Patient"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-8 text-sm border-border bg-background w-full sm:w-48"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-8 text-sm border-border bg-background"
                      >
                        Sort By
                        <ChevronDown className="w-6 h-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSortBy("date")}>Sort By Date</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name")}>Sort By Name</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("status")}>Sort By Status</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-foreground uppercase tracking-wider min-w-[768px] sticky top-0 z-10">
                  <div>DATE</div>
                  <div>PATIENT</div>
                  <div>SERVICE</div>
                  <div>STATUS</div>
                  <div>ACTION</div>
                </div>
                {/* Table Rows */}
                <div className="divide-y divide-border min-w-[640px] sm:min-w-[768px]">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="grid grid-cols-5 gap-4 px-4 py-4 items-center text-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-foreground">{appointment.date}</div>
                      <div className="font-medium text-foreground">{appointment.patient}</div>
                      <div className="text-foreground">{appointment.service}</div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 text-xs border-border bg-background hover:bg-muted/50"
                            >
                              {appointment.status}
                              <ChevronDown className="w-6 h-6 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Pending</DropdownMenuItem>
                            <DropdownMenuItem>Completed</DropdownMenuItem>
                            <DropdownMenuItem>Canceled</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
                              <MoreHorizontal className="w-6 h-6 text-teal-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowPatientModal(true)}>View Detail</DropdownMenuItem>
                            <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowEditModal(true)}>Reschedule</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-border flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border bg-background">
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  <Button size="sm" className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600 text-white text-xs">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs border-border bg-background">
                    2
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border bg-background">
                  Next
                </Button>
                <span className="text-xs text-muted-foreground">10 /Pages</span>
              </div>
            </div>
          </TabsContent>

          {/* Patient Notes Tab */}
          <TabsContent value="notes" className="mt-0">
            <div className="bg-card p-4 sm:p-6 space-y-6">
              {patientNotes.map((note) => (
                <div key={note.id} className="border border-border rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{note.title}</h3>
                          <Badge
                            className={`text-xs px-2 py-1 ${
                              note.status === "Transcribed"
                                ? "bg-teal-500 hover:bg-teal-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {note.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-3">
                          <span>Sarah Johnson</span>
                          <span>
                            {note.time} - {note.date}
                          </span>
                        </div>
                        {note.status === "Transcribed" && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-6 h-6 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground">Transcription</span>
                            </div>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                              {note.transcription}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground flex-shrink-0">
                      <div>{note.size}</div>
                      <div>{note.date}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white h-8 px-4 text-xs">
                      {note.status === "Transcribed" ? (
                        <>
                          <Play className="w-6 h-6 mr-1" />
                          Play
                        </>
                      ) : (
                        <>
                          <Pause className="w-6 h-6 mr-1" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-4 text-xs border-border bg-background">
                      <MdOutlineModeEdit className="w-6 h-6 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-4 text-xs border-border bg-background">
                      <Download className="w-6 h-6 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-4 text-xs border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-background"
                    >
                      <Trash2 className="w-6 h-6 mr-1" />
                      Delete
                    </Button>
                  </div>
                  {note.status === "Pending" && (
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Processing...</span>
                        <span>{note.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="mt-0">
            <div className="bg-card">
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-foreground uppercase tracking-wider min-w-[480px] sm:min-w-[600px]">
                  <div>DATE</div>
                  <div>MEDICATION</div>
                  <div>DOSAGE</div>
                  <div>ACTION</div>
                </div>
                {/* Table Rows */}
                <div className="divide-y divide-border min-w-[480px] sm:min-w-[600px]">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="grid grid-cols-4 gap-4 px-4 py-4 items-center text-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-foreground">{prescription.date}</div>
                      <div className="font-medium text-foreground">{prescription.medication}</div>
                      <div className="text-foreground">{prescription.dosage}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-teal-500 hover:bg-teal-600 text-white h-7 px-3 text-xs"
                          onClick={() => handlePrescriptionView(prescription)}
                        >
                          <Eye className="w-6 h-6 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs border-border bg-background">
                          <RefreshCw className="w-6 h-6 mr-1" />
                          Refill
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-border flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border bg-background">
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  <Button size="sm" className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600 text-white text-xs">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs border-border bg-background">
                    2
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border bg-background">
                  Next
                </Button>
                <span className="text-xs text-muted-foreground">10 /Pages</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <div className="bg-card dark:bg-gray-900">
              <div className="w-full">
                <div className="overflow-x-auto border border-slate-200 dark:border-gray-700 rounded-lg">
                  <div className="min-w-[1600px] lg:min-w-[1800px]">
                    {/* Main Header Row */}
                    <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-slate-100 dark:bg-gray-800 border-b border-border dark:border-gray-700 text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                      <div>PATIENT</div>
                      <div>CO PAY</div>
                      <div>DESCRIPTION</div>
                      <div>CHARGE</div>
                      <div>ADJUSTMENT</div>
                      <div>INSURANCE PAID</div>
                      <div>CLAIM STATUS</div>
                      <div
                        className="flex items-center gap-1 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        onClick={() => setEditPatientPaidModal(true)}
                      >
                        PATIENT PAID
                        <MdOutlineModeEdit className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>DATE</div>
                      <div>PATIENT RESPONSIBILITY</div>
                      <div>REASON</div>
                      <div>PAYMENT STATUS</div>
                      <div>ACTION</div>
                    </div>

                    {/* Emma Wilson Row */}
                    <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-4 items-center text-sm border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
                          <img src="/woman-profile.png" alt="Emma Wilson" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-gray-100 text-xs lg:text-sm truncate">
                          Emma Wilson
                        </span>
                      </div>
                      <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">$20</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">FOLIC ACID (SR)</div>
                      <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">$250.00</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">($118.12)</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">($12.27)</div>
                      <div>
                        <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 text-xs px-2 py-1 font-medium border-0">
                          Pending
                        </Badge>
                      </div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">--</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">30/01/2024</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">($12.27)</div>
                      <div className="text-slate-600 dark:text-gray-400 text-xs">Deductible/Coinsurance</div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300"
                            >
                              Pending
                              <ChevronDown className="w-6 h-6 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Submitted
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Denied
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                        >
                          <BsFillSendFill className="w-6 h-6 lg:w-4 lg:h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Detail Header Row */}
                    <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-slate-50 dark:bg-gray-800 border-b border-border dark:border-gray-700 text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                      <div>CPT CODE</div>
                      <div></div>
                      <div>DESCRIPTION</div>
                      <div>CHARGE</div>
                      <div>ADJUSTMENT</div>
                      <div>INSURANCE PAID</div>
                      <div>CLAIM STATUS</div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        PATIENT PAID
                      </div>
                      <div>DATE</div>
                      <div>PATIENT RESPONSIBILITY</div>
                      <div>REASON</div>
                      <div></div>
                      <div>ACTION</div>
                    </div>

                    {/* Detail Rows */}
                    <div className="bg-slate-25 dark:bg-gray-900">
                      {/* Submitted Row */}
                      <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                        {/* CPT Code */}
                        <div className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.cptCode || "86800"}
                              onChange={(e) => handleInputChange("cptCode", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "86800"
                          )}
                        </div>

                        {/* Description */}
                        <div className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.description || "FOLIC ACID (SR)"}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "FOLIC ACID (SR)"
                          )}
                        </div>

                        {/* Charge */}
                        <div className="text-xs lg:text-sm text-gray-900 dark:text-gray-100">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.charge || "$150.00"}
                              onChange={(e) => handleInputChange("charge", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "$150.00"
                          )}
                        </div>

                        {/* Insurance Adjustment */}
                        <div className="text-xs lg:text-sm text-red-600 dark:text-red-400">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.insuranceAdjustment || "($18.12)"}
                              onChange={(e) => handleInputChange("insuranceAdjustment", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "($18.12)"
                          )}
                        </div>

                        {/* Insurance Paid */}
                        <div className="text-xs lg:text-sm text-green-600 dark:text-green-400">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.insurancePaid || "($10.27)"}
                              onChange={(e) => handleInputChange("insurancePaid", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "($10.27)"
                          )}
                        </div>

                        {/* Patient Paid */}
                        <div className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.patientPaid || "--"}
                              onChange={(e) => handleInputChange("patientPaid", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "--"
                          )}
                        </div>

                        {/* Date */}
                        <div className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                          {editingRowId === "submitted" ? (
                            <input
                              type="date"
                              value={editingData.date || "2024-08-02"}
                              onChange={(e) => handleInputChange("date", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "08/02/2024"
                          )}
                        </div>

                        {/* Balance */}
                        <div className="text-xs lg:text-sm text-red-600 dark:text-red-400">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.balance || "($08.27)"}
                              onChange={(e) => handleInputChange("balance", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "($08.27)"
                          )}
                        </div>

                        {/* Notes */}
                        <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                          {editingRowId === "submitted" ? (
                            <input
                              type="text"
                              value={editingData.notes || "Deductible/Coinsurance"}
                              onChange={(e) => handleInputChange("notes", e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          ) : (
                            "Deductible/Coinsurance"
                          )}
                        </div>
                        <div></div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                            onClick={() =>
                              handleEditRow("submitted", {
                                cptCode: "86800",
                                description: "FOLIC ACID (SR)",
                                charge: "$150.00",
                                insuranceAdjustment: "($18.12)",
                                insurancePaid: "($10.27)",
                                patientPaid: "--",
                                date: "08/02/2024",
                                balance: "($08.27)",
                                notes: "Deductible/Coinsurance",
                              })
                            }
                          >
                            {editingRowId === "submitted" ? (
                              <Check className="w-6 h-6 lg:w-4 lg:h-4" />
                            ) : (
                              <MdOutlineModeEdit className="w-6 h-6 lg:w-4 lg:h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-6 h-6 lg:w-4 lg:h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Approved Row */}
                      <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                        <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.cptCode || "86800"}
                              onChange={(e) => handleInputChange("cptCode", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "86800"
                          )}
                        </div>
                        <div></div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.description || "FOLIC ACID (SR)"}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "FOLIC ACID (SR)"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.charge || "$150.00"}
                              onChange={(e) => handleInputChange("charge", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "$150.00"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.insuranceAdjustment || "($18.12)"}
                              onChange={(e) => handleInputChange("insuranceAdjustment", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "($18.12)"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.insurancePaid || "($10.27)"}
                              onChange={(e) => handleInputChange("insurancePaid", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "($10.27)"
                          )}
                        </div>
                        <div>
                          <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 text-xs px-2 py-1 font-medium border-0">
                            Approved
                          </Badge>
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.patientPaid || "--"}
                              onChange={(e) => handleInputChange("patientPaid", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "--"
                          )}
                        </div>
                        <div className="flex items-center gap-1 lg:gap-2 text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          <Calendar className="w-6 h-6 lg:w-4 lg:h-4 text-slate-400 dark:text-gray-500" />
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.date || "08/02/2024"}
                              onChange={(e) => handleInputChange("date", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "08/02/2024"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.balance || "($08.27)"}
                              onChange={(e) => handleInputChange("balance", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "($08.27)"
                          )}
                        </div>
                        <div className="text-slate-600 dark:text-gray-400 text-xs">
                          {editingRowId === "approved" ? (
                            <input
                              type="text"
                              value={editingData.notes || "Deductible/Coinsurance"}
                              onChange={(e) => handleInputChange("notes", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "Deductible/Coinsurance"
                          )}
                        </div>
                        <div></div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                            onClick={() =>
                              handleEditRow("approved", {
                                cptCode: "86800",
                                description: "FOLIC ACID (SR)",
                                charge: "$150.00",
                                insuranceAdjustment: "($18.12)",
                                insurancePaid: "($10.27)",
                                patientPaid: "--",
                                date: "08/02/2024",
                                balance: "($08.27)",
                                notes: "Deductible/Coinsurance",
                              })
                            }
                          >
                            {editingRowId === "approved" ? (
                              <Check className="w-6 h-6 lg:w-4 lg:h-4" />
                            ) : (
                              <MdOutlineModeEdit className="w-6 h-6 lg:w-4 lg:h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Rejected Row */}
                      <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                        <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.cptCode || "86800"}
                              onChange={(e) => handleInputChange("cptCode", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "86800"
                          )}
                        </div>
                        <div></div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.description || "FOLIC ACID (SR)"}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "FOLIC ACID (SR)"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.charge || "$150.00"}
                              onChange={(e) => handleInputChange("charge", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "$150.00"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.insuranceAdjustment || "($18.12)"}
                              onChange={(e) => handleInputChange("insuranceAdjustment", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "($18.12)"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.insurancePaid || "($10.27)"}
                              onChange={(e) => handleInputChange("insurancePaid", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "($10.27)"
                          )}
                        </div>
                        <div>
                          <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900 text-xs px-2 py-1 font-medium border-0">
                            Rejected
                          </Badge>
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.patientPaid || "--"}
                              onChange={(e) => handleInputChange("patientPaid", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "--"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.date || "08/02/2024"}
                              onChange={(e) => handleInputChange("date", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "08/02/2024"
                          )}
                        </div>
                        <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.balance || "($08.27)"}
                              onChange={(e) => handleInputChange("balance", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "($08.27)"
                          )}
                        </div>
                        <div className="text-slate-600 dark:text-gray-400 text-xs">
                          {editingRowId === "rejected" ? (
                            <input
                              type="text"
                              value={editingData.notes || "Deductible/Coinsurance"}
                              onChange={(e) => handleInputChange("notes", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            />
                          ) : (
                            "Deductible/Coinsurance"
                          )}
                        </div>
                        <div></div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                            onClick={() =>
                              handleEditRow("rejected", {
                                cptCode: "86800",
                                description: "FOLIC ACID (SR)",
                                charge: "$150.00",
                                insuranceAdjustment: "($18.12)",
                                insurancePaid: "($10.27)",
                                patientPaid: "--",
                                date: "08/02/2024",
                                balance: "($08.27)",
                                notes: "Deductible/Coinsurance",
                              })
                            }
                          >
                            {editingRowId === "rejected" ? (
                              <Check className="w-6 h-6 lg:w-4 lg:h-4" />
                            ) : (
                              <MdOutlineModeEdit className="w-6 h-6 lg:w-4 lg:h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-6 h-6 lg:w-4 lg:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Add More Button */}
                    <div className="px-3 lg:px-4 py-4 border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900 h-8 px-3 text-sm font-medium"
                        onClick={handleAddMoreBilling}
                      >
                        <Plus className="w-6 h-6 mr-2" />
                        Add More
                      </Button>
                    </div>

                    {/* Sarah Corner Row */}
                    <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-4 items-center text-sm border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
                          <img src="/patient-profile.png" alt="Sarah Corner" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-gray-100 text-xs lg:text-sm truncate">
                          Sarah Corner
                        </span>
                      </div>
                      <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">$20</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">FOLIC ACID (SR)</div>
                      <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">$250.00</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">($118.12)</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">($12.27)</div>
                      <div>
                        <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 text-xs px-2 py-1 font-medium border-0">
                          Pending
                        </Badge>
                      </div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">--</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">30/01/2024</div>
                      <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">($12.27)</div>
                      <div className="text-slate-600 dark:text-gray-400 text-xs">Deductible/Coinsurance</div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300"
                            >
                              Pending
                              <ChevronDown className="w-6 h-6 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Submitted
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                              Denied
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                        >
                          <BsFillSendFill className="w-6 h-6 lg:w-4 lg:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-100 dark:hover:bg-gray-800 px-3 py-2 text-sm"
                  >
                    Previous
                  </Button>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 text-sm">
                    1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-100 dark:hover:bg-gray-800 px-3 py-2 text-sm"
                  >
                    2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-100 dark:hover:bg-gray-800 px-3 py-2 text-sm"
                  >
                    Next
                  </Button>
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">10 /Pages</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent
          className="fixed right-0 top-0 h-full max-h-full w-full sm:w-[400px] p-0 gap-0 bg-card border-l border-border rounded-none translate-x-0 translate-y-0"
          style={{ top: 0, left: "auto", transform: "none" }}
        >
          <DialogHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">Edit Detailssdsd</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50 text-red-500"
                onClick={handleDeleteAppointment}
              >
                <Trash2 className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
                onClick={() => setShowEditModal(false)}
              >
                {/* <X className="w-6 h-6" /> */}
              </Button>
            </div>
          </DialogHeader>

          <div className="p-4 space-y-4 max-h-full overflow-y-auto">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Patient Name</label>
              <Input value="Emma Wilson" className="h-9 text-sm bg-background border-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Date & Time</label>
              <Input value="Emma Wilson" className="h-9 text-sm bg-background border-border" />
              <div className="text-xs text-muted-foreground mt-1">GMT + 05:00 Asia/Karachi (PKT)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Date</label>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="text-sm text-foreground hover:text-teal-600 transition-colors font-medium"
                  >
                    Fri, Jul 17th, 2025
                  </button>
                  {showCalendar && <Calendar2024 />}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Slot</label>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="w-full justify-between h-8 text-xs border-border bg-background"
                  >
                    {selectedTime}
                    <ChevronDown className="w-6 h-6" />
                  </Button>
                  {showTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTime(slot)
                            setShowTimeDropdown(false)
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Update Status:</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-9 text-sm border-border bg-background">
                    Pending
                    <ChevronDown className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleUpdateStatus("Pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateStatus("Completed")}>Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateStatus("Canceled")}>Canceled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button className="w-full bg-teal-500 hover:bg-teal-600 h-9 text-sm" onClick={handleSaveAppointment}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrescriptionModal} onOpenChange={setShowPrescriptionModal}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl p-0 gap-0 bg-card border-border">
          <DialogHeader className="p-4 pb-0 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="w-5 h-5" />
              Prescription Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-muted/50"
              onClick={() => setShowPrescriptionModal(false)}
            >
              {/* <X className="w-6 h-6" /> */}
            </Button>
          </DialogHeader>
          <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-3 text-foreground">State</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-foreground font-medium">State of New Jersey</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Prescriber Address</div>
                    <div className="font-medium text-foreground">PANKAJ RAMANLAL SHIROLWALA, M.D.</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Telephone</div>
                    <div className="font-medium text-foreground">(732) 442-2211</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">NPI Number</div>
                    <div className="font-medium text-foreground">1003882523</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">DEA #</div>
                    <div className="font-medium text-foreground">BS9168091</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-foreground">Date Prescribed</h4>
                <div className="space-y-3 text-sm">
                  <div className="font-medium text-foreground">Dec 15, 2024</div>
                  <div>
                    <div className="text-muted-foreground text-xs">Prescriber Address</div>
                    <div className="font-medium text-foreground">
                      609 AMBOY AVENUE, SUITE 101, PERTH AMBOY, NJ 08861
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Fax</div>
                    <div className="font-medium text-foreground">(732) 326-0517</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">License #</div>
                    <div className="font-medium text-foreground">25MA07849500</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-foreground">Patient Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Patient Name</div>
                  <div className="font-medium text-foreground">Sarah Corner</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Patient Address</div>
                  <div className="font-medium text-foreground">609 AMBOY AVENUE, SUITE 101, PERTH AMBOY, NJ 08861</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-muted-foreground text-xs mb-2">Patient Illness Detail</div>
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border border-border">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                  totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                  sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="text-muted-foreground text-xs">Substitution Permissible</div>
                  <div className="font-medium text-foreground">YES</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Do Not Refill</div>
                  <div className="font-medium text-foreground">YES</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Medication</div>
                  <div className="font-medium text-foreground">Amoxicillin 500mg</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-muted-foreground text-xs">Do Not Substitute</div>
                  <div className="font-medium text-foreground">NO</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Refill Times</div>
                  <div className="font-medium text-foreground">2 Times Weekly</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Dosage</div>
                  <div className="font-medium text-foreground">500mg twice daily</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-2">Instructions</div>
              <div className="text-sm font-medium text-foreground">
                Take with food for 7 days. Complete the full course even if symptoms improve.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button className="flex-1 bg-teal-500 hover:bg-teal-600 h-9 text-sm">Download</Button>
              <Button
                variant="outline"
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 h-9 text-sm border-border"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPatientModal} onOpenChange={setShowPatientModal}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md p-0 gap-0 bg-card border-border">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-lg font-semibold text-foreground">Patient Details</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-muted/50"
              onClick={() => setShowPatientModal(false)}
            >
              {/* <X className="w-6 h-6" /> */}
            </Button>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/woman-profile.png" />
                <AvatarFallback className="bg-muted text-muted-foreground">SJ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">Patient ID: #PAT-2024-001</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Age</div>
                <div className="font-medium text-foreground">32 years</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Gender</div>
                <div className="font-medium text-foreground">Female</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Blood Type</div>
                <div className="font-medium text-foreground">O+</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Last Visit</div>
                <div className="font-medium text-foreground">Dec 15, 2024</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="w-6 h-6 text-muted-foreground" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="w-6 h-6 text-muted-foreground" />
                <span>sarah.johnson@email.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin className="w-6 h-6 text-muted-foreground" />
                <span>123 Main St, City, State 12345</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="w-6 h-6 text-muted-foreground" />
                <span>DOB: March 15, 1992</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {editPatientPaidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Edit Patient Paid</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditPatientPaidModal(false)}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                {/* <X className="w-6 h-6" /> */}
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Amount Paid</label>
                <input
                  type="text"
                  placeholder="Enter Patient Name"
                  value={editPatientPaidData.amount}
                  onChange={(e) =>
                    setEditPatientPaidData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Change</label>
                <textarea
                  placeholder="Short note explaining why the amount was modified"
                  value={editPatientPaidData.reason}
                  onChange={(e) =>
                    setEditPatientPaidData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                onClick={() => setEditPatientPaidModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  // Handle save logic here
                  setEditPatientPaidModal(false)
                  setEditPatientPaidData({ amount: "", reason: "" })
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
