"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api/axios";

interface CalendlyConnectionProps {
  doctorId: string;
  onConnectionChange?: (isConnected: boolean) => void;
}

/**
 * Checks the Calendly connection status for a doctor
 * @param doctorId - The ID of the doctor
 * @returns Promise<boolean> - True if connected, false otherwise
 */
export async function checkCalendlyStatus(doctorId: string): Promise<boolean> {
  try {
    const response = await api.get(`/api/calendly/connected-status/${doctorId}`);
    return response.data?.calendlyConnected ?? false;
  } catch (error) {
    console.error("Error checking Calendly status:", error);
    return false;
  }
}

function CalendlyConnectionContent({
  doctorId,
  onConnectionChange,
}: CalendlyConnectionProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasHandledCallback, setHasHandledCallback] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Check connection status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!doctorId) return;
      
      setIsLoading(true);
      try {
        const connected = await checkCalendlyStatus(doctorId);
        setIsConnected(connected);
        onConnectionChange?.(connected);
      } catch (error) {
        console.error("Error fetching Calendly status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [doctorId, onConnectionChange]);

  // Handle OAuth callback - backend redirects back with success/failure flag
  useEffect(() => {
    if (hasHandledCallback) return; // Prevent multiple callback handlers

    const success = searchParams?.get("calendly_success");
    const error = searchParams?.get("calendly_error");
    const code = searchParams?.get("code"); // OAuth code from Calendly
    const state = searchParams?.get("state"); // State parameter

    // Check if we have OAuth callback parameters but no success/error flag
    // This might indicate the backend callback endpoint isn't working
    if (code && state && !success && !error) {
      console.warn("OAuth callback received but backend may not have processed it:", { code, state });
      // Don't show error immediately - backend might still be processing
      // But log it for debugging
    }

    if (success === "true") {
      setHasHandledCallback(true);
      toast({
        title: "Success",
        description: "Calendly has been successfully connected!",
      });
      
      // Call GET /calendly/connected-status/:doctorId to update UI
      const refreshStatus = async () => {
        if (doctorId) {
          try {
            const connected = await checkCalendlyStatus(doctorId);
            setIsConnected(connected);
            onConnectionChange?.(connected);
          } catch (error) {
            console.error("Error refreshing Calendly status:", error);
          }
        }
      };
      refreshStatus();

      // Clean up URL parameters
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("calendly_success");
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
      }
    } else if (error) {
      setHasHandledCallback(true);
      toast({
        title: "Connection Failed",
        description: error || "Failed to connect to Calendly. Please try again.",
        variant: "destructive",
      });

      // Clean up URL parameters
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("calendly_error");
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams, doctorId, toast, onConnectionChange, hasHandledCallback]);

  const handleConnect = () => {
    if (!doctorId) {
      toast({
        title: "Error",
        description: "Doctor ID is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (isConnected) {
      return; // Already connected, do nothing
    }

    setIsConnecting(true);
    // Redirect to backend OAuth endpoint - backend handles OAuth flow and redirects back
    // Backend will redirect to Calendly, handle OAuth callback, store tokens server-side,
    // then redirect back to frontend with success/failure flag
    let baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://api.clinicx.io';
    // Remove trailing slash if present to avoid double slashes
    baseURL = baseURL.replace(/\/+$/, '');
    const connectUrl = `${baseURL}/api/calendly/connect?doctorId=${doctorId}`;
    
    // Log the URL for debugging
    console.log('Redirecting to Calendly OAuth endpoint:', connectUrl);
    
    // Show info toast about the OAuth flow
    toast({
      title: "Redirecting to Calendly",
      description: "You will be redirected to Calendly to authorize the connection. Please log in if prompted.",
    });
    
    // Small delay to ensure toast is visible
    setTimeout(() => {
      window.location.href = connectUrl;
    }, 500);
  };

  if (isLoading) {
    return (
      <Button disabled>
        Checking connection...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600">Calendly Connected</span>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const connected = await checkCalendlyStatus(doctorId);
            setIsConnected(connected);
            onConnectionChange?.(connected);
            if (connected) {
              toast({
                title: "Status Updated",
                description: "Calendly is still connected.",
              });
            } else {
              toast({
                title: "Status Updated",
                description: "Calendly connection was lost.",
                variant: "destructive",
              });
            }
          }}
        >
          Refresh Status
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting || isConnected}
    >
      {isConnecting ? "Connecting..." : "Connect Calendly"}
    </Button>
  );
}

export function CalendlyConnection(props: CalendlyConnectionProps) {
  return (
    <Suspense fallback={<Button disabled>Loading...</Button>}>
      <CalendlyConnectionContent {...props} />
    </Suspense>
  );
}

