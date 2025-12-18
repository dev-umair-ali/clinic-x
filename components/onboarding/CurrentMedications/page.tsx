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
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Current Medications
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        List all medications you are currently taking:
      </p>
      <Textarea
        value={formData.currentMedications}
        onChange={(e) => updateFormData("currentMedications", e.target.value)}
        placeholder="Include prescription medications, over-the-counter drugs, vitamins, and supplements..."
        rows={3}
        className="mb-6"
      />
      <Label className="text-sm font-medium text-gray-700 mb-3 block">
        Do you take blood thinners?
      </Label>
      <RadioGroup
        value={formData.bloodThinners}
        onValueChange={(v) => updateFormData("bloodThinners", v)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="blood-thinners-yes" />
          <Label htmlFor="blood-thinners-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="blood-thinners-no" />
          <Label htmlFor="blood-thinners-no">No</Label>
        </div>
      </RadioGroup>
    </div>
  );
}