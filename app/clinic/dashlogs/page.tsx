"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ChevronDown,
  Eye,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const logData = [
  {
    timestamp: "28/01/2024, 10:30:00",
    user: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    action: "Patient Record Updated",
    actionDetail: "Updated patient John Sm...",
    device: "Chrome on Windows",
    sessionId: "SES-0000001",
    requestId: "REQ-0000123",
    userAgent: "Chrome on Windows",
    complianceLocation: "Unknown",
  },
  {
    timestamp: "28/01/2024, 10:30:00",
    user: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    action: "Patient Record Updated",
    actionDetail: "Updated patient John Sm...",
    device: "Chrome on Windows",
    sessionId: "SES-0000001",
    requestId: "REQ-0000123",
    userAgent: "Chrome on Windows",
    complianceLocation: "Unknown",
  },
  {
    timestamp: "28/01/2024, 10:30:00",
    user: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    action: "Patient Record Updated",
    actionDetail: "Updated patient John Sm...",
    device: "Chrome on Windows",
    sessionId: "SES-0000001",
    requestId: "REQ-0000123",
    userAgent: "Chrome on Windows",
    complianceLocation: "Unknown",
  },
  {
    timestamp: "28/01/2024, 10:30:00",
    user: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    action: "Patient Record Updated",
    actionDetail: "Updated patient John Sm...",
    device: "Chrome on Windows",
    sessionId: "SES-0000001",
    requestId: "REQ-0000123",
    userAgent: "Chrome on Windows",
       complianceLocation: "Unknown",
  },
  {
    timestamp: "28/01/2024, 10:30:00",
    user: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    action: "Patient Record Updated",
    actionDetail: "Updated patient John Sm...",
    device: "Chrome on Windows",
    sessionId: "SES-0000001",
    requestId: "REQ-0000123",
    userAgent: "Chrome on Windows",
    complianceLocation: "Unknown",
  },
  {
    timestamp: "28/01/2024, 10:30:00",
    user: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    action: "Patient Record Updated",
    actionDetail: "Updated patient John Sm...",
    device: "Chrome on Windows",
    sessionId: "SES-0000001",
    requestId: "REQ-0000123",
    userAgent: "Chrome on Windows",
    complianceLocation: "Unknown",
  },
];

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<(typeof logData)[0] | null>(
    null
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
          Logs Dashboard
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
          Monitor system activity and audit trail
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              Total Logs
            </CardTitle>
            <Activity className="h-4 w-4 text-[hsl(var(--color-chart-blue))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--color-chart-blue))]">5</div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              Today's Activity Doctor
            </CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(var(--color-status-success))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--color-status-success))]">0</div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              Active Users
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-[hsl(var(--color-chart-orange))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--color-chart-orange))]">5</div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              System Events
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-[hsl(var(--color-status-error))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--color-status-error))]">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs Section */}
      <Card className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
              Activity Logs
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] h-4 w-4" />
                <Input
                  placeholder="Search Doctor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                  >
                    Sort By
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[hsl(var(--popover))] dark:bg-[hsl(var(--popover))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                  <DropdownMenuItem className="text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))]">
                    Date
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))]">
                    User
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))]">
                    Action
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 py-3 px-4 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] rounded-t-lg border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
            <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              TIMESTAMP
            </div>
            <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              USER
            </div>
            <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              IP ADDRESS
            </div>
            <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              ACTION
            </div>
            <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              DEVICE
            </div>
            <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              ACTION
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[hsl(var(--border))] dark:divide-[hsl(var(--border))]">
            {logData.map((log, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 py-4 px-4 hover:bg-[hsl(var(--muted)/0.5)] dark:hover:bg-[hsl(var(--muted)/0.5)]"
              >
                <div className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {log.timestamp}
                </div>
                <div className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {log.user}
                </div>
                <div className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {log.ipAddress}
                </div>
                <div className="text-sm">
                  <div className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] font-medium">
                    {log.action}
                  </div>
                  <div className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                    {log.actionDetail}
                  </div>
                </div>
                <div className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {log.device}
                </div>
                <div className="text-sm">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] hover:bg-[hsl(var(--color-brand-teal)/0.1)] dark:hover:bg-[hsl(var(--color-brand-teal)/0.1)]"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[hsl(var(--popover))] dark:bg-[hsl(var(--popover))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))]">
                          Log Entry Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectedLog && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-1">
                                User
                              </div>
                              <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                                {selectedLog.user}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-1">
                                Action
                              </div>
                              <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                                {selectedLog.action}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-1">
                                Timestamp
                              </div>
                              <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                                {selectedLog.timestamp}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-1">
                                IP Address
                              </div>
                              <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                                {selectedLog.ipAddress}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-1">
                              Device
                            </div>
                            <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                              {selectedLog.device}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-1">
                              Notes
                            </div>
                            <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                              Updated patient John Smith's medication list
                            </div>
                          </div>
                          <div className="text-sm font-medium text-[hsl(var(--popover-foreground))] dark:text-[hsl(var(--popover-foreground))] mb-2">
                            Additional Context
                          </div>
                          <div className="space-y-1 text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                            <div>• Session ID: {selectedLog.sessionId}</div>
                            <div>• Request ID: {selectedLog.requestId}</div>
                            <div>• User Agent: {selectedLog.userAgent}</div>
                            <div>
                              • Compliance Location:{" "}
                              {selectedLog.complianceLocation}
                            </div>
                          </div>
                        </div>
                      )}                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button className="bg-[hsl(var(--color-brand-teal))] text-white hover:bg-[hsl(var(--color-brand-teal-dark))] w-8 h-8 p-0">
                1
              </Button>
              <Button
                variant="outline"
                className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] w-8 h-8 p-0"
              >
                2
              </Button>
            </div>
            <Button
              variant="outline"
              className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            >
              Next
            </Button>
            <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
              10 /Pages
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}