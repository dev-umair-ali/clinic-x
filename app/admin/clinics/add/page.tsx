"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Building2,
  MapPin,
  User,
  Upload,
  Loader2,
  Save,
  ArrowLeft,
} from "lucide-react"
import { type CreateClinicRequest } from "@/lib/api"
import { createClinic } from "@/lib/slices/clinicSlice"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"


interface ClinicFormData {
  // Clinic Info
  clinicName: string
  clinicSpecaility?: string[]
  timezone: string

  // Owner Info
  ownerName?: string
  ownerPhone?: string
  ownerAge?: number
  ownerGender?: 'male' | 'female' | 'other'
  ownerEmail?: string

  // Clinic Contact
  email?: string
  clinicPhone?: string
  clinicFax?: string

  // Address
  street: string
  city: string
  state: string
  zipCode: string
  country: string

  // Additional Info
  bio?: string
  description?: string

  // Logo
  logo: File | null
}

export default function AddClinicPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

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
    clinicPhone: "",
    clinicFax: "",
    logo: null,
    clinicSpecaility: [],
    ownerPhone: "",
    ownerAge: 0,
    ownerGender: "male",
    ownerEmail: "",
    bio: "",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof ClinicFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)

    try {
      // Get current logged-in user ID for both createdBy and ownerUser
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

      const clinicPayload: CreateClinicRequest = {
        clinicName: formData.clinicName,
        createdBy: currentUserId,
        ownerName: formData.ownerName,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        clinicPhone: formData.clinicPhone,
        clinicFax: formData.clinicFax,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        ownerAge: Number(formData.ownerAge),
        ownerGender: formData.ownerGender,
        clinicSpecaility: formData.clinicSpecaility,
        email: formData.email,
        timezone: formData.timezone,
        bio: formData.bio,
        description: formData.description,
      }

      const clinicResult = await dispatch(createClinic(clinicPayload)).unwrap()
      const newClinicId = clinicResult._id

      toast({
        title: "Success",
        description: "Clinic created successfully!",
      });

      if (newClinicId) {
        router.push(`/admin/clinics/${newClinicId}`)
      } else {
        // Fallback to clinics list if ID not found
        router.push("/admin/clinics")
      }

    } catch (err: any) {
      console.error("Error creating clinic:", err)

      // Enhanced error message handling
      let errorMessage = err.message || err.error || err || "Something went wrong."

      // Check for duplicate email error
      if (errorMessage.includes("E11000") || errorMessage.includes("duplicate key") || errorMessage.includes("email_1")) {
        errorMessage = "This email is already in use by another clinic. Please use a different email address."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }

  /* ----------  RENDER  ---------- */
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Toaster />

      {/* Header */}
      <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-[hsl(var(--muted-foreground))]"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                Add New Clinic
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Create a new clinic in the system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Clinic Details */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <Building2 className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Clinic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-[hsl(var(--foreground))]">
                    Clinic Name *
                  </Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g. City Health Center"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange("clinicName", e.target.value)}
                    required
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[hsl(var(--foreground))]">
                    Clinic Email *
                  </Label>
                  <Input
                    id="email"
                    placeholder="e.g. contact@cityhealthcenter.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicPhone" className="text-[hsl(var(--foreground))]">
                    Clinic Phone *
                  </Label>
                  <Input
                    id="clinicPhone"
                    placeholder="e.g. (123) 456-7890"
                    value={formData.clinicPhone}
                    onChange={(e) => handleInputChange("clinicPhone", e.target.value)}
                    required
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicFax" className="text-[hsl(var(--foreground))]">
                    Clinic Fax *
                  </Label>
                  <Input
                    id="clinicFax"
                    placeholder="e.g. (123) 456-7890"
                    value={formData.clinicFax}
                    onChange={(e) => handleInputChange("clinicFax", e.target.value)}
                    required
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[hsl(var(--foreground))]">Clinic Speciality</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[40px]">
                    {formData.clinicSpecaility && formData.clinicSpecaility.length > 0 ? (
                      formData.clinicSpecaility.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(var(--color-brand-teal))] text-white text-sm rounded-md"
                        >
                          {specialty}
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange(
                                "clinicSpecaility",
                                formData.clinicSpecaility?.filter((s) => s !== specialty)
                              )
                            }}
                            className="hover:bg-[hsl(var(--color-brand-teal-dark))] rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No specialties selected</span>
                    )}
                  </div>
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val && !formData.clinicSpecaility?.includes(val)) {
                        handleInputChange("clinicSpecaility", [
                          ...(formData.clinicSpecaility || []),
                          val,
                        ])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add Speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Logo upload temporarily disabled - will be available in edit page */}
              <div className="space-y-2 mt-6">
                <Label className="text-[hsl(var(--muted-foreground))]">Clinic Logo</Label>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Logo upload will be available after creating the clinic. You can add it by editing the clinic.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <MapPin className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-[hsl(var(--foreground))]">
                    Street Address *
                  </Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    required
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[hsl(var(--foreground))]">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-[hsl(var(--foreground))]">
                      State/Province *
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-[hsl(var(--foreground))]">
                      Zip/Postal Code *
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-[hsl(var(--foreground))]">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-[hsl(var(--foreground))]">
                    Owner Name *
                  </Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g. Dr. John Smith"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    required
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail" className="text-[hsl(var(--foreground))]">
                      Owner Email *
                    </Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      placeholder="owner@clinic.com"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Must be unique - cannot use existing clinic email
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-[hsl(var(--foreground))]">
                      Owner Phone *
                    </Label>
                    <Input
                      id="ownerPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.ownerPhone}
                      onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownerAge" className="text-[hsl(var(--foreground))]">
                      Owner Age *
                    </Label>
                    <Input
                      id="ownerAge"
                      type="number"
                      placeholder="e.g. 45"
                      value={formData.ownerAge}
                      onChange={(e) => handleInputChange("ownerAge", e.target.value)}
                      required
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerGender" className="text-[hsl(var(--foreground))]">
                      Owner Gender *
                    </Label>
                    <Select
                      value={formData.ownerGender}
                      onValueChange={(val) => handleInputChange("ownerGender", val)}
                    >
                      <SelectTrigger className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <Building2 className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[hsl(var(--foreground))]">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    placeholder="Brief bio about the clinic..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[hsl(var(--foreground))]">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    placeholder="Detailed description of services, facilities, and specializations..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-1/2 border-[hsl(var(--border))] bg-transparent"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-1/2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
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