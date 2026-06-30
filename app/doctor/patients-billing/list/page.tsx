"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctorBillingAPI, type Charge } from "@/lib/api/billing";
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
  Send,
  TrendingUp,
  Loader2,
  RefreshCcw,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const statusConfig = {
  draft: { label: "Draft", icon: FileText, color: "bg-gray-500" },
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  submitted_to_insurance: { label: "Submitted", icon: Send, color: "bg-blue-500" },
  paid: { label: "Paid", icon: CheckCircle, color: "bg-green-500" },
  overdue: { label: "Overdue", icon: AlertCircle, color: "bg-red-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-gray-400" },
};

const paymentStatusConfig = {
  unpaid: { label: "Unpaid", color: "destructive" },
  partially_paid: { label: "Partially Paid", color: "default" },
  paid: { label: "Paid", color: "default" },
  overdue: { label: "Overdue", color: "destructive" },
};

export default function PatientsBillingIntegrated() {
  const router = useRouter();
  const { toast } = useToast();

  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCharges, setTotalCharges] = useState(0);

  // Fetch charges
  useEffect(() => {
    fetchCharges();
  }, [currentPage, statusFilter, paymentStatusFilter, dateRange]);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const dateFrom = calculateDateFrom(dateRange);
      
      const result = await doctorBillingAPI.listCharges({
        page: currentPage,
        limit: 20,
        status: statusFilter === "all" ? undefined : statusFilter,
        paymentStatus: paymentStatusFilter === "all" ? undefined : paymentStatusFilter,
        dateFrom,
        search: searchQuery || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (result.success && result.data) {
        setCharges(result.data.charges);
        setTotalPages(result.data.totalPages);
        setTotalCharges(result.data.total);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load charges",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching charges:", error);
      toast({
        title: "Error",
        description: "Failed to load charges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await doctorBillingAPI.getStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const calculateDateFrom = (range: string): string => {
    const now = new Date();
    const days = parseInt(range);
    const dateFrom = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return dateFrom.toISOString().split("T")[0];
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCharges();
  };

  const handleRefresh = () => {
    fetchCharges();
    fetchStats();
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "admin"]}>
      <Toaster />
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                Patient Billing
              </h1>
              <p className="text-[hsl(var(--muted-foreground))]">
                Manage patient charges and billing records
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={() => router.push("/doctor/patients-billing/create-new")}
                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Charge
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats.totalRevenue?.toLocaleString() || "0"}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {stats.chargeCount || 0} total charges
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Paid
                  </CardTitle>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${stats.totalPaid?.toLocaleString() || "0"}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {stats.paidCount || 0} paid charges
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Outstanding
                  </CardTitle>
                  <Clock className="w-4 h-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    ${stats.totalPending?.toLocaleString() || "0"}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {stats.pendingCount || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overdue
                  </CardTitle>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${stats.overdueAmount?.toLocaleString() || "0"}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {stats.overdueCount || 0} overdue charges
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    placeholder="Search by patient name, invoice number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted_to_insurance">Submitted</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={paymentStatusFilter}
                  onValueChange={setPaymentStatusFilter}
                >
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} variant="outline">
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charges List */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Records ({totalCharges})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : charges.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No charges found</p>
                  <Button
                    onClick={() => router.push("/doctor/patients-billing/create-new")}
                    className="mt-4"
                    variant="outline"
                  >
                    Create First Charge
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {charges.map((charge) => {
                    const StatusIcon = statusConfig[charge.status]?.icon || FileText;
                    const statusColor = statusConfig[charge.status]?.color || "bg-gray-500";

                    return (
                      <div
                        key={charge._id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(`/doctor/patients-billing/${charge._id}`)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-10 h-10 rounded-full ${statusColor} bg-opacity-10 flex items-center justify-center`}
                              >
                                <StatusIcon
                                  className={`w-5 h-5 ${statusColor.replace(
                                    "bg-",
                                    "text-"
                                  )}`}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {charge.patientId?.firstName}{" "}
                                  {charge.patientId?.lastName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {charge.invoiceNumber} • {charge.visitType}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-13">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(charge.serviceDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {charge.items.length} item(s)
                              </div>
                              {charge.insuranceInfo?.providerName && (
                                <div className="flex items-center gap-1">
                                  {charge.insuranceInfo.providerName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right space-y-2">
                            <div>
                              <div className="text-2xl font-bold">
                                ${(charge.totalCharge - (charge.amountPaid || 0) + (charge.discountAmount ? -charge.discountAmount : 0)).toFixed(2)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                of ${charge.totalCharge.toFixed(2)}
                              </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                              <Badge
                                variant={
                                  paymentStatusConfig[charge.paymentStatus]
                                    ?.color as any
                                }
                              >
                                {paymentStatusConfig[charge.paymentStatus]
                                  ?.label || charge.paymentStatus}
                              </Badge>
                              <Badge variant="outline">
                                {statusConfig[charge.status]?.label ||
                                  charge.status}
                              </Badge>
                            </div>
                          </div>

                          <ChevronRight className="w-5 h-5 text-muted-foreground ml-4" />
                        </div>

                        {charge.isOverdue && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 ml-13">
                            <AlertCircle className="w-4 h-4" />
                            <span>Payment overdue</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
