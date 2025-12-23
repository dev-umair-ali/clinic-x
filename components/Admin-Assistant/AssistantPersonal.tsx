"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Upload } from "lucide-react"

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"]

interface Props {
  data: {
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    nationalId: string
    photo: File | null
  }
  onChange: (field: string, val: string) => void
  onPhoto: (file: File) => void
  photoPreview: string | null
}

export default function AssistantPersonal({ data, onChange, onPhoto, photoPreview }: Props) {
  const [preview, setPreview] = useState<string | null>(photoPreview)

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <Card className="border-[hsl(var(--border))] shadow-sm">
      <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
          <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-[hsl(var(--card))]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[hsl(var(--foreground))]">
              First Name <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="Enter first name"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[hsl(var(--foreground))]">
              Last Name <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              placeholder="Enter last name"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-[hsl(var(--foreground))]">
              Date of Birth <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-[hsl(var(--foreground))]">
              Gender <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Select value={data.gender} onValueChange={(v) => onChange("gender", v)}>
              <SelectTrigger className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId" className="text-[hsl(var(--foreground))]">
              National ID <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="nationalId"
              value={data.nationalId}
              onChange={(e) => onChange("nationalId", e.target.value)}
              placeholder="Enter national ID"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-[hsl(var(--foreground))] mb-2 block">Assistant Photo</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 border-2 border-dashed border-[hsl(var(--border))] rounded-full flex items-center justify-center overflow-hidden bg-[hsl(var(--accent))]">
              {preview ? (
                <img src={preview} alt="Photo preview" className="w-full h-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
              )}
            </div>
            <div>
              <label htmlFor="photo-upload">
                <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))] rounded-lg hover:bg-[hsl(var(--color-brand-teal-light))] transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </div>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}