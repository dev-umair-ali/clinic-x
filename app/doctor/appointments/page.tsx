"use client";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Calendar, List } from "lucide-react";
import StatsCards from "@/components/DoctorAppointments-components/StatsCards";
import ViewToggle from "@/components/DoctorAppointments-components/ViewToggle";
import CalendarView from "@/components/DoctorAppointments-components/CalendarView";
import AppointmentList from "@/components/DoctorAppointments-components/AppointmentList";
import PatientModal from "@/components/DoctorAppointments-components/PatientModal";
import EditAppointmentModal from "@/components/DoctorAppointments-components/EditAppointmentModal";
import AppointmentBookingModal from "@/components/DoctorAppointments-components/AppointmentBookingModal";
import useAppointments from "@/components/DoctorAppointments-components/hooks/useAppointments";
import useStats from "@/components/DoctorAppointments-components/hooks/useStats";
import { DoctorAppointment, PatientDetails } from "@/lib/api/services/appointmentService";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Procedure from "@/components/patients/Procedure";
import { patientOnboardingService } from "@/lib/api/services/patientOnboardingService";

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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<DoctorAppointment | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const initialFetchDone = useRef(false);
  const lastFetchedCalendarMonth = useRef<string>("");

  // NEW – navigation states
  const [view, setView] = useState<"list" | "procedure">("list");
  const [activeAppointment, setActiveAppointment] = useState<DoctorAppointment | null>(null);

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
    if (authUser?.id && appointments.length === 0 && !loading && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchList();
    }
  }, [authUser?.id]);

  useEffect(() => {
    if (!authUser?.id) return;
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
    } catch {}
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
    } catch {}
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
    } catch {}
  };

  const handleEditAppointment = (apt: DoctorAppointment) => {
    setEditingAppointment(apt);
    setShowEditModal(true);
  };

  // NEW – switch to Procedure view
  const handleStartVisit = async (apt: DoctorAppointment) => {
    // Fetch complete patient details first
    if (!apt._id) return;
    
    console.log('🚀 Starting visit for appointment:', apt._id);
    console.log('🚀 Appointment patient data:', apt.patient);
    
    try {
      // Try to fetch patient details from API first
      let patientData;
      let patientForms = null;
      
      try {
        console.log('🔄 Fetching patient details...');
        const p = await fetchPatientDetails(apt._id);
        console.log('✅ Patient details fetched:', p._id);
        console.log('📋 Patient object:', p);
        
        patientData = {
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
          appointment: apt,
        };

        console.log('📋 patientData created:', patientData);

        // Fetch patient onboarding forms
        try {
          console.log('🔍 Fetching patient forms for patient ID:', p._id);
          console.log('🔍 patientOnboardingService available?', !!patientOnboardingService);
          console.log('🔍 patientOnboardingService.forms available?', !!patientOnboardingService?.forms);
          console.log('🔍 getFormsByPatientId available?', !!patientOnboardingService?.forms?.getFormsByPatientId);
          
          const formsResponse = await patientOnboardingService.forms.getFormsByPatientId(p._id);
          console.log('📦 Full forms response:', formsResponse);
          if (formsResponse.success && formsResponse.data) {
            // formsResponse.data is the entire patient object with populated forms
            patientForms = formsResponse.data;
            console.log('✅ Patient data with forms loaded successfully');
            console.log('📋 Available form fields:', Object.keys(patientForms).filter(key => key.includes('Form') || key.includes('form')));
            console.log('📄 historyHealthForm:', patientForms.historyHealthForm);
            console.log('💳 insuranceForm:', patientForms.insuranceForm);
            console.log('🏃 lifeStyleForm:', patientForms.lifeStyleForm);
            console.log('🦷 dentalHistoryForm:', patientForms.dentalHistoryForm);
            console.log('📋 constantLegalForm:', patientForms.constantLegalForm);
            console.log('👤 onboardingForm:', patientForms.onboardingForm);
          } else {
            console.warn('⚠️ Forms response unsuccessful or no data:', formsResponse);
          }
        } catch (formError) {
          console.error('❌ Error loading patient forms:', formError);
        }
      } catch (apiError) {
        console.warn('⚠️ fetchPatientDetails failed, using fallback:', apiError);
        // Fallback: Use patient data from the appointment object
        const p = apt.patient || apt.patientId;
        
        if (!p) {
          throw new Error("No patient data available in appointment");
        }
        
        // Handle both populated patient object and patient ID string
        if (typeof p === 'string') {
          // If it's just an ID, create minimal patient data
          patientData = {
            _id: p,
            name: apt.patientName || "Unknown Patient",
            patientId: `#PAT-${p.slice(-6)}`,
            email: "",
            phone: "",
            dateOfBirth: "",
            age: 0,
            gender: "",
            bloodType: "",
            address: "",
            avatar: "",
            lastVisit: "",
            appointment: apt,
          };
        } else {
          // If it's a populated object, use it directly
          patientData = {
            _id: (p as any)._id || (p as any).id,
            name: (p as any).name || apt.patientName || "Unknown Patient",
            patientId: (p as any).patientId || `#PAT-${((p as any)._id || (p as any).id || '').slice(-6)}`,
            email: (p as any).email || "",
            phone: (p as any).phone || "",
            dateOfBirth: (p as any).dateOfBirth || "",
            age: calculateAge((p as any).dateOfBirth),
            gender: (p as any).gender || "",
            bloodType: (p as any).bloodType || "",
            address: (p as any).address || "",
            avatar: (p as any).avatar || "",
            lastVisit: (p as any).lastVisit || "",
            appointment: apt,
          };
        }
      }
      
      // Always try to fetch forms, regardless of whether patient details succeeded
      console.log('🔎 Checking if should fetch forms. patientForms:', patientForms, 'patientData._id:', patientData?._id);
      if (!patientForms && patientData?._id) {
        try {
          console.log('🔍 [Fallback] Fetching patient forms for patient ID:', patientData._id);
          const formsResponse = await patientOnboardingService.forms.getFormsByPatientId(patientData._id);
          console.log('📦 [Fallback] Full forms response:', formsResponse);
          if (formsResponse.success && formsResponse.data) {
            patientForms = formsResponse.data;
            console.log('✅ [Fallback] Patient data with forms loaded successfully');
            console.log('📋 [Fallback] Complete forms data:', JSON.stringify(patientForms, null, 2));
            console.log('📋 [Fallback] Available form fields:', Object.keys(patientForms).filter(key => key.includes('Form') || key.includes('form') || key.includes('History') || key.includes('Style') || key.includes('Legal') || key.includes('Boarding')));
            console.log('📄 onBoarding:', patientForms.onBoarding);
            console.log('💳 insurance:', patientForms.insurance);
            console.log('🏥 history:', patientForms.history);
            console.log('🏃 lifeStyle:', patientForms.lifeStyle);
            console.log('🦷 dentalHistory:', patientForms.dentalHistory);
            console.log('📋 constantLegal:', patientForms.constantLegal);
          } else {
            console.warn('⚠️ [Fallback] Forms response unsuccessful or no data:', formsResponse);
          }
        } catch (formError) {
          console.error('❌ [Fallback] Error loading patient forms:', formError);
        }
      }
      
      // Attach forms data to patient object
      const patientWithForms = {
        ...patientData,
        forms: patientForms
      };
      
      setActiveAppointment({ ...apt, patient: patientWithForms } as any);
      setView("procedure");
      
      // Update status to in-progress after setting the view
      await handleStatusUpdate(apt._id, "in-progress");
    } catch (e) {
      console.error("Error in handleStartVisit:", e);
    }
  };

  const handleAppointmentChange = () => {
    if (!authUser?.id) return;
    if (viewMode === "calendar") {
      const { startDate, endDate } = getMonthRange(currentMonth);
      const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
      lastFetchedCalendarMonth.current = monthKey;
      fetchCalendar(startDate, endDate);
    } else {
      fetchList();
    }
  };

  const calendarEvents = useMemo(() => {
    return appointments.map((apt: any) => {
      let dateStr = "";
      if (apt.dateTime) {
        const d = new Date(apt.dateTime);
        dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      } else if (apt.date) {
        const d = typeof apt.date === "string" ? new Date(apt.date) : apt.date;
        dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
      const normalized = { ...apt, _id: apt._id || apt.id, id: apt.id || apt._id };
      return {
        id: apt._id || apt.id,
        title: `${apt.patientName || (typeof apt.patient === "object" ? apt.patient?.name : "Patient")} - ${apt.type || apt.service || "appointment"}`,
        date: dateStr,
        type: ((apt.type || apt.service)?.toLowerCase() || "appointment") as any,
        appointment: normalized,
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
            view === "procedure" && activeAppointment && activeAppointment.patient ? (
              <Procedure
                patient={activeAppointment.patient}
                doctorId={authUser?.doctorId || authUser?.id || ""}
                goBack={() => {
                  setView("list");
                  setActiveAppointment(null);
                  // Refresh appointments list
                  fetchList();
                }}
              />
            ) : (
              <>
                <StatsCards data={statsData} />
                <div className="mb-6 flex justify-end">
                  <Button onClick={() => setShowBookingModal(true)} className="w-full sm:w-auto" size="lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
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
                  onPatientClick={handlePatientClick}
                  onEdit={handleEditAppointment}
                  onStartVisit={handleStartVisit}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </>
            )
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

      <PatientModal open={showPatientModal} setOpen={setShowPatientModal} patient={selectedPatient} />
      <EditAppointmentModal
        open={showEditModal}
        setOpen={setShowEditModal}
        appointment={editingAppointment}
        doctorId={authUser?.doctorId || authUser?.id || ""}
        onSaved={() => {
          setShowEditModal(false);
          if (viewMode === "calendar") fetchCalendar();
          else fetchList();
        }}
        onError={(message) => {
          // Error handling can be added here if needed
          console.error("Edit appointment error:", message);
        }}
      />
      <AppointmentBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDate={new Date()}
        doctorId={authUser?.doctorId || authUser?.id || ""}
        onSuccess={() => {
          setShowBookingModal(false);
          handleAppointmentChange();
        }}
      />
      <Toaster />
    </ProtectedRoute>
  );
}