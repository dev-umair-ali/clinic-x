"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Calendar,
  UserCheck,
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Heart,
  Pill,
  AlertTriangle,
  Scissors,
  User,
  StickyNote,
  Moon,
  Activity,
  Wine,
  Baby,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  X,
  FileImage,
  CreditCard,
  Stethoscope,
  Receipt,
  ArrowLeft,
  Download,
  Eye,
  ChevronDown,
} from "lucide-react"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  bloodType: string
  lastVisit: string
  avatar?: string
  patientId: string
  dob: string
  address: string
  status: string
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    age: 32,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 15, 2024",
    patientId: "#PAT-2024-001",
    dob: "March 15, 1992",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 15, 2024",
    patientId: "#PAT-2024-002",
    dob: "March 15, 1982",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 15, 2024",
    patientId: "#PAT-2024-003",
    dob: "March 15, 1982",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 15, 2024",
    patientId: "#PAT-2024-004",
    dob: "March 15, 1982",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 15, 2024",
    patientId: "#PAT-2024-005",
    dob: "March 15, 1982",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  },
  {
    id: "6",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 15, 2024",
    patientId: "#PAT-2024-006",
    dob: "March 15, 1982",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  },
]

export default function CompletePatientManagement() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [currentView, setCurrentView] = useState<"dashboard" | "patient-profile" | "patient-dashboard" | "procedure">(
    "dashboard",
  )
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showOnboarded, setShowOnboarded] = useState(false)
  const [activeTab, setActiveTab] = useState("medical-history")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
  })

  if (user?.role !== "doctor") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only doctors can access patient management.</p>
        </div>
      </div>
    )
  }

  const handleAddPatient = () => {
    setShowAddPatient(false)
    setShowOnboarded(true)
    setNewPatient({ name: "", email: "", phone: "" })
  }

  const handleViewProfile = (patient: Patient) => {
    setSelectedPatient(patient)
    setCurrentView("patient-profile")
  }

  const handleStartProcedure = () => {
    setCurrentView("procedure")
  }

  const handleHistory = () => {
    setCurrentView("patient-dashboard")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedPatient(null)
  }

  const handleBackToProfile = () => {
    setCurrentView("patient-profile")
  }

  // Screen 10: Procedure Screen with Sidebar
  if (currentView === "procedure" && selectedPatient) {
    return <ProcedureScreen patient={selectedPatient} onBack={handleBackToProfile} />
  }

  // Screen 8: Patient Dashboard (History Overview)
  if (currentView === "patient-dashboard" && selectedPatient) {
    return <PatientDashboard patient={selectedPatient} onBack={handleBackToProfile} />
  }

  // Screens 4-9: Patient Profile with All Tabs
  if (currentView === "patient-profile" && selectedPatient) {
    return (
      <PatientProfile
        patient={selectedPatient}
        onBack={handleBackToDashboard}
        onStartProcedure={handleStartProcedure}
        onHistory={handleHistory}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    )
  }

  // Screens 1-3: Main Dashboard, Add Patient Modal, Success Modal
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Screen 1: Main Patient Management Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">View, track, and manage all your Patients.</p>
        </div>
        <Button onClick={() => setShowAddPatient(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100">Total Patients</p>
                <p className="text-3xl font-bold">800K</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-teal-200" />
                <span className="text-sm text-teal-100">+20%</span>
              </div>
            </div>
            {/* Wave pattern */}
            <div className="absolute bottom-0 right-0 opacity-20">
              <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
                <path d="M0 30C20 10, 40 50, 60 30C80 10, 100 50, 120 30V60H0V30Z" fill="white" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Appointments This Week</p>
                <p className="text-3xl font-bold text-gray-900">160</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-8 h-8 text-gray-400" />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-red-500">-12%</span>
                  <svg width="20" height="12" viewBox="0 0 20 12" className="text-red-500">
                    <path d="M2 10L8 4L12 8L18 2" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Follow-Ups Due</p>
                <p className="text-3xl font-bold text-gray-900">42</p>
              </div>
              <UserCheck className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Patient List</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search Patient"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    Sort By
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Sort By Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("age")}>Sort By Age</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600 uppercase text-xs tracking-wider">NAME</th>
                  <th className="text-left p-4 font-medium text-gray-600 uppercase text-xs tracking-wider">
                    AGE / GENDER
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600 uppercase text-xs tracking-wider">
                    LAST VISIT DATE
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600 uppercase text-xs tracking-wider">STATUS</th>
                  <th className="text-left p-4 font-medium text-gray-600 uppercase text-xs tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {patient.age} / {patient.gender}
                    </td>
                    <td className="p-4">30/01/2024</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/2 h-full bg-teal-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">{patient.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert("Add Notes")}>
                            <StickyNote className="w-4 h-4 mr-2" />
                            Add Notes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert("Write Prescription")}>
                            <Pill className="w-4 h-4 mr-2" />
                            Write Prescription
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert("Add Bill")}>
                            <Receipt className="w-4 h-4 mr-2" />
                            Add Bill
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert("Manage Appointment")}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Manage Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewProfile(patient)}>
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-teal-600 text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Next
            </Button>
            <span className="text-sm text-gray-600">10 /Pages</span>
          </div>
        </CardContent>
      </Card>

      {/* Screen 2: Add Patient Modal */}
      <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setShowAddPatient(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Patient Name</label>
              <Input
                placeholder="Enter Patient Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
              <Input
                placeholder="Enter Email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Phone Number</label>
              <Input
                placeholder="Enter Phone Number"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddPatient(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddPatient} className="flex-1 bg-teal-600 hover:bg-teal-700">
                Onboard Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Screen 3: Patient Onboarded Success Modal */}
      <Dialog open={showOnboarded} onOpenChange={setShowOnboarded}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Onboarded</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setShowOnboarded(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Sara John has been added. Click Add new Patient Button to add another Patient
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowOnboarded(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowOnboarded(false)
                  setShowAddPatient(true)
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Add New Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Screen 4-9: Patient Profile with All Tabs
function PatientProfile({
  patient,
  onBack,
  onStartProcedure,
  onHistory,
  activeTab,
  setActiveTab,
}: {
  patient: Patient
  onBack: () => void
  onStartProcedure: () => void
  onHistory: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Patient Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-medium">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">Patient ID: {patient.patientId}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onStartProcedure} className="bg-teal-600 hover:bg-teal-700">
              Start the Procedure
            </Button>
            <Button variant="outline" onClick={onHistory}>
              History
            </Button>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 mb-6">
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-semibold">{patient.age} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-semibold">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Type</p>
            <p className="font-semibold">{patient.bloodType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Visit</p>
            <p className="font-semibold">{patient.lastVisit}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{patient.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>DOB: {patient.dob}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white">
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="dental-history">Dental History</TabsTrigger>
          <TabsTrigger value="insurance-info">Insurance Info</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="consent-legal">Consent & Legal</TabsTrigger>
          <TabsTrigger value="uploads-documents">Uploads & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="medical-history">
          <MedicalHistoryTab />
        </TabsContent>

        <TabsContent value="dental-history">
          <DentalHistoryTab />
        </TabsContent>

        <TabsContent value="insurance-info">
          <InsuranceInfoTab />
        </TabsContent>

        <TabsContent value="lifestyle">
          <LifestyleTab />
        </TabsContent>

        <TabsContent value="consent-legal">
          <ConsentLegalTab />
        </TabsContent>

        <TabsContent value="uploads-documents">
          <UploadsDocumentsTab />
        </TabsContent>
      </Tabs>

      <Button variant="outline" onClick={onBack} className="mt-6 bg-transparent">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Patient List
      </Button>
    </div>
  )
}

// Screen 6: Medical History Tab
function MedicalHistoryTab() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Medical History</h3>
        <p className="text-gray-600 text-sm">Comprehensive medical background and conditions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Medical Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Hypertension
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Type 2 Diabetes
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              High Cholesterol
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Asthma
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Asthma
            </Badge>
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Lisinopril 10mg daily
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Metformin 500mg twice daily
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Atorvastatin 20mg daily
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Albuterol inhaler as needed
            </Badge>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-800">Penicillin - Rash</span>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-800">Shellfish - Hives</span>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-800">Latex - Contact dermatitis</span>
              <Badge variant="destructive">Critical</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Surgical History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              Surgical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Appendectomy</p>
              <p className="text-sm text-gray-600">2018-03-15 • City General Hospital</p>
            </div>
            <div>
              <p className="font-medium">Cholecystectomy</p>
              <p className="text-sm text-gray-600">2020-11-08 • Metropolitan Medical Center</p>
            </div>
          </CardContent>
        </Card>

        {/* Primary Care Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Primary Care Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Primary Care Physician</p>
                <p className="font-medium">Dr. Jennifer Martinez</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Thinner Use</p>
                <p className="font-medium">Yes - Currently Taking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Patient reports family history of cardiovascular disease. Father had MI at age 58. Mother has diabetes.
              Patient is compliant with medications and follows diabetic diet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DentalHistoryTab() {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Dental History</h3>
        <p className="text-gray-600 text-sm">Comprehensive dental background and treatments</p>
      </div>
      <p className="text-gray-500">Dental history information would be displayed here...</p>
    </div>
  )
}

// Screen 4: Insurance Info Tab
function InsuranceInfoTab() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Insurance Information</h3>
        <p className="text-gray-600 text-sm">Medical, dental, and chiropractic insurance details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Insurance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Medical Insurance
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Insurance Company</p>
              <p className="font-semibold">Blue Cross Blue Shield</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Policy Holder</p>
                <p className="font-medium">John Smith</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Group ID</p>
                <p className="font-medium">BCBS-98765</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member ID</p>
                <p className="font-medium">BC-123456789</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dental Insurance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dental Insurance
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Insurance Company</p>
              <p className="font-semibold">Delta Dental</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Policy Holder</p>
                <p className="font-medium">John Smith</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Group ID</p>
                <p className="font-medium">BCBS-98765</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member ID</p>
                <p className="font-medium">BC-123456789</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Insurance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Active Policies</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Cards Uploaded</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-gray-600">Missing Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Emergency Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Insurance Emergency Contact
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Contact Name</p>
                <p className="font-medium">Sarah Smith (Spouse)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">(555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Relationship</p>
                <p className="font-medium">Spouse</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Authority Level</p>
              <Badge className="bg-blue-100 text-blue-800">Full Authorization</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Screen 7: Lifestyle Tab
function LifestyleTab() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Lifestyle & Risk Factors</h3>
        <p className="text-gray-600 text-sm">Sleep, exercise, substance use, and occupational factors</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sleep & Rest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Sleep & Rest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Sleep Quality</p>
              <Badge className="bg-blue-100 text-blue-800">Good</Badge>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p className="font-medium">Sleep Setup</p>
              <div className="text-sm space-y-1">
                <p>
                  Pillow: <span className="font-medium">Memory foam</span>
                </p>
                <p>
                  Mattress: <span className="font-medium">Medium firm</span>
                </p>
                <p>
                  Position: <span className="font-medium">Side sleeper</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise & Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Exercise & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Exercise Frequency</p>
              <Badge className="bg-blue-100 text-blue-800">Weekly</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupation Type</p>
              <Badge className="bg-blue-100 text-blue-800">Sitting Work</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Substance Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wine className="w-5 h-5" />
              Substance Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Alcohol Use</p>
                <Badge className="bg-blue-100 text-blue-800">Occasionally</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tobacco Use</p>
                <Badge className="bg-blue-100 text-blue-800">Never</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recreational Drugs</p>
                <Badge className="bg-blue-100 text-blue-800">No</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reproductive Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Reproductive Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600">Pregnancy Status</p>
              <Badge className="bg-blue-100 text-blue-800">Not Applicable</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-bold">Low</p>
              <p className="text-sm text-gray-600">Cardiovascular Risk</p>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-bold">Moderate</p>
              <p className="text-sm text-gray-600">Musculoskeletal Risk</p>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-bold">Low</p>
              <p className="text-sm text-gray-600">Substance Use Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Screen 8: Consent & Legal Tab
function ConsentLegalTab() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Consent & Legal Agreements</h3>
        <p className="text-gray-600 text-sm">Legal documents, consent forms, and digital signatures</p>
      </div>

      {/* Consent Forms & Agreements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Consent Forms & Agreements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">HIPAA Privacy Authorization</p>
                  <p className="text-sm text-gray-600">Signed: 2024-07-10 • Digital signature</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Signed</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Financial Responsibility Agreement</p>
                  <p className="text-sm text-gray-600">Signed: 2024-07-10 • Digital signature</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Signed</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">General Privacy Policy</p>
                  <p className="text-sm text-gray-600">Signed: 2024-07-10 • Digital signature</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Signed</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Treatment Consent Form</p>
                  <p className="text-sm text-gray-600">• Digital signature • Witness required</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Signed</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Research Participation Consent</p>
                  <p className="text-sm text-gray-600">Signed: 2024-07-10 • Digital signature</p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Research Participation Consent</p>
                  <p className="text-sm text-gray-600">Signed: 2024-07-10 • Digital signature</p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Declined</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Identity Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Driver's License</p>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>
              <p className="text-sm text-gray-600">Uploaded: 2024-07-10</p>
              <p className="text-sm text-gray-600">Expires: 2027-03-15</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Insurance Card (Front & Back)</p>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>
              <p className="text-sm text-gray-600">Uploaded: 2024-07-10</p>
              <p className="text-sm text-gray-600">Expires: 2024-12-31</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent & Legal Agreements Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Consent & Legal Agreements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-600">Signed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-gray-600">Declined</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">80%</p>
              <p className="text-sm text-gray-600">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Screen 9: Uploads & Documents Tab
function UploadsDocumentsTab() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Uploads & Documents</h3>
        <p className="text-gray-600 text-sm">Patient documents, scans, and medical records</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Document Cards */}
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileImage className="w-8 h-8 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Chest X-Ray - Frontal View</h4>
                    <Badge variant="outline" className="text-xs">
                      {index % 2 === 0 ? "Laboratory" : "Radiology"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-blue-600">{index % 2 === 0 ? "Lab Result" : "Xray"}</span>
                    </p>
                    <p>Size: {index % 2 === 0 ? "456 KB" : "2.4 MB"}</p>
                    <p>Uploaded: 2024-07-{index < 4 ? "20" : "15"}</p>
                    <p>By: {index % 2 === 0 ? "Lab Tech" : "Dr. Sarah Johnson"}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-teal-600 border-teal-600 bg-transparent">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="text-teal-600 border-teal-600 bg-transparent">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Screen 8: Patient Dashboard (History Overview)
function PatientDashboard({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Patient Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-medium">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">Patient ID: {patient.patientId}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700">Start the Procedure</Button>
            <Button variant="outline">History</Button>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-semibold">{patient.age} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-semibold">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Type</p>
            <p className="font-semibold">{patient.bloodType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Visit</p>
            <p className="font-semibold">{patient.lastVisit}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{patient.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>DOB: {patient.dob}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-600">
              <Calendar className="w-5 h-5" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 mb-2">Latest Appointment</p>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span>Mon 21 July, 2:30 PM</span>
                <Badge variant="outline">Annual Checkup</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <StickyNote className="w-5 h-5" />
              Patients Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 mb-2">Latest Notes</p>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Mon 21 July, 2:30 PM</span>
              </div>
              <div>
                <p className="font-medium mb-1">Summary:</p>
                <p className="text-sm text-gray-700">
                  Patient reported recurring headache and blurred vision. Blood pressure elevated. Recommended initial
                  tests before medication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <Pill className="w-5 h-5" />
              Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 mb-2">Latest Prescriptions</p>
              <div className="flex items-center gap-2 text-sm mb-3">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span>Mon 21 July, 2:30 PM</span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Medicines:</span>
                </p>
                <p>Panadol 500mg – 1 tablet – Twice Daily – 5 days</p>
                <p>Omeprazole 20mg – 1 tablet – Before breakfast – 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500">
              <Receipt className="w-5 h-5" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 mb-2">Latest Billing</p>
              <div className="flex items-center gap-2 text-sm mb-3">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span>Mon 21 July, 2:30 PM</span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">CPT Code:</span> 99213
                </p>
                <p>
                  <span className="font-medium">Description:</span> Follow-up Consultation
                </p>
                <p>
                  <span className="font-medium">Charge:</span> $120
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" onClick={onBack} className="mt-6 bg-transparent">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Patient Profile
      </Button>
    </div>
  )
}

// Screen 10: Procedure Screen with Sidebar
function ProcedureScreen({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full sm:w-64 bg-white border-b sm:border-b-0 sm:border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Procedure Dashboard</h2>
          <p className="text-sm text-gray-600">{patient.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection("overview")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeSection === "overview" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection("vitals")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeSection === "vitals" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Vital Signs
          </button>
          <button
            onClick={() => setActiveSection("examination")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeSection === "examination" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Examination
          </button>
          <button
            onClick={() => setActiveSection("diagnosis")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeSection === "diagnosis" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Diagnosis
          </button>
          <button
            onClick={() => setActiveSection("treatment")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeSection === "treatment" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Treatment Plan
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" onClick={onBack} className="w-full bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Patient Header */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="font-medium">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
                  <p className="text-gray-600">Patient ID: {patient.patientId}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">In Progress</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Type</p>
                <p className="font-medium">{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-gray-600">Procedure Date</p>
                <p className="font-medium">Today</p>
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Active Section */}
          {activeSection === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>Procedure Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Scheduled Procedure</h4>
                    <p className="text-gray-600">Annual Physical Examination</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Duration</h4>
                    <p className="text-gray-600">45 minutes</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-gray-600">Patient reports feeling well overall. No acute concerns.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "vitals" && (
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Blood Pressure</h4>
                    <p className="text-2xl font-bold text-gray-900">120/80</p>
                    <p className="text-sm text-green-600">Normal</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Heart Rate</h4>
                    <p className="text-2xl font-bold text-gray-900">72</p>
                    <p className="text-sm text-green-600">Normal</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Temperature</h4>
                    <p className="text-2xl font-bold text-gray-900">98.6°F</p>
                    <p className="text-sm text-green-600">Normal</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Oxygen Saturation</h4>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-sm text-green-600">Normal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "examination" && (
            <Card>
              <CardHeader>
                <CardTitle>Physical Examination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">General Appearance</h4>
                    <p className="text-gray-600">Patient appears well, alert, and oriented</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Cardiovascular</h4>
                    <p className="text-gray-600">Regular rate and rhythm, no murmurs</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Respiratory</h4>
                    <p className="text-gray-600">Clear to auscultation bilaterally</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Abdomen</h4>
                    <p className="text-gray-600">Soft, non-tender, no masses palpated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "diagnosis" && (
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis & Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Primary Diagnosis</h4>
                    <Badge className="bg-blue-100 text-blue-800">Z00.00 - Routine Health Examination</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Assessment</h4>
                    <p className="text-gray-600">
                      Patient is in good health overall. Continue current medications and lifestyle modifications.
                      Recommend follow-up in 12 months for routine care.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "treatment" && (
            <Card>
              <CardHeader>
                <CardTitle>Treatment Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Medications</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-gray-400" />
                        <span>Continue Lisinopril 10mg daily</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-gray-400" />
                        <span>Continue Metformin 500mg twice daily</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Follow-up</h4>
                    <p className="text-gray-600">Schedule routine follow-up in 12 months</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Patient Instructions</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Continue current diet and exercise routine</li>
                      <li>• Monitor blood pressure at home</li>
                      <li>• Contact office if any concerns arise</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
