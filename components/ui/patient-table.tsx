"use client";

import { useMemo, useState, useEffect } from "react";
import { MoreHorizontal, Edit, Eye, UserX, Search } from "lucide-react";
import type { Patient } from "@/lib/slices/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { updatePatientStatus, fetchPatients } from "@/lib/slices/patientSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // default
  const [updatingPatientStatus, setUpdatingPatientStatus] = useState<string | null>(null);
  const [updatingPatientId, setUpdatingPatientId] = useState<string | null>(null);
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          (patient.firstName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (patient.lastName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (patient.email?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      ),
    [patients, searchTerm]
  );

  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      if (sortBy === "name") {
        const aFullName = `${a.firstName || ""} ${a.lastName || ""
          }`.toLowerCase();
        const bFullName = `${b.firstName || ""} ${b.lastName || ""
          }`.toLowerCase();
        return aFullName.localeCompare(bFullName);
      }
      if (sortBy === "age") return a.age - b.age;
      return 0;
    });
  }, [filteredPatients, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = sortedPatients.slice(startIndex, endIndex);



  const handleUpdatePatientStatus = async (patientId: string, patientStatus: string) => {
    // Toggle status: if active -> inactive, if inactive -> active
    const newStatus = patientStatus === "active" ? "inactive" : "active";
    try {
      setUpdatingPatientStatus(patientId);
      const response = await dispatch(updatePatientStatus({id: patientId, status: newStatus}));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Patient status updated successfully!");
        await dispatch(fetchPatients());
        setUpdatingPatientStatus(null);
        setUpdatingPatientId(null);
      }
    } catch (error: any) {
      toast.error("Failed to update patient status. Please try again.");
      setUpdatingPatientStatus(null);
      setUpdatingPatientId(null);
    }
  };

  const canRemovePatient = user?.role === "doctor" || user?.role === "admin";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Patient List ({patients.length} patients)
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search Patients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-200 focus:ring-2 focus:ring-[#1DA68F] focus:border-[#1DA68F]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {[
                "PATIENT NAME",
                "AGE",
                "GENDER",
                "DOCTOR",
                "LAST VISIT",
                "STATUS",
                "ACTION",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedPatients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Patient Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={patient.profilePicture || "/placeholder.svg?height=80&width=80"}
                      alt={`${patient.firstName} ${patient.lastName}`}
                      className="h-9 w-9 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {patient.firstName || "N/A"} {patient.lastName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Age */}
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {patient.age} Years
                </td>

                {/* Gender */}
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {patient.gender || "Male"}
                </td>

                {/* Doctor */}
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {(patient.assignedDoctor as any)?.[0]?.firstName + " " + (patient.assignedDoctor as any)?.[0]?.lastName || "No doctor assigned"}
                </td>

                {/* Last Visit */}
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {moment(patient.lastVisit).format("DD/MM/YYYY HH:mm") === "Invalid date" ? "No last visit" : moment(patient.lastVisit).format("DD/MM/YYYY HH:mm")}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === "active"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                    >
                    {patient.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-gray-800 shadow-lg rounded-md"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/patients/view/${patient.id}`)
                        }
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/patients/edit/${patient.id}`)
                        }
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {canRemovePatient && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center text-red-600 focus:text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                {patient.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md dark:bg-gray-900 dark:text-gray-200">
                              <AlertDialogHeader className="flex flex-row items-center gap-3 space-y-0">
                                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                  <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <AlertDialogTitle className="text-lg font-semibold">
                                  {patient.status === "active"
                                    ? "Deactivate Patient"
                                    : "Activate Patient"}
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-4">
                                Are you sure you want to{" "}
                                {patient.status === "active"
                                  ? "deactivate"
                                  : "activate"}{" "}
                                {patient.firstName} {patient.lastName}?
                                {patient.status === "active"
                                  ? " This will prevent them from seeing new patients."
                                  : " This will allow them to see new patients again."}
                              </AlertDialogDescription>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel
                                  disabled={updatingPatientStatus === patient.id}
                                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-0"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleUpdatePatientStatus(patient.id, patient.status)}
                                  disabled={updatingPatientStatus === patient.id}
                                  className={`flex-1 text-white ${patient.status === "active"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                    }`}>
                                  Yes, {patient.status === "active"
                                    ? "Deactivate"
                                    : "Activate"} Patient
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-sm rounded ${currentPage === pageNum
                        ? "bg-[#1DA68F] text-white"
                        : "border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Items per page dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page
              }}
              className="border border-gray-300 dark:border-gray-600 rounded text-sm px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {[10, 20, 30, 40].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
