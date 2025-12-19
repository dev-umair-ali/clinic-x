"use client";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; // ← NEW
import { useState, type ChangeEvent } from "react";
import { FaCheck } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  medication: string;
  dosage: string;
}

export function RejectPrescriptionModal({ open, onClose, onConfirm, medication, dosage }: Props) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
          <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">Reject Prescription</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-red-600" />
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

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-gray-300 mb-2">Reason for rejection</label>
            <Textarea
              placeholder="Enter reason..."
              value={reason}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-md bg-background dark:bg-gray-900 text-foreground dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirm}>
            Confirm Reject
          </Button>
        </div>
      </div>
    </div>
  );
}