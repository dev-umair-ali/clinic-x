"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { doctorBillingAPI, type DoctorStats } from "@/lib/api/billing";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  RefreshCcw,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
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
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/toaster";

export default function BillingStatsDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const dateFrom = calculateDateFrom(dateRange);

      const result = await doctorBillingAPI.getStats({
        dateFrom,
      });

      if (result.success && result.data) {
        setStats(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load statistics",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDateFrom = (range: string): string => {
    const now = new Date();
    const days = parseInt(range);
    const dateFrom = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return dateFrom.toISOString().split("T")[0];
  };

  const collectionRate = stats
    ? ((stats.totalPaid / stats.totalRevenue) * 100).toFixed(1)
    : "0";

  return (
    <ProtectedRoute allowedRoles={["doctor", "admin"]}>
      <Toaster />
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                Billing Statistics & Analytics
              </h1>
              <p className="text-[hsl(var(--muted-foreground))]">
                Overview of your billing performance
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchStats} className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : stats ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      {stats.chargeCount} total charges
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Avg: ${stats.averageChargeAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Collected
                    </CardTitle>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ${stats.totalPaid.toLocaleString()}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {stats.paidCount} paid charges
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Collection Rate</span>
                        <span className="font-semibold">{collectionRate}%</span>
                      </div>
                      <Progress value={parseFloat(collectionRate)} className="h-1" />
                    </div>
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
                    <div className="text-3xl font-bold text-yellow-600">
                      ${stats.totalPending.toLocaleString()}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {stats.pendingCount} pending charges
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <ArrowUpRight className="w-3 h-3 text-yellow-500" />
                      <span>
                        {((stats.totalPending / stats.totalRevenue) * 100).toFixed(1)}%
                        of revenue
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      ${stats.overdueAmount.toLocaleString()}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {stats.overdueCount} overdue charges
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Requires immediate attention</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status Breakdown</CardTitle>
                    <CardDescription>
                      Distribution of charges by payment status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Paid</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${stats.totalPaid.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stats.paidCount} charges
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={(stats.totalPaid / stats.totalRevenue) * 100}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Pending</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-yellow-600">
                            ${stats.totalPending.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stats.pendingCount} charges
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={(stats.totalPending / stats.totalRevenue) * 100}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Overdue</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">
                            ${stats.overdueAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stats.overdueCount} charges
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={(stats.overdueAmount / stats.totalRevenue) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Collection Metrics</CardTitle>
                    <CardDescription>
                      Key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Collection Rate
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {collectionRate}%
                        </span>
                      </div>
                      <Progress value={parseFloat(collectionRate)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Target: 85% • Industry avg: 75%
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Average Charge
                        </span>
                        <span className="text-2xl font-bold">
                          ${stats.averageChargeAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Total Charges
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.chargeCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Paid Charges
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {stats.paidCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Procedures */}
              {stats.topProcedures && stats.topProcedures.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Procedures by Revenue</CardTitle>
                    <CardDescription>
                      Most frequently billed procedures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topProcedures.map((procedure, index) => (
                        <div
                          key={procedure.code}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold">{procedure.code}</div>
                              <div className="text-sm text-muted-foreground">
                                {procedure.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              ${procedure.revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {procedure.count} times
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() =>
                        router.push("/doctor/patients-billing/list?status=overdue")
                      }
                    >
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span>View Overdue ({stats.overdueCount})</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() =>
                        router.push("/doctor/patients-billing/list?status=pending")
                      }
                    >
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span>View Pending ({stats.pendingCount})</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() =>
                        router.push("/doctor/patients-billing/create-new")
                      }
                    >
                      <FileText className="w-5 h-5 text-teal-500" />
                      <span>Create New Charge</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No statistics available</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
