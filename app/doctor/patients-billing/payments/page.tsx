"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generatePaymentsReportPDF, type PDFPaymentsReportData } from "@/lib/utils/pdf-generator";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
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

interface Payment {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  patientName: string;
  patientId: string;
  paymentDate: string;
  paymentMethod: string;
  paymentSource: string;
  amount: number;
  referenceNumber: string;
  status: string;
  processingFee: number;
  notes?: string;
}

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  const payments: Payment[] = [
    {
      id: "1",
      transactionId: "TXN-2024-001",
      invoiceNumber: "INV-2024-001",
      patientName: "Emma Wilson",
      patientId: "PT-10234",
      paymentDate: "2024-01-20",
      paymentMethod: "Credit Card",
      paymentSource: "Patient",
      amount: 175.0,
      referenceNumber: "****4532",
      status: "completed",
      processingFee: 5.25,
    },
    {
      id: "2",
      transactionId: "TXN-2024-002",
      invoiceNumber: "INV-2024-002",
      patientName: "Michael Chen",
      patientId: "PT-10235",
      paymentDate: "2024-01-19",
      paymentMethod: "Insurance Payment",
      paymentSource: "Aetna",
      amount: 340.0,
      referenceNumber: "EFT-20240119",
      status: "completed",
      processingFee: 0,
    },
    {
      id: "3",
      transactionId: "TXN-2024-003",
      invoiceNumber: "INV-2024-003",
      patientName: "Sarah Johnson",
      patientId: "PT-10236",
      paymentDate: "2024-01-19",
      paymentMethod: "Debit Card",
      paymentSource: "Patient",
      amount: 85.5,
      referenceNumber: "****7890",
      status: "completed",
      processingFee: 2.57,
    },
    {
      id: "4",
      transactionId: "TXN-2024-004",
      invoiceNumber: "INV-2024-004",
      patientName: "Robert Taylor",
      patientId: "PT-10237",
      paymentDate: "2024-01-18",
      paymentMethod: "Check",
      paymentSource: "Patient",
      amount: 295.0,
      referenceNumber: "CHK-1234",
      status: "pending",
      processingFee: 0,
      notes: "Check deposited, awaiting clearance",
    },
    {
      id: "5",
      transactionId: "TXN-2024-005",
      invoiceNumber: "INV-2024-005",
      patientName: "Lisa Anderson",
      patientId: "PT-10238",
      paymentDate: "2024-01-18",
      paymentMethod: "Insurance Payment",
      paymentSource: "Medicare",
      amount: 255.0,
      referenceNumber: "EFT-2024-001",
      status: "completed",
      processingFee: 0,
    },
    {
      id: "6",
      transactionId: "TXN-2024-006",
      invoiceNumber: "INV-2024-006",
      patientName: "James Martinez",
      patientId: "PT-10239",
      paymentDate: "2024-01-17",
      paymentMethod: "Bank Transfer",
      paymentSource: "Patient",
      amount: 450.0,
      referenceNumber: "ACH-987654",
      status: "completed",
      processingFee: 3.5,
    },
    {
      id: "7",
      transactionId: "TXN-2024-007",
      invoiceNumber: "INV-2024-007",
      patientName: "Jennifer Martinez",
      patientId: "PT-10240",
      paymentDate: "2024-01-16",
      paymentMethod: "Cash",
      paymentSource: "Patient",
      amount: 125.0,
      referenceNumber: "CASH-001",
      status: "completed",
      processingFee: 0,
    },
    {
      id: "8",
      transactionId: "TXN-2024-008",
      invoiceNumber: "INV-2024-008",
      patientName: "David Lee",
      patientId: "PT-10241",
      paymentDate: "2024-01-15",
      paymentMethod: "Credit Card",
      paymentSource: "Patient",
      amount: 210.0,
      referenceNumber: "****8765",
      status: "failed",
      processingFee: 0,
      notes: "Card declined - insufficient funds",
    },
  ];

  // Calculate statistics
  const totalPayments = payments.filter(p => p.status === "completed").length;
  const totalAmount = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalProcessingFees = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.processingFee, 0);
  const pendingPayments = payments.filter(p => p.status === "pending").length;
  const failedPayments = payments.filter(p => p.status === "failed").length;

  const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  const handleDownloadPDF = () => {
    // Calculate by method and source
    const byMethod: Record<string, { count: number; amount: number }> = {};
    const bySource: Record<string, { count: number; amount: number }> = {};

    payments.filter(p => p.status === "completed").forEach(payment => {
      // By method
      if (!byMethod[payment.paymentMethod]) {
        byMethod[payment.paymentMethod] = { count: 0, amount: 0 };
      }
      byMethod[payment.paymentMethod].count++;
      byMethod[payment.paymentMethod].amount += payment.amount;

      // By source
      if (!bySource[payment.paymentSource]) {
        bySource[payment.paymentSource] = { count: 0, amount: 0 };
      }
      bySource[payment.paymentSource].count++;
      bySource[payment.paymentSource].amount += payment.amount;
    });

    const pdfData: PDFPaymentsReportData = {
      reportDate: new Date().toISOString().split('T')[0],
      dateRange: `Last ${dateRange} days`,
      payments: payments.filter(p => p.status === "completed"),
      totalAmount,
      totalPayments,
      byMethod,
      bySource,
    };

    generatePaymentsReportPDF(pdfData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes("Card")) {
      return <CreditCard className="w-4 h-4" />;
    } else if (method === "Insurance Payment") {
      return <Building2 className="w-4 h-4" />;
    } else {
      return <DollarSign className="w-4 h-4" />;
    }
  };

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
                    Payment History
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track and manage all payment transactions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="payments-content">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalAmount.toFixed(2)}
                  </p>
                  <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {totalPayments} completed payments
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${averagePayment.toFixed(2)}
                  </p>
                  <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Per transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pendingPayments}
                  </p>
                  <FileText className="w-8 h-8 text-yellow-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Awaiting clearance
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Processing Fees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalProcessingFees.toFixed(2)}
                  </p>
                  <TrendingDown className="w-8 h-8 text-red-500 opacity-20" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {((totalProcessingFees / totalAmount) * 100).toFixed(2)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by transaction ID, patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Payment Method" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="insurance">Insurance Payment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Payment Source" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
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

          {/* Payment History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow 
                        key={payment.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm font-semibold">
                              {payment.transactionId}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              Ref: {payment.referenceNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto font-mono text-blue-600 dark:text-blue-400"
                            onClick={() => router.push(`/doctor/patients-billing/${payment.invoiceNumber}`)}
                          >
                            {payment.invoiceNumber}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.patientName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.patientId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="text-sm">{payment.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {payment.paymentSource}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">
                            ${payment.amount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.processingFee > 0 ? (
                            <span className="text-sm text-red-600 dark:text-red-400">
                              ${payment.processingFee.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                          {payment.notes && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
                              {payment.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: "Insurance Payments", count: 2, amount: 595.0, color: "blue" },
                    { method: "Credit Cards", count: 2, amount: 385.0, color: "purple" },
                    { method: "Bank Transfers", count: 1, amount: 450.0, color: "green" },
                    { method: "Debit Cards", count: 1, amount: 85.5, color: "indigo" },
                    { method: "Cash", count: 1, amount: 125.0, color: "yellow" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                          <span className="text-sm font-medium">{item.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ${item.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.count} transaction{item.count > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className={`bg-${item.color}-500 h-2 rounded-full`}
                          style={{ width: `${(item.amount / totalAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Collection Rate
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {totalPayments} of {payments.length} payments successful
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {((totalPayments / payments.length) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Net Revenue
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        After processing fees
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${(totalAmount - totalProcessingFees).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                        Average Processing Time
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        From service to payment
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      5.2 days
                    </p>
                  </div>

                  {failedPayments > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                          Failed Payments
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Requires attention
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {failedPayments}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
