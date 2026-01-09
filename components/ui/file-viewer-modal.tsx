"use client";

import { X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileData: string | null;
  fileName: string;
}

export function FileViewerModal({
  isOpen,
  onClose,
  fileData,
  fileName,
}: FileViewerModalProps) {
  if (!fileData) return null;

  const isPDF = fileData.startsWith('data:application/pdf');
  const isImage = fileData.startsWith('data:image/');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{fileName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isImage && (
            <img
              src={fileData}
              alt={fileName}
              className="w-full h-auto rounded-lg"
            />
          )}
          
          {isPDF && (
            <iframe
              src={fileData}
              className="w-full h-[70vh] rounded-lg border"
              title={fileName}
            />
          )}
          
          {!isImage && !isPDF && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Preview not available for this file type</p>
              <a
                href={fileData}
                download={fileName}
                className="text-primary hover:underline mt-2 inline-block"
              >
                Download file
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
