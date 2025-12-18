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

export default function ContactInformation({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Email Address *
          </Label>
          <Input
            type="email"
            placeholder="your@example.com"
            value={formData.emailAddress}
            onChange={(e) => updateFormData("emailAddress", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Phone Number *
          </Label>
          <Input
            placeholder="(555) 123-4567"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData("phoneNumber", e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Preferred Contact Method
        </Label>
        <Select
          value={formData.preferredContactMethod}
          onValueChange={(v) => updateFormData("preferredContactMethod", v)}
        >
          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="How would you like us to contact you" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="text">Text Message</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}