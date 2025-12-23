"use client";
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] dark:bg-[hsl(var(--card))] dark:text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{initialData ? "Edit Billing Entry" : "Add New Billing Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cpt" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">CPT Code</Label>
            <Input id="cpt" value={formData.cpt} onChange={handleChange} required className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Patient</Label>
            <Input id="patient" value={formData.patient} onChange={handleChange} required className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copay" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Co Pay</Label>
            <Input id="copay" value={formData.copay} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Description</Label>
            <Input id="desc" value={formData.desc} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="charge" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Charge</Label>
            <Input id="charge" value={formData.charge} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adjustment" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Adjustment</Label>
            <Input id="adjustment" value={formData.adjustment} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Insurance Paid</Label>
            <Input id="insurance" value={formData.insurance} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paid" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Patient Paid</Label>
            <Input id="paid" value={formData.paid} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibility" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Patient Responsibility</Label>
            <Input id="responsibility" value={formData.responsibility} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Reason</Label>
            <Input id="reason" value={formData.reason} onChange={handleChange} className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange(value, "status")}>
              <SelectTrigger id="status" className="border-[hsl(var(--border))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] dark:bg-[hsl(var(--card))] dark:text-[hsl(var(--foreground))] dark:border-[hsl(var(--border))]">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:col-span-2 mt-4">
            <Button type="submit" className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))] dark:bg-[hsl(var(--color-brand-teal))] dark:hover:bg-[hsl(var(--color-brand-teal-dark))] dark:text-[hsl(var(--primary-foreground))]">
              {initialData ? "Save Changes" : "Add Bill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}