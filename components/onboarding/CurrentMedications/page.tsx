"use client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CurrentMedications({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Current Medications
      </h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
        List all medications you are currently taking:
      </p>
      <Textarea
        value={formData?.currentMedication}
        onChange={(e) => updateFormData("currentMedication", e.target.value)}
        placeholder="Include prescription medications, over-the-counter drugs, vitamins, and supplements..."
        rows={3}
        className="mb-6 bg-[hsl(var(--color-input-bg))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
      />
      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-3 block">
        Do you take blood thinners?
      </Label>
      <RadioGroup
        value={formData?.bloodThinner}
        onValueChange={(v) => updateFormData("bloodThinner", v)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="blood-thinners-yes" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
          <Label htmlFor="blood-thinners-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="blood-thinners-no" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
          <Label htmlFor="blood-thinners-no" className="text-[hsl(var(--foreground))]">No</Label>
        </div>
      </RadioGroup>
    </div>
  );
}