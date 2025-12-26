"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { fetchClinicById, updateClinic } from "@/lib/slices/clinicSlice"
import { clinicService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  User,
  Loader2,
  Save,
  ArrowLeft,
  Globe,
  Upload,
  Trash2,
  Image as ImageIcon
} from "lucide-react"
import type { UpdateClinicRequest } from "@/lib/api"

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
  clinicName: string
  timezone: string
  ownerUser: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  email: string
  phone: string
  logo: File | null
}

export default function EditClinicPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { currentClinic: clinic, loading } = useSelector((state: RootState) => state.clinics)

  /* ---------  STATE  --------- */
  const [formData, setFormData] = useState<ClinicFormData>({
    clinicName: "",
    timezone: "UTC",
    ownerUser: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    email: "",
    phone: "",
    logo: null,
  })

  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch clinic data on mount
  useEffect(() => {
    if (params.id) {
      dispatch(fetchClinicById(params.id as string))
    }
  }, [params.id, dispatch])

  // Populate form when clinic data is loaded
  useEffect(() => {
    if (clinic) {
      setFormData({
        clinicName: clinic.clinicName || clinic.name || "",
        timezone: clinic.settings?.timezone || "UTC",
        ownerUser: clinic.ownerUser || "",
        street: clinic.address?.street || "",
        city: clinic.address?.city || "",
        state: clinic.address?.state || "",
        zipCode: clinic.address?.zipCode || "",
        country: clinic.address?.country || "",
        email: clinic.email || "",
        phone: clinic.phone || "",
        logo: null,
      })
      // Set current logo URL if exists
      setCurrentLogoUrl(clinic.logo || null)
    }
  }, [clinic])

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof ClinicFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file")
        return
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB")
        return
      }
      
      setFormData((prev) => ({ ...prev, logo: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }))
    setLogoPreview(null)
  }

  const handleDeleteCurrentLogo = async () => {
    if (!params.id) return
    
    try {
      setIsUploadingLogo(true)
      await dispatch(updateClinic({ 
        id: params.id as string, 
        data: { logo: "" } 
      })).unwrap()
      setCurrentLogoUrl(null)
      setSuccessMessage("Logo removed successfully")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError("Failed to remove logo: " + (err.message || err))
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validation
    if (!formData.clinicName.trim()) {
      setError("Clinic name is required")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }

    try {
      setIsSubmitting(true)

      // If there's a new logo file, upload it first
      let logoUrl = currentLogoUrl || ""
      if (formData.logo) {
        try {
          setIsUploadingLogo(true)
          console.log("Uploading new logo...")
          
          // Upload logo to backend
          const uploadResult = await clinicService.uploadClinicLogo(params.id as string, formData.logo)
          
          // Extract logo URL from response
          if (uploadResult.success && uploadResult.data?.logoUrl) {
            logoUrl = uploadResult.data.logoUrl
            console.log("Logo uploaded successfully:", logoUrl)
          } else {
            throw new Error("Logo upload failed: No URL returned")
          }
          
        } catch (logoError: any) {
          console.error("Logo upload failed:", logoError)
          setError(`Logo upload failed: ${logoError.message}. Other changes will still be saved.`)
          // Continue with update even if logo upload fails
        } finally {
          setIsUploadingLogo(false)
        }
      }

      const updateData: UpdateClinicRequest = {
        clinicName: formData.clinicName,
        name: formData.clinicName,
        ownerUser: formData.ownerUser,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        email: formData.email,
        phone: formData.phone,
        settings: {
          timezone: formData.timezone,
        },
      }
      
      // Include logo URL if we have one
      if (logoUrl) {
        updateData.logo = logoUrl
      }

      await dispatch(updateClinic({ id: params.id as string, data: updateData })).unwrap()
      setSuccessMessage("Clinic updated successfully!")
      setTimeout(() => {
        router.push(`/admin/clinics/${params.id}`)
      }, 1500)
    } catch (err: any) {
      console.error("Update error:", err)
      setError(err?.message || "Failed to update clinic")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && !clinic) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1DA68F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Clinic</h1>
              <p className="text-gray-500 mt-1">Update clinic information and settings</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
            <CardContent className="p-4 flex items-center gap-2 text-red-600 dark:text-red-400">
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
            <CardContent className="p-4 flex items-center gap-2 text-green-600 dark:text-green-400">
              <span>{successMessage}</span>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Logo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#1DA68F]" />
                Clinic Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Current/Preview Logo */}
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                    ) : currentLogoUrl ? (
                      <img src={currentLogoUrl} alt="Current logo" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No logo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.logo || currentLogoUrl ? "Change Logo" : "Upload Logo"}
                      </div>
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={isUploadingLogo}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: Square image, PNG or JPG, max 5MB
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {formData.logo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                        disabled={isUploadingLogo}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove New
                      </Button>
                    )}
                    
                    {currentLogoUrl && !formData.logo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteCurrentLogo}
                        disabled={isUploadingLogo}
                        className="text-red-600 hover:text-red-700"
                      >
                        {isUploadingLogo ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Current Logo
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#1DA68F]" />
                Clinic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">
                    Clinic Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clinicName"
                    placeholder="Enter clinic name"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange("clinicName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(val) => handleInputChange("timezone", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="clinic@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#1DA68F]" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="94102"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#1DA68F]" />
                Owner Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerUser">Owner Name</Label>
                <Input
                  id="ownerUser"
                  placeholder="John Doe"
                  value={formData.ownerUser}
                  onChange={(e) => handleInputChange("ownerUser", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1DA68F] hover:bg-[#168f73] min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Clinic
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
