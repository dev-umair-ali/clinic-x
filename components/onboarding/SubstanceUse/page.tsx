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
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Substance Use
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Tobacco Use:
          </Label>
          <RadioGroup
            value={formData.tobaccoUse}
            onValueChange={(v) => updateFormData("tobaccoUse", v)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="tobacco-yes" />
              <Label htmlFor="tobacco-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="tobacco-no" />
              <Label htmlFor="tobacco-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Alcohol Use:
          </Label>
          <RadioGroup
            value={formData.alcoholUse}
            onValueChange={(v) => updateFormData("alcoholUse", v)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="alcohol-yes" />
              <Label htmlFor="alcohol-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="alcohol-no" />
              <Label htmlFor="alcohol-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Recreational Drug Use:
          </Label>
          <RadioGroup
            value={formData.recreationalDrugUse}
            onValueChange={(v) => updateFormData("recreationalDrugUse", v)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="drugs-yes" />
              <Label htmlFor="drugs-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="drugs-no" />
              <Label htmlFor="drugs-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}