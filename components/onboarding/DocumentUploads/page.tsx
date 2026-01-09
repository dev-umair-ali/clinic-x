"use client";

import { Upload, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState, useEffect } from "react";
import { FileViewerModal } from "@/components/ui/file-viewer-modal";
import { fileToBase64 } from "@/lib/utils/fileUtils";

export default function DocumentUploads({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}) {
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const scansRef = useRef<HTMLInputElement>(null);
  const medicalRecordRef = useRef<HTMLInputElement>(null);
  const otherDocRef = useRef<HTMLInputElement>(null);

  const [fileNames, setFileNames] = useState({
    idFront: '',
    idBack: '',
    scans: '',
    medicalRecord: '',
    otherDoc: ''
  });

  const [filePreviews, setFilePreviews] = useState<Record<string, string | null>>({
    idFront: null,
    idBack: null,
    scans: null,
    medicalRecord: null,
    otherDoc: null
  });

  const [viewingFile, setViewingFile] = useState<{ data: string; name: string } | null>(null);

  // Generate previews when files change
  useEffect(() => {
    const updatePreviews = async () => {
      const previews: Record<string, string | null> = {};
      const names: Record<string, string> = {};

      const fileFields = {
        idFront: formData.idFront,
        idBack: formData.idBack,
        scans: formData.scans,
        medicalRecord: formData.medicalRecord,
        otherDoc: formData.otherDoc
      };

      for (const [key, field] of Object.entries(fileFields)) {
        if (field instanceof File) {
          names[key] = field.name;
          previews[key] = await fileToBase64(field, false);
        } else {
          const base64Key = key + 'Base64';
          if (formData[base64Key]) {
            console.log('Loading ' + key + ' from backend');
            names[key] = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            previews[key] = formData[base64Key];
          } else {
            names[key] = '';
            previews[key] = null;
          }
        }
      }

      setFileNames(prev => ({ ...prev, ...names }));
      setFilePreviews(previews);
    };

    updatePreviews();
  }, [
    formData.idFront,
    formData.idBack,
    formData.scans,
    formData.medicalRecord,
    formData.otherDoc,
    formData.idFrontBase64,
    formData.idBackBase64,
    formData.scansBase64,
    formData.medicalRecordBase64,
    formData.otherDocBase64
  ]);

  const handleFileSelect = (fieldName: string, ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    fileNameKey: keyof typeof fileNames
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileNames(prev => ({ ...prev, [fileNameKey]: file.name }));
      updateFormData(fieldName, file);
      console.log(fieldName + ' selected:', file.name);
    }
  };

  const removeFile = (
    fieldName: string,
    fileNameKey: keyof typeof fileNames,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    setFileNames(prev => ({ ...prev, [fileNameKey]: '' }));
    updateFormData(fieldName, null);
    if (ref.current) ref.current.value = '';
  };

  const FileUploadBox = ({
    label,
    description,
    fileName,
    filePreview,
    onBoxClick,
    onRemove,
    onView,
    inputRef,
    onChange,
  }: any) => (
    <div>
      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
        {label}
      </Label>
      <div
        className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-[hsl(var(--primary))] transition-colors"
        onClick={onBoxClick}
      >
        <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
          {fileName ? 'File selected' : 'Click to upload'}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
          Drag & drop or click to select
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
          onClick={(e) => {
            e.stopPropagation();
            onBoxClick();
          }}
        >
          Choose File
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={onChange}
          className="hidden"
        />
      </div>
      {fileName && (
        <div className="mt-2 flex items-center justify-between p-2 bg-[hsl(var(--muted))] rounded">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-[hsl(var(--foreground))] truncate">
              {fileName}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {filePreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onView}
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
              onClick={onRemove}
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

  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Document Uploads
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadBox
            label="Upload ID (Front)"
            description="Driver's license, passport, or other government-issued ID"
            fileName={fileNames.idFront}
            filePreview={filePreviews.idFront}
            onBoxClick={() => handleFileSelect('idFront', idFrontRef)}
            onRemove={() => removeFile('idFront', 'idFront', idFrontRef)}
            onView={() =>
              filePreviews.idFront &&
              setViewingFile({ data: filePreviews.idFront, name: fileNames.idFront })
            }
            inputRef={idFrontRef}
            onChange={(e: any) => handleFileChange(e, 'idFront', 'idFront')}
          />
          <FileUploadBox
            label="Upload ID (Back)"
            fileName={fileNames.idBack}
            filePreview={filePreviews.idBack}
            onBoxClick={() => handleFileSelect('idBack', idBackRef)}
            onRemove={() => removeFile('idBack', 'idBack', idBackRef)}
            onView={() =>
              filePreviews.idBack &&
              setViewingFile({ data: filePreviews.idBack, name: fileNames.idBack })
            }
            inputRef={idBackRef}
            onChange={(e: any) => handleFileChange(e, 'idBack', 'idBack')}
          />
        </div>
        <FileUploadBox
          label="X-rays or Scans"
          description="Upload any relevant X-rays, MRIs, CT scans, or other imaging"
          fileName={fileNames.scans}
          filePreview={filePreviews.scans}
          onBoxClick={() => handleFileSelect('scans', scansRef)}
          onRemove={() => removeFile('scans', 'scans', scansRef)}
          onView={() =>
            filePreviews.scans &&
            setViewingFile({ data: filePreviews.scans, name: fileNames.scans })
          }
          inputRef={scansRef}
          onChange={(e: any) => handleFileChange(e, 'scans', 'scans')}
        />
        <FileUploadBox
          label="Medical Records"
          description="Previous medical records, lab results, or reports"
          fileName={fileNames.medicalRecord}
          filePreview={filePreviews.medicalRecord}
          onBoxClick={() => handleFileSelect('medicalRecord', medicalRecordRef)}
          onRemove={() => removeFile('medicalRecord', 'medicalRecord', medicalRecordRef)}
          onView={() =>
            filePreviews.medicalRecord &&
            setViewingFile({
              data: filePreviews.medicalRecord,
              name: fileNames.medicalRecord,
            })
          }
          inputRef={medicalRecordRef}
          onChange={(e: any) => handleFileChange(e, 'medicalRecord', 'medicalRecord')}
        />
        <FileUploadBox
          label="Other Documents"
          description="Any other relevant medical documents"
          fileName={fileNames.otherDoc}
          filePreview={filePreviews.otherDoc}
          onBoxClick={() => handleFileSelect('otherDoc', otherDocRef)}
          onRemove={() => removeFile('otherDoc', 'otherDoc', otherDocRef)}
          onView={() =>
            filePreviews.otherDoc &&
            setViewingFile({ data: filePreviews.otherDoc, name: fileNames.otherDoc })
          }
          inputRef={otherDocRef}
          onChange={(e: any) => handleFileChange(e, 'otherDoc', 'otherDoc')}
        />
      </div>
      <FileViewerModal
        isOpen={viewingFile !== null}
        onClose={() => setViewingFile(null)}
        fileData={viewingFile?.data || null}
        fileName={viewingFile?.name || ''}
      />
    </div>
  );
}
