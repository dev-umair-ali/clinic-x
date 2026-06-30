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

export default function AdditionalInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Additional Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Occupation
          </Label>
          <Input
            placeholder="Your Job Title or Profession"
            value={formData?.occupation}
            onChange={(e) => updateFormData("occupation", e.target.value)}
            className="bg-[hsl(var(--color-input-bg))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Primary Language
          </Label>
          <Select
            value={formData?.primaryLanguage}
            onValueChange={(v) => updateFormData("primaryLanguage", v)}
          >
            <SelectTrigger className="bg-[hsl(var(--color-input-bg))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
              <SelectItem value="english" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">English</SelectItem>
              <SelectItem value="spanish" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">Spanish</SelectItem>
              <SelectItem value="french" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">French</SelectItem>
              <SelectItem value="other" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
          Referred By (Optional)
        </Label>
        <Input
          placeholder="Who referred you to our practice?"
          value={formData?.referredBy}
          onChange={(e) => updateFormData("referredBy", e.target.value)}
          className="bg-[hsl(var(--color-input-bg))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
        />
      </div>
    </div>
  );
}