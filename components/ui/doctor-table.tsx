"use client";

import { useState } from "react";
import { MoreHorizontal, Search, Eye, Edit, UserX } from "lucide-react";
import type { Doctor } from "@/lib/slices/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateDoctorStatus, fetchDoctors } from "@/lib/slices/doctorSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
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

interface DoctorTableProps {
  doctors: Doctor[];
}

export function DoctorTable({ doctors }: DoctorTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleToggleStatus = async (doctorId: string) => {
    try {
      setDeletingDoctorId(doctorId);

      // Find the doctor to get current status
      const doctor = doctors.find((d) => d.id === doctorId);
      if (!doctor) {
        toast.error("Doctor not found");
        return;
      }

      // Toggle status: if active -> inactive, if inactive -> active
      const newStatus = doctor.status === "active" ? "inactive" : "active";

      // Update the doctor status using the specific status endpoint
      const response = await dispatch(
        updateDoctorStatus({
          id: doctorId,
          status: newStatus,
        })
      )
      
      if (response.payload === "Doctor status updated successfully") {
        // Show success message based on action
        const action = newStatus === "active" ? "active" : "inactive";
        toast.success(`Doctor ${action} successfully!`);
        dispatch(fetchDoctors());
      }
    } catch (error: any) {
      toast.error("Failed to update doctor status. Please try again.");
    }
  };

  const canRemoveDoctor = user?.role === "admin";
  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <ToastContainer />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  DOCTOR NAME/Email
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  SPECIALTY
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        {doctor.profilePicture ? (
                          <img
                            src={doctor.profilePicture || "/placeholder.svg"}
                            alt={`${doctor.firstName || ""} ${doctor.lastName || ""
                              }`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {doctor.firstName && doctor.lastName
                              ? `${doctor.firstName[0]}${doctor.lastName[0]}`
                              : "NA"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Dr. {doctor.firstName || ""} {doctor.lastName || ""}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {doctor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {doctor.specialization}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {doctor.experience}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {doctor.phone}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.status === "active"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                    >
                      {doctor.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 dark:bg-gray-800 dark:border-gray-700"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/doctors/view/${doctor.id}`)
                          }
                          className="flex items-center dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/doctors/edit/${doctor.id}`)
                          }
                          className="flex items-center dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {canRemoveDoctor && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center text-red-600 focus:text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                {doctor.status === "active"
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
                                  {doctor.status === "active"
                                    ? "Deactivate Doctor"
                                    : "Activate Doctor"}
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-4">
                                Are you sure you want to{" "}
                                {doctor.status === "active"
                                  ? "deactivate"
                                  : "activate"}{" "}
                                Dr. {doctor.firstName} {doctor.lastName}?
                                {doctor.status === "active"
                                  ? " This will prevent them from seeing new patients."
                                  : " This will allow them to see new patients again."}
                              </AlertDialogDescription>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel
                                  disabled={deletingDoctorId === doctor.id}
                                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-0"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleToggleStatus(doctor.id)}
                                  disabled={deletingDoctorId === doctor.id}
                                  className={`flex-1 text-white ${doctor.status === "active"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                  {deletingDoctorId === doctor.id
                                    ? "Updating..."
                                    : `Yes, ${doctor.status === "active"
                                      ? "Deactivate"
                                      : "Activate"
                                    } Doctor`}
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

        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(doctors.length, 3) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-sm rounded ${currentPage === pageNum
                          ? "bg-teal-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(doctors.length, currentPage + 1))
                }
                disabled={currentPage === doctors.length}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* Items per page dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rows per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="text-sm border rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
