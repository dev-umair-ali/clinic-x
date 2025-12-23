"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Download, FileText, X } from "lucide-react"

interface PrescriptionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: {
    id: string
    date: string
    doctor: string
    medication: string
    dosage: string
    status: string
    refillStatus: string
    patientName: string
    patientIllnessDetail: string
    patientAddress: string
    datePrescribed: string
    producedBy: string
    npiNumber: string
    taxNumber: string
    licenseNumber: string
    substitutionPermissible: string
    doNotSubstitute: string
    doNotRefill: string
    refillTimes: string
    instructions: string
    transcription: string
  } | null
}

export function PrescriptionDetailsModal({ isOpen, onClose, prescription }: PrescriptionDetailsModalProps) {
  if (!prescription) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-0 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]">
        {/* Header */}
        <DialogHeader className="p-4 pb-0 border-b border-[hsl(var(--border))] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <DialogTitle className="text-base font-semibold text-[hsl(var(--foreground))]">
              Prescription Details
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          >
          </button>
        </DialogHeader>

        <div className="p-4 space-y-6">
          {/* Voice Recording */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-[hsl(var(--foreground))]">Voice Recording from Doctor</h4>
            <div className="flex gap-2">
              <Button className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white flex-[0.7] justify-start">
                <Play className="h-4 w-4 mr-1" /> Play
              </Button>
              <Button
                variant="outline"
                className="border-[hsl(var(--border))] flex-[0.3] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
            <div className="mt-3 border border-[hsl(var(--border))] rounded-md p-3 bg-[hsl(var(--muted))]">
              <h5 className="text-sm font-medium mb-1 flex items-center gap-1 text-[hsl(var(--foreground))]">
                <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                Transcription
              </h5>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{prescription.transcription}</p>
            </div>
          </div>

          {/* Prescription Info */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">State</p>
              <p className="font-medium text-[hsl(var(--foreground))]">State of New Jersey</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Date Prescribed</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.datePrescribed}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Prescribed by</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.producedBy}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Prescriber Address</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.patientAddress}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Telephone</p>
              <p className="font-medium text-[hsl(var(--foreground))]">(732) 442-2211</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Fax</p>
              <p className="font-medium text-[hsl(var(--foreground))]">(732) 326-0517</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">NPI Number</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.npiNumber}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">License #</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.licenseNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[hsl(var(--muted-foreground))]">DEA #</p>
              <p className="font-medium text-[hsl(var(--foreground))]">BS9168091</p>
            </div>
          </div>

          {/* Patient Details */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-[hsl(var(--foreground))]">Patient Details</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Patient Name</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{prescription.patientName}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Patient Address</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{prescription.patientAddress}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[hsl(var(--muted-foreground))]">Patient Illness Detail</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{prescription.patientIllnessDetail}</p>
              </div>
            </div>
          </div>

          {/* Medication Details */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Substitution Permissible</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.substitutionPermissible}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Do Not Substitute</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.doNotSubstitute}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Do Not Refill</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.doNotRefill}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Refill Times</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.refillTimes}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Medication</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.medication}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--muted-foreground))]">Dosage</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.dosage}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[hsl(var(--muted-foreground))]">Instructions</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{prescription.instructions}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-[hsl(var(--border))] flex gap-2">
          <Button className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white flex-1">
            Download
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[hsl(var(--border))] flex-1 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] bg-transparent"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}