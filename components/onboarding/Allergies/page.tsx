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
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">Allergies</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
        Allergies (medications, foods, environmental):
      </p>
      <Textarea
        value={formData?.allergies}
        onChange={(e) => updateFormData("allergies", e.target.value)}
        placeholder="List any known allergies and reactions..."
        rows={3}
        className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
      />
    </div>
  );
}