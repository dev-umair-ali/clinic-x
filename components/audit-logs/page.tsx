"use client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Shield, AlertTriangle, Users, Search } from "lucide-react"

const auditData = [
  {
    timestamp: "15/01/2024, 19:30:00",
    user: "Dr. Sarah Johnson",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    timestamp: "15/01/2024, 19:30:00",
    user: "Dr. Sarah Johnson",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ipAddress: "192.168.1.100",
    status: "Failed",
  },
  {
    timestamp: "15/01/2024, 19:30:00",
    user: "Dr. Sarah Johnson",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ipAddress: "192.168.1.100",
    status: "Failed",
  },
  {
    timestamp: "15/01/2024, 19:30:00",
    user: "Dr. Sarah Johnson",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    timestamp: "15/01/2024, 19:30:00",
    user: "Dr. Sarah Johnson",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    timestamp: "15/01/2024, 19:30:00",
    user: "Dr. Sarah Johnson",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
]

export default function AuditLogsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "doctor", "patient"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Audit Logs</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track system activities, user actions, and compliance logs
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Activities */}
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Activities</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                      +8.2%
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Events */}
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Security Events</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                      +2.1%
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Failed Attempts */}
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Failed Attempts</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md">
                      +5.4%
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Active Users */}
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Users</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                      +5%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search Logs..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="last-7-days">
                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-actions">
                <SelectTrigger className="w-[130px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-actions">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="modify">Modify</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-users">
                <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All Users</SelectItem>
                  <SelectItem value="doctors">Doctors</SelectItem>
                  <SelectItem value="patients">Patients</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audit Trail Table */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audit Trail</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-600">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        TIMESTAMP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        USER
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        ACTION
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        RESOURCE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        IP ADDRESS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {auditData.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.resource}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {log.ipAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.status === "Success"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
