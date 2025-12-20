"use client";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useState, useEffect } from "react";
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
      if (viewMode === "calendar") fetchCalendar();
      else fetchList();
    } catch (e: any) {
      // error already surfaced via hook
    }
  };

  const handleCreateAppointment = async (data: any) => {
    try {
      await createAppointment(data);
      if (viewMode === "calendar") fetchCalendar();
      else fetchList();
    } catch (e: any) {
      // error already surfaced via hook
    }
  };

  const handleEditAppointment = (apt: DoctorAppointment) => {
    setEditingAppointment(apt);
    setShowEditModal(true);
  };

  const calendarEvents = appointments.map((apt) => ({
    id: apt._id,
    title: `${apt.patientName || apt.patient?.name|| "Patient"} - ${apt.type || "appointment"}`,
    date: apt.dateTime.split("T")[0],
    type: (apt.type?.toLowerCase() || "appointment") as any,
  }));

  const statsData = [
    { title: "Hours Available This Week", value: stats.hoursAvailable, icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Appointments Booked", value: stats.appointmentsBooked, icon: <List className="h-4 w-4 sm:h-5 sm:w-5" />, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20" },
    { title: "Next Available Slot", value: stats.nextAvailableSlot, icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Calendly Integrationsdsd</h1>
            <StatsCards data={statsData} />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              <ViewToggle
                viewMode={viewMode}
                setViewMode={setViewMode}
                onCalendar={() => fetchCalendar()}
                onList={() => fetchList()}
              />
            </div>
          </div>

          {viewMode === "calendar" ? (
            <CalendarView
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              calendarEvents={calendarEvents}
            />
          ) : (
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
    </ProtectedRoute>
  );
}