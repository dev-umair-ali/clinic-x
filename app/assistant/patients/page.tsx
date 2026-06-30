"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { PatientTable } from "@/components/ui/assistant-patient-table";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchAssistantPatients } from "@/lib/slices/assistantPatientSlice";
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
import { fetchClinicDoctorsByAssistant } from "@/lib/slices/patientSlice";
import { FaUserClock } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { Ban } from "lucide-react";
import { Users, UserCheck, User } from "lucide-react"; // icons for the boxes

export default function ReceptionistPatientsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { assistantPatients, pagination, loading, error } = useSelector(
    (state: RootState) => state.assistantPatients
  );
  const { clinicDoctors } = useSelector((state: RootState) => state.patients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorsFilter, setDoctorsFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { user } = useSelector((state: RootState) => state.auth);

  const patientsData = useMemo(() => assistantPatients, [assistantPatients]);
  const totalPages = pagination?.totalPages || 1;

  useEffect(() => {
    // Fetch patients with filters and pagination
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (doctorsFilter && doctorsFilter !== "all")
      params.doctorId = doctorsFilter;

    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    params.page = currentPage;
    params.limit = itemsPerPage;

    dispatch(fetchAssistantPatients(params));
  }, [
    dispatch,
    searchQuery,
    statusFilter,
    doctorsFilter,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    // Fetch doctors based on selected clinic
    if (user?.clinicId) {
      dispatch(fetchClinicDoctorsByAssistant(user.clinicId));
    }
  }, [dispatch, user?.clinicId]);

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

  const handleDoctorChange = (value: string) => {
    setDoctorsFilter(value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDoctorsFilter("all");
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
    <ProtectedRoute allowedRoles={["assistant"]}>
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
              <button
                onClick={() => handleNavigation("/assistant/patients/add")}
                className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] min-w-[130px] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--color-brand-teal-dark))] flex justify-center items-center gap-2 font-bold text-sm transition-colors mt-4 sm:mt-0"
              >
                + Add Patient
              </button>
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
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
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

                {/* Doctor Filter */}
                <div>
                  <Select
                    value={doctorsFilter}
                    onValueChange={handleDoctorChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Doctors</SelectItem>
                      {clinicDoctors.map((doctor: any) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery ||
                statusFilter !== "all" ||
                doctorsFilter !== "all") && (
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
                  {doctorsFilter !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                      Doctor:{" "}
                      {
                        clinicDoctors.find((c) => c._id === doctorsFilter)
                          ?.firstName
                      }{" "}
                      {
                        clinicDoctors.find((c) => c._id === doctorsFilter)
                          ?.lastName
                      }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {/* Total Patients */}
              <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.1)] flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:h-7 w-7 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]"/>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate">
                    Total Patients
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]">
                    {patientsData?.length}
                  </p>
                </div>
              </div>

              {/* Active Patients */}
              <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success-light))] flex-shrink-0">
                  <UserCheck className="h-5 w-5 sm:h-6 sm:h-7 w-7 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"/>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate">
                    Active Patients
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]">
                    {activePatientCount}
                  </p>
                </div>
              </div>

              {/* Pending Verification Patients */}
              <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.1)] flex-shrink-0">
                  <FaUserClock className="h-5 w-5 sm:h-6 sm:h-7 w-7 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]"/>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate">
                    Pending Verification
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">
                    {pendingPatientCount}
                  </p>
                </div>
              </div>

              {/* In-Active Patients */}
              <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.1)] flex-shrink-0">
                  <FaUserXmark className="h-5 w-5 sm:h-6 sm:h-7 w-7 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]"/>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate">
                    In-Active Patients
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">
                    {inactivePatientCount}
                  </p>
                </div>
              </div>

              {/* Suspended Patients */}
              <div className="flex items-center p-4 sm:p-5 lg:p-6 min-h-[100px] sm:min-h-[110px] bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] rounded-xl shadow-sm border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:shadow-md transition-shadow">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-error-light))] dark:bg-[hsl(var(--color-status-error-light))] flex-shrink-0">
                  <Ban className="h-5 w-5 sm:h-6 sm:h-7 w-7 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]"/>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate">
                    Suspended Patients
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]">
                    {suspendedPatientCount}
                  </p>
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