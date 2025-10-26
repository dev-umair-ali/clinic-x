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
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "Refill Due":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "Expired":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Prescriptions</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            View and manage your prescription medications
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-col  space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Prescriptions
              </CardTitle>
              <div className="h-10 w-10 bg-[#17a24875] flex items-center justify-center rounded-full">
                <BiCapsule className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#17A248] dark:text-white">{activePrescriptionsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-col  space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Refills Due</CardTitle>
              <div className="h-10 w-10 bg-[#dd28254b] flex items-center justify-center rounded-full">
                <RefreshCcw className="h-6 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#DD2725] dark:text-white">{refillsDueCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-col  space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</CardTitle>
              <div className="h-10 w-10 bg-[#ca8b0345] flex items-center justify-center rounded-full">
                <Clock className="h-5 w-5 text-[#CA8A03] dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#CA8A03] dark:text-white">{expiredCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white" />
            <Input
              placeholder="Search Logs.."
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <SelectItem value="7days" className="text-gray-900 dark:text-white">
                Last 7 Days
              </SelectItem>
              <SelectItem value="30days" className="text-gray-900 dark:text-white">
                Last 30 Days
              </SelectItem>
              <SelectItem value="90days" className="text-gray-900 dark:text-white">
                Last 90 Days
              </SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[130px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <SelectItem value="all" className="text-gray-900 dark:text-white">
                All Actions
              </SelectItem>
              <SelectItem value="download" className="text-gray-900 dark:text-white">
                Download
              </SelectItem>
              <SelectItem value="listen" className="text-gray-900 dark:text-white">
                Listen
              </SelectItem>
              <SelectItem value="refill" className="text-gray-900 dark:text-white">
                Refill
              </SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <SelectItem value="all" className="text-gray-900 dark:text-white">
                All Users
              </SelectItem>
              <SelectItem value="patient" className="text-gray-900 dark:text-white">
                Patient
              </SelectItem>
              <SelectItem value="doctor" className="text-gray-900 dark:text-white">
                Doctor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* All Prescriptions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Prescriptions</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="text-sm font-medium text-black dark:text-gray-400 uppercase tracking-wider">
                    MEDICATION
                  </TableHead>
                  <TableHead className="text-sm font-medium text-black dark:text-gray-400 uppercase tracking-wider">
                    DOCTOR
                  </TableHead>
                  <TableHead className="text-sm font-medium text-black dark:text-gray-400 uppercase tracking-wider">
                    DATE ISSUED
                  </TableHead>
                  <TableHead className="text-sm font-medium text-black dark:text-gray-400 uppercase tracking-wider">
                    DOSAGE
                  </TableHead>
                  <TableHead className="text-sm font-medium text-black dark:text-gray-400 uppercase tracking-wider">
                    STATUS
                  </TableHead>
                  <TableHead className="text-sm font-medium text-black dark:text-gray-400 uppercase tracking-wider text-right">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPrescriptions.map((rx, index) => (
                  <TableRow
                    key={rx.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white py-4">{rx.medication}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white py-4">{rx.doctor}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white py-4">{rx.date}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white py-4">{rx.dosage}</TableCell>
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
                          className="h-8 w-8 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActionClick(rx, "view")}
                          className="h-8 w-8 text-white bg-[#1DA68F] dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActionClick(rx, "reload")}
                          className="h-8 w-8 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-3 py-1"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </Button>
                <span className="text-white dark:text-gray-400 ml-2">10 /Pages</span>
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
