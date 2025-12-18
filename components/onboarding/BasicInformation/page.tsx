"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BasicInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Full Name *
          </Label>
          <Input
            placeholder="Enter your full Legal Name"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Preferred Name
          </Label>
          <Input
            placeholder="What would you like to be called"
            value={formData.preferredName}
            onChange={(e) => updateFormData("preferredName", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}