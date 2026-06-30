"use client";
import { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoctorAppointment } from "@/lib/api/services/appointmentService";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface Props {
  loading: boolean;
  error: string | null;
  appointments: DoctorAppointment[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  currentPage: number;
  setCurrentPage: (p: number | ((prev: number) => number)) => void;
  totalPages: number;
}

export default function AppointmentList(props: Props) {
  const {
    loading,
    error,
    appointments,
    selectedFilter,
    onStatusUpdate,
    currentPage,
    setCurrentPage,
  } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const pageSize = 10;

  const filtered = useMemo(() => {
    let f = [...appointments];
    if (
      selectedFilter === "scheduled" ||
      selectedFilter === "pending" ||
      selectedFilter === "completed" ||
      selectedFilter === "rescheduled"
    ) {
      const now = new Date();
      f = f.filter((a) => {
        const dateTime = a.dateTime || a.date;
        if (!dateTime) return false;
        const appointmentDate = new Date(dateTime);
        return (
          appointmentDate >= now &&
          a.status !== "cancelled" &&
          !isNaN(appointmentDate.getTime())
        );
      });
    } else if (selectedFilter === "cancelled") {
      f = f.filter((a) => a.status === "cancelled");
    }
    f.sort((a, b) => {
      const dateA = new Date((a.dateTime || a.date) as string);
      const dateB = new Date((b.dateTime || b.date) as string);
      return dateA.getTime() - dateB.getTime();
    });
    return f;
  }, [appointments, selectedFilter]);

  const calculatedTotalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize),
  );

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  const formatDate = (d: string | undefined) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  };

  const formatTime = (d: string | undefined) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
  };

  return (
    <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]">
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[hsl(var(--foreground))]">
            Appointment List View
          </h2>
          {filtered.length > 0 && (
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filtered.length)} of{" "}
              {filtered.length}
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
            <span className="ml-2 text-[hsl(var(--muted-foreground))]">
              Loading appointments...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 bg-[hsl(var(--color-status-error)/0.1)] border border-[hsl(var(--color-status-error)/0.2)] text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Mobile cards */}
        {!loading && (
          <div className="block sm:hidden space-y-3">
            {paginatedItems.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                No appointments found
              </div>
            ) : (
              paginatedItems.map((a) => (
                <div
                  key={a._id}
                  className="bg-[hsl(var(--muted)/0.5)] rounded-lg p-4 border border-[hsl(var(--border))]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <button className="font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--color-brand-teal))]">
                        Dr.{" "}
                        {(a as any).doctorName ||
                          (typeof a.doctor === "object" &&
                            (a.doctor as any)?.name) ||
                          "Doctor"}
                      </button>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {formatDate(a.dateTime || a.date)}{" "}
                        {formatTime(a.dateTime || a.date)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAppointment(a);
                            setDetailsModalOpen(true);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        {role === "doctor" && (a.status === "scheduled" || a.status === "start_visit") && (
                          <DropdownMenuItem
                            onClick={() => onStatusUpdate(a._id, "start_visit")}
                          >
                            Start Visit
                          </DropdownMenuItem>
                        )}
                        {a?.status === "start_visit" && (
                          <DropdownMenuItem
                            onClick={() => onStatusUpdate(a._id, "completed")}
                          >
                            Completed
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop table */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto max-h-[600px] overflow-y-auto rounded-lg border border-[hsl(var(--border))]">
            {paginatedItems.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                No appointments found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[hsl(var(--muted)/0.5)] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      DATE-TIME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      CLINIC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      DOCTOR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      PATIENT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      SERVICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))]">
                  {paginatedItems.map((a) => (
                    <tr
                      key={a._id}
                      className="hover:bg-[hsl(var(--muted)/0.5)]"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))]">
                        {moment(a.date).format("ll")}{" "}
                        {moment(a.time, "HH:mm").format("h:mm A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))]">
                        {(a as any).clinicRef?.clinicName || "Clinic"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--color-brand-teal))] font-medium">
                          Dr.{" "}
                          {(typeof a.doctorRef === "object" &&
                            (a.doctorRef as any)?.firstName) +
                            " " +
                            ((typeof a.doctorRef === "object" &&
                              (a.doctorRef as any)?.lastName) ||
                              "") || "Doctor"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))]">
                        {(a as any).patientRef?.firstName +
                          " " +
                          ((a as any).patientRef?.lastName || "") || "Patient"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))]">
                        {a.service || "Appointment"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {a.status
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAppointment(a);
                                setDetailsModalOpen(true);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>

                            {role === "doctor" && (a.status === "scheduled" || a.status === "start_visit") && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusUpdate(a._id, "start_visit")
                                }
                              >
                                Start Visit
                              </DropdownMenuItem>
                            )}

                            {(role === "doctor" || role === 'clinic' || role === 'assistant') && a.status === "start_visit" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusUpdate(a._id, "completed")
                                }
                              >
                                Completed
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {calculatedTotalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
              >
                Previous
              </Button>
              {Array.from(
                { length: Math.min(5, calculatedTotalPages) },
                (_, i) => {
                  let p;
                  if (calculatedTotalPages <= 5) p = i + 1;
                  else if (currentPage <= 3) p = i + 1;
                  else if (currentPage >= calculatedTotalPages - 2)
                    p = calculatedTotalPages - 4 + i;
                  else p = currentPage - 2 + i;
                  return (
                    <Button
                      key={p}
                      variant={currentPage === p ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === p
                          ? "bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))]"
                          : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                      }
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </Button>
                  );
                },
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === calculatedTotalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(calculatedTotalPages, p + 1))
                }
                className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
              >
                Next
              </Button>
            </div>
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Page {currentPage} of {calculatedTotalPages}
            </span>
          </div>
        )}
      </div>

      <AppointmentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onSuccess={() => {
          setDetailsModalOpen(false);
          // Trigger a refresh if needed
          window.location.reload();
        }}
      />
    </div>
  );
}
