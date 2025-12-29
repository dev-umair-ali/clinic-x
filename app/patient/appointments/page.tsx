"use client";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Calendar, List } from "lucide-react";
import ViewToggle from "@/components/PatientAppointments-components/ViewToggle";
import CalendarView from "@/components/PatientAppointments-components/CalendarView";
import AppointmentList from "@/components/PatientAppointments-components/AppointmentList";
import DoctorModal from "@/components/PatientAppointments-components/DoctorModal";
import EditAppointmentModal from "@/components/PatientAppointments-components/EditAppointmentModal";
import AppointmentBookingModal from "@/components/PatientAppointments-components/AppointmentBookingModal";
import useAppointments from "@/components/PatientAppointments-components/hooks/useAppointments";
import { DoctorAppointment } from "@/lib/api/services/appointmentService";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

export default function PatientAppointments() {
  const router = useRouter();
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  // Debug auth state
  useEffect(() => {
    console.log("🔍 PatientAppointments Page - Auth User:", {
      userId: authUser?.id,
      userName: authUser?.name,
      userRole: authUser?.role,
      fullUser: authUser,
    });
  }, [authUser]);

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedFilter, setSelectedFilter] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<DoctorAppointment | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const initialFetchDone = useRef(false);
  const lastFetchedCalendarMonth = useRef<string>("");

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
    fetchDoctorDetails,
    updateStatus,
    createAppointment,
    updateAppointment,
  } = useAppointments(viewMode, selectedFilter, searchQuery, currentPage, pageLimit);

  // Get user ID - for patients, prefer patientId over user id
  const userId = authUser?.patientId || authUser?.id || (authUser as any)?._id;

  useEffect(() => {
    if (userId && appointments.length === 0 && !loading && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchList();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    if (viewMode === "calendar") {
      const { startDate, endDate } = getMonthRange(currentMonth);
      const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
      
      if (lastFetchedCalendarMonth.current !== monthKey) {
        lastFetchedCalendarMonth.current = monthKey;
        fetchCalendar(startDate, endDate);
      }
    } else {
      if (appointments.length === 0 && !initialFetchDone.current) {
        initialFetchDone.current = true;
        fetchList();
      }
    }
  }, [viewMode, currentMonth.getFullYear(), currentMonth.getMonth()]);

  const handleDoctorClick = async (apt: DoctorAppointment) => {
    if (!apt._id) return;
    try {
      const doctor = await fetchDoctorDetails(apt._id);
      setSelectedDoctor(doctor);
      setShowDoctorModal(true);
    } catch (e: any) {
      // error handled by hook
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
      // error handled by hook
    }
  };

  const handleEditAppointment = (apt: DoctorAppointment) => {
    setEditingAppointment(apt);
    setShowEditModal(true);
  };

  const handleAppointmentChange = () => {
    if (userId) {
      if (viewMode === "calendar") {
        const { startDate, endDate } = getMonthRange(currentMonth);
        const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        lastFetchedCalendarMonth.current = monthKey;
        fetchCalendar(startDate, endDate);
      } else {
        fetchList();
      }
    }
  };

  const calendarEvents = useMemo(() => {
    return appointments.map((apt: any) => {
      let dateStr = '';
      
      if (apt.dateTime) {
        const date = new Date(apt.dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else if (apt.date) {
        const dateObj = typeof apt.date === 'string' ? new Date(apt.date) : apt.date;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      }
      
      const normalizedAppointment = {
        ...apt,
        _id: apt._id || apt.id,
        id: apt.id || apt._id,
      };
      
      return {
        id: apt._id || apt.id,
        title: `Dr. ${apt.doctorName || (typeof apt.doctor === 'object' ? apt.doctor?.name : "Doctor")} - ${apt.type || apt.service || "appointment"}`,
        date: dateStr,
        type: ((apt.type || apt.service)?.toLowerCase() || "appointment") as any,
        appointment: normalizedAppointment,
      };
    });
  }, [appointments]);

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] mb-4 sm:mb-6">My Appointments</h1>
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
              {/* New Appointment Button */}
              <div className="mb-6 flex justify-end">
                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Appointment
                </Button>
              </div>
              
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
                onDoctorClick={handleDoctorClick}
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
              patientId={userId || ""}
              onAppointmentChange={handleAppointmentChange}
            />
          )}
        </div>
      </div>

      <DoctorModal
        open={showDoctorModal}
        setOpen={setShowDoctorModal}
        doctor={selectedDoctor}
      />

      <EditAppointmentModal
        open={showEditModal}
        setOpen={setShowEditModal}
        appointment={editingAppointment}
        onSaved={() => {
          setShowEditModal(false);
          handleAppointmentChange();
        }}
        onError={(m) => {}}
      />
      
      <AppointmentBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDate={new Date()}
        patientId={authUser?.id || ""}
        onSuccess={() => {
          setShowBookingModal(false);
          handleAppointmentChange();
        }}
      />
      
      <Toaster />
    </ProtectedRoute>
  );
}
