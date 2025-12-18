"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function PatientAcknowledgment({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Patient Acknowledgment
      </h3>
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="informationComplete"
              checked={formData.informationComplete}
              onCheckedChange={(c) => updateFormData("informationComplete", c)}
              className="mt-1"
            />
            <Label htmlFor="informationComplete" className="text-sm leading-relaxed">
              I confirm that the information I have provided above is complete and
              accurate to the best of my knowledge.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="consentToTreatment"
              checked={formData.consentToTreatment}
              onCheckedChange={(c) => updateFormData("consentToTreatment", c)}
              className="mt-1"
            />
            <Label htmlFor="consentToTreatment" className="text-sm leading-relaxed">
              I consent to chiropractic/dental evaluation and treatment by the
              licensed healthcare provider.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="physicalExamination"
              checked={formData.physicalExamination}
              onCheckedChange={(c) => updateFormData("physicalExamination", c)}
              className="mt-1"
            />
            <Label htmlFor="physicalExamination" className="text-sm leading-relaxed">
              I understand that this evaluation and treatment may involve physical
              touch and examination.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacyPolicies"
              checked={formData.privacyPolicies}
              onCheckedChange={(c) => updateFormData("privacyPolicies", c)}
              className="mt-1"
            />
            <Label htmlFor="privacyPolicies" className="text-sm leading-relaxed">
              I have read and agree to the clinic's Privacy, Financial, and HIPAA
              Policies.
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}