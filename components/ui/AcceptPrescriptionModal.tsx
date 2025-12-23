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
    <div className="fixed inset-0 bg-[hsl(var(--color-black)/0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(var(--card))] rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">Accept Prescription</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[hsl(var(--color-status-success))]" />
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
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]" onClick={onConfirm}>
            Confirm Accept
          </Button>
        </div>
      </div>
    </div>
  );
}