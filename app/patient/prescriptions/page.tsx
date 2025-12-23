"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCcw, Clock, Search, Download, Volume2 } from "lucide-react"
import { PrescriptionDetailsModal } from "./prescription-details-modal"
import { BiCapsule } from "react-icons/bi"
import { TfiReload } from "react-icons/tfi"

export default function PrescriptionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  const mockPrescriptions = [
    {
      id: "RX001",
      date: "2024-12-01",
      doctor: "Dr. Sarah Johnson",
      medication: "Lisinopril 10mg",
      dosage: "Take 1 tablet daily with water",
      status: "Active",
      refillStatus: "Active",
      patientName: "John Smith",
      patientIllnessDetail: "Hypertension management",
      patientAddress: "123 Main St, Newark, NJ 07102",
      datePrescribed: "2024-12-01",
      producedBy: "Dr. Sarah Johnson, MD",
      npiNumber: "1234567890",
      taxNumber: "12-3456789",
      licenseNumber: "NJ12345",
      substitutionPermissible: "Yes",
      doNotSubstitute: "No",
      doNotRefill: "No",
      refillTimes: "5 refills remaining",
      instructions: "Take one tablet by mouth daily with or without food. Monitor blood pressure regularly.",
      transcription:
        "Patient presents with elevated blood pressure readings. Prescribing Lisinopril 10mg once daily for hypertension management. Patient counseled on medication compliance and lifestyle modifications.",
    },
    {
      id: "RX002",
      date: "2024-12-01",
      doctor: "Dr. Sarah Johnson",
      medication: "Lisinopril 10mg",
      dosage: "Take 1 tablet daily with water",
      status: "Refill Due",
      refillStatus: "Refill Due",
      patientName: "John Smith",
      patientIllnessDetail: "Hypertension management",
      patientAddress: "123 Main St, Newark, NJ 07102",
      datePrescribed: "2024-11-01",
      producedBy: "Dr. Sarah Johnson, MD",
      npiNumber: "1234567890",
      taxNumber: "12-3456789",
      licenseNumber: "NJ12345",
      substitutionPermissible: "Yes",
      doNotSubstitute: "No",
      doNotRefill: "No",
      refillTimes: "1 refill remaining",
      instructions: "Take one tablet by mouth daily with or without food. Monitor blood pressure regularly.",
      transcription:
        "Follow-up visit for hypertension. Patient reports good compliance with medication. Blood pressure well controlled. Continue current regimen.",
    },
    {
      id: "RX003",
      date: "2024-12-01",
      doctor: "Dr. Sarah Johnson",
      medication: "Lisinopril 10mg",
      dosage: "Take 1 tablet daily with water",
      status: "Active",
      refillStatus: "Expired",
      patientName: "John Smith",
      patientIllnessDetail: "Hypertension management",
      patientAddress: "123 Main St, Newark, NJ 07102",
      datePrescribed: "2024-10-01",
      producedBy: "Dr. Sarah Johnson, MD",
      npiNumber: "1234567890",
      taxNumber: "12-3456789",
      licenseNumber: "NJ12345",
      substitutionPermissible: "Yes",
      doNotSubstitute: "No",
      doNotRefill: "Yes",
      refillTimes: "No refills remaining",
      instructions: "Take one tablet by mouth daily with or without food. Monitor blood pressure regularly.",
      transcription:
        "Initial prescription for newly diagnosed hypertension. Patient educated on medication importance and side effects to monitor.",
    },
    {
      id: "RX004",
      date: "2024-12-01",
      doctor: "Dr. Sarah Johnson",
      medication: "Lisinopril 10mg",
      dosage: "Take 1 tablet daily with water",
      status: "Active",
      refillStatus: "Active",
      patientName: "John Smith",
      patientIllnessDetail: "Hypertension management",
      patientAddress: "123 Main St, Newark, NJ 07102",
      datePrescribed: "2024-12-01",
      producedBy: "Dr. Sarah Johnson, MD",
      npiNumber: "1234567890",
      taxNumber: "12-3456789",
      licenseNumber: "NJ12345",
      substitutionPermissible: "Yes",
      doNotSubstitute: "No",
      doNotRefill: "No",
      refillTimes: "3 refills remaining",
      instructions: "Take one tablet by mouth daily with or without food. Monitor blood pressure regularly.",
      transcription:
        "Routine follow-up for hypertension management. Patient doing well on current medication. Continue treatment plan.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[hsl(var(--color-status-success-light))] text-[hsl(var(--color-status-success))] dark:bg-[hsl(var(--color-status-success-light))] dark:text-[hsl(var(--color-status-success))]"
      case "Refill Due":
        return "bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))] dark:bg-[hsl(var(--color-status-error)/0.1)] dark:text-[hsl(var(--color-status-error))]"
      case "Expired":
        return "bg-[hsl(var(--color-chart-orange)/0.1)] text-[hsl(var(--color-chart-orange))] dark:bg-[hsl(var(--color-chart-orange)/0.1)] dark:text-[hsl(var(--color-chart-orange))]"
      default:
        return "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] dark:bg-[hsl(var(--muted))] dark:text-[hsl(var(--muted-foreground))]"
    }
  }

  const handleActionClick = (prescription: any, actionType: string) => {
    if (actionType === "view") {
      setSelectedPrescription(prescription)
      setIsModalOpen(true)
    } else if (actionType === "download") {
      // Handle download functionality
      console.log("Download prescription:", prescription.id)
    } else if (actionType === "reload") {
      console.log("Reload prescription:", prescription.id)
    }
  }

  const activePrescriptionsCount = mockPrescriptions.filter((p) => p.refillStatus === "Active").length
  const refillsDueCount = mockPrescriptions.filter((p) => p.refillStatus === "Refill Due").length
  const expiredCount = mockPrescriptions.filter((p) => p.refillStatus === "Expired").length

  return (
    <div className="min-h-screen bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Prescriptions</h1>
          <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
            View and manage your prescription medications
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="flex flex-col  space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                Active Prescriptions
              </CardTitle>
              <div className="h-10 w-10 bg-[hsl(var(--color-status-success-light))] flex items-center justify-center rounded-full">
                <BiCapsule className="h-6 w-6 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]">{activePrescriptionsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="flex flex-col  space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Refills Due</CardTitle>
              <div className="h-10 w-10 bg-[hsl(var(--color-status-error)/0.1)] flex items-center justify-center rounded-full">
                <RefreshCcw className="h-6 w-5 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]">{refillsDueCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="flex flex-col  space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Expired</CardTitle>
              <div className="h-10 w-10 bg-[hsl(var(--color-chart-orange)/0.1)] flex items-center justify-center rounded-full">
                <Clock className="h-5 w-5 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">{expiredCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
            <Input
              placeholder="Search Logs.."
              className="pl-9 pr-4 py-2 bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] dark:placeholder:text-[hsl(var(--muted-foreground))]"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[140px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
              <SelectItem value="7days" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Last 7 Days
              </SelectItem>
              <SelectItem value="30days" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Last 30 Days
              </SelectItem>
              <SelectItem value="90days" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Last 90 Days
              </SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[130px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
              <SelectItem value="all" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                All Actions
              </SelectItem>
              <SelectItem value="download" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Download
              </SelectItem>
              <SelectItem value="listen" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Listen
              </SelectItem>
              <SelectItem value="refill" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Refill
              </SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[120px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
              <SelectItem value="all" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                All Users
              </SelectItem>
              <SelectItem value="patient" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Patient
              </SelectItem>
              <SelectItem value="doctor" className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Doctor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* All Prescriptions Table */}
        <div className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-sm overflow-x-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">All Prescriptions</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                  <TableHead className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                    MEDICATION
                  </TableHead>
                  <TableHead className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                    DOCTOR
                  </TableHead>
                  <TableHead className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                    DATE ISSUED
                  </TableHead>
                  <TableHead className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                    DOSAGE
                  </TableHead>
                  <TableHead className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                    STATUS
                  </TableHead>
                  <TableHead className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider text-right">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPrescriptions.map((rx, index) => (
                  <TableRow
                    key={rx.id}
                    className="border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))]"
                  >
                    <TableCell className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] py-4">{rx.medication}</TableCell>
                    <TableCell className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] py-4">{rx.doctor}</TableCell>
                    <TableCell className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] py-4">{rx.date}</TableCell>
                    <TableCell className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] py-4">{rx.dosage}</TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          rx.status,
                        )}`}
                      >
                        {rx.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActionClick(rx, "download")}
                          className="h-8 w-8 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActionClick(rx, "view")}
                          className="h-8 w-8 bg-[hsl(var(--color-brand-teal))] text-white hover:bg-[hsl(var(--color-brand-teal-dark))] hover:text-white"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActionClick(rx, "reload")}
                          className="h-8 w-8 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                        >
                          <TfiReload className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Button
                  size="sm"
                  className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-3 py-1"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]"
                >
                  Next
                </Button>
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] ml-2">10 /Pages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prescription={selectedPrescription}
      />
    </div>
  )
}