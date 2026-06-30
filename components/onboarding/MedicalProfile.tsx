import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from 'react';

interface MedicalProfileProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const MedicalProfile: React.FC<MedicalProfileProps> = ({ formData, updateFormData }) => {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Medical Profile
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Critical Allergies *
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.criticalAllergies}
            onChange={e => updateFormData('criticalAllergies', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Primary Care Information
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.primaryCareInformation}
            onChange={e => updateFormData('primaryCareInformation', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Medical Conditions *
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.medicalConditions}
            onChange={e => updateFormData('medicalConditions', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Current Medications *
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.medicalProfileCurrentMedications}
            onChange={e => updateFormData('medicalProfileCurrentMedications', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Surgical History
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.surgicalHistoryProfile}
            onChange={e => updateFormData('surgicalHistoryProfile', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Additional Notes
          </Label>
          <Textarea
            placeholder="Any additional notes"
            value={formData?.additionalNotes}
            onChange={e => updateFormData('additionalNotes', e.target.value)}
            className="min-h-[100px] bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalProfile;
