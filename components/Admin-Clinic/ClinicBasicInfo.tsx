"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Upload } from "lucide-react"
import { useState } from "react"

const clinicTypes = [
  "General Practice",
  "Dental Clinic",
  "Eye Clinic",
  "Pediatric Clinic",
  "Orthopedic Clinic",
  "Dermatology Clinic",
  "Cardiology Clinic",
  "Neurology Clinic",
  "Gynecology Clinic",
  "Multi-Specialty",
]

interface ClinicBasicProps {
  data: {
    clinicName: string
    clinicType: string
    registrationNumber: string
    taxId: string
    totalDoctors: string
    totalStaff: string
    logo: File | null
  }
  onChange: (field: string, val: string) => void
  onLogo: (file: File) => void
  logoPreview: string | null
}

export default function ClinicBasicInfo({ data, onChange, onLogo, logoPreview }: ClinicBasicProps) {
  const [preview, setPreview] = useState<string | null>(logoPreview)

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onLogo(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <Card className="border-[hsl(var(--border))] shadow-sm">
      <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
          <Building2 className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
          Basic Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-[hsl(var(--card))]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clinicName" className="text-[hsl(var(--foreground))]">
              Clinic Name <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="clinicName"
              value={data.clinicName}
              onChange={(e) => onChange("clinicName", e.target.value)}
              placeholder="Enter clinic name"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicType" className="text-[hsl(var(--foreground))]">
              Clinic Type <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Select value={data.clinicType} onValueChange={(v) => onChange("clinicType", v)}>
              <SelectTrigger className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]">
                <SelectValue placeholder="Select clinic type" />
              </SelectTrigger>
              <SelectContent>
                {clinicTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber" className="text-[hsl(var(--foreground))]">
              Registration Number <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="registrationNumber"
              value={data.registrationNumber}
              onChange={(e) => onChange("registrationNumber", e.target.value)}
              placeholder="Enter registration number"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-[hsl(var(--foreground))]">
              Tax ID / GST Number
            </Label>
            <Input
              id="taxId"
              value={data.taxId}
              onChange={(e) => onChange("taxId", e.target.value)}
              placeholder="Enter tax ID"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalDoctors" className="text-[hsl(var(--foreground))]">
              Total Doctors
            </Label>
            <Input
              id="totalDoctors"
              type="number"
              value={data.totalDoctors}
              onChange={(e) => onChange("totalDoctors", e.target.value)}
              placeholder="Enter number"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalStaff" className="text-[hsl(var(--foreground))]">
              Total Staff
            </Label>
            <Input
              id="totalStaff"
              type="number"
              value={data.totalStaff}
              onChange={(e) => onChange("totalStaff", e.target.value)}
              placeholder="Enter number"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-[hsl(var(--foreground))] mb-2 block">Clinic Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 border-2 border-dashed border-[hsl(var(--border))] rounded-lg flex items-center justify-center overflow-hidden bg-[hsl(var(--accent))]">
              {preview ? (
                <img src={preview} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
              )}
            </div>
            <div>
              <label htmlFor="logo-upload">
                <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))] rounded-lg hover:bg-[hsl(var(--color-brand-teal-light))] transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </div>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}