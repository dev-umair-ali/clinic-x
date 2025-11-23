"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
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
import { appointmentService, type DoctorAppointment } from "@/lib/api/services/appointmentService"
import { fetchDoctorPatients } from "@/lib/slices/doctorPatientSlice"

// Helper functions
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "scheduled":
    case "confirmed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
    case "completed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "cancelled":
    case "canceled":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  }
}

interface MedicalDashboardProps {
  onBack: () => void // Added callback prop for back navigation
}

export function MedicalDashboard({ onBack }: MedicalDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const { patients, loading: patientsLoading } = useSelector((state: RootState) => state.doctorPatients);
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Sort By")
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch patients on mount
  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, [dispatch]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.getDoctorAppointments({
        status: "scheduled",
        limit: 100,
      });
      
      if (response && response.success && response.data) {
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } else {
        setAppointments([]);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch appointments";
      setError(errorMessage);
      setAppointments([]);
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointmentsToday = appointments.filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return aptDate >= today && aptDate < tomorrow && apt.status === "scheduled";
    }).length;

    const totalPatients = Array.isArray(patients) ? patients.length : 0;

    return [
      {
        title: "Total Patients",
        value: totalPatients.toLocaleString(),
        change: "+8.2%",
        changeType: "positive" as const,
        icon: Users,
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "Appointments Today",
        value: appointmentsToday.toString(),
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
    ];
  }, [appointments, patients]);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    
    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((apt) => {
        const patientName = apt.patientName || (typeof apt.patient === 'object' ? apt.patient?.name : '') || 'Patient';
        return patientName.toLowerCase().includes(search);
      });
    }

    // Sort
    if (sortBy === "Name") {
      filtered.sort((a, b) => {
        const nameA = (a.patientName || (typeof a.patient === 'object' ? a.patient?.name : '') || '').toLowerCase();
        const nameB = (b.patientName || (typeof b.patient === 'object' ? b.patient?.name : '') || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === "Time") {
      filtered.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else if (sortBy === "Status") {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }

    return filtered;
  }, [appointments, searchTerm, sortBy]);

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
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {(() => {
                  const hour = new Date().getHours();
                  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
                  const doctorName = authUser?.name || authUser?.firstName || "Dr. Smith";
                  return `${greeting}, ${doctorName}`;
                })()}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
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

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm mx-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1da68f]"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading appointments...</span>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No appointments found</p>
              </div>
            ) : (
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
                  {filteredAppointments.map((appointment) => {
                    const patientName = appointment.patientName || (typeof appointment.patient === 'object' ? appointment.patient?.name : '') || 'Patient';
                    const avatar = typeof appointment.patient === 'object' ? appointment.patient?.avatar : undefined;
                    
                    return (
                      <TableRow key={appointment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                                {patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 dark:text-white">{patientName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {formatTime(appointment.dateTime)}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {appointment.type || "Appointment"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadgeClass(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {filteredAppointments.length > 0 && (
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Patients Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Patients</h2>
              </div>
            </div>

            {patientsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1da68f]"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading patients...</span>
              </div>
            ) : !Array.isArray(patients) || patients.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No patients found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                    <TableHead className="text-gray-600 dark:text-gray-300 font-medium">PATIENT NAME</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-medium">AGE/GENDER</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-medium">EMAIL</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-medium">PHONE</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-medium">STATUS</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-medium">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                              {patient.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "P"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {patient.age}/{patient.gender || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{patient.email || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{patient.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            patient.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
                          }
                        >
                          {patient.status || "inactive"}
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
                              <Edit className="h-4 w-4" />
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              View Records
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              View Appointments
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
