"use client"

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
    <div className="">
      <div className="max-w-7xl mx-auto p-5 space-y-6">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Manage your payments and billing history
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your payments and billing history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-emerald-500 text-white p-6 rounded-xl w-full sm:w-80 h-48 flex flex-col justify-between">
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
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-full sm:w-80 h-48 flex flex-col items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">Add new Card</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Outstanding Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$295.00</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$95.50</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Insurance Coverage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">BlueCross</p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CPT CODE
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DOCTOR
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CO PAY
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DESCRIPTION
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CHARGE
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ADJUSTMENT
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      INSURANCE PAID
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PATIENT PAID
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DATE
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PATIENT RESPONSIBILITY
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      REASON
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      STATUS
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ACTION
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBillingData.map((bill, index) => (
                    <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.cptCode || bill.cptCode}
                            onChange={(e) => handleInputChange("cptCode", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.cptCode
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.doctor || bill.doctor}
                            onChange={(e) => handleInputChange("doctor", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.doctor
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.coPay || bill.coPay}
                            onChange={(e) => handleInputChange("coPay", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.coPay
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.description || bill.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.description
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.charge || bill.charge}
                            onChange={(e) => handleInputChange("charge", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.charge
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.adjustment || bill.adjustment}
                            onChange={(e) => handleInputChange("adjustment", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.adjustment
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.insurancePaid || bill.insurancePaid}
                            onChange={(e) => handleInputChange("insurancePaid", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.insurancePaid
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.patientPaid || bill.patientPaid}
                            onChange={(e) => handleInputChange("patientPaid", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.patientPaid
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.date || bill.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.date
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.patientResponsibility || bill.patientResponsibility}
                            onChange={(e) => handleInputChange("patientResponsibility", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.patientResponsibility
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
                        {editingRowIndex === index ? (
                          <Input
                            value={editableData.reason || bill.reason}
                            onChange={(e) => handleInputChange("reason", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          bill.reason
                        )}
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={bill.status}>
                          <SelectTrigger className="w-24 h-8 text-xs">
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
              <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 bg-transparent">
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 bg-transparent">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  Next
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">10 /Pages</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
