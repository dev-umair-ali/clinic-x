"use client";

import { useSearchParams } from "next/navigation";
import Procedure from "@/components/patients/Procedure"; // <-- the big component you pasted

export default function DoctorProcedurePage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? "";

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

  return <Procedure patient={mockPatient} goBack={goBack} />;
}