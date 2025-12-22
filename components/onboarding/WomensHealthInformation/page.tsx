"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function WomensHealthInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Women&apos;s Health Information
      </h3>
      <div className="mb-6">
        <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-3 block">
          Are you currently pregnant?
        </Label>
        <RadioGroup
          value={formData.currentlyPregnant}
          onValueChange={(v) => updateFormData("currentlyPregnant", v)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="pregnant-yes" />
            <Label htmlFor="pregnant-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="pregnant-no" />
            <Label htmlFor="pregnant-no" className="text-[hsl(var(--foreground))]">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id="pregnant-unsure" />
            <Label htmlFor="pregnant-unsure" className="text-[hsl(var(--foreground))]">Unsure</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        {[
          { key: "menstrualCycleInfo", label: "Menstrual Cycle Information", ph: "Regular/Irregular, cycle length, last period, etc." },
          { key: "pmsSymptoms", label: "PMS Symptoms", ph: "Describe any PMS-related symptoms you experience" },
          { key: "hormonalSymptoms", label: "Hormonal Symptoms", ph: "Hot flashes, mood changes, sleep disturbances, etc." },
          { key: "posturalSymptoms", label: "Postural Symptoms", ph: "Back pain, posture changes, joint pain, etc." },
          { key: "birthControl", label: "Birth Control", ph: "Type of birth control used, if any" },
          { key: "pregnancyHistory", label: "Pregnancy History", ph: "Number of pregnancies, births, complications, etc." },
        ].map((x) => (
          <div key={x.key}>
            <Label className="text-sm font-medium text-[hsl(var(--foreground))]">{x.label}</Label>
            <Textarea
              value={formData[x.key as keyof typeof formData]}
              onChange={(e) => updateFormData(x.key, e.target.value)}
              placeholder={x.ph}
              rows={2}
              className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}