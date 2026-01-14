"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { exportToCSV, handlePrint } from "@/lib/utils/billing-utils";
import { useToast } from "@/hooks/use-toast";
import { claimsAPI, type InsuranceClaim } from "@/lib/api/billing";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
  Building2,
  User,
  Loader2,
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

export default function ClaimsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [insuranceFilter, setInsuranceFilter] = useState("all");
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaimed: 0,
    totalApproved: 0,
    totalPaid: 0,
    pendingCount: 0,
  });

  // Fetch claims on mount and when filters change
  useEffect(() => {
    fetchClaims();
  }, [statusFilter, insuranceFilter]);

  const fetchClaims = async () => {
    try {
      setLoading(true);

      const params: any = {
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const result = await claimsAPI.listClaims(params);

      if (result.success && result.data) {
        setClaims(result.data.claims || []);
        calculateStats(result.data.claims || []);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch claims",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: "Error",
        description: "Failed to load claims data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (claimsData: InsuranceClaim[]) => {
    const totalClaimed = claimsData.reduce((sum, claim) => sum + claim.totalCharges, 0);
    const totalApproved = claimsData.reduce((sum, claim) => sum + claim.allowedAmount, 0);
    const totalPaid = claimsData.reduce((sum, claim) => sum + claim.paidAmount, 0);
    const pendingCount = claimsData.filter(
      (c) => c.status === 'submitted' || c.status === 'in_review'
    ).length;

    setStats({
      totalClaimed,
      totalApproved,
      totalPaid,
      pendingCount,
    });
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchClaims();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "submitted":
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "partially_approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "appeal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "submitted":
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "partially_approved":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
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
                  Claims Management
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track and manage insurance claims
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Status
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => exportToCSV(claims, 'claims_report')}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                  onClick={() => router.push('/doctor/patients-billing/claims/submit')}
                >
                  <Send className="w-4 h-4" />
                  Submit Claim
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
                      Total Claimed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${stats.totalClaimed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {claims.length} claims
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
                      Approved Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${stats.totalApproved.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {stats.totalClaimed > 0 ? ((stats.totalApproved / stats.totalClaimed) * 100).toFixed(1) : 0}% approval rate
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
                      Pending Claims
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stats.pendingCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Awaiting response
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Paid Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      ${stats.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {claims.filter(c => c.status === "paid").length} paid claims
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by claim number, patient name, or ID..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="partially_approved">Partially Approved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={insuranceFilter} onValueChange={setInsuranceFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Insurers</SelectItem>
                    <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                    <SelectItem value="uhc">United Healthcare</SelectItem>
                    <SelectItem value="aetna">Aetna</SelectItem>
                    <SelectItem value="cigna">Cigna</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Claims Table */}
          <Card>
            <CardHeader>
              <CardTitle>Claims History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : claims.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No claims found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Submit your first insurance claim to get started
                  </p>
                  <Button onClick={() => router.push("/doctor/patients-billing/claims/submit")}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Claim
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claim Number</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Insurance</TableHead>
                          <TableHead>Service Date</TableHead>
                          <TableHead className="text-right">Charged</TableHead>
                          <TableHead className="text-right">Paid</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Update</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.map((claim) => (
                      <TableRow 
                        key={claim._id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => router.push(`/doctor/patients-billing/claims/${claim._id}`)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm font-semibold">{claim.claimNumber || claim.claimId}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Charge: {typeof claim.chargeId === 'string' ? claim.chargeId.slice(-6) : 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {typeof claim.patientId === 'object' ? `${claim.patientId?.firstName || ''} ${claim.patientId?.lastName || ''}` : 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {typeof claim.patientId === 'object' ? claim.patientId?._id?.slice(-6) : claim.patientId?.toString().slice(-6) || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{claim.insuranceProvider?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(claim.serviceDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${claim.totalCharges.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={claim.paidAmount > 0 ? "font-semibold text-green-600 dark:text-green-400" : "text-gray-400"}>
                            ${claim.paidAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(claim.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(claim.status)}
                            <span className="capitalize">{formatStatus(claim.status)}</span>
                          </Badge>
                          {claim.denialInfo?.denialReason && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[200px]">
                              {claim.denialInfo.denialReason}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(claim.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium">1-{claims.length}</span> of{" "}
                  <span className="font-medium">{claims.length}</span> claims
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={claims.length < 100}>
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
