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
    <Card className="border-[hsl(var(--border))] shadow-sm">
      <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
          <MapPin className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
          Address Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-[hsl(var(--card))]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address" className="text-[hsl(var(--foreground))]">
              Street Address <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Enter complete street address"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))] min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-[hsl(var(--foreground))]">
              City <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="Enter city"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-[hsl(var(--foreground))]">
              State / Province
            </Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="Enter state"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-[hsl(var(--foreground))]">
              ZIP / Postal Code
            </Label>
            <Input
              id="zipCode"
              value={data.zipCode}
              onChange={(e) => onChange("zipCode", e.target.value)}
              placeholder="Enter ZIP code"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-[hsl(var(--foreground))]">
              Country
            </Label>
            <Input
              id="country"
              value={data.country}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder="Enter country"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}