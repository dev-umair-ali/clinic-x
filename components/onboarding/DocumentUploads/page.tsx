"use client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DocumentUploads() {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Document Uploads
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload ID (Front)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload</p>
              <p className="text-xs text-gray-500 mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Driver's license, passport, or other government-issued ID
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload ID (Back)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload</p>
              <p className="text-xs text-gray-500 mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Upload X-rays or Scans
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500 mb-2">
              Drag & drop or click to select
            </p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Any recent X-rays, MRIs, CT scans, or other imaging studies
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Upload Medical/Dental Records
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500 mb-2">
              Drag & drop or click to select
            </p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Previous treatment records, lab results, or other relevant medical
            documents
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Other Documents
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500 mb-2">
              Drag & drop or click to select
            </p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Any other relevant documents or forms
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Accepted file types: Images (JPG, PNG), PDFs, Word documents
          </li>
          <li>• Maximum file size: 10MB per file</li>
          <li>• All uploads are securely encrypted and HIPAA compliant</li>
          <li>
            • You can upload documents now or bring them to your appointment
          </li>
        </ul>
      </div>
    </div>
  );
}