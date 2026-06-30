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

export default function EmergencyContact({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Emergency Contact
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Emergency Contact Name *
          </Label>
          <Input
            placeholder="Person's Name"
            value={formData?.emergencyContactName}
            onChange={(e) => updateFormData("emergencyContactName", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Emergency Contact Phone *
          </Label>
          <Input
            placeholder="(555) 123-4567"
            value={formData?.emergencyPhoneNumber}
            onChange={(e) => updateFormData("emergencyPhoneNumber", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
          Relationship to Patient *
        </Label>
        <Select
          value={formData?.relationshipToPatient}
          onValueChange={(v) => updateFormData("relationshipToPatient", v)}
        >
          <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
            <SelectItem value="spouse" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Spouse</SelectItem>
            <SelectItem value="parent" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Parent</SelectItem>
            <SelectItem value="child" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Child</SelectItem>
            <SelectItem value="sibling" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Sibling</SelectItem>
            <SelectItem value="friend" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Friend</SelectItem>
            <SelectItem value="other" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}