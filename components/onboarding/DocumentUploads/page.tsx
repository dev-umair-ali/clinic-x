"use client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DocumentUploads() {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Document Uploads
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
              Upload ID (Front)
            </Label>
            <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Click to upload</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
                Choose File
              </Button>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Driver's license, passport, or other government-issued ID
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
              Upload ID (Back)
            </Label>
            <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Click to upload</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
                Choose File
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Upload X-rays or Scans
          </Label>
          <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Click to upload</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
              Drag & drop or click to select
            </p>
            <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Any recent X-rays, MRIs, CT scans, or other imaging studies
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Upload Medical/Dental Records
          </Label>
          <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Click to upload</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
              Drag & drop or click to select
            </p>
            <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Previous treatment records, lab results, or other relevant medical
            documents
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Other Documents
          </Label>
          <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Click to upload</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
              Drag & drop or click to select
            </p>
            <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Any other relevant documents or forms
          </p>
        </div>
      </div>

      <div className="bg-[hsl(var(--color-chart-blue)/0.1)] border border-[hsl(var(--color-chart-blue))] rounded-lg p-4 mt-6">
        <h4 className="font-medium text-[hsl(var(--color-chart-blue))] mb-2">Upload Guidelines</h4>
        <ul className="text-sm text-[hsl(var(--color-chart-blue))] space-y-1">
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