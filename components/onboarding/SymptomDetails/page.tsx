"use client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SymptomDetails({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        Symptom Details
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            What improves it?
          </Label>
          <Textarea
            placeholder="Activities, positions, treatments that help..."
            value={formData.whatImprovesIt}
            onChange={(e) => updateFormData("whatImprovesIt", e.target.value)}
            className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            What worsens it?
          </Label>
          <Textarea
            placeholder="Activities, positions, treatments that make it worse..."
            value={formData.whatWorsensIt}
            onChange={(e) => updateFormData("whatWorsensIt", e.target.value)}
            className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            What activities are affected?
          </Label>
          <Textarea
            placeholder="Daily activities that are difficult due to your condition..."
            value={formData.activitiesAffected}
            onChange={(e) => updateFormData("activitiesAffected", e.target.value)}
            className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Have you seen anyone else for this?
          </Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="seenAnyoneElse"
                value="yes"
                checked={formData.seenAnyoneElse === "yes"}
                onChange={(e) => updateFormData("seenAnyoneElse", e.target.value)}
                className="text-teal-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="seenAnyoneElse"
                value="no"
                checked={formData.seenAnyoneElse === "no"}
                onChange={(e) => updateFormData("seenAnyoneElse", e.target.value)}
                className="text-teal-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
            </label>
          </div>
          {formData.seenAnyoneElse === "yes" && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Please describe who you&apos;ve seen and what treatments you&apos;ve tried:
              </Label>
              <Textarea
                placeholder="Doctors, therapists, treatments, medications..."
                value={formData.treatmentsTried}
                onChange={(e) => updateFormData("treatmentsTried", e.target.value)}
                className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}