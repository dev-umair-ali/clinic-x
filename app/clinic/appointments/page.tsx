"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/ui/calendar-view";
import { updateAppointment } from "@/lib/slices/appointmentSlice";
import { Plus } from "lucide-react";

import UpcomingCard from "@/components/patient-appointments/UpcomingCard";
import StatsCards from "@/components/patient-appointments/StatsCards";
import ViewToggleBar from "@/components/patient-appointments/ViewToggleBar";
import AppointmentTable from "@/components/patient-appointments/AppointmentTable";
import CancelDialog from "@/components/patient-appointments/CancelDialog";

function parseAppointmentDate(apt: any) {
  return new Date(`${apt.date} ${apt.time}`);
}

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Dummy data for testing
  const patientAppointments = useMemo(() => [
    {
      _id: "1",
      type: "Annual Physical Exam",
      doctorName: "Sarah Smith",
      date: "2025-12-25",
      time: "10:00 AM",
      status: "confirmed",
      patient: user?.id ?? "patient1",
    },
    {
      _id: "2",
      type: "Dental Checkup",
      doctorName: "John Doe",
      date: "2025-12-28",
      time: "2:00 PM",
      status: "pending",
      patient: user?.id ?? "patient1",
    },
    {
      _id: "3",
      type: "Eye Examination",
      doctorName: "Emma Brown",
      date: "2025-12-30",
      time: "11:30 AM",
      status: "confirmed",
      patient: user?.id ?? "patient1",
    },
  ], [user?.id]);

  // Find nearest upcoming appointment
  const upcomingAppointment = useMemo(() => {
    return patientAppointments
      .filter(
        (a) =>
          a.status === "confirmed" || a.status === "pending"
      )
      .sort(
        (a, b) =>
          parseAppointmentDate(a).getTime() -
          parseAppointmentDate(b).getTime()
      )[0];
  }, [patientAppointments]);

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [filterTab, setFilterTab] = useState<"Upcoming" | "Canceled" | "All">(
    "Upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Monthly");
  const [cancelTarget, setCancelTarget] = useState<any>(null);

  const statusColor = (st: string) => {
    switch (st) {
      case "confirmed":
        return "bg-[#1DA68F] text-white";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calendarEvents = useMemo(
    () =>
      patientAppointments.map((a) => ({
        id: a._id,
        title: `${a.type} - ${a.doctorName}`,
        date: a.date,
        status: a.status,
        type: "appointment",
      })),
    [patientAppointments]
  );

  const confirmCancel = () => {
    if (!cancelTarget) return;
    dispatch(updateAppointment({ ...cancelTarget, status: "cancelled" }));
    setCancelTarget(null);
  };

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Appointments
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Schedule and manage your appointments
              </p>
            </div>
            <Button
              onClick={() => router.push("/clinic/appointments/book")}
              className="bg-[#1DA68F] hover:bg-[#168f73] text-white flex gap-2"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingCard
              appointment={upcomingAppointment}
              onCancel={(apt) => setCancelTarget(apt)}
            />
            <StatsCards />
          </div>

          <ViewToggleBar viewMode={viewMode} setViewMode={setViewMode} />

          {viewMode === "calendar" ? (
            <CalendarView events={calendarEvents} />
          ) : (
            <AppointmentTable
              appointments={patientAppointments}
              filterTab={filterTab}
              setFilterTab={setFilterTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onCancel={(apt) => setCancelTarget(apt)}
              statusColor={statusColor}
              parseDate={parseAppointmentDate}
            />
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelDialog
        open={!!cancelTarget}
        appointment={cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
    </ProtectedRoute>
  );
}
