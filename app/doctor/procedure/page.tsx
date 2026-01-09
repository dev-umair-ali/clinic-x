"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Procedure from "@/components/patients/Procedure";

// Separate component for the content that uses useSearchParams
function ProcedureContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? "";
  const doctorId = searchParams.get("doctorId") ?? "";

  // dummy patient object for now – replace with real fetch when ready
  const mockPatient = {
    id: patientId,
    name: "Current Patient",
    patientId: `#PAT-${patientId.slice(-6)}`,
    email: "patient@mail.com",
    phone: "(555) 555-5555",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    lastVisit: "Dec 29, 2025",
    dob: "Jan 1, 1983",
    address: "123 Main St, City, State 12345",
    status: "1/2",
  };

  const goBack = () => window.history.back();

  return <Procedure patient={mockPatient} doctorId={doctorId} goBack={goBack} />;
}

// Main page component with Suspense boundary
export default function DoctorProcedurePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProcedureContent />
    </Suspense>
  );
}