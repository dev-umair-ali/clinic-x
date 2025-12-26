"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  User,
  Upload,
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { authService, uploadService, type CreateClinicRequest } from "@/lib/api"
import { createClinic, updateClinic, uploadClinicLogo } from "@/lib/slices/clinicSlice"

/* ---------  STATIC DATA  --------- */
const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney"
]

/* ---------  TYPES  --------- */
interface ClinicFormData {
  // Clinic Info
  clinicName: string
  timezone: string
  ownerName: string  // Owner name (not user ID)

  // Address
  street: string
  city: string
  state: string
  zipCode: string
  country: string

  // Contact Info
  email: string
  phone: string

  // Logo
  logo: File | null
}

export default function AddClinicPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  /* ---------  STATE  --------- */
  const [formData, setFormData] = useState<ClinicFormData>({
    clinicName: "",
    timezone: "UTC", // Default
    ownerName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    email: "",
    phone: "",
    logo: null,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof ClinicFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((p) => ({ ...p, logo: file }))
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 1. Get current logged-in user ID for both createdBy and ownerUser
      let currentUserId = ""
      try {
        const storedUser = localStorage.getItem('clinic-ai-user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          // Try different possible ID fields from localStorage
          currentUserId = parsedUser._id || parsedUser.id || ""
        }
      } catch (e) {
        console.warn("Could not retrieve current user ID", e)
      }

      // If no user ID found, throw error
      if (!currentUserId) {
        throw new Error("You must be logged in to create a clinic. Please log in and try again.")
      }

      console.log("Creating clinic with user ID:", currentUserId)

      // 2. Note: Logo upload will be available in the edit page after clinic creation
      // For now, we're skipping logo upload during creation to ensure smooth clinic creation
      // Users can add the logo by editing the clinic afterward

      // 3. Create Clinic with all required fields
      const clinicPayload: CreateClinicRequest = {
        name: formData.clinicName,
        clinicName: formData.clinicName, // Required field (API documentation exception)
        createdBy: currentUserId, // Current logged-in user
        ownerUser: formData.ownerName, // Owner name from form input (not user ID)
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        phone: formData.phone,
        email: formData.email,
        settings: {
          timezone: formData.timezone,
          currency: "USD",
        },
      }

      console.log("Clinic payload:", clinicPayload)

      const clinicResult = await dispatch(createClinic(clinicPayload)).unwrap()
      
      console.log("Clinic API response:", clinicResult)
      console.log("Clinic ID:", clinicResult?._id)

      if (!clinicResult || !clinicResult._id) {
        throw new Error("Clinic created but no ID returned. Response: " + JSON.stringify(clinicResult))
      }

      const clinicId = clinicResult._id
      console.log("Clinic created successfully with ID:", clinicId)

      // Note: Logo upload functionality will be added to the edit page
      // For now, clinic is created without a logo

      setShowSuccess(true)
      setTimeout(() => router.push("/admin/clinics"), 2000)

    } catch (err: any) {
      console.error("Error creating clinic:", err)
      
      // Enhanced error message handling
      let errorMessage = err.message || err.error || err || "Something went wrong."
      
      // Check for duplicate email error
      if (errorMessage.includes("E11000") || errorMessage.includes("duplicate key") || errorMessage.includes("email_1")) {
        errorMessage = "This email is already in use by another clinic. Please use a different email address."
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /* ----------  RENDER  ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

      {/* Feedback */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-[hsl(var(--color-status-success))] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          Clinic created successfully!
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Clinic</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new clinic in the system.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1: Clinic Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#1DA68F]" />
                Clinic Details
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Basic information about the healthcare facility.
              </p>
            </div>

            <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g. City Health Center"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange("clinicName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone *</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(val) => handleInputChange("timezone", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Logo upload temporarily disabled - will be available in edit page */}
                <div className="space-y-2">
                  <Label className="text-gray-500">Clinic Logo</Label>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Logo upload will be available after creating the clinic. You can add it by editing the clinic.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Address */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#1DA68F]" />
                Location
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Physical address of the clinic.
              </p>
            </div>

            <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Owner Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#1DA68F]" />
                Owner Details
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Contact information for the clinic owner.
              </p>
            </div>

            <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g. Dr. John Smith"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Owner Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="owner@clinic.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Must be unique - cannot use existing clinic email
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Owner Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1DA68F] hover:bg-[#168f73] min-w-[140px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Clinic
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}