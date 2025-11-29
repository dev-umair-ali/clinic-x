"use client";

import { useState, useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import {
  Calendar,
  List,
  Clock,
  CheckCircle,
  FileText,
  Search,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentService, type DoctorAppointment, type PatientDetails, type CreateAppointmentRequest } from "@/lib/api/services/appointmentService";

// Calendar Event interface
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "appointment" | "follow-up" | "consultation" | "check-up";
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string | undefined): number {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Helper function to extract date from dateTime
function extractDate(dateTime: string): string {
  return dateTime.split('T')[0];
}

export default function DoctorAppointments() {
  const router = useRouter();
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<DoctorAppointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [editPatientName, setEditPatientName] = useState("");
  const [editCalendarMonth, setEditCalendarMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // API state
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    hoursAvailable: "0",
    appointmentsBooked: "0",
    nextAvailableSlot: "N/A",
  });
  const [totalPages, setTotalPages] = useState(1);

  // Fetch appointments on mount and when filters change
  useEffect(() => {
    if (viewMode === "calendar") {
      fetchCalendarAppointments();
    } else {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, currentPage, viewMode]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewMode === "list") {
        if (currentPage === 1) {
          fetchAppointments();
        } else {
          setCurrentPage(1);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, viewMode]);

  // Fetch weekly count for stats
  useEffect(() => {
    fetchWeeklyCount();
  }, []);

  // Fetch appointment list view on initial load (alternative endpoint)
  useEffect(() => {
    if (authUser?.id && appointments.length === 0 && !loading) {
      fetchAppointmentListView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  // Fetch appointments using GET /doctors/appointments with query params
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: {
        patientName?: string;
        status?: string;
        page?: number;
        limit?: number;
      } = {
        page: currentPage,
        limit: pageLimit,
      };

      if (searchQuery && searchQuery.trim()) {
        params.patientName = searchQuery.trim();
      }

      // Use status filter API endpoint for status filtering
      if (selectedFilter === "Canceled") {
        const response = await appointmentService.getDoctorAppointmentsByStatus("cancelled");
        if (response && response.success && response.data) {
          setAppointments(Array.isArray(response.data) ? response.data : []);
          setTotalPages(1);
        } else {
          setAppointments([]);
          setTotalPages(1);
        }
        return;
      } else if (selectedFilter === "Upcoming") {
        params.status = "scheduled";
      }

      const response = await appointmentService.getDoctorAppointments(params);
      if (response && response.success) {
        setAppointments(Array.isArray(response.data) ? response.data : []);
        if (response.total !== undefined && response.limit) {
          setTotalPages(Math.ceil(response.total / response.limit));
        } else {
          setTotalPages(1);
        }
      } else {
        setAppointments([]);
        setError(response?.message || "No appointments found");
      }
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || "Failed to fetch appointments";
      setError(errorMessage);
      setAppointments([]);
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch calendar appointments using GET /doctors/appointments/calendar
  const fetchCalendarAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.getDoctorAppointmentsCalendar();
      if (response && response.success && response.data) {
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } else {
        setAppointments([]);
        setError(response?.message || "No calendar appointments found");
      }
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || "Failed to fetch calendar appointments";
      setError(errorMessage);
      setAppointments([]);
      console.error("Error fetching calendar appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointment list view using GET /doctors/:id/appointmentListView
  const fetchAppointmentListView = async () => {
    if (!authUser?.id) {
      console.warn("No doctor ID available for appointment list view");
      return;
    }
    
    try {
      const response = await appointmentService.getDoctorAppointmentListView(authUser.id);
      if (response && response.success && response.data) {
        setAppointments(Array.isArray(response.data) ? response.data : []);
        if (response.total !== undefined && response.limit) {
          setTotalPages(Math.ceil(response.total / response.limit));
        } else {
          setTotalPages(1);
        }
      } else {
        // Fallback to regular appointments endpoint
        fetchAppointments();
      }
    } catch (err: any) {
      console.error("Error fetching appointment list view:", err);
      // Fallback to regular appointments endpoint
      fetchAppointments();
    }
  };

  const fetchWeeklyCount = async () => {
    try {
      const response = await appointmentService.getDoctorWeeklyCount();
      if (response && response.success && response.data && typeof response.data.count === 'number') {
        setStats((prev) => ({
          ...prev,
          appointmentsBooked: response.data.count.toString(),
        }));
      } else {
        // Keep default value if response is invalid
        console.warn("Invalid weekly count response:", response);
      }
    } catch (err: any) {
      console.error("Error fetching weekly count:", err);
      // Don't set error state for stats as it's not critical
      // Keep default value
    }
  };

  const fetchPatientDetails = async (appointmentId: string) => {
    if (!appointmentId || appointmentId.trim() === '') {
      setError("Invalid appointment ID");
      return;
    }
    
    try {
      // First try to get appointment by ID (GET /doctors/appointments/:id)
      let appointmentData;
      try {
        const appointmentResponse = await appointmentService.getDoctorAppointmentById(appointmentId);
        if (appointmentResponse && appointmentResponse.success && appointmentResponse.data) {
          appointmentData = appointmentResponse.data;
        }
      } catch (err: any) {
        console.log("getDoctorAppointmentById failed, trying details endpoint:", err.message);
      }

      // Then get full details (GET /doctors/appointments/:id/details)
      const response = await appointmentService.getDoctorAppointmentDetails(appointmentId);
      if (response && response.success && response.data?.patient) {
        const patient = response.data.patient;
        if (!patient._id || !patient.name) {
          throw new Error("Invalid patient data received");
        }
        
        const patientDetails: PatientDetails = {
          _id: patient._id,
          name: patient.name,
          patientId: patient.patientId || `#PAT-${patient._id.slice(-6)}`,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          age: calculateAge(patient.dateOfBirth),
          gender: patient.gender,
          bloodType: patient.bloodType,
          address: patient.address,
          avatar: patient.avatar,
          lastVisit: patient.lastVisit,
        };
        setSelectedPatient(patientDetails);
        setShowPatientModal(true);
        setError(null);
      } else if (appointmentData && typeof appointmentData.patient === 'object' && appointmentData.patient) {
        // Fallback to data from getDoctorAppointmentById
        const patient = appointmentData.patient as any;
        if (patient._id && patient.name) {
          const patientDetails: PatientDetails = {
            _id: patient._id,
            name: patient.name,
            patientId: patient.patientId || `#PAT-${patient._id.slice(-6)}`,
            email: patient.email,
            phone: patient.phone,
            dateOfBirth: patient.dateOfBirth,
            age: calculateAge(patient.dateOfBirth),
            gender: patient.gender,
            bloodType: patient.bloodType,
            address: patient.address,
            avatar: patient.avatar,
          };
          setSelectedPatient(patientDetails);
          setShowPatientModal(true);
          setError(null);
        } else {
          throw new Error("Incomplete patient data received");
        }
      } else {
        throw new Error("Patient details not found");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch patient details";
      setError(errorMessage);
      console.error("Error fetching patient details:", err);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    if (!appointmentId || appointmentId.trim() === '') {
      setError("Invalid appointment ID");
      return;
    }
    
    if (!newStatus || !['scheduled', 'completed', 'cancelled'].includes(newStatus)) {
      setError("Invalid status value");
      return;
    }
    
    try {
      const response = await appointmentService.updateDoctorAppointmentStatus(appointmentId, newStatus);
      if (response && response.success) {
        setError(null);
        // Refresh appointments based on current view mode
        if (viewMode === "calendar") {
          fetchCalendarAppointments();
        } else {
          fetchAppointments();
        }
      } else {
        throw new Error(response?.message || "Failed to update appointment status");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update appointment status";
      setError(errorMessage);
      console.error("Error updating appointment status:", err);
    }
  };

  // Create new appointment using POST /appointments
  const handleCreateAppointment = async (appointmentData: CreateAppointmentRequest) => {
    // Validate required fields
    if (!appointmentData.doctor || !appointmentData.patient || !appointmentData.dateTime) {
      setError("Missing required fields: doctor, patient, and dateTime are required");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.createAppointment(appointmentData);
      if (response && response.success) {
        // Refresh appointments based on current view mode
        if (viewMode === "calendar") {
          fetchCalendarAppointments();
        } else {
          fetchAppointments();
        }
        setShowBookingModal(false);
        // Refresh weekly count
        fetchWeeklyCount();
      } else {
        throw new Error(response?.message || "Failed to create appointment");
      }
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || "Failed to create appointment";
      setError(errorMessage);
      console.error("Error creating appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on selected filter
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    
    if (selectedFilter === "Upcoming") {
      const now = new Date();
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.dateTime);
        return aptDate >= now && apt.status !== "cancelled";
      });
    } else if (selectedFilter === "Canceled") {
      filtered = filtered.filter((apt) => apt.status === "cancelled");
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return dateA - dateB;
    });

    return filtered;
  }, [appointments, selectedFilter]);

  // Calendar events from appointments
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return filteredAppointments.map((apt) => ({
      id: apt._id,
      title: `${apt.patientName || apt.patient?.name || "Patient"} - ${apt.type || "appointment"}`,
      date: extractDate(apt.dateTime),
      type: (apt.type?.toLowerCase() || "appointment") as
        | "appointment"
        | "follow-up"
        | "consultation"
        | "check-up",
    }));
  }, [filteredAppointments]);

  // Calculate next available slot
  const nextAvailableSlot = useMemo(() => {
    const upcoming = filteredAppointments
      .filter((apt) => apt.status === "scheduled")
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
    
    if (upcoming) {
      const date = new Date(upcoming.dateTime);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return `Today ${formatTime(upcoming.dateTime)}`;
      }
      return formatDate(upcoming.dateTime) + " " + formatTime(upcoming.dateTime);
    }
    return "N/A";
  }, [filteredAppointments]);

  const statsData = [
    {
      title: "Hours Available This Week",
      value: stats.hoursAvailable,
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Appointments Booked",
      value: stats.appointmentsBooked,
      icon: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Next Available Slot",
      value: nextAvailableSlot,
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const handlePatientClick = async (appointment: DoctorAppointment) => {
    if (appointment._id) {
      await fetchPatientDetails(appointment._id);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevMonthDay.getDate(),
        isCurrentMonth: false,
        fullDate: prevMonthDay,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      });
    }

    // Add empty cells for days after the last day of the month
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({ date: i, isCurrentMonth: false, fullDate: nextMonthDay });
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const navigateEditCalendarMonth = (direction: "prev" | "next") => {
    setEditCalendarMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendarView = () => {
    const days = getDaysInMonth(currentMonth);

    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-muted rounded transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-muted rounded transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayDateStr = day.fullDate.toISOString().split('T')[0];
              const dayEvents = calendarEvents.filter(
                (event) => event.date === dayDateStr
              );

              return (
                <div
                  key={index}
                  className={`p-1 sm:p-2 h-16 sm:h-20 border border-border ${
                    day.isCurrentMonth ? "bg-card" : "bg-muted/50"
                  } relative cursor-pointer hover:bg-muted/50 transition-colors`}
                  onClick={() => {
                    console.log("Calendar day clicked:", day.fullDate);
                  }}
                >
                  <span
                    className={`text-xs sm:text-sm ${
                      day.isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day.date}
                  </span>

                  {/* Render appointments for this day */}
                  {dayEvents.length > 0 && day.isCurrentMonth && (
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            event.type === "follow-up"
                              ? "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200"
                              : event.type === "consultation"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          }`}
                        >
                          {event.title.split(" - ")[1] || event.type}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentList = () => {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Appointment List View
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Patient"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Date">Date</SelectItem>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            {["Upcoming", "Canceled", "All"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && (
            <div className="block sm:hidden space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments found
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-muted/50 rounded-lg p-4 border border-border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <button
                          onClick={() => handlePatientClick(appointment)}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {appointment.patientName || appointment.patient?.name || "Patient"}
                        </button>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(appointment.dateTime)} {formatTime(appointment.dateTime)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Start Visit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(appointment._id, "completed")}
                          >
                            Mark Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditAppointment(appointment)}
                          >
                            Reschedule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {appointment.type || "Appointment"}
                      </span>
                      <Select
                        value={appointment.status}
                        onValueChange={(value) => {
                          handleStatusUpdate(appointment._id, value);
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Desktop Table View */}
          {!loading && (
            <div className="hidden sm:block overflow-hidden rounded-lg border border-border">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        DATE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        PATIENT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        SERVICE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {formatDate(appointment.dateTime)} {formatTime(appointment.dateTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handlePatientClick(appointment)}
                            className="text-sm text-foreground hover:text-primary font-medium"
                          >
                            {appointment.patientName || appointment.patient?.name || "Patient"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {appointment.type || "Appointment"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select
                            value={appointment.status}
                            onValueChange={(value) => {
                              handleStatusUpdate(appointment._id, value);
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Start Visit</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(appointment._id, "completed")}
                              >
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditAppointment(appointment)}
                              >
                                Reschedule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={currentPage === pageNum ? "bg-teal-600 hover:bg-teal-700" : ""}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleEditAppointment = (appointment: DoctorAppointment) => {
    setEditingAppointment(appointment);
    setEditPatientName(appointment.patientName || appointment.patient?.name || "");
    const appointmentDate = new Date(appointment.dateTime);
    setSelectedDate(appointmentDate);
    setSelectedTimeSlot(formatTime(appointment.dateTime));
    setShowEditModal(true);
  };

  const timeSlots = [
    "01:00 PM - 02:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
  ];

  const renderEditModal = () => {
    const days = getDaysInMonth(editCalendarMonth); // Use edit calendar month state

    return (
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent
          className="
    !fixed top-0 right-0 h-full 
    w-full sm:w-[400px] max-w-full sm:max-w-[400px] 
    overflow-y-auto p-0 
    bg-white dark:bg-gray-900 
    border-l border-gray-200 dark:border-gray-700 
    shadow-lg rounded-none 
    transition-transform duration-300 
    translate-x-0 data-[state=closed]:translate-x-full
  "
          style={{
            transform: "none", // prevents Radix default centering
            left: "auto", // ensures it doesn’t stick to left
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Details
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                onClick={() => {
                  // Add confirmation dialog here
                  setShowEditModal(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowEditModal(false)}
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Patient Name */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Patient Name
              </label>
              <Input
                value={editPatientName}
                onChange={(e) => {
                  setEditPatientName(e.target.value);
                }}
                className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="Emma Wilson"
              />
            </div>

            {/* Date & Time Section */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Date & Time
              </label>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {editPatientName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  GMT + 05:00 Asia/Karachi (PKT)
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Date
                    </div>
                    <button
                      onClick={() => {
                        setShowCalendar(!showCalendar);
                      }}
                      className="font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 text-left"
                    >
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </button>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Slot
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedTimeSlot || "04:00 PM - 06:00 PM"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showCalendar && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <button
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    onClick={() => {
                      navigateEditCalendarMonth("prev");
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                  </button>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {monthNames[editCalendarMonth.getMonth()]}{" "}
                    {editCalendarMonth.getFullYear()}
                  </h3>
                  <button
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    onClick={() => {
                      navigateEditCalendarMonth("next");
                      console.log("Edit calendar: Next month");
                    }}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-900 dark:text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const isSelected =
                      selectedDate.getDate() === day.date &&
                      selectedDate.getMonth() ===
                        editCalendarMonth.getMonth() &&
                      selectedDate.getFullYear() ===
                        editCalendarMonth.getFullYear() &&
                      day.isCurrentMonth;

                    const isHighlighted =
                      day.isCurrentMonth && (day.date === 4 || day.date === 22);

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(day.fullDate);
                          setShowCalendar(false); // Close calendar after selection
                          console.log("Selected date:", day.fullDate);
                        }}
                        className={`p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[32px] transition-colors ${
                          isSelected
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : isHighlighted
                            ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50"
                            : day.isCurrentMonth
                            ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                            : "text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        {day.date}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Update Status */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Update Status:
              </label>
              <Select
                defaultValue="Pending"
                onValueChange={(value) => {
                  console.log("Status changed to:", value);
                }}
              >
                <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="Pending"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="Confirmed"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Confirmed
                  </SelectItem>
                  <SelectItem
                    value="Completed"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Completed
                  </SelectItem>
                  <SelectItem
                    value="Canceled"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Canceled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Available Time Slots:
              </label>
              <Select
                value={selectedTimeSlot}
                onValueChange={(value) => {
                  setSelectedTimeSlot(value);
                  console.log("Selected time slot:", value);
                }}
              >
                <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  {timeSlots.map((slot, index) => (
                    <SelectItem
                      key={index}
                      value={slot}
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 font-medium"
              onClick={async () => {
                if (!editingAppointment || !editingAppointment._id) {
                  setError("Invalid appointment data");
                  return;
                }
                
                if (!selectedTimeSlot || selectedTimeSlot.trim() === '') {
                  setError("Please select a time slot");
                  return;
                }
                
                try {
                  const dateTime = new Date(selectedDate);
                  if (isNaN(dateTime.getTime())) {
                    setError("Invalid date selected");
                    return;
                  }
                  
                  const [time, period] = selectedTimeSlot.split(" ");
                  if (!time || !period) {
                    setError("Invalid time format");
                    return;
                  }
                  
                  const [hours, minutes] = time.split(":");
                  if (!hours || !minutes) {
                    setError("Invalid time format");
                    return;
                  }
                  
                  let hour24 = parseInt(hours);
                  if (isNaN(hour24) || hour24 < 0 || hour24 > 12) {
                    setError("Invalid hour value");
                    return;
                  }
                  
                  if (period === "PM" && hour24 !== 12) hour24 += 12;
                  if (period === "AM" && hour24 === 12) hour24 = 0;
                  
                  const minuteValue = parseInt(minutes);
                  if (isNaN(minuteValue) || minuteValue < 0 || minuteValue > 59) {
                    setError("Invalid minute value");
                    return;
                  }
                  
                  dateTime.setHours(hour24, minuteValue, 0, 0);
                  
                  if (isNaN(dateTime.getTime())) {
                    setError("Invalid date and time combination");
                    return;
                  }
                  
                  const response = await appointmentService.updateAppointment(editingAppointment._id, {
                    dateTime: dateTime.toISOString(),
                  });
                  
                  if (response && response.success) {
                    setError(null);
                    setShowEditModal(false);
                    // Refresh appointments based on current view mode
                    if (viewMode === "calendar") {
                      fetchCalendarAppointments();
                    } else {
                      fetchAppointments();
                    }
                  } else {
                    throw new Error(response?.message || "Failed to update appointment");
                  }
                } catch (err: any) {
                  const errorMessage = err.message || "Failed to update appointment";
                  setError(errorMessage);
                  console.error("Error updating appointment:", err);
                }
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              Calendly Integration
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} ${stat.color}`}
                    >
                      {stat.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                        {stat.title}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={() => {
                    setViewMode("calendar");
                    // Fetch calendar appointments when switching to calendar view
                    fetchCalendarAppointments();
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex-1 sm:flex-none justify-center ${
                    viewMode === "calendar"
                      ? "bg-card text-foreground border-border"
                      : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar View</span>
                  <span className="sm:hidden">Calendar</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode("list");
                    // Fetch list appointments when switching to list view
                    fetchAppointments();
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex-1 sm:flex-none justify-center ${
                    viewMode === "list"
                      ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700"
                      : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Appointment List View
                  </span>
                  <span className="sm:hidden">List View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === "calendar"
            ? renderCalendarView()
            : renderAppointmentList()}
        </div>
      </div>

      {/* Patient Details Modal */}
      <Dialog open={showPatientModal} onOpenChange={setShowPatientModal}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPatient.avatar || "/placeholder.svg"}
                  alt={selectedPatient.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.patientId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                {selectedPatient.age !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">
                      {selectedPatient.age} years
                    </p>
                  </div>
                )}
                {selectedPatient.gender && (
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">
                      {selectedPatient.gender}
                    </p>
                  </div>
                )}
                {selectedPatient.bloodType && (
                  <div>
                    <p className="text-muted-foreground">Blood Type</p>
                    <p className="font-medium text-foreground">
                      {selectedPatient.bloodType}
                    </p>
                  </div>
                )}
              </div>

              {selectedPatient.lastVisit && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Last Visit</p>
                  <p className="font-medium text-foreground">
                    {selectedPatient.lastVisit}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                {selectedPatient.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">📞</span>
                    <span className="truncate text-foreground">
                      {selectedPatient.phone}
                    </span>
                  </div>
                )}
                {selectedPatient.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">✉️</span>
                    <span className="truncate text-foreground">
                      {selectedPatient.email}
                    </span>
                  </div>
                )}
                {selectedPatient.address && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">📍</span>
                    <span className="text-xs sm:text-sm text-foreground">
                      {selectedPatient.address}
                    </span>
                  </div>
                )}
                {selectedPatient.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">🎂</span>
                    <span className="text-foreground">
                      DOB: {formatDate(selectedPatient.dateOfBirth)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Modal */}
      {renderEditModal()}
    </ProtectedRoute>
  );
}
