"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, Camera, User, Phone, MapPin, Briefcase, Globe } from "lucide-react"
import type { AppDispatch, RootState } from "@/lib/store"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDoctor } from "@/lib/slices/doctorSlice"
import { fetchClinics } from "@/lib/slices/clinicSlice"
import moment from "moment"

export default function ViewDoctorProfile() {
  const params = useParams()
  const router = useRouter()
  const { doctor, loading } = useSelector((state: RootState) => state.doctors)
  const { clinics } = useSelector((state: RootState) => state.clinics)
  const dispatch = useDispatch<AppDispatch>()
  const doctorId = params.id as string

  useEffect(() => {
    dispatch(fetchClinics())
  }, [dispatch])

  useEffect(() => {
    if (doctorId) dispatch(fetchDoctor(doctorId))
  }, [dispatch, doctorId])

  useEffect(() => {
  }, [doctor])

  /* ----------  HELPERS  ---------- */
  const formatAddress = (address: any) => {
    if (typeof address === "string") return address
    if (address && typeof address === "object") {
      const parts = []
      if (address.street) parts.push(address.street)
      if (address.city) parts.push(address.city)
      if (address.state) parts.push(address.state)
      if (address.country) parts.push(address.country)
      if (address.zipCode) parts.push(address.zipCode)
      return parts.length ? parts.join(", ") : "Address not specified"
    }
    return "123 Main St, Anytown, USA"
  }

  const formatTextField = (value: any, fallback: string) =>
    typeof value === "string" ? value : value && typeof value === "object" ? JSON.stringify(value) : fallback

  /* ----------  RENDER  ---------- */
  if (loading)
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))] mx-auto"></div>
            <p className="mt-4 text-[hsl(var(--muted-foreground))]">Loading doctor profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )

  if (!doctor)
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[hsl(var(--muted-foreground))]">Doctor not found</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">Looking for doctor ID: {doctorId}</p>
            <Button onClick={() => router.push("/admin/doctors")} className="mt-4">
              Back to Doctors
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* ------- HEADER ------- */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--muted-foreground))]"
                onClick={() => router.push("/admin/doctors")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">View Doctor</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">View doctor information and settings</p>
              </div>
            </div>
             {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
                onClick={() => router.push("/admin/doctors")}
              >
                Back to Doctors
              </Button>
              <Button
                type="button"
                className="w-1/2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
                onClick={() => router.push(`/admin/doctors/edit/${doctor._id}`)}
              >
                Edit Doctor
              </Button>
            </div>
          </div>
        </div>

        {/* ------- BODY ------- */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <form className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={doctor.profilePicture || "/placeholder.svg?height=80&width=80"} alt={`${doctor.firstName} ${doctor.lastName}`} />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {`${doctor.firstName} ${doctor.lastName}`}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">Profile Image</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Proposed size 512 × 512 px, max 2.5 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">First Name *</Label>
                    <Input value={doctor.firstName || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Last Name *</Label>
                    <Input value={doctor.lastName || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Full Name *</Label>
                    <Input value={`${doctor.firstName || ""} ${doctor.lastName || ""}`} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Date of Birth *</Label>
                    <Input value={moment(doctor.dateOfBirth).format("YYYY-MM-DD") || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Age *</Label>
                    <Input value={doctor.age?.toString() || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Gender *</Label>
                    <Input value={doctor.gender ? doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1) : ""} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[hsl(var(--foreground))]">Bio</Label>
                    <Textarea value={formatTextField(doctor.bio, "")} readOnly rows={3} />
                  </div>
                </div>

                {/* Education Details */}
                {(doctor as any).education?.length > 0 && (
                  <div className="mt-6">
                    <Label className="text-[hsl(var(--foreground))] mb-3 block">Education Details</Label>
                    <div className="space-y-3">
                      {(doctor as any).education.map((edu: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[hsl(var(--accent))] rounded-lg border border-[hsl(var(--border))]">
                          {edu.degree && <div className="font-medium text-[hsl(var(--foreground))]">{edu.degree}</div>}
                          {edu.institution && <div className="text-sm text-[hsl(var(--muted-foreground))]">{edu.institution}</div>}
                          <div className="flex gap-3 mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                            {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                            {edu.graduationYear && <span>• {edu.graduationYear}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Phone className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Email Address *</Label>
                    <Input value={doctor.email || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Phone Number *</Label>
                    <Input value={doctor.phoneNumber || ""} readOnly />
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
                    <Label className="text-[hsl(var(--foreground))]">Street Address</Label>
                    <Input value={typeof doctor.address === 'object' ? doctor.address?.street || "" : ""} readOnly />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">City</Label>
                      <Input value={typeof doctor.address === 'object' ? doctor.address?.city || "" : ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">State</Label>
                      <Input value={typeof doctor.address === 'object' ? doctor.address?.state || "" : ""} readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">Zip Code</Label>
                      <Input value={typeof doctor.address === 'object' ? doctor.address?.zipCode || "" : ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">Country</Label>
                      <Input value={typeof doctor.address === 'object' ? doctor.address?.country || "" : ""} readOnly />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Briefcase className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Specialty *</Label>
                    <Input value={doctor.specialization || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">License Number *</Label>
                    <Input value={doctor.licenseNumber || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Assigned Clinic</Label>
                    <Input
                      value={
                        clinics.find((c) => c._id === (typeof doctor.clinicRef === "string" ? doctor.clinicRef : doctor.clinicRef?._id))?.clinicName ||
                        (typeof doctor.clinicRef === "string" ? doctor.clinicRef : "") ||
                        "Not Assigned"
                      }
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Years of Experience *</Label>
                    <Input value={(doctor as any).yearsOfExperience?.toString() || ""} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Globe className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox checked={doctor.languages?.includes(language) || false} disabled />
                      <Label className="text-sm text-[hsl(var(--muted-foreground))]">{language}</Label>
                    </div>
                  ))}
                </div>
                {doctor.languages && doctor.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {doctor.languages.map((language: string) => (
                      <Badge key={language} variant="secondary" className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] border border-[hsl(var(--color-chart-blue))]">
                        {language}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status & HIPAA */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  Status & HIPAA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Status</Label>
                    <Badge
                      variant={doctor.status === "active" ? "default" : "destructive"}
                      className={
                        doctor.status === "active"
                          ? "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]"
                          : "bg-[hsl(var(--color-status-error-light))] text-[hsl(var(--color-status-error))]"
                      }
                    >
                      {doctor.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">HIPAA Consent</Label>
                    <Badge
                      variant={doctor.hipaaConsent ? "default" : "destructive"}
                      className={
                        doctor.hipaaConsent
                          ? "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]"
                          : "bg-[hsl(var(--color-status-error-light))] text-[hsl(var(--color-status-error))]"
                      }
                    >
                      {doctor.hipaaConsent ? "Consented" : "Not Consented"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

           
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}