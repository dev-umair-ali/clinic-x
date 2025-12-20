"use client";
import { useMemo } from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoctorAppointment } from "@/lib/api/services/appointmentService";

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
  onPatientClick: (apt: DoctorAppointment) => void;
  onEdit: (apt: DoctorAppointment) => void;
  currentPage: number;
  setCurrentPage: (p: number | ((prev: number) => number)) => void;
  totalPages: number;
}

export default function AppointmentList(props: Props) {
  const {
    loading,
    error,
    appointments,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedFilter,
    setSelectedFilter,
    onStatusUpdate,
    onPatientClick,
    onEdit,
    currentPage,
    setCurrentPage,
    totalPages,
  } = props;

  const filtered = useMemo(() => {
    let f = [...appointments];
    if (selectedFilter === "Upcoming") {
      const now = new Date();
      f = f.filter((a) => new Date(a.dateTime) >= now && a.status !== "cancelled");
    } else if (selectedFilter === "Canceled") {
      f = f.filter((a) => a.status === "cancelled");
    }
    f.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    return f;
  }, [appointments, selectedFilter]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Appointment List View</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search Patient"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Date">Date</SelectItem>
                <SelectItem value="Patient">Patient</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          {["Upcoming", "Canceled", "All"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === f
                  ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Mobile cards */}
        {!loading && (
          <div className="block sm:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No appointments found</div>
            ) : (
              filtered.map((a) => (
                <div key={a._id} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <button
                        onClick={() => onPatientClick(a)}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {a.patientName || (typeof a.patient === 'object' ? a.patient?.name : null) || "Patient"}
                      </button>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(a.dateTime)} {formatTime(a.dateTime)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Start Visit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusUpdate(a._id, "completed")}>
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(a)}>Reschedule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{a.type || "Appointment"}</span>
                    <Select
                      value={a.status}
                      onValueChange={(v) => onStatusUpdate(a._id, v)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop table */}
        {!loading && (
          <div className="hidden sm:block overflow-hidden rounded-lg border border-border">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No appointments found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">DATE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PATIENT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">SERVICE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">STATUS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ACTION</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filtered.map((a) => (
                    <tr key={a._id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatDate(a.dateTime)} {formatTime(a.dateTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onPatientClick(a)}
                          className="text-sm text-foreground hover:text-primary font-medium"
                        >
                          {a.patientName || (typeof a.patient === 'object' ? a.patient?.name : null) || "Patient"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{a.type || "Appointment"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={a.status}
                          onValueChange={(v) => onStatusUpdate(a._id, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Start Visit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusUpdate(a._id, "completed")}>
                              Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(a)}>Reschedule</DropdownMenuItem>
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else p = currentPage - 2 + i;
                return (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    size="sm"
                    className={currentPage === p ? "bg-teal-600 hover:bg-teal-700" : ""}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
          </div>
        )}
      </div>
    </div>
  );
}