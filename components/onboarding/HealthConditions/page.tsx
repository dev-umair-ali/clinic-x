"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const conditions = [
  "Headaches",
  "Back Pain",
  "Neck Pain",
  "Sports Injuries",
  "Arthritis",
  "Cancer",
  "High Blood Pressure",
  "Osteoporosis",
  "Scoliosis",
  "Numbness/Tingling",
  "Diabetes",
];

export default function HealthConditions({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Health Conditions
      </h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
        Check all conditions that apply to you:
      </p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {conditions.map((c) => (
          <div key={c} className="flex items-center space-x-2">
            <Checkbox
              id={c.toLowerCase().replace(/[^a-z0-9]/g, "-")}
              checked={formData.healthConditions.includes(c)}
              onCheckedChange={(checked) => {
                const arr = formData.healthConditions;
                updateFormData(
                  "healthConditions",
                  checked ? [...arr, c] : arr.filter((x: string) => x !== c)
                );
              }}
            />
            <Label
              htmlFor={c.toLowerCase().replace(/[^a-z0-9]/g, "-")}
              className="text-sm text-[hsl(var(--foreground))]"
            >
              {c}
            </Label>
          </div>
        ))}
      </div>
      <div>
        <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
          Other conditions not listed:
        </Label>
        <Textarea
          value={formData.otherConditions}
          onChange={(e) => updateFormData("otherConditions", e.target.value)}
          placeholder="Please specify any other health conditions..."
          rows={2}
          className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </div>
    </div>
  );
}