"use client";

import { useMemo, useState, useEffect } from "react";
import { MoreHorizontal, Edit, Eye, UserX, Search } from "lucide-react";
import type { ClinicPatient } from "@/lib/slices/clinicPatientSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  updateClinicPatientStatus,
  fetchClinicPatients,
} from "@/lib/slices/clinicPatientSlice";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface PatientTableProps {
  patients: ClinicPatient[];
  currentPage: number;
  itemsPerPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function PatientTable({
  patients,
  currentPage,
  itemsPerPage,
  totalPages = 1,
  onPageChange,
  onItemsPerPageChange,
}: PatientTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [updatingPatientId, setUpdatingPatientId] = useState<string | null>(
    null
  );

  const handleUpdatePatientStatus = async (patientId: string) => {
    try {
      setUpdatingPatientId(patientId);

      // Find the patient to get current status
      const patient = patients.find((p) => p._id === patientId);
      if (!patient) {
        toast({
          title: "Error",
          description: "Patient not found",
          variant: "destructive",
        });
        return;
      }

      // Toggle status: if active -> inactive, if inactive -> active
      const newStatus = patient.status === "active" ? "inactive" : "active";

      // Update the patient status
      const response = await dispatch(
        updateClinicPatientStatus({
          id: patientId,
          status: newStatus,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        const action = newStatus === "active" ? "activated" : "deactivated";
        toast({
          title: "Success",
          description: `Patient ${action} successfully!`,
          variant: "default",
        });
        dispatch(fetchClinicPatients({}));
      } else if (response.meta.requestStatus === "rejected") {
        toast({
          title: "Error",
          description:
            (response.payload as string) || "Failed to update patient status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update patient status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPatientId(null);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-xl shadow-md border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))]">
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
                    className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] dark:divide-[hsl(var(--border))]">
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50 transition-colors"
                >
                  {/* Patient Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          patient.profilePicture ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={`${patient.firstName} ${patient.lastName}`}
                        className="h-9 w-9 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                          {patient.firstName || "N/A"}{" "}
                          {patient.lastName || "N/A"}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                          {patient.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {patient.age} Years
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {patient.gender || "Male"}
                  </td>

                  {/* Doctor */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {(patient.doctorRef as any)?.firstName +
                      " " +
                      (patient.doctorRef as any)?.lastName ||
                      "No doctor assigned"}
                  </td>

                  {/* Last Visit */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {moment(patient.lastVisit).format("DD/MM/YYYY HH:mm") ===
                    "Invalid date"
                      ? "No last visit"
                      : moment(patient.lastVisit).format("DD/MM/YYYY HH:mm")}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.status === "active"
                          ? "bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.2)] text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"
                          : "bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]"
                      }`}
                    >
                      {patient.status.charAt(0).toUpperCase() +
                        patient.status.slice(1).replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50"
                        >
                          <MoreHorizontal className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] shadow-lg rounded-md"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/clinic/patients/view/${patient._id}`)
                          }
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/clinic/patients/edit/${patient._id}`)
                          }
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center text-[hsl(var(--color-status-error))] focus:text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] cursor-pointer hover:bg-[hsl(var(--color-status-error)/0.1)] dark:hover:bg-[hsl(var(--color-status-error)/0.2)]"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {patient.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md dark:bg-[hsl(var(--card))] dark:text-[hsl(var(--foreground))]">
                            <AlertDialogHeader className="flex flex-row items-center gap-3 space-y-0">
                              <div className="h-8 w-8 rounded-full bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] flex items-center justify-center">
                                <UserX className="h-4 w-4 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
                              </div>
                              <AlertDialogTitle className="text-lg font-semibold">
                                {patient.status === "active"
                                  ? "Deactivate Patient"
                                  : "Activate Patient"}
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-4">
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
                                disabled={updatingPatientId === patient._id}
                                className="flex-1 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 dark:hover:bg-[hsl(var(--muted))]/80 border-0"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  patient._id &&
                                  handleUpdatePatientStatus(patient._id)
                                }
                                disabled={updatingPatientId === patient._id}
                                className={`flex-1 text-white ${
                                  patient.status === "active"
                                    ? "bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-dark))]"
                                    : "bg-[hsl(var(--color-status-success))] hover:bg-[hsl(var(--color-status-success-dark))]"
                                }`}
                              >
                                {updatingPatientId === patient._id
                                  ? "Updating..."
                                  : patient.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}{" "}
                                Patient
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* ---------- page controls ---------- */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]
                   hover:text-[hsl(var(--color-brand-teal))] dark:hover:text-[hsl(var(--color-brand-teal))]
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-9 h-9 text-sm rounded-md border transition
                        ${
                          isActive
                            ? "bg-[hsl(var(--color-brand-teal))] text-white border-[hsl(var(--color-brand-teal))] shadow"
                            : "text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]" +
                              " hover:border-[hsl(var(--color-brand-teal))] dark:hover:border-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal))] dark:hover:text-[hsl(var(--color-brand-teal))]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
                className="px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]
                   hover:text-[hsl(var(--color-brand-teal))] dark:hover:text-[hsl(var(--color-brand-teal))]
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* ---------- rows per page ---------- */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                Rows per page:
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => onItemsPerPageChange(Number(v))}
              >
                <SelectTrigger className="h-9 w-20 text-sm rounded-lg border-[hsl(var(--color-brand-teal))] dark:border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="rounded-lg shadow-md dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]"
                  style={{ minWidth: 20 }}
                >
                  {[10, 20, 30, 40, 50].map((s) => (
                    <SelectItem
                      key={s}
                      value={String(s)}
                      className="text-sm rounded-md hover:bg-[hsl(var(--color-brand-teal)/0.1)] dark:hover:bg-[hsl(var(--color-brand-teal)/0.2)] focus:bg-[hsl(var(--color-brand-teal)/0.1)] dark:focus:bg-[hsl(var(--color-brand-teal)/0.2)]"
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}