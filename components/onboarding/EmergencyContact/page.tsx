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

export default function EmergencyContact({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        Emergency Contact
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Emergency Contact Name
          </Label>
          <Input
            placeholder="Person's Name"
            value={formData.emergencyContactName}
            onChange={(e) => updateFormData("emergencyContactName", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Emergency Contact Phone
          </Label>
          <Input
            placeholder="(555) 123-4567"
            value={formData.emergencyContactPhone}
            onChange={(e) => updateFormData("emergencyContactPhone", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Relationship to Patient
        </Label>
        <Select
          value={formData.relationshipToPatient}
          onValueChange={(v) => updateFormData("relationshipToPatient", v)}
        >
          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectItem value="spouse">Spouse</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="child">Child</SelectItem>
            <SelectItem value="sibling">Sibling</SelectItem>
            <SelectItem value="friend">Friend</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}