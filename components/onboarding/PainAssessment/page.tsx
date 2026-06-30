"use client";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function PainAssessment({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Pain Assessment
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Pain Level (0 = No Pain, 10 = Worst Pain)
          </Label>
          <div className="space-y-2">
            <Slider
              value={[formData?.painLevel || 0]}
              onValueChange={(val) => updateFormData("painLevel", val[0])}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              <span>0</span>
              <span className="font-medium">Current: {formData?.painLevel || 0}</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Pain characteristics (check all that apply):
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Constant",
              "Intermittent",
              "Sharp",
              "Dull",
              "Burning",
              "Throbbing",
              "Aching",
              "Shooting",
            ].map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={c}
                  checked={formData?.painCharacteristics?.includes(c)}
                  onChange={(e) => {
                    const arr = formData?.painCharacteristics || [];
                    updateFormData(
                      "painCharacteristics",
                      e.target.checked ? [...arr, c] : arr.filter((x: string) => x !== c)
                    );
                  }}
                  className="text-[hsl(var(--color-brand-teal))]"
                />
                <span className="text-sm text-[hsl(var(--foreground))]">{c}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}