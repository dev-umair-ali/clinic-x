"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { HeaderBanner } from "@/app/doctor/doctor-charts/header-banner";
import { AISavingsSection } from "@/app/doctor/doctor-charts/ai-savings-section";
import AppointmentsOverviewSection from "@/components/appointments-overview-section";
import { PaymentCollectionSection } from "@/app/doctor/doctor-charts/payment-collection-section";
import { BillingInsightsSection } from "@/app/doctor/doctor-charts/billing-insights-section";
import { PrescriptionsSection } from "@/app/doctor/doctor-charts/prescriptions-section";
import { NotesCreditSection } from "@/app/doctor/doctor-charts/notes-credit-section";
import { RemindersProgressSection } from "@/app/doctor/doctor-charts/reminders-progress-section";
import { MedicalDashboard } from "@/app/doctor/doctor-charts/medical-dashboard";

export default function DoctorDashboard() {
  // Mock user data for UI replication
  const user = { name: "Steven Adesanya" };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [showMedicalDashboard, setShowMedicalDashboard] = useState(false);

  const handleGoToAppointments = () => {
    setShowMedicalDashboard(true);
  };

  const handleBackToDashboard = () => {
    setShowMedicalDashboard(false);
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
      <div className="flex-1 overflow-y-auto p-6 bg-background">
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
    </ProtectedRoute>
  );
}
