
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from 'react';

interface DentalHistoryProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const DentalHistory: React.FC<DentalHistoryProps> = ({ formData, updateFormData }) => {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Dental History
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Last Dental Visit *
          </Label>
          <Input
            placeholder="Enter last dental visit"
            value={formData?.lastDentalVisit}
            onChange={e => updateFormData('lastDentalVisit', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Dental Anxiety Level *
          </Label>
          <Input
            placeholder="Enter dental anxiety level"
            value={formData?.dentalAnxietyLevel}
            onChange={e => updateFormData('dentalAnxietyLevel', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Smoking Status *
          </Label>
          <Input
            placeholder="Enter smoking status"
            value={formData?.smokingStatus}
            onChange={e => updateFormData('smokingStatus', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Vaping *
          </Label>
          <Input
            placeholder="Enter vaping status"
            value={formData?.vaping}
            onChange={e => updateFormData('vaping', e.target.value)}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Current Symptoms *
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.currentSymptoms}
            onChange={e => updateFormData('currentSymptoms', e.target.value.split(','))}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Treatment Received *
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.treatmentReceived}
            onChange={e => updateFormData('treatmentReceived', e.target.value.split(','))}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Device and Equipment *
          </Label>
          <Input
            placeholder="Comma separated"
            value={formData?.deviceAndEquipment}
            onChange={e => updateFormData('deviceAndEquipment', e.target.value.split(','))}
            className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DentalHistory;
