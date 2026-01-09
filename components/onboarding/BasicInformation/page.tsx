"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BasicInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Full Name *
          </Label>
          <Input
            placeholder="Enter your full Legal Name"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Preferred Name
          </Label>
          <Input
            placeholder="What would you like to be called"
            value={formData.preferredName}
            onChange={(e) => updateFormData("preferredName", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        
        {/* Date of Birth - Required */}
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Date of Birth *
          </Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>

        {/* Gender - Required */}
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Gender *
          </Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
            <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address Fields - Required */}
        <div className="sm:col-span-2">
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Street Address *
          </Label>
          <Input
            placeholder="123 Main Street"
            value={formData.streetAddress}
            onChange={(e) => updateFormData("streetAddress", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            City *
          </Label>
          <Input
            placeholder="City"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            State *
          </Label>
          <Input
            placeholder="State"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Zip Code *
          </Label>
          <Input
            placeholder="12345"
            value={formData.zipCode}
            onChange={(e) => updateFormData("zipCode", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>
    </div>
  );
}