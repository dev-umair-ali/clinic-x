"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"

interface ClinicContactProps {
  data: {
    phoneNumber: string
    alternatePhone: string
    email: string
    website: string
  }
  onChange: (field: string, val: string) => void
}

export default function ClinicContact({ data, onChange }: ClinicContactProps) {
  return (
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
            <Label htmlFor="phoneNumber" className="text-[hsl(var(--foreground))]">
              Phone Number <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone" className="text-[hsl(var(--foreground))]">
              Alternate Phone
            </Label>
            <Input
              id="alternatePhone"
              type="tel"
              value={data.alternatePhone}
              onChange={(e) => onChange("alternatePhone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[hsl(var(--foreground))]">
              Email Address <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="clinic@example.com"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-[hsl(var(--foreground))]">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={data.website}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder="https://www.example.com"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}