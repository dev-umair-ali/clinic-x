"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
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
import api from "@/lib/api/axios"

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

  // Address
  street: string
  city: string
  state: string
  zipCode: string
  country: string

  // Owner Info (for Signup)
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPhone: string
  ownerPassword: string
  hipaaConsent: boolean

  // Logo
  logo: File | null
}

export default function AddClinicPage() {
  const router = useRouter()

  /* ---------  STATE  --------- */
  const [formData, setFormData] = useState<ClinicFormData>({
    clinicName: "",
    timezone: "UTC", // Default
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerPassword: "",
    hipaaConsent: false,
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
      // 1. Validate Basic
      if (!formData.hipaaConsent) {
        throw new Error("Owner must consent to HIPAA regulations.")
      }

      // 2. Create Owner User
      const signupPayload = {
        email: formData.ownerEmail,
        password: formData.ownerPassword,
        firstName: formData.ownerFirstName,
        lastName: formData.ownerLastName,
        role: "clinic_admin",
        phoneNumber: formData.ownerPhone,
        hipaaConsent: formData.hipaaConsent,
      }

      let ownerId = ""
      try {
        await api.post("/auth/signup", signupPayload)

        const loginRes = await api.post("/auth/login", {
          email: formData.ownerEmail,
          password: formData.ownerPassword
        })

        const token = loginRes.data?.token || loginRes.data?.accessToken
        const user = loginRes.data?.user

        if (user && user._id) {
          ownerId = user._id
        } else if (token) {
          throw new Error("Could not retrieve new user ID after signup. Please check console.")
        } else {
          throw new Error("Login failed after signup.")
        }

      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to create owner user.")
      }

      // 3. Create Clinic
      let createdBy = "68ff956bbcd478cb86c3e773" // Default fallback from example
      try {
        const storedUser = localStorage.getItem('clinic-ai-user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser._id) createdBy = parsedUser._id
        }
      } catch (e) {
        console.warn("Could not retrieve current user ID for createdBy field", e)
      }

      const clinicPayload = {
        name: formData.clinicName,
        clinicName: formData.clinicName, // Redundant but requested
        createdBy: createdBy,
        ownerUser: ownerId,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        phone: formData.ownerPhone, // Using owner contact as primary clinic contact
        email: formData.ownerEmail,
        settings: {
          timezone: formData.timezone,
          currency: "USD",
        },
      }

      const clinicRes = await api.post("/clinics", clinicPayload)
      const clinicId = clinicRes.data?._id || clinicRes.data?.id

      // 4. Upload Logo if exists
      if (formData.logo && clinicId) {
        const logoFormData = new FormData()
        logoFormData.append("file", formData.logo)
        await api.post(`/admin/clinics/${clinicId}/logo`, logoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      setShowSuccess(true)
      setTimeout(() => router.push("/admin/clinics"), 2000)

    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong.")
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
          Clinic and Owner created successfully!
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a clinic and its administrator account.</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <Label>Clinic Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Upload className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        Choose File
                      </Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: Square, PNG or JPG.</p>
                    </div>
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

          {/* Section 3: Owner / Admin */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#1DA68F]" />
                Administrator
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Create the main administrator account for this clinic.
              </p>
            </div>

            <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerFirstName">First Name *</Label>
                    <Input
                      id="ownerFirstName"
                      value={formData.ownerFirstName}
                      onChange={(e) => handleInputChange("ownerFirstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerLastName">Last Name *</Label>
                    <Input
                      id="ownerLastName"
                      value={formData.ownerLastName}
                      onChange={(e) => handleInputChange("ownerLastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Owner Email *</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Owner Phone</Label>
                    <Input
                      id="ownerPhone"
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPassword">Password *</Label>
                  <Input
                    id="ownerPassword"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    value={formData.ownerPassword}
                    onChange={(e) => handleInputChange("ownerPassword", e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="hipaaConsent"
                    checked={formData.hipaaConsent}
                    onCheckedChange={(c) => handleInputChange("hipaaConsent", c === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="hipaaConsent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm I have obtained HIPAA consent from this user.
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      This user will be created as a generic clinic_admin.
                    </p>
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
                  Create Records
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}