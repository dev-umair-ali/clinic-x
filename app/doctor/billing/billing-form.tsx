"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BillingItem {
  id?: number;
  cpt: string;
  patient: string;
  copay: string;
  desc: string;
  charge: string;
  adjustment: string;
  insurance: string;
  paid: string;
  date: string;
  responsibility: string;
  reason: string;
  status: string;
}

interface BillingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: BillingItem) => void;
  initialData?: BillingItem | null;
}

export function BillingForm({ isOpen, onClose, onSave, initialData }: BillingFormProps) {
  const [formData, setFormData] = useState<BillingItem>({
    cpt: "",
    patient: "",
    copay: "",
    desc: "",
    charge: "",
    adjustment: "",
    insurance: "",
    paid: "",
    date: "",
    responsibility: "",
    reason: "",
    status: "Pending",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        cpt: "",
        patient: "",
        copay: "",
        desc: "",
        charge: "",
        adjustment: "",
        insurance: "",
        paid: "",
        date: "",
        responsibility: "",
        reason: "",
        status: "Pending",
      })
    }
  }, [initialData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, field: keyof BillingItem) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Billing Entry" : "Add New Billing Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cpt">CPT Code</Label>
            <Input id="cpt" value={formData.cpt} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Input id="patient" value={formData.patient} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copay">Co Pay</Label>
            <Input id="copay" value={formData.copay} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={formData.desc} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="charge">Charge</Label>
            <Input id="charge" value={formData.charge} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adjustment">Adjustment</Label>
            <Input id="adjustment" value={formData.adjustment} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance">Insurance Paid</Label>
            <Input id="insurance" value={formData.insurance} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paid">Patient Paid</Label>
            <Input id="paid" value={formData.paid} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibility">Patient Responsibility</Label>
            <Input id="responsibility" value={formData.responsibility} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input id="reason" value={formData.reason} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange(value, "status")}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:col-span-2 mt-4">
            <Button type="submit">{initialData ? "Save Changes" : "Add Bill"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
