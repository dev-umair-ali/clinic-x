"use client";

import { Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Procedure from "@/components/patients/Procedure";
import {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientFullDetails } from "@/lib/slices/appointmentSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { getAllOnboardingFormsForAppointment } from "@/lib/slices/onboardingSlice";

function ProcedureContent() {
  const dispatch = useDispatch<AppDispatch>();

  const params = useParams();
  const searchParams = useSearchParams();
  const patientId = (params.patientId as string) || searchParams.get("patientId") || "";
  const appointmentId = (params.appointmentId as string) || searchParams.get("appointmentId") || "";
  const { patientDetails } = useSelector((state: RootState) => state.appointments);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientFullDetails(patientId));
      dispatch(getAllOnboardingFormsForAppointment(patientId))

    }
  }, [dispatch, patientId]);

  const goBack = () => window.history.back();
  return <Procedure patient={patientDetails} goBack={goBack} appointmentId={appointmentId} patientId={patientId} />;
}

// Main page component with Suspense boundary
export default function DoctorProcedurePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProcedureContent />
    </Suspense>
  );
}