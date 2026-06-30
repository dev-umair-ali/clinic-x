"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function ExercisePhysicalActivity({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Exercise & Physical Activity
      </h3>
      <div className="mb-4">
        <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-3 block">
          Do you exercise regularly?
        </Label>
        <RadioGroup
          value={formData.exerciseRegularly}
          onValueChange={(v) => updateFormData("exerciseRegularly", v)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="exercise-yes" />
            <Label htmlFor="exercise-yes" className="text-[hsl(var(--foreground))]">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="exercise-no" />
            <Label htmlFor="exercise-no" className="text-[hsl(var(--foreground))]">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-6">
        <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-3 block">
          What type of work do you do?
        </Label>
        <RadioGroup
          value={formData.workType}
          onValueChange={(v) => updateFormData("workType", v)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mostly-sitting" id="mostly-sitting" />
            <Label htmlFor="mostly-sitting" className="text-[hsl(var(--foreground))]">Mostly sitting (desk job)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mostly-standing" id="mostly-standing" />
            <Label htmlFor="mostly-standing" className="text-[hsl(var(--foreground))]">Mostly standing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical-labor" id="physical-labor" />
            <Label htmlFor="physical-labor" className="text-[hsl(var(--foreground))]">Physical labor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed-activities" id="mixed-activities" />
            <Label htmlFor="mixed-activities" className="text-[hsl(var(--foreground))]">Mixed activities</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-4">
        <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-3 block">
          Sleep Quality:
        </Label>
        <RadioGroup
          value={formData.sleepQuality}
          onValueChange={(v) => updateFormData("sleepQuality", v)}
          className="flex items-center gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="sleep-poor" />
            <Label htmlFor="sleep-poor" className="text-[hsl(var(--foreground))]">Poor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="sleep-fair" />
            <Label htmlFor="sleep-fair" className="text-[hsl(var(--foreground))]">Fair</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="sleep-good" />
            <Label htmlFor="sleep-good" className="text-[hsl(var(--foreground))]">Good</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
          Do you use pillows or sleep supports?
        </Label>
        <Textarea
          value={formData.sleepSupport}
          onChange={(e) => updateFormData("sleepSupport", e.target.value)}
          placeholder="Describe any pillows, wedges, or supports you use while sleeping..."
          rows={2}
          className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </div>
    </div>
  );
}