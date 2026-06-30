"use client";

import { useState, useEffect } from "react";
import { themeService } from "@/lib/api/services/themeService";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useAppHooks";
import { fetchDoctorDashboard } from "@/lib/slices/dashboardSlice";
import type { RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { HeaderBanner } from "@/components/doctor-charts/header-banner";
import { AISavingsSection } from "@/components/doctor-charts/ai-savings-section";
import AppointmentsOverviewSection from "@/components/appointments-overview-section";
import { PaymentCollectionSection } from "@/components/doctor-charts/payment-collection-section";
import { BillingInsightsSection } from "@/components/doctor-charts/billing-insights-section";
import { PrescriptionsSection } from "@/components/doctor-charts/prescriptions-section";
import { NotesCreditSection } from "@/components/doctor-charts/notes-credit-section";
import { RemindersProgressSection } from "@/components/doctor-charts/reminders-progress-section";
import { MedicalDashboard } from "@/components/doctor-charts/medical-dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CalendlyConnection,
  checkGoogleCalendarStatus,
} from "@/components/calendar-connection";
import { useRouter } from "next/navigation";


export default function DoctorDashboard() {
  // Mock user data for UI replication
  const user = { name: "Steven Adesanya" };
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { data: dashboardData, loading: dashboardLoading } = useAppSelector((state) => state.dashboard.doctor);
  const router = useRouter();

  // Theme state
  const [clinicTheme, setClinicTheme] = useState<any>(null);
  const [showMedicalDashboard, setShowMedicalDashboard] = useState(false);
  const [showCalendlyDialog, setShowCalendlyDialog] = useState(false);
  const [isCalendlyConnected, setIsCalendlyConnected] = useState(false);


  // Fetch theme and check connection status on mount
  useEffect(() => {
    const userId = (authUser as any)?._id || "";
    const doctorId = (authUser as any)?.doctorId || "";
    const clinicId = (authUser as any)?.clinicId || "";
    
    // Fetch dashboard data
    if (doctorId) {
      dispatch(fetchDoctorDashboard(doctorId));
    }
    
    const fetchStatusAndTheme = async () => {
      if (!userId || !doctorId) return;

      // Fetch clinic theme if clinicId exists
      if (clinicId) {
        try {
          const themeRes = await themeService.getClinicTheme(clinicId);
          setClinicTheme(themeRes?.data?.theme || null);
        } catch (err) {
          setClinicTheme(null);
        }
      }

      try {
        const googleConnected = await checkGoogleCalendarStatus(doctorId);
        setShowCalendlyDialog(!googleConnected);
      } catch (error) {
        console.error("Error fetching Google Calendar status:", error);
      }
    };
    fetchStatusAndTheme();
  }, [authUser, dispatch]);

  const handleGoToAppointments = () => {
          router.push(`/doctor/appointments`);
  };

  const handleBackToDashboard = () => {
    setShowMedicalDashboard(false);
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsCalendlyConnected(connected);
    if (connected) {
      setShowCalendlyDialog(false);
    }
  };

  if (showMedicalDashboard) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <MedicalDashboard onBack={handleBackToDashboard} />
      </ProtectedRoute>
    );
  }

  if (dashboardLoading && !dashboardData) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))] flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Welcome Section */}
          <div className="p-4">
            <HeaderBanner
              userName={authUser?.firstName + " " + authUser?.lastName || user.name}
              date="Today"
              onGoToAppointments={handleGoToAppointments}
            />
          </div>

          {/* Clinic X Saved You Section */}
          {/* <AISavingsSection /> */}

          {/* Appointments Overview */}
          <AppointmentsOverviewSection dashboardData={dashboardData?.appointmentsOverview} />
          {/* Data available: dashboardData?.appointmentsOverview */}

          {/* Payment Distribution & Weekly Collection Goal */}
          {/* <PaymentCollectionSection /> */}

          {/* Billing Insights */}
          {/* <BillingInsightsSection /> */}

          {/* Prescriptions Trends */}
          {/* <div className="">
            <PrescriptionsSection />
          </div> */}

          {/* Patient Notes & Credit Usage */}
          <NotesCreditSection  dashboardData={dashboardData?.patientNotesGraph ?? null} />
          {/* Data available: dashboardData?.patientNotesGraph */}

          {/* Task Reminders & Progress Tracking */}
          {/* <RemindersProgressSection /> */}
        </div>
      </div>

      {/* Google Calendar Connection Dialog */}
      <Dialog open={showCalendlyDialog} onOpenChange={() => { }}>
          <DialogContent
            className="max-w-md rounded-3xl border-0 shadow-2xl overflow-hidden bg-[hsl(var(--card))] [&>button]:hidden"
            style={clinicTheme ? { borderColor: clinicTheme.primary, background: clinicTheme.secondary } : {}}
          >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[hsl(var(--color-chart-blue)/0.2)] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[hsl(var(--color-brand-teal)/0.1)] rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="space-y-5 text-center px-2 pt-8 pb-2 relative z-10">
            {/* Icon with enhanced styling */}
            <div className="mx-auto relative">
              <div className="absolute inset-0 bg-[hsl(var(--color-chart-blue)/0.3)] rounded-full blur-2xl scale-150" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--color-chart-blue))] shadow-2xl border border-[hsl(var(--color-white-alpha-20))]">
                <svg
                  className="h-10 w-10 text-[hsl(var(--sidebar-foreground))]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H18V2h-2v1H8V2H6v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
            </div>

            <DialogTitle className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              Connect Google Calendar
            </DialogTitle>

            <DialogDescription className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs">
              Sync your schedule seamlessly and never miss an appointment
            </DialogDescription>
          </DialogHeader>

          <div className="my-7 px-8 relative z-10">
            <div className="h-px bg-[hsl(var(--border))]" />
          </div>

          <div className="px-6 pb-6 relative z-10">
            <div className="bg-[hsl(var(--muted))]/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex justify-center">
                {authUser &&
                  (authUser as any)?.doctorId &&
                  (() => {
                    const doctorId = (authUser as any)?.doctorId || "";
                    return (
                      <CalendlyConnection
                        userId={doctorId}
                        doctorId={doctorId}
                        onConnectionChange={handleConnectionChange}
                        theme={clinicTheme}
                      />
                    );
                  })()}
              </div>
            </div>
          </div>

          {/* Security badge with enhanced styling */}
          <div className="px-6 pb-8 relative z-10">
            <div className="rounded-xl bg-[hsl(var(--color-status-success)/0.1)] border border-[hsl(var(--color-status-success)/0.3)] px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-xs font-semibold text-[hsl(var(--color-status-success))] flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Secure connection • Disconnect anytime
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}