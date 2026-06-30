"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { updateDoctor, fetchDoctor } from "@/lib/slices/doctorSlice"
import { fetchClinics } from "@/lib/slices/clinicSlice"
import type { AppDispatch, RootState } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Plus, Loader2, User, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"

export default function EditDoctorPage() {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const doctorRef = params.id as string

  const { doctor, loading: doctorsLoading } = useSelector((state: RootState) => state.doctors)
  const { clinics } = useSelector((state: RootState) => state.clinics)

  /* ----------  STATE  ---------- */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    phone: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    specialization: "",
    clinicRef: "",
    languages: [] as string[],
    yearsOfExperience: "",
    experience: "",
    licenseNumber: "",
    bio: "",
    educationSummary: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    education: [] as Array<{
      degree: string
      institution: string
      graduationYear: number | null
      fieldOfStudy: string
    }>,
    role: "doctor" as const,
    hipaaConsent: true,
    profilePicture: "",

  })

  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ----------  HOOKS  ---------- */
  useEffect(() => {
    dispatch(fetchClinics())
  }, [dispatch])

  useEffect(() => {
    if (doctorRef) dispatch(fetchDoctor(doctorRef))
  }, [dispatch, doctorRef])

  useEffect(() => {
    if (!doctor || doctor._id !== doctorRef) return

    const addressValue =
      typeof doctor.address === "string"
        ? { street: doctor.address, city: "", state: "", zipCode: "", country: "USA" }
        : doctor.address && typeof doctor.address === "object"
        ? {
            street: (doctor.address as any).street || "",
            city: (doctor.address as any).city || "",
            state: (doctor.address as any).state || "",
            zipCode: (doctor.address as any).zipCode || "",
            country: (doctor.address as any).country || "USA",
          }
        : { street: "", city: "", state: "", zipCode: "", country: "USA" }

    const educationValue = (doctor as any).education?.map((edu: any) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      graduationYear: edu.graduationYear || null,
      fieldOfStudy: edu.fieldOfStudy || "",
    })) || []

    setFormData({
      firstName: doctor.firstName || "",
      lastName: doctor.lastName || "",
      name: `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim(),
      email: doctor.email || "",
      password: "",
      phoneNumber: doctor.phoneNumber || "",
      phone: doctor.phoneNumber || "",
      age: doctor.age?.toString() || "",
      dateOfBirth: doctor.dateOfBirth || "",
      gender: doctor.gender || "",
      specialization: doctor.specialization || "",
      clinicRef: typeof doctor.clinicRef === "string" ? doctor.clinicRef : (doctor.clinicRef as any)?._id || "",
      languages: doctor.languages || [],
      yearsOfExperience: doctor.yearsOfExperience?.toString() || "",
      experience: doctor.yearsOfExperience?.toString() || "",
      licenseNumber: doctor.licenseNumber || "",
      bio: typeof doctor.bio === "string" ? doctor.bio : "",
      educationSummary: typeof doctor.educationSummary === "string" ? doctor.educationSummary : "",
      address: addressValue,
      education: educationValue,
      role: "doctor",
      hipaaConsent: doctor.hipaaConsent ?? true,
      profilePicture: doctor.profilePicture || "",
    })
    setProfileImage(doctor.profilePicture || null)
  }, [doctor, doctorRef])

  /* ----------  HANDLERS  ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith("address.")) {
      const field = name.split(".")[1]
      return setFormData((p) => ({ ...p, address: { ...p.address, [field]: value } }))
    }
    const updated = { ...formData, [name]: value }
    if (name === "firstName" || name === "lastName") {
      updated.name = `${name === "firstName" ? value : formData.firstName} ${name === "lastName" ? value : formData.lastName}`.trim()
    }
    if (name === "phone") updated.phoneNumber = value
    if (name === "phoneNumber") updated.phone = value
    if (name === "experience") updated.yearsOfExperience = value
    if (name === "yearsOfExperience") updated.experience = value
    setFormData(updated)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append("file", file)
    const token = localStorage.getItem("clinic-ai-token")
    if (!token) {
      toast({ title: "Error", description: "No auth token", variant: "destructive" })
      return ""
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    if (!res.ok) {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" })
      return ""
    }
    const result = await res.json()
    return result.fileUrl || result.profilePicture || result.data?.fileUrl
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Invalid image", variant: "destructive" })
      return
    }
    if (file.size > 2.5 * 1024 * 1024) {
      toast({ title: "Error", description: "Max 2.5 MB", variant: "destructive" })
      return
    }
    setImageUploading(true)
    try {
      const url = await uploadImage(file)
      if (url) {
        setFormData((p) => ({ ...p, profilePicture: url }))
        setProfileImage(url)
        toast({ title: "Success", description: "Picture uploaded!" })
      }
    } catch {
      toast({ title: "Error", description: "Upload error", variant: "destructive" })
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctor) return
    setLoading(true)
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        gender: formData.gender as "male" | "female" | "other",
        phone: formData.phoneNumber,
        phoneNumber: formData.phoneNumber,
        experience: Number(formData.yearsOfExperience),
        yearsOfExperience: formData.yearsOfExperience,
        profilePicture: formData.profilePicture || profileImage || undefined,
        education: formData.educationSummary ? formData.education : [],
        clinicRef: formData.clinicRef,
      }
      const result = await dispatch(updateDoctor({ id: doctorRef, doctorData: payload })).unwrap()
      setLoading(false)
      toast({ title: "Success", description: "Doctor updated!" })

      router.push(`/admin/doctors/view/${doctorRef}`)
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Update failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (!doctor || doctorsLoading)
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))] mx-auto"></div>
            <p className="mt-4 text-[hsl(var(--muted-foreground))]">Loading doctor data...</p>
          </div>
        </div>
      </ProtectedRoute>
    )

  /* ----------  RENDER  ---------- */
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Toaster />
        {/* ------- HEADER ------- */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--muted-foreground))]"
                // onClick={() => router.push("/admin/doctors")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Edit Doctor</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Update doctor information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------- BODY ------- */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Camera className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="flex items-center space-x-4">
                  <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.profilePicture || "/placeholder.svg?height=80&width=80"} />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center">
                      {imageUploading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} className="hidden" />
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
                    <Label htmlFor="firstName" className="text-[hsl(var(--foreground))]">First Name *</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[hsl(var(--foreground))]">Last Name *</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[hsl(var(--foreground))]">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[hsl(var(--foreground))]">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-[hsl(var(--foreground))]">Phone Number *</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[hsl(var(--foreground))]">Age *</Label>
                    <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-[hsl(var(--foreground))]">Date of Birth *</Label>
                    <DatePicker
                      value={formData.dateOfBirth}
                      onChange={(iso) => setFormData({ ...formData, dateOfBirth: iso })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-[hsl(var(--foreground))]">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-[hsl(var(--foreground))]">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Plus className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="educationSummary" className="text-[hsl(var(--foreground))]">Education</Label>
                    <Input id="educationSummary" name="educationSummary" value={formData.educationSummary} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinicRef" className="text-[hsl(var(--foreground))]">Assigned Clinic</Label>
                    <Select value={formData.clinicRef} onValueChange={(v) => setFormData({ ...formData, clinicRef: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.clinicName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-[hsl(var(--foreground))]">Specialty *</Label>
                    <Select value={formData.specialization} onValueChange={(v) => setFormData({ ...formData, specialization: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience" className="text-[hsl(var(--foreground))]">Years of Experience *</Label>
                    <Select value={formData.yearsOfExperience} onValueChange={(v) => setFormData({ ...formData, yearsOfExperience: v, experience: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y} {y === 1 ? "year" : "years"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-[hsl(var(--foreground))]">License Number *</Label>
                    <Input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2 mt-6">
                  <Label className="text-[hsl(var(--foreground))]">Languages</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={formData.languages.includes(lang)}
                          onCheckedChange={(c) =>
                            setFormData((p) => ({
                              ...p,
                              languages: c ? [...p.languages, lang] : p.languages.filter((l) => l !== lang),
                            }))
                          }
                        />
                        <Label htmlFor={`lang-${lang}`} className="text-sm text-[hsl(var(--muted-foreground))]">
                          {lang}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] border border-[hsl(var(--color-chart-blue))]"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, languages: p.languages.filter((l) => l !== lang) }))}
                            className="ml-1.5 w-4 h-4 rounded-full text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.2)]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                    <Input name="address.street" value={formData.address.street} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">City</Label>
                      <Input name="address.city" value={formData.address.city} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">State</Label>
                      <Input name="address.state" value={formData.address.state} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">Zip Code</Label>
                      <Input name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">Country</Label>
                      <Input name="address.country" value={formData.address.country} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
                // onClick={() => router.push("/admin/doctors")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Update Doctor
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}