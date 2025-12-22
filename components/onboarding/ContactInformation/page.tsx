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

export default function ContactInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Email Address *
          </Label>
          <Input
            type="email"
            placeholder="your@example.com"
            value={formData.emailAddress}
            onChange={(e) => updateFormData("emailAddress", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Phone Number *
          </Label>
          <Input
            placeholder="(555) 123-4567"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData("phoneNumber", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
          Preferred Contact Method
        </Label>
        <Select
          value={formData.preferredContactMethod}
          onValueChange={(v) => updateFormData("preferredContactMethod", v)}
        >
          <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
            <SelectValue placeholder="How would you like us to contact you" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
            <SelectItem value="phone" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Phone</SelectItem>
            <SelectItem value="email" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Email</SelectItem>
            <SelectItem value="text" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Text Message</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}