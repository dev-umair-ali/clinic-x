"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateInvoicePDF, type PDFInvoiceData } from "@/lib/utils/pdf-generator";
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  Search,
  FileText,
  Building2,
  User,
  ChevronRight,
  Stethoscope,
  Receipt,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface BillingStatement {
  id: string;
  invoiceNumber: string;
  dateOfService: string;
  provider: string;
  serviceDescription: string;
  totalCharge: number;
  insurancePaid: number;
  patientPaid: number;
  yourBalance: number;
  status: "paid" | "pending" | "overdue";
  dueDate?: string;
  cptCodes: string[];
}

export default function PatientBillingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Mock patient billing data
  const patientInfo = {
    name: "Emma Wilson",
    patientId: "PT-10234",
    dob: "1990-05-15",
    email: "emma.wilson@email.com",
    phone: "(555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
  };

  const insuranceInfo = {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BCBS-123456789",
    groupNumber: "GRP-456789",
    planType: "PPO Plus",
    coverageStatus: "Active",
    effectiveDate: "2024-01-01",
  };

  const billingStatements: BillingStatement[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      dateOfService: "2024-01-15",
      provider: "Dr. Sarah Johnson",
      serviceDescription: "Annual Physical Examination",
      totalCharge: 285.0,
      insurancePaid: 200.0,
      patientPaid: 65.0,
      yourBalance: 20.0,
      status: "pending",
      dueDate: "2024-02-15",
      cptCodes: ["99213", "81002"],
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      dateOfService: "2024-01-10",
      provider: "Dr. Michael Chen",
      serviceDescription: "Follow-up Visit - Diabetes Management",
      totalCharge: 180.0,
      insurancePaid: 144.0,
      patientPaid: 36.0,
      yourBalance: 0,
      status: "paid",
      cptCodes: ["99214"],
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      dateOfService: "2023-12-20",
      provider: "Dr. Sarah Johnson",
      serviceDescription: "Lab Work - Comprehensive Metabolic Panel",
      totalCharge: 95.0,
      insurancePaid: 75.0,
      patientPaid: 0,
      yourBalance: 20.0,
      status: "overdue",
      dueDate: "2024-01-20",
      cptCodes: ["80053"],
    },
    {
      id: "4",
      invoiceNumber: "INV-2023-045",
      dateOfService: "2023-11-05",
      provider: "Dr. Michael Chen",
      serviceDescription: "Sick Visit - Upper Respiratory Infection",
      totalCharge: 150.0,
      insurancePaid: 120.0,
      patientPaid: 30.0,
      yourBalance: 0,
      status: "paid",
      cptCodes: ["99213"],
    },
  ];

  const paymentHistory = [
    {
      id: "1",
      date: "2024-01-20",
      invoiceNumber: "INV-2024-002",
      amount: 36.0,
      method: "Credit Card (****4532)",
      status: "Completed",
    },
    {
      id: "2",
      date: "2023-12-15",
      invoiceNumber: "INV-2023-045",
      amount: 30.0,
      method: "Credit Card (****4532)",
      status: "Completed",
    },
    {
      id: "3",
      date: "2024-01-18",
      invoiceNumber: "INV-2024-001",
      amount: 65.0,
      method: "Credit Card (****4532)",
      status: "Completed",
    },
  ];

  // Calculate summary metrics
  const totalOutstanding = billingStatements.reduce(
    (sum, stmt) => sum + stmt.yourBalance,
    0
  );
  const totalPaid = billingStatements.reduce(
    (sum, stmt) => sum + stmt.patientPaid,
    0
  );
  const overdueBalance = billingStatements
    .filter((stmt) => stmt.status === "overdue")
    .reduce((sum, stmt) => sum + stmt.yourBalance, 0);
  const pendingClaims = billingStatements.filter(
    (stmt) => stmt.status === "pending"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (statement: BillingStatement) => {
    router.push(`/patient/billing/${statement.id}`);
  };

  const handleMakePayment = (statement: BillingStatement) => {
    router.push(`/patient/billing/payment?invoice=${statement.invoiceNumber}`);
  };

  const handleDownloadPDF = (statement: BillingStatement) => {
    const pdfData: PDFInvoiceData = {
      invoiceNumber: statement.invoiceNumber,
      dateOfService: statement.dateOfService,
      dateCreated: new Date().toISOString().split('T')[0],
      dateDue: statement.dueDate || '',
      status: statement.status,
      patient: {
        name: patientInfo.name,
        id: patientInfo.patientId,
        dob: patientInfo.dob,
        email: patientInfo.email,
        phone: patientInfo.phone,
        address: `${patientInfo.address}`,
      },
      insurance: {
        provider: insuranceInfo.provider,
        policyNumber: insuranceInfo.policyNumber,
        groupNumber: insuranceInfo.groupNumber,
        subscriberName: patientInfo.name,
      },
      provider: {
        name: statement.provider,
        npi: 'NPI123456',
        specialty: 'Internal Medicine',
        facility: 'ClinicX Health Center',
        phone: '(555) 123-4567',
        address: '123 Medical Drive, Suite 100, Healthcare City, ST 12345',
      },
      charges: [{
        cptCode: 'CPT-001',
        description: statement.serviceDescription,
        quantity: 1,
        unitPrice: statement.totalCharge,
        total: statement.totalCharge,
        modifier: '',
        diagnosisPointers: ['1'],
      }],
      diagnosisCodes: [{
        code: 'Z00.00',
        description: 'Encounter for general examination',
        pointer: 1,
      }],
      payments: statement.status === 'paid' ? [{
        date: new Date().toISOString().split('T')[0],
        method: 'Credit Card',
        payer: 'Patient',
        amount: statement.yourBalance,
        referenceNumber: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      }] : [],
      adjustments: [],
      subtotal: statement.totalCharge,
      totalAdjustments: 0,
      totalPayments: statement.insurancePaid + (statement.status === 'paid' ? statement.yourBalance : 0),
      balance: statement.yourBalance,
      notes: 'Thank you for choosing ClinicX Health Center.',
    };
    generateInvoicePDF(pdfData);
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Billing & Payments
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your medical bills and payment information
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Alert for Overdue Balance */}
          {overdueBalance > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start flex-1">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
                      Overdue Balance: ${overdueBalance.toFixed(2)}
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      Please pay your overdue balance to avoid late fees and service interruptions.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                  onClick={() => {
                    const overdueStmt = billingStatements.find(s => s.status === "overdue");
                    if (overdueStmt) handleMakePayment(overdueStmt);
                  }}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Outstanding Balance
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${totalOutstanding.toFixed(2)}
                    </p>
                    {overdueBalance > 0 ? (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        ${overdueBalance.toFixed(2)} overdue
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {pendingClaims} pending {pendingClaims === 1 ? 'claim' : 'claims'}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Paid (YTD)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${totalPaid.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Year to date payments
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Insurance Coverage
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      {insuranceInfo.provider}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {insuranceInfo.planType} - Active
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Payment Methods
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      VISA ****4532
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Default payment method
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Card */}
          <Card className="border-2 border-[#1DA68F]/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#1DA68F]/10 rounded-lg">
                    <Receipt className="w-6 h-6 text-[#1DA68F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Quick Actions
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your billing and payments
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {totalOutstanding > 0 && (
                    <Button
                      size="sm"
                      className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                      onClick={() => {
                        const firstUnpaid = billingStatements.find(s => s.status !== "paid");
                        if (firstUnpaid) handleMakePayment(firstUnpaid);
                      }}
                    >
                      <DollarSign className="w-4 h-4" />
                      Pay Outstanding Balance
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => router.push("/patient/billing/payment-methods")}
                  >
                    <CreditCard className="w-4 h-4" />
                    Payment Methods
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="statements" className="space-y-4">
            <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <TabsTrigger value="statements" className="gap-2">
                <Receipt className="w-4 h-4" />
                Billing Statements
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Payment History
              </TabsTrigger>
              <TabsTrigger value="insurance" className="gap-2">
                <Shield className="w-4 h-4" />
                Insurance Info
              </TabsTrigger>
            </TabsList>

            {/* Billing Statements Tab */}
            <TabsContent value="statements" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Your Billing Statements</CardTitle>
                      <CardDescription>
                        View and download your medical billing statements
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="30">Last 30 Days</SelectItem>
                          <SelectItem value="90">Last 90 Days</SelectItem>
                          <SelectItem value="365">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingStatements.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No billing statements found</p>
                      </div>
                    ) : (
                      billingStatements.map((statement) => (
                        <Card
                          key={statement.id}
                          className={`border-2 hover:shadow-md transition-all cursor-pointer group ${
                            statement.status === "overdue"
                              ? "border-red-200 dark:border-red-800 hover:border-red-300"
                              : "border-gray-200 dark:border-gray-800 hover:border-[#1DA68F]/30"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                        {statement.serviceDescription}
                                      </h3>
                                      <Badge className={getStatusColor(statement.status)}>
                                        <span className="flex items-center gap-1">
                                          {getStatusIcon(statement.status)}
                                          {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                                        </span>
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                      <FileText className="w-4 h-4" />
                                      <span>Invoice: {statement.invoiceNumber}</span>
                                      <span className="text-gray-400">•</span>
                                      <Stethoscope className="w-4 h-4" />
                                      <span>Provider: {statement.provider}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      Date of Service
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {new Date(statement.dateOfService).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                      Total Charge
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      ${statement.totalCharge.toFixed(2)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                      Insurance Paid
                                    </p>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                      ${statement.insurancePaid.toFixed(2)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                      Your Balance
                                    </p>
                                    <p className={`text-sm font-bold ${
                                      statement.yourBalance > 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-green-600 dark:text-green-400"
                                    }`}>
                                      ${statement.yourBalance.toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                {statement.dueDate && statement.status !== "paid" && (
                                  <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className={`${
                                      statement.status === "overdue"
                                        ? "text-red-600 dark:text-red-400 font-semibold"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}>
                                      Due: {new Date(statement.dueDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex lg:flex-col items-center gap-2 lg:pl-4 lg:border-l border-gray-200 dark:border-gray-800">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2 w-full lg:w-auto"
                                  onClick={() => router.push(`/patient/billing/${statement.id}`)}
                                >
                                  <FileText className="w-4 h-4" />
                                  View Details
                                </Button>
                                {statement.status !== "paid" && (
                                  <Button
                                    size="sm"
                                    className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90 w-full lg:w-auto"
                                    onClick={() => handleMakePayment(statement)}
                                  >
                                    <DollarSign className="w-4 h-4" />
                                    Pay ${statement.yourBalance.toFixed(2)}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Helpful Information Card */}
              <Card className="border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Understanding Your Bill
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>• <strong>Total Charge:</strong> The full amount billed by your healthcare provider</p>
                        <p>• <strong>Insurance Paid:</strong> Amount covered by your insurance plan</p>
                        <p>• <strong>Your Balance:</strong> Amount you're responsible for paying</p>
                        <p>• Click <strong>"View Details"</strong> to see the complete breakdown including CPT codes and diagnosis information</p>
                        <p>• Download statements as PDFs for your records and tax purposes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Review your past payments and transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              {payment.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${payment.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insurance Info Tab */}
            <TabsContent value="insurance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-500/20">
                  <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Insurance Information</CardTitle>
                        <CardDescription>Your current coverage details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Insurance Provider
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {insuranceInfo.provider}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Policy Number
                        </p>
                        <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                          {insuranceInfo.policyNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Group Number
                        </p>
                        <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                          {insuranceInfo.groupNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Plan Type
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {insuranceInfo.planType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Coverage Status
                        </p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {insuranceInfo.coverageStatus}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Effective Date
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {new Date(insuranceInfo.effectiveDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-500/20">
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>Patient Information</CardTitle>
                        <CardDescription>Your registered details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Full Name
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {patientInfo.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Patient ID
                        </p>
                        <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                          {patientInfo.patientId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Date of Birth
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {new Date(patientInfo.dob).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {patientInfo.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Phone Number
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {patientInfo.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {patientInfo.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Assistance Info */}
              <Card className="border-2 border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-lg flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Financial Assistance Available
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        We understand medical bills can be challenging. We offer flexible payment plans and financial assistance programs based on your situation. Contact our billing team at <span className="font-medium">(555) 123-4567</span> or email <span className="font-medium">billing@clinicx.com</span>.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          onClick={() => window.open('/patient/financial-assistance', '_blank')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          onClick={() => window.location.href = 'tel:+15551234567'}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Contact Billing
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
