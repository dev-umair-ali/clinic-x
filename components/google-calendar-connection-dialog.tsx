"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setShowConnectionDialog } from "@/lib/slices/googleCalendarSlice";
import { CalendlyConnection } from "@/components/calendar-connection";

export function GoogleCalendarConnectionDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showConnectionDialog, isConnected } = useSelector(
    (state: RootState) => state.googleCalendar
  );

  const doctorId = (user as any)?.doctorId || "";
  const userId = (user as any)?._id || "";

  // Don't show if not a doctor or if already connected
  const shouldShow = user?.role === "doctor" && !isConnected && showConnectionDialog;

  const handleConnectionChange = (connected: boolean) => {
    if (connected) {
      dispatch(setShowConnectionDialog(false));
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Dialog open={shouldShow} onOpenChange={() => {}}>
      <DialogContent className="max-w-md rounded-3xl border-0 shadow-2xl overflow-hidden bg-gradient-to-b from-[hsl(var(--color-slate-900))] via-[hsl(var(--color-slate-900))] to-[hsl(var(--color-slate-950))] dark:from-[hsl(var(--color-slate-900))] dark:via-[hsl(var(--color-slate-900))] dark:to-[hsl(var(--color-slate-950))] [&>button]:hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[hsl(var(--color-chart-blue)/0.2)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[hsl(var(--color-brand-teal)/0.1)] rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="space-y-5 text-center px-2 pt-8 pb-2 relative z-10">
          <div className="mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-chart-blue)/0.3)] to-[hsl(var(--color-brand-teal)/0.2)] rounded-full blur-2xl scale-150" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-chart-blue))] to-[hsl(var(--color-blue-500))] shadow-2xl border border-[hsl(var(--color-chart-blue)/0.3)]">
              <svg
                className="h-10 w-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3H18V2h-2v1H8V2H6v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
            </div>
          </div>

          <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[hsl(var(--foreground))] to-[hsl(var(--color-chart-blue)/0.3)] bg-clip-text text-transparent">
            Connect Google Calendar
          </DialogTitle>

          <DialogDescription className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs">
            Sync your schedule seamlessly and never miss an appointment
          </DialogDescription>
        </DialogHeader>

        <div className="my-7 px-8 relative z-10">
          <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--color-chart-blue)/0.4)] to-transparent" />
        </div>

        <div className="px-6 pb-6 relative z-10">
          <div className="bg-gradient-to-br from-[hsl(var(--muted)/0.5)] to-[hsl(var(--card)/0.5)] rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-center">
              {doctorId && (
                <CalendlyConnection
                  userId={userId}
                  doctorId={doctorId}
                  onConnectionChange={handleConnectionChange}
                />
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 relative z-10">
          <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--color-status-success)/0.1)] to-[hsl(var(--color-brand-teal)/0.1)] border border-[hsl(var(--color-status-success)/0.3)] px-4 py-3 text-center backdrop-blur-sm">
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
  );
}