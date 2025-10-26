"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { updateDoctorPatient, fetchDoctorPatients, fetchDoctorPatientById } from "@/lib/slices/doctorPatientSlice"
import { fetchDoctors } from "@/lib/slices/doctorSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  fullName: string
  email: string
  password: string
  phone: string
  age: string
  dateOfBirth: string
  gender: string
  bloodType: string
  assignedDoctor: string
  insuranceInfo: string
  medicalHistory: string
  address: string
  status: string
}

export default function EditPatientPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { patients, loading } = useSelector((state: RootState) => state.doctorPatients)
  const { doctors, loading: doctorsLoading } = useSelector((state: RootState) => state.doctors)
  
  const patientId = params.id as string
  // Try to find patient by exact ID first, then by _id, then by email as fallback
  let patient = patients.find(p => p.id === patientId || p._id === patientId)
  
  // If not found by ID, try to find by email (in case ID format is different)
  if (!patient && patientId.includes('@')) {
    patient = patients.find(p => p.email === patientId)
  }
  

  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    assignedDoctor: "",
    insuranceInfo: "",
    medicalHistory: "",
    address: "",
    status: "active"
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Always fetch patients and doctors to ensure we have the latest data
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchDoctorPatients()).unwrap(),
          dispatch(fetchDoctors()).unwrap()
        ])
        setDataLoaded(true)
      } catch (error) {
        console.error('Error loading data:', error)
        setDataLoaded(true) // Set to true even on error to prevent infinite loading
      }
    }
    
    loadData()
    
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      
      setDataLoaded(true)
    }, 10000) // 10 second timeout
    
    return () => clearTimeout(timeout)
  }, [dispatch])

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        fullName: patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
        email: patient.email || "",
        password: "", // Don't populate password for security
        phone: patient.phone || "",
        age: patient.age?.toString() || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        bloodType: patient.bloodType || "",
        assignedDoctor: patient.assignedDoctor || "",
        insuranceInfo: patient.insuranceInfo || "",
        medicalHistory: patient.medicalHistory || "",
        address: patient.address || "",
        status: patient.status || "active"
      })
    }
  }, [patient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let updatedFormData = { ...formData, [name]: value }

    // Auto-concatenate first name and last name for full name
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? value : formData.firstName
      const lastName = name === 'lastName' ? value : formData.lastName
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.age || !formData.dateOfBirth || !formData.gender || !formData.bloodType || !formData.assignedDoctor || !formData.insuranceInfo || !formData.medicalHistory || !formData.address) {
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
        status: formData.status as "active" | "inactive",
        assignedDoctor: formData.assignedDoctor,
        insuranceInfo: formData.insuranceInfo,
        dateOfBirth: formData.dateOfBirth,
        role: "patient",
        hipaaConsent: true,
                
      }

      // Use the actual patient ID from the found patient
      const actualPatientId = patient._id || patient.id || patientId
      await dispatch(updateDoctorPatient({ id: actualPatientId, patientData })).unwrap()
        toast.success("Patient updated successfully!")
      setIsLoading(false)
      router.push("/doctor/patients")
    } catch (error: any) {
      toast.error(error.message || "Failed to update patient")
    } finally {
      setIsLoading(false)
    }
  }

  if ((loading || doctorsLoading) && !dataLoaded) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Patient</h1>
            </div>
            
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <span className="ml-2 text-gray-600">Loading patients...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Patient</h1>
            </div>
            
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <p className="font-medium">Patient not found</p>
              <p className="text-sm mt-1">Patient ID: {patientId}</p>
              <p className="text-sm">Total patients loaded: {patients.length}</p>
              <p className="text-sm mt-2">Please check if the patient exists or try refreshing the data.</p>
              <Button 
                onClick={() => dispatch(fetchDoctorPatients())} 
                className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Refresh Patient Data
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Edit Patient: {patient.firstName} {patient.lastName}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                disabled
                readOnly
                className="bg-gray-50 cursor-not-allowed"
                placeholder="Auto-generated from first and last name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="password">Password</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Password must be at least 8 characters and contain uppercase, lowercase, number, and special character</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    disabled={true}
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="30"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm text-gray-700"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm text-gray-700"
                  required
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
              <div>
                <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
                <select
                  id="assignedDoctor"
                  name="assignedDoctor"
                  value={formData.assignedDoctor}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm text-gray-700"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="insuranceInfo">Insurance Information</Label>
              <Input
                id="insuranceInfo"
                name="insuranceInfo"
                type="text"
                value={formData.insuranceInfo}
                onChange={handleChange}
                placeholder="Insurance provider and policy number"
                required
              />
            </div>

            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="e.g. Hypertension, Asthma, Previous surgeries"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Anytown, State 12345"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm text-gray-700"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#1DA68F] hover:bg-[#1DA68F]/70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Patient
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
