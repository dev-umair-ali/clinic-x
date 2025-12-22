"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InsuranceDetails({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Insurance Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Insurance Company Name *
          </Label>
          <Input
            value={formData.insuranceCompanyName}
            onChange={(e) => updateFormData("insuranceCompanyName", e.target.value)}
            placeholder="e.g Blue Cross Shield Blue Cross"
            className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Policyholder Name *
          </Label>
          <Input
            value={formData.policyholderName}
            onChange={(e) => updateFormData("policyholderName", e.target.value)}
            placeholder="Name on the insurance policy"
            className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Relationship to Patient
          </Label>
          <Select
            value={formData.relationshipToPatient}
            onValueChange={(v) => updateFormData("relationshipToPatient", v)}
          >
            <SelectTrigger className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
              <SelectItem value="self" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Self</SelectItem>
              <SelectItem value="spouse" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Spouse</SelectItem>
              <SelectItem value="parent" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Parent</SelectItem>
              <SelectItem value="child" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Child</SelectItem>
              <SelectItem value="other" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Member/Subscriber ID *
          </Label>
          <Input
            value={formData.memberSubscriberID}
            onChange={(e) => updateFormData("memberSubscriberID", e.target.value)}
            placeholder="Insurance member ID"
            className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Group Number
          </Label>
          <Input
            value={formData.groupNumber}
            onChange={(e) => updateFormData("groupNumber", e.target.value)}
            placeholder="Group or policy number (if applicable)"
            className="mt-1 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>
    </div>
  );
}