"use client";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  medication: string;
  dosage: string;
}

export function AcceptPrescriptionModal({ open, onClose, onConfirm, medication, dosage }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
          <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">Accept Prescription</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Medication</p>
              <p className="font-medium text-foreground dark:text-gray-100">{medication}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Dosage</p>
              <p className="font-medium text-foreground dark:text-gray-100">{dosage}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#1FA888] hover:bg-teal-600 text-white" onClick={onConfirm}>
            Confirm Accept
          </Button>
        </div>
      </div>
    </div>
  );
}