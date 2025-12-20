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
    <div className="min-h-screen bg-background dark:bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground mb-2">
          Logs Dashboard
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Monitor system activity and audit trail
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              Total Logs
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">5</div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              Today's Activity Doctor
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">0</div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              Active Users
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">5</div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              System Events
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs Section */}
      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground dark:text-foreground">
              Activity Logs
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Doctor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground"
                  >
                    Sort By
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover dark:bg-popover border-border dark:border-border">
                  <DropdownMenuItem className="text-popover-foreground dark:text-popover-foreground">
                    Date
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-popover-foreground dark:text-popover-foreground">
                    User
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-popover-foreground dark:text-popover-foreground">
                    Action
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 py-3 px-4 bg-muted dark:bg-muted rounded-t-lg border-b border-border dark:border-border">
            <div className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              TIMESTAMP
            </div>
            <div className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              USER
            </div>
            <div className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              IP ADDRESS
            </div>
            <div className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              ACTION
            </div>
            <div className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              DEVICE
            </div>
            <div className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              ACTION
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border dark:divide-border">
            {logData.map((log, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 py-4 px-4 hover:bg-muted/50 dark:hover:bg-muted/50"
              >
                <div className="text-sm text-foreground dark:text-foreground">
                  {log.timestamp}
                </div>
                <div className="text-sm text-foreground dark:text-foreground">
                  {log.user}
                </div>
                <div className="text-sm text-foreground dark:text-foreground">
                  {log.ipAddress}
                </div>
                <div className="text-sm">
                  <div className="text-foreground dark:text-foreground font-medium">
                    {log.action}
                  </div>
                  <div className="text-muted-foreground dark:text-muted-foreground">
                    {log.actionDetail}
                  </div>
                </div>
                <div className="text-sm text-foreground dark:text-foreground">
                  {log.device}
                </div>
                <div className="text-sm">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-teal-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-popover dark:bg-popover border-border dark:border-border max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-popover-foreground dark:text-popover-foreground">
                          Log Entry Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectedLog && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-1">
                                User
                              </div>
                              <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {selectedLog.user}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-1">
                                Action
                              </div>
                              <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {selectedLog.action}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-1">
                                Timestamp
                              </div>
                              <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {selectedLog.timestamp}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-1">
                                IP Address
                              </div>
                              <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {selectedLog.ipAddress}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-1">
                              Device
                            </div>
                            <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                              {selectedLog.device}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-1">
                              Notes
                            </div>
                            <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                              Updated patient John Smith's medication list
                            </div>
                          </div>
                          <div className="text-sm font-medium text-popover-foreground dark:text-popover-foreground mb-2">
                            Additional Context
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground dark:text-muted-foreground">
                            <div>• Session ID: {selectedLog.sessionId}</div>
                            <div>• Request ID: {selectedLog.requestId}</div>
                            <div>• User Agent: {selectedLog.userAgent}</div>
                            <div>
                              • Compliance Location:{" "}
                              {selectedLog.complianceLocation}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center  mt-6">
            <Button
              variant="outline"
              className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button className="bg-teal-500 text-white hover:bg-teal-600 w-8 h-8 p-0">
                1
              </Button>
              <Button
                variant="outline"
                className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground w-8 h-8 p-0"
              >
                2
              </Button>
            </div>
            <Button
              variant="outline"
              className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground"
            >
              Next
            </Button>
            <div className="text-sm text-muted-foreground dark:text-muted-foreground">
              10 /Pages
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
