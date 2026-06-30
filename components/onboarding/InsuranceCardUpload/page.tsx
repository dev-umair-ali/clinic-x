"use client";
import { Upload, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState, useEffect } from "react";
import { FileViewerModal } from "@/components/ui/file-viewer-modal";
import { fileToBase64 } from "@/lib/utils/fileUtils";

export default function InsuranceCardUpload({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}) {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [frontFileName, setFrontFileName] = useState<string>('');
  const [backFileName, setBackFileName] = useState<string>('');
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<{ data: string; name: string } | null>(null);

  // Generate previews when files change
  useEffect(() => {
    if (formData.insuranceCardFront instanceof File) {
      setFrontFileName(formData.insuranceCardFront.name);
      fileToBase64(formData.insuranceCardFront, false).then(setFrontPreview);
    } else if (formData.insuranceCardFrontBase64) {
      // Load base64 data from backend
      setFrontFileName('Insurance Card Front');
      setFrontPreview(formData.insuranceCardFrontBase64);
    } else {
      setFrontFileName('');
      setFrontPreview(null);
    }
  }, [formData.insuranceCardFront, formData.insuranceCardFrontBase64]);

  useEffect(() => {
    if (formData.insuranceCardBack instanceof File) {
      setBackFileName(formData.insuranceCardBack.name);
      fileToBase64(formData.insuranceCardBack, false).then(setBackPreview);
    } else if (formData.insuranceCardBackBase64) {
      // Load base64 data from backend
      setBackFileName('Insurance Card Back');
      setBackPreview(formData.insuranceCardBackBase64);
    } else {
      setBackFileName('');
      setBackPreview(null);
    }
  }, [formData.insuranceCardBack, formData.insuranceCardBackBase64]);

  const handleFrontClick = () => {
    frontInputRef.current?.click();
  };

  const handleBackClick = () => {
    backInputRef.current?.click();
  };

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontFileName(file.name);
      updateFormData('insuranceCardFront', file);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackFileName(file.name);
      updateFormData('insuranceCardBack', file);
    }
  };

  const removeFront = () => {
    setFrontFileName('');
    updateFormData('insuranceCardFront', null);
    if (frontInputRef.current) {
      frontInputRef.current.value = '';
    }
  };

  const removeBack = () => {
    setBackFileName('');
    updateFormData('insuranceCardBack', null);
    if (backInputRef.current) {
      backInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Insurance Card Upload
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Insurance Card (Front)
          </Label>
          <div 
            className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-[hsl(var(--primary))] transition-colors"
            onClick={handleFrontClick}
          >
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
              {frontFileName ? 'File selected' : 'Click to upload front'}
            </p>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
              onClick={(e) => {
                e.stopPropagation();
                handleFrontClick();
              }}
            >
              Choose File
            </Button>
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFrontChange}
              className="hidden"
            />
          </div>
          {frontFileName && (
            <div className="mt-2 flex items-center justify-between p-2 bg-[hsl(var(--muted))] rounded">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[hsl(var(--foreground))] truncate">{frontFileName}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {frontPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingFile({ data: frontPreview, name: frontFileName })}
                    className="h-6 w-6 p-0"
                    title="View file"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFront}
                  className="h-6 w-6 p-0"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Insurance Card (Back)
          </Label>
          <div 
            className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-[hsl(var(--primary))] transition-colors"
            onClick={handleBackClick}
          >
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
              {backFileName ? 'File selected' : 'Click to upload back'}
            </p>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
              onClick={(e) => {
                e.stopPropagation();
                handleBackClick();
              }}
            >
              Choose File
            </Button>
            <input
              ref={backInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleBackChange}
              className="hidden"
            />
          </div>
          {backFileName && (
            <div className="mt-2 flex items-center justify-between p-2 bg-[hsl(var(--muted))] rounded">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[hsl(var(--foreground))] truncate">{backFileName}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {backPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingFile({ data: backPreview, name: backFileName })}
                    className="h-6 w-6 p-0"
                    title="View file"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeBack}
                  className="h-6 w-6 p-0"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
        Accepted formats: JPG, PNG, PDF (Max 10MB per file)
      </p>

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={viewingFile !== null}
        onClose={() => setViewingFile(null)}
        fileData={viewingFile?.data || null}
        fileName={viewingFile?.name || ''}
      />
    </div>
  );
}