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
    <Card className="border-[hsl(var(--border))] shadow-sm">
      <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
          <Phone className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
          Contact Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-[hsl(var(--card))]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-[hsl(var(--foreground))]">
              Phone Number <span className="text-[hsl(var(--destructive))]">*</span>
            </Label>
            <Input
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="Enter phone number"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone" className="text-[hsl(var(--foreground))]">
              Alternate Phone
            </Label>
            <Input
              id="alternatePhone"
              value={data.alternatePhone}
              onChange={(e) => onChange("alternatePhone", e.target.value)}
              placeholder="Enter alternate phone"
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
              placeholder="Enter email address"
              className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
          <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-4">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName" className="text-[hsl(var(--foreground))]">
                Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                value={data.emergencyContactName}
                onChange={(e) => onChange("emergencyContactName", e.target.value)}
                placeholder="Enter contact name"
                className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-[hsl(var(--foreground))]">
                Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                value={data.emergencyContactPhone}
                onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
                placeholder="Enter contact phone"
                className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation" className="text-[hsl(var(--foreground))]">
                Relationship
              </Label>
              <Select
                value={data.emergencyContactRelation}
                onValueChange={(v) => onChange("emergencyContactRelation", v)}
              >
                <SelectTrigger className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]">
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