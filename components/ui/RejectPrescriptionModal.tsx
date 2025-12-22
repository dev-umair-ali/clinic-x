"use client";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; // ← NEW
import { useState, type ChangeEvent } from "react";

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
    <div className="fixed inset-0 bg-[hsl(var(--color-black)/0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(var(--card))] rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">Reject Prescription</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[hsl(var(--color-status-error))]" />
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Medication</p>
              <p className="font-medium text-[hsl(var(--card-foreground))]">{medication}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[hsl(var(--color-status-info))]" />
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Dosage</p>
              <p className="font-medium text-[hsl(var(--card-foreground))]">{dosage}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Reason for rejection</label>
            <Textarea
              placeholder="Enter reason..."
              value={reason}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-dark))] text-[hsl(var(--destructive-foreground))]" onClick={handleConfirm}>
            Confirm Reject
          </Button>
        </div>
      </div>
    </div>
  );
}