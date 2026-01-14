"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  Building2,
  Send,
  CreditCard,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { generateBillingSummaryPDF, type PDFBillingSummaryData } from "@/lib/utils/pdf-generator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorBillingAPI, type Charge } from "@/lib/api/billing";
import { useToast } from "@/hooks/use-toast";

export default function PatientsBillingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCharges: 0,
    totalCollected: 0,
    totalPending: 0,
    pendingClaims: 0,
  });

  // Fetch charges on mount and when filters change
  useEffect(() => {
    fetchCharges();
  }, [statusFilter, dateRange]);

  const fetchCharges = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const dateTo = new Date();
      const dateFrom = new Date();
      dateFrom.setDate(dateTo.getDate() - parseInt(dateRange));

      const params: any = {
        limit: 100,
        sortBy: 'serviceDate',
        sortOrder: 'desc' as const,
      };

      if (statusFilter !== 'all') {
        params.paymentStatus = statusFilter;
      }

      if (dateRange !== 'all') {
        params.dateFrom = dateFrom.toISOString();
        params.dateTo = dateTo.toISOString();
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const result = await doctorBillingAPI.listCharges(params);

      if (result.success && result.data) {
        setCharges(result.data.charges || []);
        calculateStats(result.data.charges || []);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch charges",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching charges:', error);
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (chargesData: Charge[]) => {
    const totalCharges = chargesData.reduce((sum, charge) => sum + charge.totalCharge, 0);
    const totalCollected = chargesData.reduce((sum, charge) => sum + charge.amountPaid, 0);
    // Calculate balance dynamically instead of using stale database value
    const totalPending = chargesData.reduce((sum, charge) => {
      const balance = charge.totalCharge - (charge.amountPaid || 0) + (charge.discountAmount ? -charge.discountAmount : 0);
      return sum + balance;
    }, 0);
    const pendingClaims = chargesData.filter(
      (c) => c.status === 'submitted_to_insurance' || c.insuranceInfo?.claimStatus === 'submitted'
    ).length;

    setStats({
      totalCharges,
      totalCollected,
      totalPending,
      pendingClaims,
    });
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchCharges();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDownloadPDF = () => {
    // Transform charges to billing records format for PDF
    const billingRecords = charges.map(charge => ({
      id: charge.invoiceNumber,
      patientName: `${charge.patientId?.firstName || ''} ${charge.patientId?.lastName || ''}`,
      patientId: charge.patientId?._id || '',
      dateOfService: new Date(charge.serviceDate).toISOString().split('T')[0],
      cptCodes: charge.items.map(item => item.cptCode),
      diagnosis: charge.items.map(item => item.description).join(', '),
      chargeAmount: charge.totalCharge,
      insurancePaid: charge.insuranceInfo?.insurancePaid || 0,
      patientPaid: charge.amountPaid,
      adjustment: charge.discountAmount || 0,
      balance: charge.totalCharge - (charge.amountPaid || 0) + (charge.discountAmount ? -charge.discountAmount : 0),
      claimStatus: charge.insuranceInfo?.claimStatus || 'pending',
      paymentStatus: charge.paymentStatus,
      insuranceProvider: charge.insuranceInfo?.providerName || 'None',
      appointmentType: charge.visitType,
    }));

    const pdfData: PDFBillingSummaryData = {
      reportDate: new Date().toISOString().split('T')[0],
      dateRange: `Last ${dateRange} days`,
      billingRecords,
      totalCharges: stats.totalCharges,
      totalCollected: stats.totalCollected,
      totalPending: stats.totalPending,
      pendingClaims: stats.pendingClaims,
    };

    generateBillingSummaryPDF(pdfData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "submitted":
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "partial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
      case "submitted":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Billing Management
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track charges, claims, and payments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push("/doctor/patients-billing/claims")}
                >
                  <Send className="w-4 h-4" />
                  Claims
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push("/doctor/patients-billing/payments")}
                >
                  <CreditCard className="w-4 h-4" />
                  Payments
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push("/doctor/patients-billing/adjustments")}
                >
                  <TrendingDown className="w-4 h-4" />
                  Adjustments
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
                <Button
                  size="sm"
                  className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                  onClick={() => router.push("/doctor/patients-billing/create")}
                >
                  <Plus className="w-4 h-4" />
                  New Charge
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Charges
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${stats.totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Last {dateRange} days
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Collected
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${stats.totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {stats.totalCharges > 0 ? ((stats.totalCollected / stats.totalCharges) * 100).toFixed(1) : 0}% collection rate
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Outstanding
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${stats.totalPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Needs collection
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Claims
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stats.pendingClaims}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Awaiting response
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by patient name, ID, or invoice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial Payment</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Billing Records */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : charges.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No charges found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first charge to get started
                  </p>
                  <Button onClick={() => router.push("/doctor/patients-billing/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Charge
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {charges.map((charge) => (
                      <div
                        key={charge._id}
                        className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-900"
                        onClick={() => router.push(`/doctor/patients-billing/${charge._id}`)}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* Left Section - Patient & Service Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {charge.patientId?.firstName} {charge.patientId?.lastName}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {charge.patientId?._id?.slice(-6) || 'N/A'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(charge.serviceDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" />
                                    {charge.invoiceNumber}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {charge.items.map((item, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs font-mono"
                                >
                                  {item.cptCode}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{charge.insuranceInfo?.providerName || 'No Insurance'}</span>
                              <span className="text-gray-300 dark:text-gray-700">•</span>
                              <span>{charge.visitType}</span>
                            </div>
                          </div>

                          {/* Right Section - Financial Info */}
                          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Charge</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  ${charge.totalCharge.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Insurance</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                  ${(charge.insuranceInfo?.insurancePaid || 0).toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Patient</p>
                                <p className="font-semibold text-blue-600 dark:text-blue-400">
                                  ${charge.amountPaid.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Balance</p>
                                <p className={`font-semibold ${(charge.totalCharge - (charge.amountPaid || 0) + (charge.discountAmount ? -charge.discountAmount : 0)) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}`}>
                                  ${(charge.totalCharge - (charge.amountPaid || 0) + (charge.discountAmount ? -charge.discountAmount : 0)).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Badge className={`${getStatusColor(charge.insuranceInfo?.claimStatus || charge.status)} flex items-center gap-1 justify-center whitespace-nowrap`}>
                                {getStatusIcon(charge.insuranceInfo?.claimStatus || charge.status)}
                                <span className="capitalize">{charge.insuranceInfo?.claimStatus || charge.status}</span>
                              </Badge>
                              <Badge className={`${getStatusColor(charge.paymentStatus)} justify-center whitespace-nowrap`}>
                                <span className="capitalize">{charge.paymentStatus.replace('_', ' ')}</span>
                              </Badge>
                            </div>

                            <Button variant="ghost" size="sm" className="hidden lg:flex">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing <span className="font-medium">1-{charges.length}</span> of <span className="font-medium">{charges.length}</span> records
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" disabled={charges.length < 100}>
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
