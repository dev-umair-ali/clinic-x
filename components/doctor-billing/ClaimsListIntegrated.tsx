"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { claimsAPI, type InsuranceClaim } from "@/lib/api/billing";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Send,
  TrendingUp,
  Loader2,
  RefreshCcw,
  Building,
  User,
  ChevronRight,
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

const statusConfig = {
  draft: { label: "Draft", icon: FileText, color: "bg-gray-500" },
  submitted: { label: "Submitted", icon: Send, color: "bg-blue-500" },
  in_review: { label: "In Review", icon: Clock, color: "bg-yellow-500" },
  approved: { label: "Approved", icon: CheckCircle, color: "bg-green-500" },
  denied: { label: "Denied", icon: XCircle, color: "bg-red-500" },
  appealed: { label: "Appealed", icon: AlertCircle, color: "bg-purple-500" },
  paid: { label: "Paid", icon: DollarSign, color: "bg-teal-500" },
};

export default function ClaimsManagementIntegrated() {
  const router = useRouter();
  const { toast } = useToast();

  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [claimTypeFilter, setClaimTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClaims, setTotalClaims] = useState(0);

  useEffect(() => {
    fetchClaims();
  }, [currentPage, statusFilter, claimTypeFilter, dateRange]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const dateFrom = calculateDateFrom(dateRange);

      const result = await claimsAPI.listClaims({
        page: currentPage,
        limit: 20,
        status: statusFilter === "all" ? undefined : statusFilter,
        claimType: claimTypeFilter === "all" ? undefined : claimTypeFilter,
        dateFrom,
        search: searchQuery || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (result.success && result.data) {
        setClaims(result.data.claims);
        setTotalPages(result.data.totalPages);
        setTotalClaims(result.data.total);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load claims",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await claimsAPI.getStats();
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
    fetchClaims();
  };

  const handleRefresh = () => {
    fetchClaims();
    fetchStats();
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "admin"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                Insurance Claims Management
              </h1>
              <p className="text-[hsl(var(--muted-foreground))]">
                Manage and track insurance claims
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
                onClick={() => router.push("/doctor/patients-billing/claims/create")}
                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Claim
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Claims
                  </CardTitle>
                  <FileText className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalClaims || 0}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Total charges: ${stats.totalCharges?.toLocaleString() || "0"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Approved
                  </CardTitle>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.statusCounts?.approved || 0}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Paid: ${stats.totalPaid?.toLocaleString() || "0"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Review
                  </CardTitle>
                  <Clock className="w-4 h-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {(stats.statusCounts?.submitted || 0) + 
                     (stats.statusCounts?.in_review || 0)}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Awaiting adjudication
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Denied
                  </CardTitle>
                  <XCircle className="w-4 h-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.statusCounts?.denied || 0}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {stats.approvalRate?.toFixed(1) || 0}% approval rate
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
                    placeholder="Search by patient, claim ID, invoice..."
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
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="appealed">Appealed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={claimTypeFilter}
                  onValueChange={setClaimTypeFilter}
                >
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Claim Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="institutional">Institutional</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="vision">Vision</SelectItem>
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

          {/* Claims List */}
          <Card>
            <CardHeader>
              <CardTitle>Claims ({totalClaims})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : claims.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No claims found</p>
                  <Button
                    onClick={() => router.push("/doctor/patients-billing/claims/create")}
                    className="mt-4"
                    variant="outline"
                  >
                    Create First Claim
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => {
                    const StatusIcon = statusConfig[claim.status]?.icon || FileText;
                    const statusColor = statusConfig[claim.status]?.color || "bg-gray-500";

                    return (
                      <div
                        key={claim._id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(`/doctor/patients-billing/claims/${claim._id}`)
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
                                <h3 className="font-semibold">{claim.claimId}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {claim.patientId?.firstName}{" "}
                                  {claim.patientId?.lastName} • {claim.claimType}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-13">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(claim.serviceDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {claim.insuranceProvider?.name || "N/A"}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {claim.procedureCodes?.length || 0} procedures
                              </div>
                              {claim.submittedDate && (
                                <div className="flex items-center gap-1">
                                  <Send className="w-4 h-4" />
                                  Submitted {new Date(claim.submittedDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right space-y-2">
                            <div>
                              <div className="text-2xl font-bold">
                                ${claim.totalCharges.toFixed(2)}
                              </div>
                              {claim.paidAmount > 0 && (
                                <div className="text-sm text-green-600">
                                  Paid: ${claim.paidAmount.toFixed(2)}
                                </div>
                              )}
                              {claim.patientResponsibility > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  Patient: ${claim.patientResponsibility.toFixed(2)}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 justify-end">
                              <Badge
                                variant={
                                  claim.status === "approved" || claim.status === "paid"
                                    ? "default"
                                    : claim.status === "denied"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="capitalize"
                              >
                                {statusConfig[claim.status]?.label || claim.status}
                              </Badge>
                            </div>
                          </div>

                          <ChevronRight className="w-5 h-5 text-muted-foreground ml-4" />
                        </div>

                        {claim.status === "denied" && claim.denialInfo && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 ml-13">
                            <XCircle className="w-4 h-4" />
                            <span>
                              Denied: {claim.denialInfo.denialReason || claim.denialInfo.reasonDescription || "See details"}
                            </span>
                          </div>
                        )}

                        {claim.status === "appealed" && claim.appealInfo && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-purple-600 ml-13">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                              Appeal submitted on{" "}
                              {new Date(claim.appealInfo.appealDate).toLocaleDateString()}
                            </span>
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
