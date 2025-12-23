"use client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MainConcern({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Main Concern
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Main reason for visit *
          </Label>
          <Textarea
            placeholder="Please describe what brought you in today."
            value={formData.mainConcern}
            onChange={(e) => updateFormData("mainConcern", e.target.value)}
            className="min-h-[100px] bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            When did symptoms begin? *
          </Label>
          <Input
            type="date"
            value={formData.symptomStartDate}
            onChange={(e) => updateFormData("symptomStartDate", e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Have you had this before?
          </Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="hadBefore"
                value="yes"
                checked={formData.hadThisBefore === "yes"}
                onChange={(e) => updateFormData("hadThisBefore", e.target.value)}
                className="text-[hsl(var(--color-brand-teal))]"
              />
              <span className="text-sm text-[hsl(var(--foreground))]">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="hadBefore"
                value="no"
                checked={formData.hadThisBefore === "no"}
                onChange={(e) => updateFormData("hadThisBefore", e.target.value)}
                className="text-[hsl(var(--color-brand-teal))]"
              />
              <span className="text-sm text-[hsl(var(--foreground))]">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}