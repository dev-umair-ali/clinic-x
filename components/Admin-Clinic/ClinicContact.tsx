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
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Phone className="h-5 w-5 text-[#1DA68F]" />
          Contact Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone" className="text-gray-700 dark:text-gray-300">
              Alternate Phone
            </Label>
            <Input
              id="alternatePhone"
              type="tel"
              value={data.alternatePhone}
              onChange={(e) => onChange("alternatePhone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="clinic@example.com"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={data.website}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder="https://www.example.com "
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}