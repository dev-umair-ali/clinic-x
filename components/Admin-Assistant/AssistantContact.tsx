
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"

const relationOptions = ["Spouse", "Parent", "Child", "Sibling", "Relative", "Friend", "Other"]

interface Props {
  data: {
    phoneNumber: string
    alternatePhone: string
    email: string
    emergencyContactName: string
    emergencyContactPhone: string
    emergencyContactRelation: string
  }
  onChange: (field: string, val: string) => void
}

export default function AssistantContact({ data, onChange }: Props) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Phone className="h-5 w-5 text-[#1DA68F]" />
          Contact Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="Enter phone number"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone" className="text-gray-700 dark:text-gray-300">
              Alternate Phone
            </Label>
            <Input
              id="alternatePhone"
              value={data.alternatePhone}
              onChange={(e) => onChange("alternatePhone", e.target.value)}
              placeholder="Enter alternate phone"
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
              placeholder="Enter email address"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName" className="text-gray-700 dark:text-gray-300">
                Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                value={data.emergencyContactName}
                onChange={(e) => onChange("emergencyContactName", e.target.value)}
                placeholder="Enter contact name"
                className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-gray-700 dark:text-gray-300">
                Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                value={data.emergencyContactPhone}
                onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
                placeholder="Enter contact phone"
                className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation" className="text-gray-700 dark:text-gray-300">
                Relationship
              </Label>
              <Select
                value={data.emergencyContactRelation}
                onValueChange={(v) => onChange("emergencyContactRelation", v)}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}