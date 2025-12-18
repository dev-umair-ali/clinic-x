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
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Insurance Coverage
      </h3>
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Do you have insurance? *
        </Label>
        <RadioGroup
          value={formData.hasInsurance}
          onValueChange={(v) => updateFormData("hasInsurance", v)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="insurance-yes" />
            <Label htmlFor="insurance-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="insurance-no" />
            <Label htmlFor="insurance-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasInsurance === "no" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            No worries! We offer flexible payment options for patients without
            insurance. Our team will discuss payment plans and self-pay rates
            during your visit.
          </p>
        </div>
      )}
    </div>
  );
}