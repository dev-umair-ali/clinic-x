"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { generateAdjustmentsReportPDF, type PDFAdjustmentsReportData } from "@/lib/utils/pdf-generator";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertTriangle,
  TrendingDown,
  Building2,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Adjustment {
  id: string;
  adjustmentId: string;
  invoiceNumber: string;
  patientName: string;
  patientId: string;
  adjustmentDate: string;
  adjustmentType: string;
  adjustmentReason: string;
  originalAmount: number;
  adjustmentAmount: number;
  finalAmount: number;
  status: string;
  createdBy: string;
  notes?: string;
  insuranceProvider?: string;
}

interface PendingInvoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientId: string;
  dateOfService: string;
  originalAmount: number;
  insuranceProvider: string;
  status: string;
}

export default function AdjustmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  // Create Adjustment Form State
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [adjustmentType, setAdjustmentType] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentNotes, setAdjustmentNotes] = useState("");

  const adjustments: Adjustment[] = [
    {
      id: "1",
      adjustmentId: "ADJ-2024-001",
      invoiceNumber: "INV-2024-001",
      patientName: "Emma Wilson",
      patientId: "PT-10234",
      adjustmentDate: "2024-01-20",
      adjustmentType: "Contractual Adjustment",
      adjustmentReason: "Insurance network discount",
      originalAmount: 285.0,
      adjustmentAmount: -45.0,
      finalAmount: 240.0,
      status: "approved",
      createdBy: "Dr. Sarah Johnson",
      insuranceProvider: "Blue Cross Blue Shield",
    },
    {
      id: "2",
      adjustmentId: "ADJ-2024-002",
      invoiceNumber: "INV-2024-003",
      patientName: "Sarah Johnson",
      patientId: "PT-10236",
      adjustmentDate: "2024-01-19",
      adjustmentType: "Write-off",
      adjustmentReason: "Financial hardship",
      originalAmount: 350.0,
      adjustmentAmount: -50.0,
      finalAmount: 300.0,
      status: "approved",
      createdBy: "Dr. Sarah Johnson",
      notes: "Patient financial assistance program approved",
    },
    {
      id: "3",
      adjustmentId: "ADJ-2024-003",
      invoiceNumber: "INV-2024-005",
      patientName: "Lisa Anderson",
      patientId: "PT-10238",
      adjustmentDate: "2024-01-18",
      adjustmentType: "Contractual Adjustment",
      adjustmentReason: "Medicare allowed amount",
      originalAmount: 425.0,
      adjustmentAmount: -170.0,
      finalAmount: 255.0,
      status: "approved",
      createdBy: "Billing Department",
      insuranceProvider: "Medicare",
    },
    {
      id: "4",
      adjustmentId: "ADJ-2024-004",
      invoiceNumber: "INV-2024-007",
      patientName: "Jennifer Martinez",
      patientId: "PT-10240",
      adjustmentDate: "2024-01-17",
      adjustmentType: "Courtesy Adjustment",
      adjustmentReason: "Family member discount",
      originalAmount: 325.0,
      adjustmentAmount: -25.0,
      finalAmount: 300.0,
      status: "pending",
      createdBy: "Dr. Sarah Johnson",
      notes: "Staff family member - 10% discount policy",
    },
    {
      id: "5",
      adjustmentId: "ADJ-2024-005",
      invoiceNumber: "INV-2024-002",
      patientName: "Michael Chen",
      patientId: "PT-10235",
      adjustmentDate: "2024-01-16",
      adjustmentType: "Billing Error Correction",
      adjustmentReason: "Duplicate charge removed",
      originalAmount: 405.0,
      adjustmentAmount: -65.0,
      finalAmount: 340.0,
      status: "approved",
      createdBy: "Billing Department",
      insuranceProvider: "Aetna",
    },
    {
      id: "6",
      adjustmentId: "ADJ-2024-006",
      invoiceNumber: "INV-2024-009",
      patientName: "Karen White",
      patientId: "PT-10242",
      adjustmentDate: "2024-01-15",
      adjustmentType: "Bad Debt Write-off",
      adjustmentReason: "Unable to collect after 120 days",
      originalAmount: 280.0,
      adjustmentAmount: -280.0,
      finalAmount: 0,
      status: "approved",
      createdBy: "Collections Manager",
      notes: "Multiple collection attempts failed",
    },
  ];

  const pendingInvoices: PendingInvoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-010",
      patientName: "Robert Taylor",
      patientId: "PT-10243",
      dateOfService: "2024-01-18",
      originalAmount: 295.0,
      insuranceProvider: "Cigna",
      status: "unpaid",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-011",
      patientName: "David Lee",
      patientId: "PT-10241",
      dateOfService: "2024-01-17",
      originalAmount: 450.0,
      insuranceProvider: "United Healthcare",
      status: "partial",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-012",
      patientName: "Maria Garcia",
      patientId: "PT-10244",
      dateOfService: "2024-01-16",
      originalAmount: 185.0,
      insuranceProvider: "Aetna",
      status: "unpaid",
    },
  ];

  // Calculate statistics
  const totalAdjustments = adjustments.length;
  const totalAdjustmentAmount = Math.abs(
    adjustments.reduce((sum, adj) => sum + adj.adjustmentAmount, 0)
  );
  const pendingAdjustments = adjustments.filter(a => a.status === "pending").length;
  const averageAdjustment = totalAdjustments > 0 ? totalAdjustmentAmount / totalAdjustments : 0;

  const adjustmentsByType = {
    contractual: adjustments.filter(a => a.adjustmentType === "Contractual Adjustment").length,
    writeOff: adjustments.filter(a => a.adjustmentType === "Write-off" || a.adjustmentType === "Bad Debt Write-off").length,
    courtesy: adjustments.filter(a => a.adjustmentType === "Courtesy Adjustment").length,
    error: adjustments.filter(a => a.adjustmentType === "Billing Error Correction").length,
  };

  const handleDownloadPDF = () => {
    // Calculate by type
    const byType: Record<string, { count: number; amount: number }> = {};

    adjustments.forEach(adj => {
      if (!byType[adj.adjustmentType]) {
        byType[adj.adjustmentType] = { count: 0, amount: 0 };
      }
      byType[adj.adjustmentType].count++;
      byType[adj.adjustmentType].amount += Math.abs(adj.adjustmentAmount);
    });

    const pdfData: PDFAdjustmentsReportData = {
      reportDate: new Date().toISOString().split('T')[0],
      dateRange: `Last ${dateRange} days`,
      adjustments,
      totalAdjustments,
      totalAdjustmentAmount: -totalAdjustmentAmount,
      byType,
    };

    generateAdjustmentsReportPDF(pdfData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getAdjustmentTypeColor = (type: string) => {
    switch (type) {
      case "Contractual Adjustment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Write-off":
      case "Bad Debt Write-off":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Courtesy Adjustment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Billing Error Correction":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleInvoiceToggle = (invoiceNumber: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceNumber)
        ? prev.filter((id) => id !== invoiceNumber)
        : [...prev, invoiceNumber]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === pendingInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(pendingInvoices.map((inv) => inv.invoiceNumber));
    }
  };

  const handleSubmitAdjustment = () => {
    console.log("Submitting adjustment:", {
      selectedInvoices,
      adjustmentType,
      adjustmentReason,
      adjustmentAmount,
      adjustmentNotes,
    });
    // Reset form
    setSelectedInvoices([]);
    setAdjustmentType("");
    setAdjustmentReason("");
    setAdjustmentAmount("");
    setAdjustmentNotes("");
    // Show success message and redirect
    alert("Adjustment created successfully!");
    setActiveTab("history");
  };

  const totalSelectedAmount = pendingInvoices
    .filter((inv) => selectedInvoices.includes(inv.invoiceNumber))
    .reduce((sum, inv) => sum + inv.originalAmount, 0);

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/doctor/patients-billing")}
                className="w-fit"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Billing
              </Button>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Billing Adjustments
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage write-offs, contractual adjustments, and corrections
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="adjustments-content">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Adjustments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalAdjustmentAmount.toFixed(2)}
                  </p>
                  <TrendingDown className="w-8 h-8 text-red-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {totalAdjustments} adjustments processed
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Adjustment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${averageAdjustment.toFixed(2)}
                  </p>
                  <DollarSign className="w-8 h-8 text-blue-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Per transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pendingAdjustments}
                  </p>
                  <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Contractual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {adjustmentsByType.contractual}
                  </p>
                  <Building2 className="w-8 h-8 text-purple-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Insurance network discounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="history">Adjustment History</TabsTrigger>
              <TabsTrigger value="create">Create Adjustment</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Adjustment History Tab */}
            <TabsContent value="history" className="mt-6 space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by adjustment ID, patient..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <SelectValue placeholder="Adjustment Type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="contractual">Contractual Adjustment</SelectItem>
                        <SelectItem value="writeoff">Write-off</SelectItem>
                        <SelectItem value="courtesy">Courtesy Adjustment</SelectItem>
                        <SelectItem value="error">Billing Error Correction</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <SelectValue placeholder="Date Range" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Adjustments Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Adjustment Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Adjustment ID</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Original</TableHead>
                          <TableHead className="text-right">Adjustment</TableHead>
                          <TableHead className="text-right">Final</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adjustments.map((adjustment) => (
                          <TableRow
                            key={adjustment.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell>
                              <p className="font-mono text-sm font-semibold">
                                {adjustment.adjustmentId}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                By {adjustment.createdBy}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto font-mono text-blue-600 dark:text-blue-400"
                                onClick={() =>
                                  router.push(
                                    `/doctor/patients-billing/${adjustment.invoiceNumber}`
                                  )
                                }
                              >
                                {adjustment.invoiceNumber}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{adjustment.patientName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {adjustment.patientId}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getAdjustmentTypeColor(adjustment.adjustmentType)}>
                                {adjustment.adjustmentType}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <p className="text-sm truncate">{adjustment.adjustmentReason}</p>
                              {adjustment.notes && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                  {adjustment.notes}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                  {new Date(adjustment.adjustmentDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric", year: "numeric" }
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold">
                                ${adjustment.originalAmount.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold text-red-600 dark:text-red-400">
                                ${adjustment.adjustmentAmount.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                ${adjustment.finalAmount.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(adjustment.status)}>
                                {adjustment.status.charAt(0).toUpperCase() +
                                  adjustment.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Adjustment Tab */}
            <TabsContent value="create" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Select Invoices */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Select Invoices</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                        >
                          {selectedInvoices.length === pendingInvoices.length
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pendingInvoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <Checkbox
                              checked={selectedInvoices.includes(invoice.invoiceNumber)}
                              onCheckedChange={() =>
                                handleInvoiceToggle(invoice.invoiceNumber)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold">
                                    {invoice.invoiceNumber} - {invoice.patientName}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {invoice.patientId} • {invoice.insuranceProvider}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    ${invoice.originalAmount.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(invoice.dateOfService).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Adjustment Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Adjustment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="adjustmentType">Adjustment Type *</Label>
                        <Select
                          value={adjustmentType}
                          onValueChange={setAdjustmentType}
                        >
                          <SelectTrigger id="adjustmentType" className="mt-1">
                            <SelectValue placeholder="Select adjustment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contractual">
                              Contractual Adjustment
                            </SelectItem>
                            <SelectItem value="writeoff">Write-off</SelectItem>
                            <SelectItem value="bad_debt">Bad Debt Write-off</SelectItem>
                            <SelectItem value="courtesy">Courtesy Adjustment</SelectItem>
                            <SelectItem value="error">
                              Billing Error Correction
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="adjustmentReason">Adjustment Reason *</Label>
                        <Select
                          value={adjustmentReason}
                          onValueChange={setAdjustmentReason}
                        >
                          <SelectTrigger id="adjustmentReason" className="mt-1">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="insurance_discount">
                              Insurance network discount
                            </SelectItem>
                            <SelectItem value="allowed_amount">
                              Insurance allowed amount
                            </SelectItem>
                            <SelectItem value="financial_hardship">
                              Financial hardship
                            </SelectItem>
                            <SelectItem value="family_discount">
                              Family member discount
                            </SelectItem>
                            <SelectItem value="duplicate_charge">
                              Duplicate charge
                            </SelectItem>
                            <SelectItem value="coding_error">Coding error</SelectItem>
                            <SelectItem value="unable_to_collect">
                              Unable to collect
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="adjustmentAmount">Adjustment Amount *</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="adjustmentAmount"
                            type="number"
                            placeholder="0.00"
                            value={adjustmentAmount}
                            onChange={(e) => setAdjustmentAmount(e.target.value)}
                            className="pl-10"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enter the amount to adjust (will be subtracted from balance)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="adjustmentNotes">Notes (Optional)</Label>
                        <Textarea
                          id="adjustmentNotes"
                          placeholder="Add any additional notes or explanation..."
                          value={adjustmentNotes}
                          onChange={(e) => setAdjustmentNotes(e.target.value)}
                          className="mt-1 min-h-[100px]"
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleSubmitAdjustment}
                          disabled={
                            selectedInvoices.length === 0 ||
                            !adjustmentType ||
                            !adjustmentReason ||
                            !adjustmentAmount
                          }
                          className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                        >
                          <Save className="w-4 h-4" />
                          Create Adjustment
                        </Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-blue-500 sticky top-6">
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Selected Invoices
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedInvoices.length}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Original Amount
                        </p>
                        <p className="text-xl font-bold">
                          ${totalSelectedAmount.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Adjustment Amount
                        </p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                          -${parseFloat(adjustmentAmount || "0").toFixed(2)}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          New Total Balance
                        </p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          $
                          {(
                            totalSelectedAmount - parseFloat(adjustmentAmount || "0")
                          ).toFixed(2)}
                        </p>
                      </div>

                      {selectedInvoices.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium mb-2">Selected:</p>
                            <div className="space-y-1">
                              {selectedInvoices.map((invNumber) => {
                                const invoice = pendingInvoices.find(
                                  (inv) => inv.invoiceNumber === invNumber
                                );
                                return (
                                  <div
                                    key={invNumber}
                                    className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                  >
                                    <p className="font-mono font-semibold">{invNumber}</p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                      ${invoice?.originalAmount.toFixed(2)}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="text-sm">Adjustment Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2 text-gray-700 dark:text-gray-300">
                      <p>• Contractual adjustments require insurance verification</p>
                      <p>• Write-offs over $500 require supervisor approval</p>
                      <p>• Document all adjustments thoroughly</p>
                      <p>• Review patient account before processing</p>
                      <p>• Adjustments are final and cannot be reversed</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Adjustments by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "Contractual Adjustments",
                          count: adjustmentsByType.contractual,
                          color: "blue",
                        },
                        {
                          type: "Write-offs",
                          count: adjustmentsByType.writeOff,
                          color: "red",
                        },
                        {
                          type: "Courtesy Adjustments",
                          count: adjustmentsByType.courtesy,
                          color: "purple",
                        },
                        {
                          type: "Error Corrections",
                          count: adjustmentsByType.error,
                          color: "orange",
                        },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                              />
                              <span className="text-sm font-medium">{item.type}</span>
                            </div>
                            <span className="text-sm font-bold">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div
                              className={`bg-${item.color}-500 h-2 rounded-full`}
                              style={{
                                width: `${(item.count / totalAdjustments) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Adjustment Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">
                        Revenue Impact
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                        -${totalAdjustmentAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Total adjustments this period
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Adjustment Rate
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        8.5%
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Of total charges
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Processing Time
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                        2.3 days
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Average approval time
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
