"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function InsuranceCoverage({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Insurance Coverage
      </h3>
      <div className="mb-6">
        <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-3 block">
          Do you have insurance? *
        </Label>
        <RadioGroup
          value={formData.hasInsurance}
          onValueChange={(v) => updateFormData("hasInsurance", v)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="insurance-yes" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
            <Label htmlFor="insurance-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="insurance-no" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
            <Label htmlFor="insurance-no" className="text-[hsl(var(--foreground))]">No</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasInsurance === "no" && (
        <div className="bg-[hsl(var(--color-chart-blue)/0.1)] border border-[hsl(var(--color-chart-blue))] rounded-lg p-4 mb-6">
          <p className="text-sm text-[hsl(var(--color-chart-blue))]">
            No worries! We offer flexible payment options for patients without
            insurance. Our team will discuss payment plans and self-pay rates
            during your visit.
          </p>
        </div>
      )}
    </div>
  );
}