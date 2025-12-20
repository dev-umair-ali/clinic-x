"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  User,
  FileText,
  Upload,
  X,
  Plus,
  ArrowLeft,
  Save,
  CheckCircle,
  Loader2,
} from "lucide-react"

/* ---------  NEW  COMPONENTS  --------- */
import ClinicBasicInfo   from "@/components/Admin-Clinic/ClinicBasicInfo"
import ClinicAddress     from "@/components/Admin-Clinic/ClinicAddress"
import ClinicContact     from "@/components/Admin-Clinic/ClinicContact"
import ClinicOperating   from "@/components/Admin-Clinic/ClinicOperating"

/* ---------  STATIC DATA  --------- */
const specializationOptions = [
  "General Medicine","Cardiology","Dermatology","Orthopedics","Pediatrics","Gynecology",
  "Neurology","Ophthalmology","ENT","Dentistry","Psychiatry","Radiology",
]
const facilityOptions = [
  "Emergency Services","Laboratory","Pharmacy","X-Ray","Ultrasound","ECG",
  "MRI","CT Scan","Ambulance","Parking","Wheelchair Access","Cafeteria",
]

/* ---------  TYPES  --------- */
interface ClinicFormData {
  clinicName: string
  clinicType: string
  registrationNumber: string
  taxId: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  alternatePhone: string
  email: string
  website: string
  openingTime: string
  closingTime: string
  workingDays: string[]
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  totalDoctors: string
  totalStaff: string
  specializations: string[]
  facilities: string[]
  description: string
  logo: File | null
  documents: File[]
}

/* ---------  MAIN PAGE  --------- */
export default function AddClinicPage() {
  const [formData, setFormData] = useState<ClinicFormData>({
    clinicName: "",
    clinicType: "",
    registrationNumber: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
    alternatePhone: "",
    email: "",
    website: "",
    openingTime: "09:00",
    closingTime: "18:00",
    workingDays: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    totalDoctors: "",
    totalStaff: "",
    specializations: [],
    facilities: [],
    description: "",
    logo: null,
    documents: [],
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof ClinicFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkingDayToggle = (day: string) => {
    setFormData((p) => ({
      ...p,
      workingDays: p.workingDays.includes(day)
        ? p.workingDays.filter((d) => d !== day)
        : [...p.workingDays, day],
    }))
  }

  const handleSpecializationToggle = (spec: string) => {
    setFormData((p) => ({
      ...p,
      specializations: p.specializations.includes(spec)
        ? p.specializations.filter((s) => s !== spec)
        : [...p.specializations, spec],
    }))
  }

  const handleFacilityToggle = (facility: string) => {
    setFormData((p) => ({
      ...p,
      facilities: p.facilities.includes(facility)
        ? p.facilities.filter((f) => f !== facility)
        : [...p.facilities, facility],
    }))
  }

  const handleLogoUpload = (file: File) => {
    setFormData((p) => ({ ...p, logo: file }))
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) setFormData((p) => ({ ...p, documents: [...p.documents, ...Array.from(files)] }))
  }

  const removeDocument = (index: number) => {
    setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const newErrors: string[] = []
    if (!formData.clinicName.trim()) newErrors.push("Clinic Name is required")
    if (!formData.clinicType) newErrors.push("Clinic Type is required")
    if (!formData.registrationNumber.trim()) newErrors.push("Registration Number is required")
    if (!formData.address.trim()) newErrors.push("Address is required")
    if (!formData.city.trim()) newErrors.push("City is required")
    if (!formData.state.trim()) newErrors.push("State is required")
    if (!formData.zipCode.trim()) newErrors.push("ZIP Code is required")
    if (!formData.country.trim()) newErrors.push("Country is required")
    if (!formData.phoneNumber.trim()) newErrors.push("Phone Number is required")
    if (!formData.email.trim()) newErrors.push("Email is required")
    if (!formData.ownerName.trim()) newErrors.push("Owner Name is required")

    if (newErrors.length) {
      setErrors(newErrors)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setErrors([])
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  /* ----------  RENDER  ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          Clinic saved successfully!
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Clinic</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to register a new clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-300 dark:border-gray-600 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="bg-[#1DA68F] hover:bg-[#168f73] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Clinic
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-red-600 dark:text-red-400 text-sm space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1  Basic Info */}
          <ClinicBasicInfo
            data={{
              clinicName: formData.clinicName,
              clinicType: formData.clinicType,
              registrationNumber: formData.registrationNumber,
              taxId: formData.taxId,
              totalDoctors: formData.totalDoctors,
              totalStaff: formData.totalStaff,
              logo: formData.logo,
            }}
            onChange={(field: string, value: string) => handleInputChange(field as keyof ClinicFormData, value)}
            onLogo={handleLogoUpload}
            logoPreview={logoPreview}
          />

          {/* 2  Address */}
          <ClinicAddress
            data={{
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            }}
            onChange={handleInputChange}
          />

          {/* 3  Contact */}
          <ClinicContact
            data={{
              phoneNumber: formData.phoneNumber,
              alternatePhone: formData.alternatePhone,
              email: formData.email,
              website: formData.website,
            }}
            onChange={handleInputChange}
          />

          {/* 4  Operating Hours */}
          <ClinicOperating
            data={{
              openingTime: formData.openingTime,
              closingTime: formData.closingTime,
              workingDays: formData.workingDays,
            }}
            onChange={handleInputChange}
            onToggleDay={handleWorkingDayToggle}
          />

          {/* 5  Owner / Admin */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <User className="h-5 w-5 text-[#1DA68F]" />
                Owner / Administrator Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-gray-700 dark:text-gray-300">
                    Owner Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    placeholder="Enter owner name"
                    className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone" className="text-gray-700 dark:text-gray-300">
                    Owner Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail" className="text-gray-700 dark:text-gray-300">
                    Owner Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                    placeholder="owner@example.com"
                    className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6  Specializations & Facilities */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <Plus className="h-5 w-5 text-[#1DA68F]" />
                Specializations & Facilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-800">
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block">Specializations</Label>
                  <div className="flex flex-wrap gap-2">
                    {specializationOptions.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => handleSpecializationToggle(spec)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          formData.specializations.includes(spec)
                            ? "bg-[#1DA68F] text-white border-[#1DA68F]"
                            : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#1DA68F]"
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block">Available Facilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {facilityOptions.map((facility) => (
                      <button
                        key={facility}
                        type="button"
                        onClick={() => handleFacilityToggle(facility)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          formData.facilities.includes(facility)
                            ? "bg-[#1DA68F] text-white border-[#1DA68F]"
                            : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#1DA68F]"
                        }`}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7  Documents & Description */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <FileText className="h-5 w-5 text-[#1DA68F]" />
                Documents & Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-800">
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block">
                    Upload Documents (License, Certificates, etc.)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <span className="text-[#1DA68F] font-medium hover:underline">Click to upload</span>
                      <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                      <input
                        id="document-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleDocumentUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, JPG, PNG up to 10MB each</p>
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#1DA68F]" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{doc.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(idx)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    Clinic Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter a brief description of your clinic, services offered, and any special features..."
                    className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F] min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button type="button" variant="outline" className="border-gray-300 dark:border-gray-600 px-8 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1DA68F] hover:bg-[#168f73] text-white px-8">
              <Save className="h-4 w-4 mr-2" />
              Save Clinic
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}