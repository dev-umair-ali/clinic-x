"use client";
import { useMemo } from "react";
import { CalendarCheck, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/slices/appointmentSlice";

interface Props {
  appointments: Appointment[];
  filterTab: "Upcoming" | "Canceled" | "All";
  setFilterTab: (t: "Upcoming" | "Canceled" | "All") => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  onReschedule: () => void;
  onCancel: (a: Appointment) => void;
  statusColor: (s: Appointment["status"]) => string;
  parseDate: (a: Appointment) => Date;
}

export default function AppointmentTable({
  appointments,
  filterTab,
  setFilterTab,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onReschedule,
  onCancel,
  statusColor,
  parseDate,
}: Props) {
  const filtered = useMemo(() => {
    let list = [...appointments];
    if (filterTab === "Upcoming") {
      list = list.filter((a) => a.status === "pending" || a.status === "confirmed");
    } else if (filterTab === "Canceled") {
      list = list.filter((a) => a.status === "cancelled");
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.doctorName.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      );
    }
    if (sortBy === "Monthly") {
      list.sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime());
    } else if (sortBy === "Weekly") {
      const order = { confirmed: 0, pending: 1, completed: 2, cancelled: 3 } as const;
      list.sort((a, b) => order[a.status as keyof typeof order] - order[b.status as keyof typeof order]);
    }
    return list;
  }, [appointments, filterTab, searchQuery, sortBy, parseDate]);

  return (
    <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]">
      <div className="p-6 border-b border-[hsl(var(--border))]">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
          Appointment List View
        </h3>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {(["Upcoming", "Canceled", "All"] as const).map((tab) => (
              <Button
                key={tab}
                variant={filterTab === tab ? "default" : "outline"}
                onClick={() => setFilterTab(tab)}
                className={`text-sm px-4 py-2 ${
                  filterTab === tab
                    ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] h-4 w-4" />
              <Input
                placeholder="Search Appointment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[hsl(var(--muted)/0.5)]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                DOCTOR
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                DATE
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                TIME
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                SERVICE
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))]">
            {filtered.map((apt) => (
              <tr key={apt.id} className="hover:bg-[hsl(var(--muted)/0.5)]">
                <td className="px-6 py-4 text-sm font-medium text-[hsl(var(--foreground))]">
                  Dr. {apt.doctorName}
                </td>
                <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))]">
                  {new Date(apt.date).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))]">{apt.time}</td>
                <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))]">{apt.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${statusColor(apt.status)}`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-1">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
                      <DropdownMenuItem
                        onClick={() => (window.location.href = "/patient/appointments/book")}
                        className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                      >
                        Schedule
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={onReschedule}
                        className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                      >
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onCancel(apt)}
                        className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                      >
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-[hsl(var(--border))] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            Previous
          </button>
          <button className="px-3 py-2 text-sm bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] rounded font-medium">1</button>
          <button className="px-3 py-2 text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))]">
            2
          </button>
          <button className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            Next
          </button>
        </div>
        <div className="text-sm text-[hsl(var(--muted-foreground))]">10 / Pages</div>
      </div>
    </div>
  );
}