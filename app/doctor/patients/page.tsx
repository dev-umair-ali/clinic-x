"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { PatientTable } from "@/components/ui/doctor-patient-table";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchDoctorPatients } from "@/lib/slices/doctorPatientSlice";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReceptionistPatientsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { patients, pagination, loading, error } = useSelector(
    (state: RootState) => state.doctorPatients
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const patientsData = useMemo(() => patients, [patients]);
  const totalPages = pagination?.totalPages || 1;

  useEffect(() => {
    // Fetch patients with filters and pagination
    const params: any = {};
    if (searchQuery) params.search = searchQuery;

    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    params.page = currentPage;
    params.limit = itemsPerPage;

    dispatch(fetchDoctorPatients(params));
  }, [dispatch, searchQuery, statusFilter, currentPage, itemsPerPage]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const activePatientCount = patientsData?.filter(
    (patient: any) => patient.status === "active"
  ).length;
  const pendingPatientCount = patientsData?.filter(
    (patient: any) => patient.status === "pending_verification"
  ).length;
  const suspendedPatientCount = patientsData?.filter(
    (patient: any) => patient.status === "suspended"
  ).length;
  const inactivePatientCount = patientsData?.filter(
    (patient: any) => patient.status === "inactive"
  ).length;

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title and Summary Cards */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
                  Patients
                </h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Manage patient records and appointments
                </p>
              </div>
              {/* <button
                onClick={() => handleNavigation("/clinic/patients/add")}
                className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] min-w-[130px] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--color-brand-teal-dark))] flex justify-center items-center gap-2 font-bold text-sm transition-colors mt-4 sm:mt-0"
              >
                + Add Patient
              </button> */}
            </div>

            <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))] p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending_verification">Pending Verification</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>



              </div>
              {/* Active Filters Display */}
              {(searchQuery || statusFilter !== "all") && (
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Total Patients */}
              <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      Total Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]">
                      {patientsData?.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Patients */}
              <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      Active Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]">
                      {activePatientCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      Pending Verification Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]">
                      {pendingPatientCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inactive Patients */}
              <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      In-Active Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">
                      {
                        inactivePatientCount
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      Suspended Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">
                      {
                        suspendedPatientCount
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && patientsData.length === 0 && (
            <div className="mb-4 bg-[hsl(var(--color-status-error-light))] border border-[hsl(var(--color-status-error))] text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
              <span className="ml-2 text-[hsl(var(--muted-foreground))]">
                Loading patients...
              </span>
            </div>
          ) : (
            <PatientTable
              patients={patientsData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
