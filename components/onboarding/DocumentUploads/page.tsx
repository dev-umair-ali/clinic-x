"use client";

import { Upload, Check, X, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileViewerModal } from "@/components/ui/file-viewer-modal";
import { Toaster } from "@/components/ui/toaster";

export default function DocumentUploads({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}) {
  const { toast } = useToast();
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [viewingFile, setViewingFile] = useState<{ url: string; name: string } | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2.5MB)
    if (file.size > 2.5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2.5 MB",
        variant: "destructive",
      });
      return;
    }

    // Set loading state for this specific field
    setUploadingFields(prev => ({ ...prev, [fieldName]: true }));

    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = localStorage.getItem("clinic-ai-token");
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const result = await res.json();
      const fileUrl = result.fileUrl || result.profilePicture || result.data?.fileUrl;

      if (fileUrl) {
        updateFormData(fieldName, fileUrl);
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully!`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${file.name}`,
        variant: "destructive",
      });
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleRemoveFile = (fieldName: string) => {
    console.log("Remove file clicked for:", fieldName);
    console.log("Current file URL:", formData[fieldName]);
    // Just logging - no actual removal
  };

  const FileUploadBox = ({
    label,
    description,
    fieldName,
    fileUrl,
    isUploading,
    onChange,
  }: {
    label: string;
    description?: string;
    fieldName: string;
    fileUrl: string | null;
    isUploading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    const getFileName = (url: string | null) => {
      if (!url) return '';
      try {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1] || 'Uploaded file';
      } catch {
        return 'Uploaded file';
      }
    };

    return (
      <div>
        <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
          {label}
        </Label>
        <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-[hsl(var(--primary))] transition-colors"
          onClick={() => !isUploading && document.getElementById(fieldName)?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-[hsl(var(--primary))] mx-auto mb-2 animate-spin" />
              <p className="text-sm text-[hsl(var(--primary))] mb-1">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                {fileUrl ? 'File uploaded' : 'Click to upload'}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                Click to select a file
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById(fieldName)?.click();
                }}
              >
                Choose File
              </Button>
            </>
          )}
          <input
            id={fieldName}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={onChange}
            className="hidden"
          />
        </div>
        {fileUrl && !isUploading && (
          <div className="mt-2 flex items-center justify-between p-2 bg-[hsl(var(--muted))] rounded">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-[hsl(var(--foreground))] truncate">
                {getFileName(fileUrl)}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViewingFile({ url: fileUrl, name: getFileName(fileUrl) })}
                className="h-6 w-6 p-0"
                title="View file"
              >
                <Eye className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(fieldName)}
                className="h-6 w-6 p-0"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {description && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            {description}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <Toaster />
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Document Uploads
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadBox
            label="Upload ID (Front)"
            description="Driver's license, passport, or other government-issued ID"
            fieldName="idFront"
            fileUrl={formData.idFront}
            isUploading={uploadingFields.idFront || false}
            onChange={(e) => handleFileChange(e, 'idFront')}
          />
          <FileUploadBox
            label="Upload ID (Back)"
            fieldName="idBack"
            fileUrl={formData.idBack}
            isUploading={uploadingFields.idBack || false}
            onChange={(e) => handleFileChange(e, 'idBack')}
          />
        </div>
        <FileUploadBox
          label="X-rays or Scans"
          description="Upload any relevant X-rays, MRIs, CT scans, or other imaging"
          fieldName="xrayOrScans"
          fileUrl={formData.xrayOrScans}
          isUploading={uploadingFields.xrayOrScans || false}
          onChange={(e) => handleFileChange(e, 'xrayOrScans')}
        />
        <FileUploadBox
          label="Medical Records"
          description="Previous medical records, lab results, or reports"
          fieldName="medicalReport"
          fileUrl={formData.medicalReport}
          isUploading={uploadingFields.medicalReport || false}
          onChange={(e) => handleFileChange(e, 'medicalReport')}
        />
        <FileUploadBox
          label="Other Documents"
          description="Any other relevant medical documents"
          fieldName="otherDocs"
          fileUrl={formData.otherDocs}
          isUploading={uploadingFields.otherDocs || false}
          onChange={(e) => handleFileChange(e, 'otherDocs')}
        />
      </div>
      <FileViewerModal
        isOpen={viewingFile !== null}
        onClose={() => setViewingFile(null)}
        fileData={viewingFile?.url || null}
        fileName={viewingFile?.name || ''}
      />
    </div>
  );
}