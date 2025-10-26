"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { updatePatient, fetchPatients } from "@/lib/slices/patientSlice"
import { fetchDoctors } from "@/lib/slices/doctorSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Camera,
  Plus,
  User,
  Heart,
  Shield,
  Phone,
  Calendar,
  MapPin,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  fullName: string
  email: string
  password: string
  phone: string
  phoneNumber: string
  age: string
  gender: string
  profilePicture: string
  dateOfBirth: string
  DateOfBirth: string
  bloodType: string
  BloodType: string
  medicalHistory: string
  MedicalHistory: string
  allergies: string
  Allergies: string
  currentMedication: string
  CurrentMedication: string
  insuranceProvide: string
  InsuranceProvide: string
  eContactName: string
  EContactName: string
  ePhoneNumber: string
  EPhoneNumber: string
  eRelationship: string
  ERelationship: string
  PrimaryDoctor: string
  primaryDoctor: string
  address: string
  status: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  allergiesArray: string[]
  medicationsArray: string[]
}

export default function EditPatientPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { patients, loading } = useSelector((state: RootState) => state.patients)
  const { doctors } = useSelector((state: RootState) => state.doctors)

  const patientId = params.id as string
  // Try to find patient by exact ID first, then by email as fallback
  let patient = patients.find((p) => p.id === patientId)

  // If not found by ID, try to find by email (in case ID format is different)
  if (!patient && patientId.includes("@")) {
    patient = patients.find((p) => p.email === patientId)
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    phoneNumber: "",
    age: "",
    gender: "",
    profilePicture: "",
    dateOfBirth: "",
    DateOfBirth: "",
    bloodType: "",
    BloodType: "",
    medicalHistory: "",
    MedicalHistory: "",
    allergies: "",
    Allergies: "",
    currentMedication: "",
    CurrentMedication: "",
    insuranceProvide: "",
    InsuranceProvide: "",
    eContactName: "",
    EContactName: "",
    ePhoneNumber: "",
    EPhoneNumber: "",
    eRelationship: "",
    ERelationship: "",
    PrimaryDoctor: "",
    primaryDoctor: "",
    address: "",
    status: "active",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    allergiesArray: [],
    medicationsArray: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Always fetch patients and doctors to ensure we have the latest data
    dispatch(fetchPatients())
    dispatch(fetchDoctors())
  }, [dispatch])

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        fullName: patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
        email: patient.email || "",
        password: patient.password || "", // Don't populate password for security
        phone: patient.phone || "",
        phoneNumber: "",
        age: patient.age?.toString() || "",
        gender: patient.gender || "",
        profilePicture: "",
        dateOfBirth: patient.dateOfBirth || "",
        DateOfBirth: "",
        bloodType: patient.bloodType || "",
        BloodType: "",
        medicalHistory: patient.medicalHistory || "",
        MedicalHistory: "",
        allergies: "",
        Allergies: "",
        currentMedication: "",
        CurrentMedication: "",
        insuranceProvide: "",
        InsuranceProvide: "",
        eContactName: "",
        EContactName: "",
        ePhoneNumber: "",
        EPhoneNumber: "",
        eRelationship: "",
        ERelationship: "",
        PrimaryDoctor: "",
        primaryDoctor: "",
        address: patient.address || "",
        status: patient.status || "active",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        allergiesArray: [],
        medicationsArray: [],
      })
    }
  }, [patient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedFormData = { ...formData, [name]: value }

    // Auto-concatenate first name and last name for full name
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName
      const lastName = name === "lastName" ? value : formData.lastName
      updatedFormData.fullName = `${firstName} ${lastName}`.trim()
    }

    setFormData(updatedFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patient) {
      toast.error("Patient not found")
      return
    }

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.age ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.address ||
      !formData.PrimaryDoctor
    ) {
      toast.error("Please fill in all required fields.")
      return
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    setIsLoading(true)

    try {
      const patientData = {
        name: formData.fullName,
        firstName: formData.firstName,
        password: formData.password,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: Number.parseInt(formData.age),
        gender: formData.gender as "male" | "female",
        address: formData.address,
        bloodType: formData.bloodType,
        medicalHistory: formData.medicalHistory,
        assignedDoctor: formData.PrimaryDoctor,
        insuranceInfo: formData.insuranceProvide,
        status: formData.status as "active" | "inactive",
        dateOfBirth: formData.dateOfBirth,
        role: "patient",
        hipaaConsent: true,
      }

      await dispatch(updatePatient({ id: patientId, patientData })).unwrap()
      toast.success("Patient updated successfully!")
      setIsLoading(false)
      router.push("/admin/patients")
    } catch (error: any) {
      toast.error(error.message || "Failed to update patient")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 dark:from-background dark:via-card/20 dark:to-primary/10">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-6 mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="p-3 hover:bg-primary/10 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Edit Patient
                  </h1>
                  <p className="text-muted-foreground mt-1">Update patient information and medical records</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 mx-auto pulse-soft"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">Loading patient data</p>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we fetch the latest information...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 dark:from-background dark:via-card/20 dark:to-primary/10">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-6 mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="p-3 hover:bg-primary/10 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Edit Patient
                  </h1>
                  <p className="text-muted-foreground mt-1">Update patient information and medical records</p>
                </div>
              </div>

              <div className="form-section border-destructive/20 bg-destructive/5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-destructive text-lg">Patient not found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We couldn't locate the patient record you're looking for.
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Patient ID:</span> {patientId}
                      </p>
                      <p>
                        <span className="font-medium">Total patients loaded:</span> {patients.length}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please verify the patient exists or try refreshing the data.
                    </p>
                    <Button
                      onClick={() => dispatch(fetchPatients())}
                      className="mt-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      size="sm"
                    >
                      <Loader2 className="mr-2 h-4 w-4" />
                      Refresh Patient Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 dark:from-background dark:via-card/20 dark:to-primary/10">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
  {/* Back Button */}
  <div className="mb-4">
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="flex items-center gap-2 rounded-md bg-teal-50 text-teal-600 px-3 py-2 hover:bg-teal-100 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="text-sm font-medium">Back to Patients</span>
    </Button>
  </div>

  {/* Title + Status */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Patient</h1>
      <p className="text-gray-500 mt-1">
        Update patient information and medical records
      </p>
    </div>

    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        formData.status === "active"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {formData.status === "active" ? (
        <>
          <CheckCircle2 className="w-3 h-3 inline mr-1" />
          Active
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Inactive
        </>
      )}
    </div>
  </div>
</div>


            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="form-section">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-2 border-border/50 overflow-hidden">
                      <img src="/professional-medical-profile.jpg" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2.5 hover:bg-primary/90 transition-all duration-200 shadow-lg group-hover:scale-110 bg-white"
                    >
                      <Camera className="h-4 w-4 text-[#1DA68F]" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Profile Image
                    </h3>
                    <p className="text-sm text-muted-foreground">Recommended size: 512 x 512 px, max 2.5 MB</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, and WebP formats</p>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        required
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          minLength={8}
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        required
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                        Alternative Phone
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+1 (555) 987-6543"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-foreground">
                        Age <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="35"
                        min="0"
                        required
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                        Gender <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType" className="text-sm font-medium text-foreground">
                        Blood Type
                      </Label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
                        Date of Birth <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profilePicture" className="text-sm font-medium text-foreground">
                        Profile Picture URL
                      </Label>
                      <Input
                        id="profilePicture"
                        name="profilePicture"
                        type="url"
                        value={formData.profilePicture}
                        onChange={handleChange}
                        placeholder="https://example.com/profile.jpg"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main Street, City, State 12345"
                        rows={3}
                        required
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors resize-none"
                      />
                      <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-medical/10 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-medical" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Medical Assignment</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="PrimaryDoctor" className="text-sm font-medium text-foreground">
                        Primary Doctor <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="PrimaryDoctor"
                        name="PrimaryDoctor"
                        value={formData.PrimaryDoctor}
                        onChange={handleChange}
                        className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-medical focus:ring-2 focus:ring-medical/20 transition-all"
                        required
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryDoctor" className="text-sm font-medium text-foreground">
                        Alternative Primary Doctor
                      </Label>
                      <Input
                        id="primaryDoctor"
                        name="primaryDoctor"
                        type="text"
                        value={formData.primaryDoctor}
                        onChange={handleChange}
                        placeholder="doctor_id_123"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvide" className="text-sm font-medium text-foreground">
                        Insurance Provider
                      </Label>
                      <div className="relative">
                        <Input
                          id="insuranceProvide"
                          name="insuranceProvide"
                          type="text"
                          value={formData.insuranceProvide}
                          onChange={handleChange}
                          placeholder="Blue Cross Blue Shield"
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors pl-10"
                        />
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="InsuranceProvide" className="text-sm font-medium text-foreground">
                        Alternative Insurance Provider
                      </Label>
                      <div className="relative">
                        <Input
                          id="InsuranceProvide"
                          name="InsuranceProvide"
                          type="text"
                          value={formData.InsuranceProvide}
                          onChange={handleChange}
                          placeholder="Alternative insurance"
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors pl-10"
                        />
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Heart className="h-5 w-5 text-info" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Medical Information</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory" className="text-sm font-medium text-foreground">
                        Medical History
                      </Label>
                      <div className="flex items-center gap-3">
                        <Textarea
                          id="medicalHistory"
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleChange}
                          placeholder="Diabetes, Hypertension, Previous surgeries..."
                          rows={4}
                          className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors resize-none"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="flex bg-[#1DA68F] text-white items-center justify-center rounded-lg bg-info hover:bg-info/90 px-3 py-2 text-info-foreground transition-colors mt-1"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add medical history item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="MedicalHistory" className="text-sm font-medium text-foreground">
                        Alternative Medical History
                      </Label>
                      <div className="flex items-center gap-3">
                        <Textarea
                          id="MedicalHistory"
                          name="MedicalHistory"
                          value={formData.MedicalHistory}
                          onChange={handleChange}
                          placeholder="Additional medical history..."
                          rows={4}
                          className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors resize-none"
                        />
                        <button
                          type="button"
                          className="flex items-center bg-[#1DA68F] text-white justify-center rounded-lg bg-info hover:bg-info/90 px-3 py-2 text-info-foreground transition-colors mt-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="text-sm font-medium text-foreground">
                        Allergies
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="allergies"
                          name="allergies"
                          type="text"
                          value={formData.allergies}
                          onChange={handleChange}
                          placeholder="Penicillin, Shellfish, Pollen..."
                          className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                        <button
                          type="button"
                          className="flex bg-[#1DA68F] text-white items-center justify-center rounded-lg bg-warning hover:bg-warning/90 px-3 py-2 text-warning-foreground transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Allergies" className="text-sm font-medium text-foreground">
                        Alternative Allergies
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="Allergies"
                          name="Allergies"
                          type="text"
                          value={formData.Allergies}
                          onChange={handleChange}
                          placeholder="Additional allergies..."
                          className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                        <button
                          type="button"
                          className="flex bg-[#1DA68F] text-white items-center justify-center rounded-lg bg-warning hover:bg-warning/90 px-3 py-2 text-warning-foreground transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentMedication" className="text-sm font-medium text-foreground">
                        Current Medication
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="currentMedication"
                          name="currentMedication"
                          type="text"
                          value={formData.currentMedication}
                          onChange={handleChange}
                          placeholder="Metformin, Lisinopril, Aspirin..."
                          className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                        <button
                          type="button"
                          className="flex  bg-[#1DA68F] text-white items-center justify-center rounded-lg bg-medical hover:bg-medical/90 px-3 py-2 text-medical-foreground transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="CurrentMedication" className="text-sm font-medium text-foreground">
                        Alternative Current Medication
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="CurrentMedication"
                          name="CurrentMedication"
                          type="text"
                          value={formData.CurrentMedication}
                          onChange={handleChange}
                          placeholder="Additional medications..."
                          className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                        <button
                          type="button"
                          className="flex bg-[#1DA68F] text-white items-center justify-center rounded-lg bg-medical hover:bg-medical/90 px-3 py-2 text-medical-foreground transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Phone className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Emergency Contact</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eContactName" className="text-sm font-medium text-foreground">
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="eContactName"
                        name="eContactName"
                        type="text"
                        value={formData.eContactName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="EContactName" className="text-sm font-medium text-foreground">
                        Alternative Emergency Contact Name
                      </Label>
                      <Input
                        id="EContactName"
                        name="EContactName"
                        type="text"
                        value={formData.EContactName}
                        onChange={handleChange}
                        placeholder="Alternative contact"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ePhoneNumber" className="text-sm font-medium text-foreground">
                        Emergency Phone Number
                      </Label>
                      <Input
                        id="ePhoneNumber"
                        name="ePhoneNumber"
                        type="text"
                        value={formData.ePhoneNumber}
                        onChange={handleChange}
                        placeholder="+1 (555) 987-6543"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="EPhoneNumber" className="text-sm font-medium text-foreground">
                        Alternative Emergency Phone Number
                      </Label>
                      <Input
                        id="EPhoneNumber"
                        name="EPhoneNumber"
                        type="text"
                        value={formData.EPhoneNumber}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eRelationship" className="text-sm font-medium text-foreground">
                        Emergency Relationship
                      </Label>
                      <select
                        id="eRelationship"
                        name="eRelationship"
                        value={formData.eRelationship}
                        onChange={handleChange}
                        className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-destructive focus:ring-2 focus:ring-destructive/20 transition-all"
                      >
                        <option value="">Select Relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ERelationship" className="text-sm font-medium text-foreground">
                        Alternative Emergency Relationship
                      </Label>
                      <select
                        id="ERelationship"
                        name="ERelationship"
                        value={formData.ERelationship}
                        onChange={handleChange}
                        className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-destructive focus:ring-2 focus:ring-destructive/20 transition-all"
                      >
                        <option value="">Select Relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section bg-muted/30">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-muted rounded-lg">
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Generated Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                    Full Name (Auto-Generated)
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    disabled
                    readOnly
                    className="bg-muted/50 cursor-not-allowed border-border/30 text-muted-foreground dark:text-white"
                    placeholder="Auto-generated from first and last name"
                  />
                  <p className="text-xs text-muted-foreground">
                    This field is automatically updated when you change the first or last name.
                  </p>
                </div>
              </div>

              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className={`p-2 rounded-lg ${formData.status === "active" ? "bg-medical/10" : "bg-muted"}`}>
                    {formData.status === "active" ? (
                      <CheckCircle2 className="h-5 w-5 text-medical" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Patient Status</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-foreground">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Active patients can schedule appointments and access services.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1 h-12 border-border/50 hover:bg-muted/50 transition-all duration-200 bg-[#EFEFEF]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-[#1DA68F] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Patient...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Patient
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
