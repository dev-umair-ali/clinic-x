"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  ChevronDown,
  MoreHorizontal,
  Users,
  Calendar,
  FileText,
  Mic,
  Plus,
  Edit,
  CreditCard,
  Settings,
  Eye,
} from "lucide-react"

interface MedicalDashboardProps {
  onBack: () => void // Added callback prop for back navigation
}

export function MedicalDashboard({ onBack }: MedicalDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Sort By")

  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Appointments Today",
      value: "24",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Pending Prescriptions",
      value: "8",
      change: "+5.4%",
      changeType: "positive" as const,
      icon: FileText,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Voice Notes in Queue",
      value: "15",
      change: "-12.3%",
      changeType: "negative" as const,
      icon: Mic,
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      time: "9:00 AM",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: 2,
      patientName: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      time: "9:00 AM",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: 3,
      patientName: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      time: "9:00 AM",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: 4,
      patientName: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      time: "9:00 AM",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: 5,
      patientName: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      time: "9:00 AM",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: 6,
      patientName: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      time: "9:00 AM",
      type: "Consultation",
      status: "Confirmed",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Good morning, Dr. Sarah Chen</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tuesday, July 22, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Appointments Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search Patient"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      >
                        {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy("Name")}>Name</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("Time")}>Time</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("Status")}>Status</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                  <TableHead className="text-gray-600 dark:text-gray-300 font-medium">PATIENT NAME</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300 font-medium">TIME</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300 font-medium">TYPE</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300 font-medium">STATUS</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300 font-medium">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{appointment.time}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{appointment.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Notes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Write Prescription
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Add Bill
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Manage Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    Previous
                  </Button>
                  <Button size="sm" className="bg-[#1da68f] hover:bg-[#178a73] text-white">
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    Next
                  </Button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">10 / Pages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
