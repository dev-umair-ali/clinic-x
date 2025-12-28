"use client";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, List } from "lucide-react";
import StatsCards from "@/components/DoctorAppointments-components/StatsCards";
import ViewToggle from "@/components/DoctorAppointments-components/ViewToggle";
import CalendarView from "@/components/DoctorAppointments-components/CalendarView";
import AppointmentList from "@/components/DoctorAppointments-components/AppointmentList";
import PatientModal from "@/components/DoctorAppointments-components/PatientModal";
import EditAppointmentModal from "@/components/DoctorAppointments-components/EditAppointmentModal";
import useAppointments from "@/components/DoctorAppointments-components/hooks/useAppointments";
import useStats from "@/components/DoctorAppointments-components/hooks/useStats";
import { DoctorAppointment, PatientDetails } from "@/lib/api/services/appointmentService";
import { Toaster } from "@/components/ui/toaster";

function calculateAge(dob?: string): number {
  if (!dob) return 0;
  const b = new Date(dob);
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
}

export default function DoctorAppointments() {
  const router = useRouter();
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedFilter, setSelectedFilter] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<DoctorAppointment | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper to get month date range - wrapped in useCallback
  const getMonthRange = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  }, []);

  const {
    appointments,
    loading,
    error,
    totalPages,
    fetchList,
    fetchCalendar,
    fetchAppointmentListView,
    fetchPatientDetails,
    updateStatus,
    createAppointment,
    updateAppointment,
  } = useAppointments(viewMode, selectedFilter, searchQuery, currentPage, pageLimit);

  const stats = useStats(appointments);

  useEffect(() => {
    if (authUser?.id && appointments.length === 0 && !loading) {
      fetchAppointmentListView(authUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  // Fetch appointments when view mode or month changes
  useEffect(() => {
    if (viewMode === "calendar") {
      const { startDate, endDate } = getMonthRange(currentMonth);
      fetchCalendar(startDate, endDate);
    } else {
      if (authUser?.id) {
        fetchAppointmentListView(authUser.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentMonth.getFullYear(), currentMonth.getMonth()]);

  const handlePatientClick = async (apt: DoctorAppointment) => {
    if (!apt._id) return;
    try {
      const p = await fetchPatientDetails(apt._id);
      const details: PatientDetails = {
        _id: p._id,
        name: p.name,
        patientId: p.patientId || `#PAT-${p._id.slice(-6)}`,
        email: p.email,
        phone: p.phone,
        dateOfBirth: p.dateOfBirth,
        age: calculateAge(p.dateOfBirth),
        gender: p.gender,
        bloodType: p.bloodType,
        address: p.address,
        avatar: p.avatar,
        lastVisit: p.lastVisit,
      };
      setSelectedPatient(details);
      setShowPatientModal(true);
    } catch (e: any) {
      // error already surfaced via hook
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
      if (viewMode === "calendar") {
        const { startDate, endDate } = getMonthRange(currentMonth);
        fetchCalendar(startDate, endDate);
      } else {
        fetchList();
      }
    } catch (e: any) {
      // error already surfaced via hook
    }
  };

  const handleCreateAppointment = async (data: any) => {
    try {
      await createAppointment(data);
      if (viewMode === "calendar") {
        const { startDate, endDate } = getMonthRange(currentMonth);
        fetchCalendar(startDate, endDate);
      } else {
        fetchList();
      }
    } catch (e: any) {
      // error already surfaced via hook
    }
  };

  const handleEditAppointment = (apt: DoctorAppointment) => {
    setEditingAppointment(apt);
    setShowEditModal(true);
  };

  const handleAppointmentChange = () => {
    // Refresh the appointments list when an appointment is created, updated, or cancelled
    if (authUser?.id) {
      if (viewMode === "calendar") {
        const { startDate, endDate } = getMonthRange(currentMonth);
        fetchCalendar(startDate, endDate);
      } else {
        fetchAppointmentListView(authUser.id);
      }
    }
  };

  const calendarEvents = useMemo(() => {
    return appointments.map((apt: any) => {
      // Handle both dateTime (ISO string) and separate date fields
      let dateStr = '';
      
      if (apt.dateTime) {
        // Parse the ISO string and format as local date YYYY-MM-DD
        const date = new Date(apt.dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else if (apt.date) {
        // If date is a Date object or string, convert to local YYYY-MM-DD format
        const dateObj = typeof apt.date === 'string' ? new Date(apt.date) : apt.date;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      }
      
      // Normalize the appointment object to ensure _id exists for the modal
      const normalizedAppointment = {
        ...apt,
        _id: apt._id || apt.id, // Ensure _id exists (calendar API uses 'id', list API uses '_id')
        id: apt.id || apt._id,  // Keep id as well for compatibility
      };
      
      return {
        id: apt._id || apt.id,
        title: `${apt.patientName || (typeof apt.patient === 'object' ? apt.patient?.name : "Patient")} - ${apt.type || apt.service || "appointment"}`,
        date: dateStr,
        type: ((apt.type || apt.service)?.toLowerCase() || "appointment") as any,
        appointment: normalizedAppointment, // Include normalized appointment data
      };
    });
  }, [appointments]);

  const statsData = [
    { title: "Hours Available This Week", value: stats.hoursAvailable, icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, color: "text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]", bgColor: "bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)]" },
    { title: "Appointments Booked", value: stats.appointmentsBooked, icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, color: "text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]", bgColor: "bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.2)]" },
    { title: "Next Available Slot", value: stats.nextAvailableSlot, icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, color: "text-[hsl(var(--color-status-warning))] dark:text-[hsl(var(--color-status-warning))]", bgColor: "bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)]" },
  ];

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] mb-4 sm:mb-6">Appointments</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              <ViewToggle
                viewMode={viewMode}
                setViewMode={setViewMode}
                onCalendar={() => fetchCalendar()}
                onList={() => fetchList()}
              />
            </div>
          </div>

          {viewMode === "list" ? (
            <>
              <StatsCards data={statsData} />
              <AppointmentList
                loading={loading}
                error={error}
                appointments={appointments}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                onStatusUpdate={handleStatusUpdate}
                onPatientClick={handlePatientClick}
                onEdit={handleEditAppointment}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </>
          ) : (
            <CalendarView
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              calendarEvents={calendarEvents}
              doctorId={authUser?.doctorId || ""}
              onAppointmentChange={handleAppointmentChange}
            />
          )}
        </div>
      </div>

      <PatientModal
        open={showPatientModal}
        setOpen={setShowPatientModal}
        patient={selectedPatient}
      />

      <EditAppointmentModal
        open={showEditModal}
        setOpen={setShowEditModal}
        appointment={editingAppointment}
        onSaved={() => {
          setShowEditModal(false);
          if (viewMode === "calendar") fetchCalendar();
          else fetchList();
        }}
        onError={(m) => {
          // surface via toast or setError if desired
        }}
      />
      
      <Toaster />
    </ProtectedRoute>
  );
}