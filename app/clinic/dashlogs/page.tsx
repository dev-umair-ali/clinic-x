"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { fetchClinicAuditLogsForClinic, clearSelectedLog } from "@/lib/slices/auditLogSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";

export default function LogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, pagination, loading } = useSelector(
    (state: RootState) => state.auditLogs
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [actorRoleFilter, setActorRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedLog, setSelectedLog] = useState<any>(null);

  const totalPages = pagination?.totalPages || 1;
  const logsData = useMemo(() => logs || [], [logs]);

  // Calculate stats
  const totalLogs = pagination?.totalItems || 0;
  const todayLogs = logsData.filter(log => {
    const today = new Date();
    const logDate = new Date(log.timestamp);
    return logDate.toDateString() === today.toDateString();
  }).length;
  const activeUsers = new Set(logsData.map(log => log.actorId)).size;
  const failedLogs = logsData.filter(log => log.status === 'failure').length;

  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (actionFilter) params.action = actionFilter;
    if (entityTypeFilter) params.entityType = entityTypeFilter;
    if (actorRoleFilter) params.actorRole = actorRoleFilter;
    params.page = currentPage;
    params.limit = itemsPerPage;
    params.clinicRef = user?.clinicId || "";

    dispatch(fetchClinicAuditLogsForClinic(params));
  }, [dispatch, searchTerm, actionFilter, entityTypeFilter, actorRoleFilter, currentPage, itemsPerPage]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    dispatch(clearSelectedLog());
  };

  const onPageChange = (page: number) => setCurrentPage(page);
  const onItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setActionFilter("");
    setEntityTypeFilter("");
    setActorRoleFilter("");
    setCurrentPage(1);
  };

  // Helper function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-2">
              Activity Logs
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg">
              Monitor system activity and audit trail in real-time
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          {
            title: "Total Logs",
            value: totalLogs.toString(),
            icon: Activity,
            color: "text-[hsl(var(--color-chart-blue))]",
            bgColor: "bg-[hsl(var(--color-chart-blue)/0.1)]",
          },
          {
            title: "Today's Activity",
            value: todayLogs.toString(),
            icon: Calendar,
            color: "text-[hsl(var(--color-status-success))]",
            bgColor: "bg-[hsl(var(--color-status-success)/0.1)]",
          },
          {
            title: "Active Users",
            value: activeUsers.toString(),
            icon: CheckCircle,
            color: "text-[hsl(var(--color-chart-orange))]",
            bgColor: "bg-[hsl(var(--color-chart-orange)/0.1)]",
          },
          {
            title: "Failed Events",
            value: failedLogs.toString(),
            icon: AlertCircle,
            color: "text-[hsl(var(--color-status-error))]",
            bgColor: "bg-[hsl(var(--color-status-error)/0.1)]",
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="bg-[hsl(var(--card))] border-[hsl(var(--border))] hover:shadow-md transition-all duration-300 hover:border-[hsl(var(--color-brand-teal))]"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[hsl(var(--foreground))]">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[hsl(var(--card))] border-[hsl(var(--border))] overflow-hidden">
        <CardHeader className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold text-[hsl(var(--foreground))]">
                System Activity
              </CardTitle>
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px] bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                  <SelectValue placeholder="Filter by Action" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                  <SelectItem value="all" className="text-[hsl(var(--popover-foreground))]">All Actions</SelectItem>
                  <SelectItem value="CREATE" className="text-[hsl(var(--popover-foreground))]">Create</SelectItem>
                  <SelectItem value="UPDATE" className="text-[hsl(var(--popover-foreground))]">Update</SelectItem>
                  <SelectItem value="DELETE" className="text-[hsl(var(--popover-foreground))]">Delete</SelectItem>
                  <SelectItem value="LOGIN" className="text-[hsl(var(--popover-foreground))]">Login</SelectItem>
                  <SelectItem value="LOGOUT" className="text-[hsl(var(--popover-foreground))]">Logout</SelectItem>
                  <SelectItem value="VIEW" className="text-[hsl(var(--popover-foreground))]">View</SelectItem>
                </SelectContent>
              </Select>

              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger className="w-[180px] bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                  <SelectValue placeholder="Filter by Entity" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                  <SelectItem value="all" className="text-[hsl(var(--popover-foreground))]">All Entities</SelectItem>
                  <SelectItem value="USER" className="text-[hsl(var(--popover-foreground))]">User</SelectItem>
                  <SelectItem value="DOCTOR" className="text-[hsl(var(--popover-foreground))]">Doctor</SelectItem>
                  <SelectItem value="ASSISTANT" className="text-[hsl(var(--popover-foreground))]">Assistant</SelectItem>
                  <SelectItem value="CLINIC" className="text-[hsl(var(--popover-foreground))]">Clinic</SelectItem>
                  <SelectItem value="APPOINTMENT" className="text-[hsl(var(--popover-foreground))]">Appointment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actorRoleFilter} onValueChange={setActorRoleFilter}>
                <SelectTrigger className="w-[180px] bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                  <SelectItem value="all" className="text-[hsl(var(--popover-foreground))]">All Roles</SelectItem>
                  <SelectItem value="admin" className="text-[hsl(var(--popover-foreground))]">Admin</SelectItem>
                  <SelectItem value="clinic" className="text-[hsl(var(--popover-foreground))]">Clinic</SelectItem>
                  <SelectItem value="doctor" className="text-[hsl(var(--popover-foreground))]">Doctor</SelectItem>
                  <SelectItem value="assistant" className="text-[hsl(var(--popover-foreground))]">Assistant</SelectItem>
                  <SelectItem value="patient" className="text-[hsl(var(--popover-foreground))]">Patient</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || actionFilter || entityTypeFilter || actorRoleFilter) && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    Active filters:
                  </span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                      Search: {searchTerm}
                    </span>
                  )}
                  {actionFilter !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                      Action: {actionFilter}
                    </span>
                  )}
                  {entityTypeFilter !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                      Entity: {entityTypeFilter}
                    </span>
                  )}
                  {actorRoleFilter !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                      Role: {actorRoleFilter}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
                        <span className="ml-2 text-[hsl(var(--muted-foreground))]">Loading logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : logsData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[hsl(var(--muted-foreground))]">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  logsData.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-[hsl(var(--muted)/0.2)] transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))]">
                        <span className="font-mono text-xs bg-[hsl(var(--muted)/0.5)] px-2.5 py-1.5 rounded">
                          {moment(log.timestamp).format("YYYY-MM-DD hh:mm:ss A")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-[hsl(var(--foreground))]">
                              {log.actorRole?.charAt(0).toUpperCase() + log.actorRole?.slice(1) || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-[hsl(var(--foreground))]">
                              {
                                (log?.actorUser as any).firstName?.charAt(0).toUpperCase() + (log?.actorUser as any).firstName?.slice(1) +
                                " " +
                                (log?.actorUser as any).lastName?.charAt(0).toUpperCase() + (log?.actorUser as any).lastName?.slice(1)
                                || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <div className="font-semibold text-[hsl(var(--foreground))]">
                            {log.entityType} {log.action}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-[hsl(var(--foreground))]">
                              {log.ipAddress || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal)/0.1)] opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setSelectedLog(log)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.1)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* ---------- page controls ---------- */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 text-sm text-[hsl(var(--foreground))]
                   hover:text-[hsl(var(--color-brand-teal))]
                   disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, idx) => {
                    if (pageNum === '...') {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-[hsl(var(--muted-foreground))]"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum as number)}
                        className={`min-w-[36px] h-9 px-3 text-sm rounded-md border transition
                          ${isActive
                            ? "bg-[hsl(var(--color-brand-teal))] text-white border-[hsl(var(--color-brand-teal))] shadow"
                            : "text-[hsl(var(--foreground))] border-[hsl(var(--border))]" +
                            " hover:border-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal))]"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="px-4 py-1.5 text-sm text-[hsl(var(--foreground))]
                   hover:text-[hsl(var(--color-brand-teal))]
                   disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>

              {/* ---------- rows per page ---------- */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  Rows per page:
                </span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(v) => onItemsPerPageChange(Number(v))}
                >
                  <SelectTrigger className="h-9 w-20 text-sm rounded-lg border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))] text-[hsl(var(--foreground))] bg-[hsl(var(--background))]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md bg-[hsl(var(--popover))] border-[hsl(var(--border))]"
                  style={{ minWidth: 20 }}>
                    {[10, 20, 30, 40, 50].map((s) => (
                      <SelectItem
                        key={s}
                        value={String(s)}
                        className="text-sm rounded-md text-[hsl(var(--popover-foreground))] hover:bg-[hsl(var(--color-brand-teal)/0.1)] focus:bg-[hsl(var(--color-brand-teal)/0.2)]"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
      }}>
        <DialogContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[hsl(var(--popover-foreground))]">
              Audit Log Details
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-3">
              {/* Primary Info Section */}
              <div className="bg-[hsl(var(--background))] rounded-lg p-4 border border-[hsl(var(--border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--popover-foreground))] mb-3 uppercase tracking-wider">
                  Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                      User
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm text-[hsl(var(--popover-foreground))]">
                        {
                          (selectedLog?.actorUser as any).firstName?.charAt(0).toUpperCase() + (selectedLog?.actorUser as any).firstName?.slice(1) +
                          " " +
                          (selectedLog?.actorUser as any).lastName?.charAt(0).toUpperCase() + (selectedLog?.actorUser as any).lastName?.slice(1)
                          || 'Unknown User'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                      Action
                    </div>
                    <div className="font-medium text-sm text-[hsl(var(--popover-foreground))]">
                      {selectedLog.entityType}  {selectedLog.action}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp and IP Section */}
              <div className="bg-[hsl(var(--background))] rounded-lg p-4 border border-[hsl(var(--border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--popover-foreground))] mb-3 uppercase tracking-wider">
                  Connection Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                      Timestamp
                    </div>
                    <div className="font-mono text-xs bg-[hsl(var(--muted)/0.5)] px-2 py-1.5 rounded text-[hsl(var(--popover-foreground))]">
                      {moment(selectedLog.timestamp).format("YYYY-MM-DD hh:mm:ss A")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                      IP Address
                    </div>
                    <div className="font-mono text-xs bg-[hsl(var(--muted)/0.5)] px-2 py-1.5 rounded text-[hsl(var(--popover-foreground))]">
                      {selectedLog.ipAddress || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Device and Session Info */}
              <div className="bg-[hsl(var(--background))] rounded-lg p-4 border border-[hsl(var(--border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--popover-foreground))] mb-3 uppercase tracking-wider">
                  System Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                      Device / User Agent
                    </div>
                    <div className="text-xs text-[hsl(var(--popover-foreground))]">
                      {selectedLog.device || selectedLog.userAgent || 'N/A'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                        {selectedLog.entityType} ID
                      </div>
                      <div className="font-mono text-xs bg-[hsl(var(--muted)/0.5)] px-2 py-1.5 rounded text-[hsl(var(--popover-foreground))]">
                        {selectedLog.entityId || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                        Request ID
                      </div>
                      <div className="font-mono text-xs bg-[hsl(var(--muted)/0.5)] px-2 py-1.5 rounded text-[hsl(var(--popover-foreground))]">
                        {selectedLog._id || 'N/A'}
                      </div>
                    </div>
                  </div>
                  {selectedLog.clinicName && (
                    <div>
                      <div className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase mb-1">
                        Clinic
                      </div>
                      <div className="text-xs text-[hsl(var(--popover-foreground))]">
                        {selectedLog.clinicName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}