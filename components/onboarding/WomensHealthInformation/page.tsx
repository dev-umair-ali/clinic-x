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
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Women&apos;s Health Information
      </h3>
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Are you currently pregnant?
        </Label>
        <RadioGroup
          value={formData.currentlyPregnant}
          onValueChange={(v) => updateFormData("currentlyPregnant", v)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="pregnant-yes" />
            <Label htmlFor="pregnant-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="pregnant-no" />
            <Label htmlFor="pregnant-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id="pregnant-unsure" />
            <Label htmlFor="pregnant-unsure">Unsure</Label>
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
            <Label className="text-sm font-medium text-gray-700">{x.label}</Label>
            <Textarea
              value={formData[x.key as keyof typeof formData]}
              onChange={(e) => updateFormData(x.key, e.target.value)}
              placeholder={x.ph}
              rows={2}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}