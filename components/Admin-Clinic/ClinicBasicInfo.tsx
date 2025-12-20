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
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Building2 className="h-5 w-5 text-[#1DA68F]" />
          Basic Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clinicName" className="text-gray-700 dark:text-gray-300">
              Clinic Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clinicName"
              value={data.clinicName}
              onChange={(e) => onChange("clinicName", e.target.value)}
              placeholder="Enter clinic name"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicType" className="text-gray-700 dark:text-gray-300">
              Clinic Type <span className="text-red-500">*</span>
            </Label>
            <Select value={data.clinicType} onValueChange={(v) => onChange("clinicType", v)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]">
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
            <Label htmlFor="registrationNumber" className="text-gray-700 dark:text-gray-300">
              Registration Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="registrationNumber"
              value={data.registrationNumber}
              onChange={(e) => onChange("registrationNumber", e.target.value)}
              placeholder="Enter registration number"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-gray-700 dark:text-gray-300">
              Tax ID / GST Number
            </Label>
            <Input
              id="taxId"
              value={data.taxId}
              onChange={(e) => onChange("taxId", e.target.value)}
              placeholder="Enter tax ID"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalDoctors" className="text-gray-700 dark:text-gray-300">
              Total Doctors
            </Label>
            <Input
              id="totalDoctors"
              type="number"
              value={data.totalDoctors}
              onChange={(e) => onChange("totalDoctors", e.target.value)}
              placeholder="Enter number"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalStaff" className="text-gray-700 dark:text-gray-300">
              Total Staff
            </Label>
            <Input
              id="totalStaff"
              type="number"
              value={data.totalStaff}
              onChange={(e) => onChange("totalStaff", e.target.value)}
              placeholder="Enter number"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Clinic Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
              {preview ? (
                <img src={preview} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <label htmlFor="logo-upload">
                <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[#1DA68F] text-[#1DA68F] rounded-lg hover:bg-[#1DA68F]/10 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </div>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}