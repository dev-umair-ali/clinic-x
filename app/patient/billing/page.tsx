"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, DollarSign, Clock, Shield, Check } from "lucide-react"
import { MdOutlineModeEditOutline } from "react-icons/md"
import { useState } from "react"

export default function PatientBilling() {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editableData, setEditableData] = useState<any>({})

  const mockBillingData = [
    {
      cptCode: "86800",
      doctor: "Emma Wilson",
      coPay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/ Coinsurance",
      status: "Pending",
    },
    {
      cptCode: "86800",
      doctor: "Emma Wilson",
      coPay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/ Coinsurance",
      status: "Pending",
    },
    {
      cptCode: "86800",
      doctor: "Emma Wilson",
      coPay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/ Coinsurance",
      status: "Pending",
    },
    {
      cptCode: "86800",
      doctor: "Emma Wilson",
      coPay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/ Coinsurance",
      status: "Pending",
    },
  ]

  const handleEditClick = (index: number, rowData: any) => {
    setEditingRowIndex(index)
    setEditableData(rowData)
  }

  const handleCheckClick = () => {
    setEditingRowIndex(null)
    setEditableData({})
  }

  const handleInputChange = (field: string, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="max-w-7xl mx-auto p-5 space-y-6">
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-6">
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-1">
            Manage your payments and billing history
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage your payments and billing history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] p-6 rounded-xl w-full sm:w-80 h-48 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm opacity-90">Current Balance</span>
              <span className="text-lg font-bold">VISA</span>
            </div>
            <div className="text-3xl font-bold">$4,570.80</div>
            <div className="text-lg tracking-wider mb-4">5294 2436 4780 2468</div>
            <div className="flex justify-between text-xs">
              <div>
                <div className="opacity-75">NAME</div>
                <div className="font-medium">Itai Bracha</div>
              </div>
              <div>
                <div className="opacity-75">VALID THRU</div>
                <div className="font-medium">12/24</div>
              </div>
              <div>
                <div className="opacity-75">CVV</div>
                <div className="font-medium">344</div>
              </div>
            </div>
          </div>
          <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-xl w-full sm:w-80 h-48 flex flex-col items-center justify-center hover:border-[hsl(var(--muted-foreground))] cursor-pointer">
            <div className="w-12 h-12 rounded-full border-2 border-[hsl(var(--border))] flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
            </div>
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Add new Card</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Card className="bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))]">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-chart-blue)/0.1)] flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[hsl(var(--color-chart-blue))]" />
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Outstanding Balance</p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">$295.00</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))]">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-status-warning)/0.1)] flex items-center justify-center">
                <Clock className="h-5 w-5 text-[hsl(var(--color-status-warning))]" />
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">$95.50</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))]">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-chart-blue)/0.1)] flex items-center justify-center">
                <Shield className="h-5 w-5 text-[hsl(var(--color-chart-blue))]" />
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Insurance Coverage</p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">BlueCross</p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--muted)/0.5)]">
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      CPT CODE
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      DOCTOR
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      CO PAY
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      DESCRIPTION
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      CHARGE
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      ADJUSTMENT
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      INSURANCE PAID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      PATIENT PAID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      DATE
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      PATIENT RESPONSIBILITY
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      REASON
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      STATUS
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      ACTION
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBillingData.map((bill, index) => (
                    <TableRow key={index} className="border-b border-[hsl(var(--border))]">
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.cptCode || bill.cptCode}
                            onChange={(e) => handleInputChange("cptCode", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.cptCode
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.doctor || bill.doctor}
                            onChange={(e) => handleInputChange("doctor", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.doctor
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.coPay || bill.coPay}
                            onChange={(e) => handleInputChange("coPay", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.coPay
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.description || bill.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.description
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.charge || bill.charge}
                            onChange={(e) => handleInputChange("charge", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.charge
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.adjustment || bill.adjustment}
                            onChange={(e) => handleInputChange("adjustment", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.adjustment
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.insurancePaid || bill.insurancePaid}
                            onChange={(e) => handleInputChange("insurancePaid", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.insurancePaid
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.patientPaid || bill.patientPaid}
                            onChange={(e) => handleInputChange("patientPaid", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.patientPaid
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.date || bill.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.date
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.patientResponsibility || bill.patientResponsibility}
                            onChange={(e) => handleInputChange("patientResponsibility", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.patientResponsibility
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--foreground))]">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.reason || bill.reason}
                            onChange={(e) => handleInputChange("reason", e.target.value)}
                            className="h-8 text-sm bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                          />
                        ) : (
                          bill.reason
                        )}
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={bill.status}>
                          <SelectTrigger className="w-24 h-8 text-xs bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (editingRowIndex === index) {
                              handleCheckClick()
                            } else {
                              handleEditClick(index, bill)
                            }
                          }}
                        >
                          {editingRowIndex === index ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <MdOutlineModeEditOutline className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-start mt-6">
              <Button variant="outline" size="sm" className="text-[hsl(var(--muted-foreground))] bg-transparent border-[hsl(var(--border))]">
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal-dark))]">
                  1
                </Button>
                <Button variant="outline" size="sm" className="text-[hsl(var(--foreground))] bg-transparent border-[hsl(var(--border))]">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="text-[hsl(var(--muted-foreground))]">
                  Next
                </Button>
                <span className="text-sm text-[hsl(var(--muted-foreground))] ml-4">10 /Pages</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}