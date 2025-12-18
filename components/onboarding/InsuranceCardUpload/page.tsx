"use client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InsuranceCardUpload() {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Insurance Card Upload
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Insurance Card (Front)
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload front</p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Insurance Card (Back)
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload back</p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}