"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Calendar, Plus, Check, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MdOutlineModeEdit } from "react-icons/md"
import { BsFillSendFill } from "react-icons/bs"

interface BillingItem {
  id: string
  patient?: string
  cptCode?: string
  coPay?: string
  description: string
  charge: string
  adjustment: string
  insurancePaid: string
  claimStatus: string
  patientPaid: string
  date: string
  patientResponsibility: string
  reason: string
  paymentStatus: string
  type: "main" | "detail"
}

interface Props {
  data: BillingItem[]
  onAddMore: () => void
  onEditPaid: () => void
}

export function DoctorBillingTable({ data, onAddMore, onEditPaid }: Props) {
  const [page, setPage] = useState(1)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<BillingItem | null>(null)

  const rowsPerPage = 4
  const paginated = data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handleEditClick = (row: BillingItem) => {
    setEditingRowId(row.id)
    setEditedData({ ...row })
  }

  const handleSave = () => {
    // Here you would typically save to your backend/state
    console.log("Saved data:", editedData)
    setEditingRowId(null)
    setEditedData(null)
  }

  const handleCancel = () => {
    setEditingRowId(null)
    setEditedData(null)
  }

  const handleInputChange = (field: keyof BillingItem, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value })
    }
  }

  /* ---------- tiny helpers ---------- */
  const Avatar = ({ name }: { name: string }) => (
    <div className="flex items-center gap-2 lg:gap-3">
      <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
        <img src="/woman-profile.png" alt={name} className="w-full h-full object-cover" />
      </div>
      <span className="font-medium text-slate-900 dark:text-gray-100 text-xs lg:text-sm truncate">{name}</span>
    </div>
  )

  const HeaderRow = (props: { children: React.ReactNode }) => (
    <div
      className={`grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px]
        lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px]
        gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-slate-100 dark:bg-gray-800
        border-b border-border dark:border-gray-700 text-xs font-medium
        text-slate-700 dark:text-gray-300 uppercase tracking-wider`}
    >
      {props.children}
    </div>
  )

  const Row = (props: { children: React.ReactNode; isEditing?: boolean }) => (
    <div
      className={`grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px]
        lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px]
        gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-border dark:border-gray-700
        ${props.isEditing ? "bg-teal-50 dark:bg-teal-900/20" : "bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800"}`}
    >
      {props.children}
    </div>
  )

  const EditableCell = ({
    value,
    field,
    isEditing,
  }: {
    value: string
    field: keyof BillingItem
    isEditing: boolean
  }) => {
    if (isEditing && editedData) {
      return (
        <Input
          value={editedData[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="h-7 text-xs lg:text-sm px-2 bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-600 focus:ring-teal-500"
        />
      )
    }
    return <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">{value}</div>
  }

  const renderActionButtons = (row: BillingItem, showEditDelete: boolean) => {
    const isEditing = editingRowId === row.id

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-green-50 dark:hover:bg-green-900 text-green-600 dark:text-green-400"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )
    }

    if (showEditDelete) {
      return (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditClick(row)}
            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
          >
            <MdOutlineModeEdit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>
      )
    }

    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
      >
        <BsFillSendFill className="w-4 h-4" />
      </Button>
    )
  }

  // Sample data for demonstration
  const sampleRows: BillingItem[] = [
    {
      id: "1",
      patient: "Emma Wilson",
      coPay: "$20",
      description: "FOLIC ACID (SR)",
      charge: "$250.00",
      adjustment: "($118.12)",
      insurancePaid: "($12.27)",
      claimStatus: "Pending",
      patientPaid: "--",
      date: "30/01/2024",
      patientResponsibility: "($12.27)",
      reason: "Deductible/Coinsurance",
      paymentStatus: "Pending",
      type: "main",
    },
    {
      id: "2",
      cptCode: "86800",
      description: "FOLIC ACID (SR)",
      charge: "$150.00",
      adjustment: "($18.12)",
      insurancePaid: "($10.27)",
      claimStatus: "Submitted",
      patientPaid: "--",
      date: "08/02/2024",
      patientResponsibility: "($08.27)",
      reason: "Deductible/Coinsurance",
      paymentStatus: "Submitted",
      type: "detail",
    },
    {
      id: "3",
      cptCode: "86800",
      description: "FOLIC ACID (SR)",
      charge: "$150.00",
      adjustment: "($18.12)",
      insurancePaid: "($10.27)",
      claimStatus: "Approved",
      patientPaid: "--",
      date: "08/02/2024",
      patientResponsibility: "($08.27)",
      reason: "Deductible/Coinsurance",
      paymentStatus: "Approved",
      type: "detail",
    },
    {
      id: "4",
      cptCode: "86800",
      description: "FOLIC ACID (SR)",
      charge: "$150.00",
      adjustment: "($18.12)",
      insurancePaid: "($10.27)",
      claimStatus: "Rejected",
      patientPaid: "--",
      date: "08/02/2024",
      patientResponsibility: "($08.27)",
      reason: "Deductible/Coinsurance",
      paymentStatus: "Rejected",
      type: "detail",
    },
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
      Submitted: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      Approved: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
      Rejected: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    }
    return (
      <Badge
        className={`${styles[status] || styles.Pending} hover:${styles[status] || styles.Pending} text-xs px-2 py-1 font-medium border-0`}
      >
        {status}
      </Badge>
    )
  }

  /* ---------- render ---------- */
  return (
    <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm">
      {/* <div className="flex justify-between items-center p-4 border-b border-border dark:border-gray-700">
        <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">Billing History</h2>
        <Button className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white">Add Billing</Button>
      </div> */}

      <div className="overflow-x-auto border-t border-slate-200 dark:border-gray-700">
        <div className="min-w-[1600px] lg:min-w-[1800px]">
          {/* ==================  MAIN HEADER  ================== */}
          <HeaderRow>
            <div>PATIENT</div>
            <div>CO PAY</div>
            <div>DESCRIPTION</div>
            <div>CHARGE</div>
            <div>ADJUSTMENT</div>
            <div>INSURANCE PAID</div>
            <div>CLAIM STATUS</div>
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              onClick={onEditPaid}
            >
              PATIENT PAID
              <MdOutlineModeEdit className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>DATE</div>
            <div>PATIENT RESPONSIBILITY</div>
            <div>REASON</div>
            <div>PAYMENT STATUS</div>
            <div>ACTION</div>
          </HeaderRow>

          {/* ==================  MAIN ROW (Emma Wilson)  ================== */}
          {(() => {
            const row = sampleRows[0]
            const isEditing = editingRowId === row.id
            return (
              <Row isEditing={isEditing}>
                <Avatar name={row.patient || ""} />
                <EditableCell value={row.coPay || ""} field="coPay" isEditing={isEditing} />
                <EditableCell value={row.description} field="description" isEditing={isEditing} />
                <EditableCell value={row.charge} field="charge" isEditing={isEditing} />
                <EditableCell value={row.adjustment} field="adjustment" isEditing={isEditing} />
                <EditableCell value={row.insurancePaid} field="insurancePaid" isEditing={isEditing} />
                <div>{getStatusBadge(row.claimStatus)}</div>
                <EditableCell value={row.patientPaid} field="patientPaid" isEditing={isEditing} />
                <EditableCell value={row.date} field="date" isEditing={isEditing} />
                <EditableCell value={row.patientResponsibility} field="patientResponsibility" isEditing={isEditing} />
                <div className="text-slate-600 dark:text-gray-400 text-xs">{row.reason}</div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300"
                      >
                        {row.paymentStatus}
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                        Submitted
                      </DropdownMenuItem>
                      <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">Pending</DropdownMenuItem>
                      <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">Paid</DropdownMenuItem>
                      <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">Denied</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {renderActionButtons(row, false)}
              </Row>
            )
          })()}

          {/* ==================  DETAIL HEADER  ================== */}
          <HeaderRow>
            <div>CPT CODE</div>
            <div></div>
            <div>DESCRIPTION</div>
            <div>CHARGE</div>
            <div>ADJUSTMENT</div>
            <div>INSURANCE PAID</div>
            <div>CLAIM STATUS</div>
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              onClick={onEditPaid}
            >
              PATIENT PAID
              <MdOutlineModeEdit className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>DATE</div>
            <div>PATIENT RESPONSIBILITY</div>
            <div>REASON</div>
            <div></div>
            <div>ACTION</div>
          </HeaderRow>

          {/* ==================  DETAIL ROWS  ================== */}
          {sampleRows.slice(1).map((row) => {
            const isEditing = editingRowId === row.id
            const showEditDelete = row.claimStatus === "Submitted" || row.claimStatus === "Rejected"

            return (
              <Row key={row.id} isEditing={isEditing}>
                <EditableCell value={row.cptCode || ""} field="cptCode" isEditing={isEditing} />
                <div></div>
                <EditableCell value={row.description} field="description" isEditing={isEditing} />
                <EditableCell value={row.charge} field="charge" isEditing={isEditing} />
                <EditableCell value={row.adjustment} field="adjustment" isEditing={isEditing} />
                <EditableCell value={row.insurancePaid} field="insurancePaid" isEditing={isEditing} />
                <div>{getStatusBadge(row.claimStatus)}</div>
                <EditableCell value={row.patientPaid} field="patientPaid" isEditing={isEditing} />
                <div className="flex items-center gap-1 lg:gap-2 text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400 dark:text-gray-500" />
                  {isEditing && editedData ? (
                    <Input
                      value={editedData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="h-7 text-xs lg:text-sm px-2 bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-600 focus:ring-teal-500 w-24"
                    />
                  ) : (
                    row.date
                  )}
                </div>
                <EditableCell value={row.patientResponsibility} field="patientResponsibility" isEditing={isEditing} />
                <div className="text-slate-600 dark:text-gray-400 text-xs">{row.reason}</div>
                <div></div>
                {renderActionButtons(row, showEditDelete)}
              </Row>
            )
          })}

          {/* ==================  ADD-MORE ROW  ================== */}
          <div className="px-3 lg:px-4 py-4 border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900 h-8 px-3 text-sm font-medium"
              onClick={onAddMore}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- pagination ---------- */}
      <div className="flex justify-between items-center p-4 text-sm text-muted-foreground dark:text-gray-400">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages || 1 }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "bg-[#1DA68F] hover:bg-[#1DA68F]/80"
                  : "border-border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="border-border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
