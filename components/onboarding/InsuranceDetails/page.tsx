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
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Insurance Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Insurance Company Name *
          </Label>
          <Input
            value={formData.insuranceCompanyName}
            onChange={(e) => updateFormData("insuranceCompanyName", e.target.value)}
            placeholder="e.g Blue Cross Shield Blue Cross"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Policyholder Name *
          </Label>
          <Input
            value={formData.policyholderName}
            onChange={(e) => updateFormData("policyholderName", e.target.value)}
            placeholder="Name on the insurance policy"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Relationship to Patient
          </Label>
          <Select
            value={formData.relationshipToPatient}
            onValueChange={(v) => updateFormData("relationshipToPatient", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self</SelectItem>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="child">Child</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Member/Subscriber ID *
          </Label>
          <Input
            value={formData.memberSubscriberID}
            onChange={(e) => updateFormData("memberSubscriberID", e.target.value)}
            placeholder="Insurance member ID"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Group Number
          </Label>
          <Input
            value={formData.groupNumber}
            onChange={(e) => updateFormData("groupNumber", e.target.value)}
            placeholder="Group or policy number (if applicable)"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}