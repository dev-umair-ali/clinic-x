"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SubstanceUse({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Substance Use
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-3 block">
            Tobacco Use:
          </Label>
          <RadioGroup
            value={formData.tobaccoUse}
            onValueChange={(v) => updateFormData("tobaccoUse", v)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="tobacco-yes" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
              <Label htmlFor="tobacco-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="tobacco-no" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
              <Label htmlFor="tobacco-no" className="text-[hsl(var(--foreground))]">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-3 block">
            Alcohol Use:
          </Label>
          <RadioGroup
            value={formData.alcoholUse}
            onValueChange={(v) => updateFormData("alcoholUse", v)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="alcohol-yes" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
              <Label htmlFor="alcohol-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="alcohol-no" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
              <Label htmlFor="alcohol-no" className="text-[hsl(var(--foreground))]">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-3 block">
            Recreational Drug Use:
          </Label>
          <RadioGroup
            value={formData.drugUse}
            onValueChange={(v) => updateFormData("drugUse", v)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="drugs-yes" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
              <Label htmlFor="drugs-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="drugs-no" className="border-[hsl(var(--border))] data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]" />
              <Label htmlFor="drugs-no" className="text-[hsl(var(--foreground))]">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}