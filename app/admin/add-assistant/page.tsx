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
  User,
  MapPin,
  Phone,
  FileText,
  Upload,
  X,
  ArrowLeft,
  Save,
  CheckCircle,
  Loader2,
  Briefcase,
  Clock,
  AlertCircle,
  GraduationCap,
} from "lucide-react"

/* ---------  NEW  COMPONENTS  --------- */
import AssistantPersonal    from "@/components/Admin-Assistant/AssistantPersonal"
import AssistantAddress     from "@/components/Admin-Assistant/AssistantAddress"
import AssistantContact     from "@/components/Admin-Assistant/AssistantContact"
import AssistantEmployment  from "@/components/Admin-Assistant/AssistantEmployment"
import AssistantSchedule    from "@/components/Admin-Assistant/AssistantSchedule"

/* ---------  STATIC DATA  --------- */
const qualificationOptions = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Medical Office Administration Certificate",
  "CPR Certified",
  "First Aid Certified",
  "HIPAA Training",
  "Electronic Health Records (EHR) Training",
  "Medical Terminology Course",
  "Customer Service Training",
]

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

/* ---------  TYPES  --------- */
interface AssistantFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationalId: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  alternatePhone: string
  email: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  assignedClinic: string
  department: string
  role: string
  employeeId: string
  hireDate: string
  employmentType: string
  salary: string
  workingDays: string[]
  shiftStart: string
  shiftEnd: string
  qualifications: string[]
  experience: string
  previousEmployer: string
  references: string
  notes: string
  photo: File | null
  documents: File[]
}

/* ---------  MAIN PAGE  --------- */
export default function AddAssistantPage() {
  const [formData, setFormData] = useState<AssistantFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
    alternatePhone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    assignedClinic: "",
    department: "",
    role: "",
    employeeId: "",
    hireDate: "",
    employmentType: "",
    salary: "",
    workingDays: [],
    shiftStart: "",
    shiftEnd: "",
    qualifications: [],
    experience: "",
    previousEmployer: "",
    references: "",
    notes: "",
    photo: null,
    documents: [],
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof AssistantFormData, value: string) => {
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

  const handleQualificationToggle = (qual: string) => {
    setFormData((p) => ({
      ...p,
      qualifications: p.qualifications.includes(qual)
        ? p.qualifications.filter((q) => q !== qual)
        : [...p.qualifications, qual],
    }))
  }

  const handlePhotoUpload = (file: File) => {
    setFormData((p) => ({ ...p, photo: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
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
    if (!formData.firstName.trim()) newErrors.push("First Name is required")
    if (!formData.lastName.trim()) newErrors.push("Last Name is required")
    if (!formData.dateOfBirth) newErrors.push("Date of Birth is required")
    if (!formData.gender) newErrors.push("Gender is required")
    if (!formData.nationalId.trim()) newErrors.push("National ID is required")
    if (!formData.address.trim()) newErrors.push("Address is required")
    if (!formData.city.trim()) newErrors.push("City is required")
    if (!formData.phoneNumber.trim()) newErrors.push("Phone Number is required")
    if (!formData.email.trim()) newErrors.push("Email is required")
    if (!formData.assignedClinic) newErrors.push("Assigned Clinic is required")
    if (!formData.role) newErrors.push("Role is required")
    if (!formData.hireDate) newErrors.push("Hire Date is required")
    if (!formData.employmentType) newErrors.push("Employment Type is required")
    if (formData.workingDays.length === 0) newErrors.push("At least one working day is required")

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
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-[hsl(var(--color-status-success))] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          Assistant saved successfully!
        </div>
      )}

      {/* Header */}
      <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-[hsl(var(--muted-foreground))]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Add New Assistant</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Register a new assistant for your clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[hsl(var(--border))] bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Assistant
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {errors.length > 0 && (
          <div className="mb-6 bg-[hsl(var(--color-status-error-light))] border border-[hsl(var(--color-status-error-dark))] rounded-lg p-4">
            <h3 className="text-[hsl(var(--color-status-error-dark))] font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Please fix the following errors:
            </h3>
            <ul className="list-disc list-inside text-[hsl(var(--color-status-error-dark))] text-sm space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1  Personal */}
          <AssistantPersonal
            data={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              dateOfBirth: formData.dateOfBirth,
              gender: formData.gender,
              nationalId: formData.nationalId,
              photo: formData.photo,
            }}
            onChange={handleInputChange}
            onPhoto={handlePhotoUpload}
            photoPreview={photoPreview}
          />

          {/* 2  Address */}
          <AssistantAddress
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
          <AssistantContact
            data={{
              phoneNumber: formData.phoneNumber,
              alternatePhone: formData.alternatePhone,
              email: formData.email,
              emergencyContactName: formData.emergencyContactName,
              emergencyContactPhone: formData.emergencyContactPhone,
              emergencyContactRelation: formData.emergencyContactRelation,
            }}
            onChange={handleInputChange}
          />

          {/* 4  Employment */}
          <AssistantEmployment
            data={{
              assignedClinic: formData.assignedClinic,
              department: formData.department,
              role: formData.role,
              employeeId: formData.employeeId,
              hireDate: formData.hireDate,
              employmentType: formData.employmentType,
              salary: formData.salary,
            }}
            onChange={handleInputChange}
          />

          {/* 5  Schedule */}
          <AssistantSchedule
            data={{
              workingDays: formData.workingDays,
              shiftStart: formData.shiftStart,
              shiftEnd: formData.shiftEnd,
            }}
            onChange={handleInputChange}
            onToggleDay={handleWorkingDayToggle}
          />

          {/* 6  Qualifications */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <GraduationCap className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Qualifications & Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="space-y-6">
                <div>
                  <Label className="text-[hsl(var(--foreground))] mb-3 block">Qualifications & Certifications</Label>
                  <div className="flex flex-wrap gap-2">
                    {qualificationOptions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQualificationToggle(q)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          formData.qualifications.includes(q)
                            ? "bg-[hsl(var(--color-brand-teal))] text-white border-[hsl(var(--color-brand-teal))]"
                            : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--color-brand-teal))]"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-[hsl(var(--foreground))]">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="Enter years of experience"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousEmployer" className="text-[hsl(var(--foreground))]">
                      Previous Employer
                    </Label>
                    <Input
                      id="previousEmployer"
                      value={formData.previousEmployer}
                      onChange={(e) => handleInputChange("previousEmployer", e.target.value)}
                      placeholder="Enter previous employer"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="references" className="text-[hsl(var(--foreground))]">
                    References
                  </Label>
                  <Textarea
                    id="references"
                    value={formData.references}
                    onChange={(e) => handleInputChange("references", e.target.value)}
                    placeholder="Enter reference details (name, contact, relationship)"
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))] min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7  Documents */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <FileText className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="space-y-4">
                <div>
                  <Label className="text-[hsl(var(--foreground))] mb-2 block">
                    Upload Documents (ID, Certificates, Resume, etc.)
                  </Label>
                  <label htmlFor="document-upload">
                    <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-[hsl(var(--color-brand-teal))] transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-[hsl(var(--muted-foreground))] mb-2" />
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Click to upload or drag and drop</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB each
                      </p>
                    </div>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    {formData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-[hsl(var(--accent))] p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                          <span className="text-sm text-[hsl(var(--foreground))]">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(idx)}
                          className="text-[hsl(var(--color-status-error))] hover:text-[hsl(var(--color-status-error-dark))]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 8  Notes */}
          <Card className="border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <FileText className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Enter any additional notes or comments"
                className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))] min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Bottom actions (mobile-only) */}
          <div className="flex justify-end gap-3 md:hidden">
            <Button variant="outline" className="border-[hsl(var(--border))] bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Assistant
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}