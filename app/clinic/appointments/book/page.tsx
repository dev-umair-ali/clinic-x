"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookAppointmentRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/clinic/appointments");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen text-[hsl(var(--muted-foreground))]">
      Redirecting to appointments…
    </div>
  );
}
