"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { fetchClinicById, updateClinic } from "@/lib/slices/clinicSlice"
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
  Loader2,
  Save,
  ArrowLeft
} from "lucide-react"
import type { UpdateClinicRequest } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

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
  clinicSpecaility: string[]
  timezone: string
  ownerName: string
  ownerPhone: string
  ownerAge: number
  ownerGender: 'male' | 'female' | 'other'
  ownerEmail: string
  email: string
  clinicPhone: string
  clinicFax: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  bio: string
  description: string
  logo: File | null
}

export default function EditClinicPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { currentClinic: clinic, loading } = useSelector(
    (state: RootState) => state.clinics
  )

  /* ---------  STATE  --------- */
  const [formData, setFormData] = useState<ClinicFormData>({
    clinicName: "",
    clinicSpecaility: [],
    timezone: "UTC",
    ownerName: "",
    ownerPhone: "",
    ownerAge: 0,
    ownerGender: "other",
    ownerEmail: "",
    email: "",
    clinicPhone: "",
    clinicFax: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    bio: "",
    description: "",
    logo: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ---------  HOOKS  --------- */
  useEffect(() => {
    if (params.id) dispatch(fetchClinicById(params.id as string))
  }, [params.id, dispatch])

  useEffect(() => {
    if (!clinic) return
    setFormData({
      clinicName: clinic.clinicName || "",
      clinicSpecaility: clinic.clinicSpecaility || [],
      timezone: clinic.timezone || "UTC",
      ownerName: clinic.ownerName || "",
      ownerPhone: clinic.ownerPhone || "",
      ownerAge: clinic.ownerAge || 0,
      ownerGender: clinic.ownerGender || "other",
      ownerEmail: clinic.ownerEmail || "",
      email: clinic.email || "",
      clinicPhone: clinic.clinicPhone || "",
      clinicFax: clinic.clinicFax || "",
      street: clinic.address?.street || "",
      city: clinic.address?.city || "",
      state: clinic.address?.state || "",
      zipCode: clinic.address?.zipCode || "",
      country: clinic.address?.country || "",
      bio: clinic.bio || "",
      description: clinic.description || "",
      logo: null
    })
  }, [clinic])

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof ClinicFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clinicName.trim() || !formData.email.trim()) {
      toast({ title: "Error", description: "Clinic name and email are required", variant: "destructive" })
      return
    }
    try {
      setIsSubmitting(true)
      const payload: UpdateClinicRequest = {
        clinicName: formData.clinicName,
        clinicSpecaility: formData.clinicSpecaility,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerAge: Number(formData.ownerAge),
        ownerGender: formData.ownerGender,
        ownerEmail: formData.ownerEmail,
        email: formData.email,
        clinicPhone: formData.clinicPhone,
        clinicFax: formData.clinicFax,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        bio: formData.bio,
        description: formData.description,
        timezone: formData.timezone
      }
      await dispatch(updateClinic({ id: params.id as string, data: payload })).unwrap()
      toast({ title: "Success", description: "Clinic updated!" })
      router.push(`/admin/clinics/${params.id}`)
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update clinic", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ----------  RENDER  ---------- */
  if (loading && !clinic) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--color-brand-teal))]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Toaster />
      {/* Header */}
      <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Edit Clinic</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Update clinic information</p>
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
            <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="email">Clinic Email *</Label>
                  <Input
                    id="email"
                    placeholder="e.g. contact@cityhealthcenter.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Clinic Phone *</Label>
                  <Input
                    id="clinicPhone"
                    placeholder="e.g. (123) 456-7890"
                    value={formData.clinicPhone}
                    onChange={(e) => handleInputChange("clinicPhone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicFax">Clinic Fax</Label>
                  <Input
                    id="clinicFax"
                    placeholder="e.g. (123) 456-7890"
                    value={formData.clinicFax}
                    onChange={(e) => handleInputChange("clinicFax", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(v) => handleInputChange("timezone", v)}>
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
                <div className="space-y-2">
                  <Label>Clinic Speciality</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[40px]">
                    {formData.clinicSpecaility.length ? (
                      formData.clinicSpecaility.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(var(--color-brand-teal))] text-white text-sm rounded-md">
                          {s}
                          <button
                            type="button"
                            onClick={() => handleInputChange("clinicSpecaility", formData.clinicSpecaility.filter((x) => x !== s))}
                            className="hover:bg-[hsl(var(--color-brand-teal-dark))] rounded-full px-1"
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
                      if (val && !formData.clinicSpecaility.includes(val)) handleInputChange("clinicSpecaility", [...formData.clinicSpecaility, val])
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
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <MapPin className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input id="street" value={formData.street} onChange={(e) => handleInputChange("street", e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input id="state" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                  <Input id="zipCode" value={formData.zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input id="ownerName" placeholder="e.g. Dr. John Smith" value={formData.ownerName} onChange={(e) => handleInputChange("ownerName", e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner Email *</Label>
                  <Input id="ownerEmail" type="email" placeholder="owner@clinic.com" value={formData.ownerEmail} onChange={(e) => handleInputChange("ownerEmail", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Owner Phone *</Label>
                  <Input id="ownerPhone" type="tel" placeholder="+1 (555) 123-4567" value={formData.ownerPhone} onChange={(e) => handleInputChange("ownerPhone", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerAge">Owner Age *</Label>
                  <Input id="ownerAge" type="number" placeholder="e.g. 45" value={formData.ownerAge} onChange={(e) => handleInputChange("ownerAge", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerGender">Owner Gender *</Label>
                  <Select value={formData.ownerGender} onValueChange={(v) => handleInputChange("ownerGender", v)}>
                    <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* Additional */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <Building2 className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Brief bio about the clinic..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed description..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="w-1/2" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="w-1/2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white" disabled={isSubmitting}>
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