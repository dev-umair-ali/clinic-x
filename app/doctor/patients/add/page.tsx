"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { createDoctorPatient, fetchDoctorPatients } from "@/lib/slices/doctorPatientSlice"
import { fetchDoctors } from "@/lib/slices/doctorSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { AppDispatch, RootState } from "@/lib/store"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Eye, EyeOff } from "lucide-react"
import { useEffect } from "react"

export default function AddPatientPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { doctors } = useSelector((state: RootState) => state.doctors)

  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Fetch doctors on component mount
  useEffect(() => {
    dispatch(fetchDoctors())
  }, [dispatch])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    setLoading(true)
    setSuccess("")

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone || !formData.age || !formData.dateOfBirth || !formData.gender || !formData.bloodType || !formData.assignedDoctor || !formData.insuranceInfo || !formData.medicalHistory || !formData.address) {
      toast.error("Please fill in all required fields.")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      setLoading(false)
      return
    }

    // Check for password complexity requirements
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumbers = /\d/.test(formData.password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      toast.error("Password must contain uppercase, lowercase, number, and special character.")
      setLoading(false)
      return
    }

    try {
      // // Step 1: Signup patient (create user account)
      // const signupData = {
      //   name: `${formData.firstName} ${formData.lastName}`,
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   email: formData.email,
      //   password: formData.password,
      //   phone: formData.phone,
      //   age: Number.parseInt(formData.age),
      //   gender: formData.gender as "male" | "female" | "other",
      //   address: formData.address,
      //   bloodType: formData.bloodType,
      //   medicalHistory: formData.medicalHistory,
      //   role: "patient" as const,
      //   hipaaConsent: true
      // }

      // Create doctor patient
      await dispatch(
        createDoctorPatient({
          ...formData,
          age: Number.parseInt(formData.age, 10),
          gender: formData.gender === "male" || formData.gender === "female" ? formData.gender : "male", // fallback to "male" if invalid
          role: "patient",
          hipaaConsent: true,
          status: formData.status === "active" || formData.status === "inactive" ? formData.status : "active", // ensure correct type
        })
      ).unwrap()
      toast.success("Patient added successfully!")

      await dispatch(fetchDoctorPatients())
      // Redirect after success
      setLoading(false)
      router.push("/doctor/patients")

    } catch (err: any) {
      // Log detailed error for debugging
      console.error("Patient creation error:", err)

      // // Show specific error messages based on error type
      if (err.response?.status === 409) {
        toast.error("A patient with this email already exists.")
      } else if (err.response?.status === 400) {
        toast.error("Invalid data provided. Please check your input.")
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.")
      } else if (err.code === 'NETWORK_ERROR') {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error(err.message || "Failed to create patient. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Patient</h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

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
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Patient..." : "Create Patient"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
