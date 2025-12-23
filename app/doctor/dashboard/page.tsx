"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { CalendlyConnection, checkCalendlyStatus } from "@/components/calendly-connection";

export default function DoctorDashboard() {
  // Mock user data for UI replication
  const user = { name: "Steven Adesanya" };
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [showMedicalDashboard, setShowMedicalDashboard] = useState(false);
  const [showCalendlyDialog, setShowCalendlyDialog] = useState(false);
  const [isCalendlyConnected, setIsCalendlyConnected] = useState<boolean>(false);

  useEffect(() => {
    console.log("authUser", authUser);
    const checkStatus = async () => {
      if (authUser?.role === 'doctor') {
        const doctorId = (authUser as any)?.doctorId;
        if (doctorId) {
          try {
            const connected = await checkCalendlyStatus(doctorId);
            console.log("connected", connected);
            setIsCalendlyConnected(connected);
            if (!connected) {
              setShowCalendlyDialog(true);
            }
          } catch (error: any) {
            console.error('Error checking Calendly status:', error);
          }
        }
      }
    };

    checkStatus();
  }, [authUser]);

  const handleGoToAppointments = () => {
    setShowMedicalDashboard(true);
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

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Welcome Section */}
          <div className="p-4">
            <HeaderBanner
              userName="Dr. Smith"
              date="Today"
              onGoToAppointments={handleGoToAppointments}
            />
          </div>

          {/* Clinic X Saved You Section */}
          <AISavingsSection />

          {/* Appointments Overview */}
          <AppointmentsOverviewSection />

          {/* Payment Distribution & Weekly Collection Goal */}
          <PaymentCollectionSection />

          {/* Billing Insights */}
          <BillingInsightsSection />

          {/* Prescriptions Trends */}
          <div className="">
            <PrescriptionsSection />
          </div>

          {/* Patient Notes & Credit Usage */}
          <NotesCreditSection />

          {/* Task Reminders & Progress Tracking */}
          <RemindersProgressSection />
        </div>
      </div>

      {/* Calendly Connection Dialog */}
      <Dialog open={showCalendlyDialog} onOpenChange={() => { }}>
        <DialogContent className="[&>button.absolute]:hidden">
          <DialogHeader>
            <DialogTitle>Calendly Not Connected</DialogTitle>
            <DialogDescription>
              You are not connected to Calendly. Please connect to it to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {authUser && ((authUser as any)?._id || authUser?.id) && (
              (() => {
                const doctorId = (authUser as any)?._id || authUser?.id || "";
                return (
                  <CalendlyConnection
                    userId={doctorId}
                    doctorId={doctorId}
                    onConnectionChange={handleConnectionChange}
                  />
                );
              })()
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}