"use client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Allergies({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">Allergies</h3>
      <p className="text-sm text-gray-600 mb-3">
        Allergies (medications, foods, environmental):
      </p>
      <Textarea
        value={formData.allergies}
        onChange={(e) => updateFormData("allergies", e.target.value)}
        placeholder="List any known allergies and reactions..."
        rows={3}
      />
    </div>
  );
}