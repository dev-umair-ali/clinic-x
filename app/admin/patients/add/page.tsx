"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { createPatient, fetchPatients } from "@/lib/slices/patientSlice"
import { fetchDoctors } from "@/lib/slices/doctorSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  ArrowLeft,
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
  UserPlus,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import type { AppDispatch, RootState } from "@/lib/store"

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

export default function AddPatientStyled() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { doctors } = useSelector((state: RootState) => state.doctors)

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

  // Fetch doctors on component mount
  useEffect(() => {
    dispatch(fetchDoctors())
  }, [dispatch])

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

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
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

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    // Check for password complexity requirements
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumbers = /\d/.test(formData.password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      toast.error("Password must contain uppercase, lowercase, number, and special character.")
      return
    }

    setIsLoading(true)

    try {
      await dispatch(
        createPatient({
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          age: Number.parseInt(formData.age, 10),
          gender: formData.gender === "male" || formData.gender === "female" ? formData.gender : "male",
          address: formData.address,
          bloodType: formData.bloodType,
          medicalHistory: formData.medicalHistory,
          dateOfBirth: formData.dateOfBirth,
          assignedDoctor: formData.PrimaryDoctor,
          insuranceInfo: formData.insuranceProvide,
          role: "patient",
          hipaaConsent: true,
          status: formData.status === "active" || formData.status === "inactive" ? formData.status : "active",
        }),
      ).unwrap()

      toast.success("Patient added successfully!")
      await dispatch(fetchPatients())
      router.push("/admin/patients")
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("A patient with this email already exists.")
      } else if (err.response?.status === 400) {
        toast.error("Invalid data provided. Please check your input.")
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.")
      } else if (err.code === "NETWORK_ERROR") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error(err.message || "Failed to create patient. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
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

              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add New Patient</h1>
                  <p className="text-gray-500 mt-1">Create new patient information and medical records</p>
                </div>

                <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <UserPlus className="w-3 h-3 inline mr-1" />
                  New Patient
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="form-section">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-2 border-border/50 overflow-hidden">
                      <img src="/placeholder-user.jpg" alt="Profile" className="w-full h-full object-cover" />
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
                        className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
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
                        Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="SecurePassword123!"
                          required
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
                  <div className="p-2 bg-medical/10 rounded-lg">
                    <UserPlus className="h-5 w-5 text-medical" />
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
                  className="flex-1 h-12 border-border/50 hover:bg-muted/50 dark:bg-muted/50 transition-all duration-200 bg-[#EFEFEF]"
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
                      Creating Patient...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Patient
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
