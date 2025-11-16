"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

function CalendlyCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const doctorId = searchParams.get("doctorId");
    const doctorName = searchParams.get("doctorName");
    const calendlyConnected = searchParams.get("calendlyConnected");

    if (success === "true") {
      // Show success message
      toast({
        title: "✅ Calendly Connected!",
        description: `Successfully connected Calendly for ${doctorName || "your account"}`,
      });

      // Redirect to doctor dashboard or settings page
      // Update this path based on where you want to redirect after success
      setTimeout(() => {
        router.push("/doctor/dashboard");
        // or router.push("/settings/doctor");
      }, 1500);
    } else if (error) {
      // Handle different error types
      let errorMessage = "Failed to connect Calendly. Please try again.";
      
      switch (error) {
        case "doctor_not_found":
          errorMessage = "Doctor profile not found. Please try again or contact support.";
          break;
        case "oauth_failed":
          const message = searchParams.get("message");
          errorMessage = `OAuth failed: ${message || "Unknown error"}`;
          break;
        case "invalid_callback":
          errorMessage = "Invalid callback parameters. Please try connecting again.";
          break;
        default:
          errorMessage = `Connection failed: ${error}`;
      }

      toast({
        title: "❌ Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Redirect back to settings or dashboard
      setTimeout(() => {
        router.push("/doctor/dashboard");
        // or router.push("/settings/doctor");
      }, 2000);
    } else {
      // No success or error parameter - shouldn't happen
      toast({
        title: "Invalid Callback",
        description: "No status information received from Calendly.",
        variant: "destructive",
      });

      setTimeout(() => {
        router.push("/doctor/dashboard");
      }, 2000);
    }
  }, [searchParams, router, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <h2 className="text-xl font-semibold">Processing Calendly Connection...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we complete the setup.</p>
      </div>
    </div>
  );
}

export default function CalendlyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    }>
      <CalendlyCallbackContent />
    </Suspense>
  );
}