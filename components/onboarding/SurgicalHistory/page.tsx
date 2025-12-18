"use client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SurgicalHistory({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Surgical History
      </h3>
      <p className="text-sm text-gray-600 mb-3">Past surgeries and dates:</p>
      <Textarea
        value={formData.surgicalHistory}
        onChange={(e) => updateFormData("surgicalHistory", e.target.value)}
        placeholder="List any surgeries you've had and approximate dates..."
        rows={3}
        className="mb-6"
      />
    </div>
  );
}