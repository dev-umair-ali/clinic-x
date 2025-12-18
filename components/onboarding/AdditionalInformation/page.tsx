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

export default function AdditionalInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        Additional Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Occupation
          </Label>
          <Input
            placeholder="Your Job Title or Profession"
            value={formData.occupation}
            onChange={(e) => updateFormData("occupation", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Primary Language
          </Label>
          <Select
            value={formData.primaryLanguage}
            onValueChange={(v) => updateFormData("primaryLanguage", v)}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Referred By (Optional)
        </Label>
        <Input
          placeholder="Who referred you to our practice?"
          value={formData.referredBy}
          onChange={(e) => updateFormData("referredBy", e.target.value)}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}