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
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-background border border-border rounded-lg text-gray-900 dark:text-foreground">
        {/* Header */}
        <DialogHeader className="p-4 pb-0 border-b border-border dark:border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600 dark:text-muted-foreground" />
            <DialogTitle className="text-base font-semibold text-gray-900 dark:text-foreground">
              Prescription Details
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-muted text-gray-500 dark:text-muted-foreground"
          >
          </button>
        </DialogHeader>

        <div className="p-4 space-y-6">
          {/* Voice Recording */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-foreground">Voice Recording from Doctor</h4>
            <div className="flex gap-2">
              <Button className="bg-[#1DA68F] hover:bg-[#178C75] text-white flex-[0.7] justify-start dark:bg-[#178C75] dark:hover:bg-[#147A64]">
                <Play className="h-4 w-4 mr-1" /> Play
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 flex-[0.3] dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
            <div className="mt-3 border border-gray-200 dark:border-border rounded-md p-3 bg-gray-50 dark:bg-gray-900/20">
              <h5 className="text-sm font-medium mb-1 flex items-center gap-1 text-gray-900 dark:text-foreground">
                <FileText className="h-4 w-4 text-gray-500 dark:text-muted-foreground" />
                Transcription
              </h5>
              <p className="text-sm text-gray-700 dark:text-muted-foreground">{prescription.transcription}</p>
            </div>
          </div>

          {/* Prescription Info */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">State</p>
              <p className="font-medium text-gray-900 dark:text-foreground">State of New Jersey</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Date Prescribed</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.datePrescribed}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Prescribed by</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.producedBy}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Prescriber Address</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.patientAddress}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Telephone</p>
              <p className="font-medium text-gray-900 dark:text-foreground">(732) 442-2211</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Fax</p>
              <p className="font-medium text-gray-900 dark:text-foreground">(732) 326-0517</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">NPI Number</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.npiNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">License #</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.licenseNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 dark:text-muted-foreground">DEA #</p>
              <p className="font-medium text-gray-900 dark:text-foreground">BS9168091</p>
            </div>
          </div>

          {/* Patient Details */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-foreground">Patient Details</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500 dark:text-muted-foreground">Patient Name</p>
                <p className="font-medium text-gray-900 dark:text-foreground">{prescription.patientName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-muted-foreground">Patient Address</p>
                <p className="font-medium text-gray-900 dark:text-foreground">{prescription.patientAddress}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-muted-foreground">Patient Illness Detail</p>
                <p className="font-medium text-gray-900 dark:text-foreground">{prescription.patientIllnessDetail}</p>
              </div>
            </div>
          </div>

          {/* Medication Details */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Substitution Permissible</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.substitutionPermissible}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Do Not Substitute</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.doNotSubstitute}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Do Not Refill</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.doNotRefill}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Refill Times</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.refillTimes}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Medication</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.medication}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-muted-foreground">Dosage</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.dosage}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 dark:text-muted-foreground">Instructions</p>
              <p className="font-medium text-gray-900 dark:text-foreground">{prescription.instructions}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border dark:border-border flex gap-2">
          <Button className="bg-[#1DA68F] hover:bg-[#178C75] text-white flex-1 dark:bg-[#178C75] dark:hover:bg-[#147A64]">
            Download
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 dark:border-border flex-1 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted bg-transparent"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
