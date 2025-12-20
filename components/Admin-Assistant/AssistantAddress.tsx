"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface Props {
  data: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  onChange: (field: string, val: string) => void
}

export default function AssistantAddress({ data, onChange }: Props) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <MapPin className="h-5 w-5 text-[#1DA68F]" />
          Address Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Enter complete street address"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F] min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="Enter city"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">
              State / Province
            </Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="Enter state"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-gray-700 dark:text-gray-300">
              ZIP / Postal Code
            </Label>
            <Input
              id="zipCode"
              value={data.zipCode}
              onChange={(e) => onChange("zipCode", e.target.value)}
              placeholder="Enter ZIP code"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
              Country
            </Label>
            <Input
              id="country"
              value={data.country}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder="Enter country"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}