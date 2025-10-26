"use client";

import { useState } from "react";
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

// Add this interface at the top after the imports
interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "appointment" | "follow-up" | "consultation" | "check-up";
}

interface PatientDetails {
  id: string;
  name: string;
  patientId: string;
  age: number;
  gender: string;
  bloodType: string;
  lastVisit: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  avatar: string;
}

const mockPatientDetails: PatientDetails = {
  id: "1",
  name: "Sarah Johnson",
  patientId: "#PAT-2024-001",
  age: 32,
  gender: "Female",
  bloodType: "O+",
  lastVisit: "Dec 15, 2024",
  phone: "(555) 123-4567",
  email: "sarah.johnson@email.com",
  address: "123 Main St, City, State 12345",
  dob: "March 15, 1992",
  avatar: "/professional-woman.png",
};

export default function DoctorAppointments() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(
    null
  );
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6)); // July 2025
  const [selectedFilter, setSelectedFilter] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 0, 15)); // January 15, 2024
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [editPatientName, setEditPatientName] = useState("");
  const [editCalendarMonth, setEditCalendarMonth] = useState(new Date(2024, 0)); // January 2024
  const [showCalendar, setShowCalendar] = useState(false);

  const mockAppointments = [
    {
      id: "1",
      patientName: "Emma Wilson",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "consultation",
      status: "pending",
    },
    {
      id: "2",
      patientName: "Emma Wilson",
      date: "2024-01-15",
      time: "11:00 AM",
      type: "consultation",
      status: "pending",
    },
    {
      id: "3",
      patientName: "Emma Wilson",
      date: "2024-01-15",
      time: "2:00 PM",
      type: "consultation",
      status: "pending",
    },
  ];

  const calendarEvents: CalendarEvent[] = mockAppointments.map((apt) => ({
    id: apt.id,
    title: `${apt.patientName} - ${apt.type}`,
    date: apt.date,
    type: apt.type.toLowerCase() as
      | "appointment"
      | "follow-up"
      | "consultation"
      | "check-up",
  }));

  const stats = [
    {
      title: "Hours Available This Week",
      value: "32",
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Appointments Booked",
      value: mockAppointments.length.toString(),
      icon: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Next Available Slot",
      value: "Today 2:00 PM",
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const handlePatientClick = (patient: PatientDetails) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
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
            {days.map((day, index) => (
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

                {/* Sample appointments - responsive */}
                {day.date === 3 && day.isCurrentMonth && (
                  <div className="mt-1 space-y-1">
                    <div className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 px-1 py-0.5 rounded truncate">
                      Follow-up
                    </div>
                    <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded truncate hidden sm:block">
                      New Consultation
                    </div>
                  </div>
                )}

                {day.date === 13 && day.isCurrentMonth && (
                  <div className="mt-1">
                    <div className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-1 py-0.5 rounded">
                      Busy
                    </div>
                  </div>
                )}

                {day.date === 22 && day.isCurrentMonth && (
                  <div className="mt-1">
                    <div className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 px-1 py-0.5 rounded truncate">
                      Follow-up
                    </div>
                  </div>
                )}

                {day.date === 23 && day.isCurrentMonth && (
                  <div className="mt-1 space-y-1">
                    <div className="text-xs bg-green-600 text-white px-1 py-0.5 rounded truncate">
                      Post Dental
                    </div>
                    <div className="text-xs bg-teal-600 text-white px-1 py-0.5 rounded truncate hidden sm:block">
                      09:00 AM
                    </div>
                  </div>
                )}
              </div>
            ))}
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

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {mockAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-muted/50 rounded-lg p-4 border border-border"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <button
                      onClick={() => handlePatientClick(mockPatientDetails)}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {appointment.patientName}
                    </button>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date}
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
                      <DropdownMenuItem>Mark Complete</DropdownMenuItem>
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
                    {appointment.type}
                  </span>
                  <Select
                    defaultValue={appointment.status}
                    onValueChange={(value) => {
                      console.log(
                        "Status changed for appointment",
                        appointment.id,
                        "to:",
                        value
                      );
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-hidden rounded-lg border border-border">
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
                {mockAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePatientClick(mockPatientDetails)}
                        className="text-sm text-foreground hover:text-primary font-medium"
                      >
                        {appointment.patientName}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {appointment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        defaultValue={appointment.status}
                        onValueChange={(value) => {
                          console.log(
                            "Status changed for appointment",
                            appointment.id,
                            "to:",
                            value
                          );
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Canceled">Canceled</SelectItem>
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
                          <DropdownMenuItem>Mark Complete</DropdownMenuItem>
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                onClick={() => console.log("Previous page")}
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => console.log("Page 1 clicked")}
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Page 2 clicked")}
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Next page")}
              >
                Next
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">10 /Pages</span>
          </div>
        </div>
      </div>
    );
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditPatientName(appointment.patientName);
    setSelectedTimeSlot("04:00 PM - 06:00 PM"); // Set default selected slot
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
              onClick={() => {
                console.log("Saving appointment changes:", {
                  appointmentId: editingAppointment?.id,
                  patientName: editPatientName,
                  selectedDate: selectedDate,
                  selectedTimeSlot: selectedTimeSlot,
                  originalAppointment: editingAppointment,
                });
                setShowEditModal(false);
                // Here you would typically make an API call to save the changes
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
              {stats.map((stat, index) => (
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
                    console.log("Switched to calendar view");
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
                    console.log("Switched to list view");
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
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium text-foreground">
                    {selectedPatient.age} years
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium text-foreground">
                    {selectedPatient.gender}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blood Type</p>
                  <p className="font-medium text-foreground">
                    {selectedPatient.bloodType}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Last Visit</p>
                <p className="font-medium text-foreground">
                  {selectedPatient.lastVisit}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📞</span>
                  <span className="truncate text-foreground">
                    {selectedPatient.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">✉️</span>
                  <span className="truncate text-foreground">
                    {selectedPatient.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📍</span>
                  <span className="text-xs sm:text-sm text-foreground">
                    {selectedPatient.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">🎂</span>
                  <span className="text-foreground">
                    DOB: {selectedPatient.dob}
                  </span>
                </div>
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
