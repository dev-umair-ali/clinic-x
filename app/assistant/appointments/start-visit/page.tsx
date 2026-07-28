"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const patientId = searchParams.get("patientId") || "";
    const appointmentId = searchParams.get("appointmentId") || "";
    const qs = new URLSearchParams();
    if (patientId) qs.set("patientId", patientId);
    if (appointmentId) qs.set("appointmentId", appointmentId);
    router.replace(`/doctor/appointments/start-visit?${qs.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen text-[hsl(var(--muted-foreground))]">
      Opening visit…
    </div>
  );
}

export default function AssistantStartVisitPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <RedirectContent />
    </Suspense>
  );
}
