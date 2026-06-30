"use client";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/lib/store";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ViewToggle from "@/components/PatientAppointments-components/ViewToggle";
import CalendarView from "@/components/PatientAppointments-components/CalendarView";
import AppointmentList from "@/components/PatientAppointments-components/AppointmentList";
import AppointmentBookingModal from "@/components/PatientAppointments-components/AppointmentBookingModal";
import { DoctorAppointment } from "@/lib/api/services/appointmentService";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  appointmentService,
} from "@/lib/api/services/appointmentService";

export default function ClinicAppointments() {
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const role = authUser?.role;

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedFilter, setSelectedFilter] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [currentPage, setCurrentPage] = useState(1);

  const [showBookingModal, setShowBookingModal] = useState(false);
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
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = authUser?.clinicId;

  const fetchList = async () => {

    setLoading(true);
    setError(null);
    try {
      if (!authUser?.clinicId) {
        throw new Error("Clinic ID is missing");
      }
      if (!role) {
        throw new Error("User role is missing");
      }
      const res = await appointmentService.getClinicAppointments(authUser.clinicId);
      const appointmentsArray = res?.appointments;
      if (res?.success && Array.isArray(appointmentsArray)) {
        let appts = appointmentsArray;

        if (searchQuery?.trim()) {
          const query = searchQuery.toLowerCase();
          appts = appts.filter((apt: any) => {
            const doctorName = apt.doctorName ||
              (typeof apt.doctor === 'object' ? apt.doctor?.name : '') || '';
            return doctorName.toLowerCase().includes(query);
          });
        }

        setAppointments(appts);
      } else {
        setAppointments([]);
        setError(res?.message || "No appointments found");
      }
    } catch (e: any) {
      const msg = e.message || e.response?.data?.message || "Failed to fetch appointments";
      setError(msg);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && appointments.length === 0 && !loading && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchList();
    }
  }, [userId]);

  useEffect(() => {

    if (appointments.length === 0 && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchList();
    }
  }, [viewMode, currentMonth.getFullYear(), currentMonth.getMonth()]);

  const handleStatusUpdate = async (id: string, status: string) => {
    if (status === "start_visit") {
      const appointment = appointments.find(apt => apt._id === id);
      if (appointment) {
        const patientId = appointment?.patientRef?._id;
        if (patientId) {
          router.push(`/doctor/appointments/start-visit?patientId=${patientId}`);
        }
      }
    }
    if (status === "completed" || status === "canceled") {
      try {
        setLoading(true);
        const res = await appointmentService.updateAppointmentStatus(role || "", id, status);
        if (res?.success) {
          fetchList();
        } else {
          alert(res?.message || "Failed to update appointment status");
        }
      } catch (e: any) {
        const msg = e.message || e.response?.data?.message || "Failed to update appointment status";
        alert(msg);
      } finally {
        setLoading(false);
      }
    };
  };


  const handleAppointmentChange = () => {
    if (userId) {
      if (viewMode === "calendar") {
        const { startDate, endDate } = getMonthRange(currentMonth);
        const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        lastFetchedCalendarMonth.current = monthKey;
        // fetchCalendar(startDate, endDate);
      } else {
        fetchList();
      }
    }
  };

  const calendarEvents = useMemo(() => {
    return appointments
      .filter((apt: any) => {
        // Filter out canceled appointments
        const status = apt.status?.toLowerCase();
        return status !== 'canceled';
      })
      .map((apt: any) => {
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
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] mb-4 sm:mb-6">My Appointments</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              <ViewToggle
                viewMode={viewMode}
                setViewMode={setViewMode}
                onCalendar={() => console.log('Switching to calendar view')}
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

              {/* Show error only if not loading and no appointments are present */}
              {!loading && error && appointments.length === 0 && (
                <div className="error-message">{error}</div>
              )}

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
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={1}
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


      <AppointmentBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDate={new Date()}
        patientId={authUser?.id || ""}
        fetchList={fetchList}
        onSuccess={() => {
          setShowBookingModal(false);
          handleAppointmentChange();
        }}
      />

      <Toaster />
    </ProtectedRoute>
  );
}