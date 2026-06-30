"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { DoctorTable } from "@/components/ui/clinic-doctor-table";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchClinicDoctors } from "@/lib/slices/clinicDoctorSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Users, UserCheck, User } from "lucide-react"; // icons for the boxes
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FaUserClock } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { Ban } from "lucide-react";

export default function ClinicDoctorsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { clinicDoctors, loading, error } = useSelector(
    (state: RootState) => state.clinicDoctors
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const doctorsData = useMemo(() => clinicDoctors || [], [clinicDoctors]);

  useEffect(() => {
    // Fetch doctors filtered by clinic ID
    // Fetch assistants filtered by clinic ID
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    if (clinicFilter && clinicFilter !== "all") params.clinicId = clinicFilter;
    params.page = currentPage;
    params.limit = itemsPerPage;

    dispatch(fetchClinicDoctors(params));
  }, [
    dispatch,
    searchQuery,
    statusFilter,
    clinicFilter,
    currentPage,
    itemsPerPage,
  ]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setClinicFilter("all");
    setCurrentPage(1);
  };

  // Calculate active doctors count
  const activeDoctorsCount = doctorsData.filter(
    (doctor) => doctor.status === "active"
  ).length;

  const pendingDoctorsCount = useMemo(
    () =>
      doctorsData.filter((doctor) => doctor.status === "pending_verification")
        .length,
    [doctorsData]
  );

  const inactiveDoctorsCount = doctorsData.filter(
    (doctor) => doctor.status === "inactive"
  ).length;

  const suspendedDoctorsCount = useMemo(
    () => doctorsData.filter((doctor) => doctor.status === "suspended").length,
    [doctorsData]
  );

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="flex-1 overflow-y-auto bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))] min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                Doctors
              </h1>
              <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-1">
                Manage and monitor all doctors across your clinics
              </p>
            </div>
            <Button
              onClick={() => handleNavigation("/clinic/doctors/add")}
              className="mt-4 md:mt-0 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Doctor</span>
            </Button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))] p-4 mb-6">
            <div className="flex items-center justify-between w-full">
              <div
                className="relative flex-1 mr-2"
                style={{ flexBasis: "70%" }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="relative flex-1" style={{ flexBasis: "30%" }}>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending_verification">
                      Pending Verification
                    </SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters / clear button */}
            {(searchQuery ||
              statusFilter !== "all" ||
              clinicFilter !== "all") && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  Active filters:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                    Search: {searchQuery}
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                    Status: {statusFilter}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Stats Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {/* Total Doctors - Blue Theme */}
            <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] truncate">
                  Total Doctors
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]">
                  {doctorsData.length}
                </p>
              </div>
            </div>

            {/* Active Doctors - Green Theme */}
            <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.2)] flex-shrink-0">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] truncate">
                  Active Doctors
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]">
                  {activeDoctorsCount}
                </p>
              </div>
            </div>

            {/* Pending Verification - Yellow/Orange Theme */}
            <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)] flex-shrink-0">
                <FaUserClock className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--color-status-warning))] dark:text-[hsl(var(--color-status-warning))]" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] truncate">
                  Pending Verification
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-status-warning))] dark:text-[hsl(var(--color-status-warning))]">
                  {pendingDoctorsCount}
                </p>
              </div>
            </div>

            {/* Inactive Doctors - Orange Theme */}
            <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.2)] flex-shrink-0">
                <FaUserXmark className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] truncate">
                  Inactive Doctors
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">
                  {inactiveDoctorsCount}
                </p>
              </div>
            </div>

            {/* Suspended Doctors - Red Theme */}
            <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] flex-shrink-0">
                <Ban className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] truncate">
                  Suspended Doctors
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]">
                  {suspendedDoctorsCount}
                </p>
              </div>
            </div>
          </div>
          {/* Error Handling */}
          {error && doctorsData.length === 0 && (
            <div className="mb-4 bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] border border-[hsl(var(--color-status-error))] dark:border-[hsl(var(--color-status-error))] text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Loading / Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
              <span className="ml-2 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                Loading doctors...
              </span>
            </div>
          ) : (
            <DoctorTable
              doctors={doctorsData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={1}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}