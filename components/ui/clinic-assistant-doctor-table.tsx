"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Edit, UserX } from "lucide-react";
import type { AssistantDoctor } from "@/lib/slices/assistantDoctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAssistantDoctorStatus } from "@/lib/slices/assistantDoctorSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoctorTableProps {
  doctors: AssistantDoctor[];
  currentPage: number;
  itemsPerPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function DoctorTable({
  doctors,
  currentPage,
  itemsPerPage,
  totalPages = 1,
  onPageChange,
  onItemsPerPageChange,
}: DoctorTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [doctorStatusRef, setDoctorStatusRef] = useState<string | null>(null);

  const handleToggleStatus = async (doctorRef: string) => {
    try {
      setDoctorStatusRef(doctorRef);

      // Find the doctor to get current status
      const doctor = doctors.find((d) => d._id === doctorRef);
      if (!doctor) {
        toast({
          title: "Error",
          description: "Doctor not found",
          variant: "destructive",
        });
        return;
      }

      // Toggle status: if active -> inactive, if inactive -> active
      const newStatus = doctor.status === "active" ? "inactive" : "active";

      // Update the doctor status using the specific status endpoint
      const response = await dispatch(
        updateAssistantDoctorStatus({
          id: doctorRef,
          status: newStatus,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        // Show success message based on action
        const action = newStatus === "active" ? "activate" : "deactivate";
        toast({
          title: "Success",
          description: `Doctor ${action} successfully!`,
          variant: "default",
        });
      } else if (response.meta.requestStatus === "rejected") {
        toast({
          title: "Error",
          description:
            (response.payload as string) || "Failed to update doctor status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update doctor status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDoctorStatusRef(null);
    }
  };

  const canRemoveDoctor = user?.role === "clinic";
  return (
    <div className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] rounded-lg shadow-md">
      <Toaster />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                DOCTOR NAME/Email
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                SPECIALTY
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Experience
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Phone
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))] dark:divide-[hsl(var(--border))]">
            {doctors.map((doctor) => (
              <tr
                key={doctor._id}
                className="hover:bg-[hsl(var(--muted)/0.2)] dark:hover:bg-[hsl(var(--muted)/0.2)] transition-colors"
              >
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] flex items-center justify-center mr-3">
                      {doctor.profilePicture ? (
                        <img
                          src={doctor.profilePicture || "/placeholder.svg"}
                          alt={`${doctor.firstName || ""} ${doctor.lastName || ""}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                          {doctor.firstName && doctor.lastName
                            ? `${doctor.firstName[0]}${doctor.lastName[0]}`
                            : "NA"}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                        Dr. {doctor.firstName || ""} {doctor.lastName || ""}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {doctor.specialization
                    ? doctor.specialization.charAt(0).toUpperCase() +
                      doctor.specialization.slice(1)
                    : "N/A"}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {doctor.yearsOfExperience}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {doctor.phoneNumber}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.status === "active"
                        ? "bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success-light))] dark:text-[hsl(var(--color-status-success))]"
                        : "bg-[hsl(var(--color-status-error-light))] dark:bg-[hsl(var(--color-status-error-light))] text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]"
                    }`}
                  >
                    {doctor.status.charAt(0).toUpperCase() +
                      doctor.status.slice(1).replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--muted-foreground))]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-[hsl(var(--muted)/0.2)] dark:hover:bg-[hsl(var(--muted)/0.2)]"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 dark:bg-[hsl(var(--background))] dark:border-[hsl(var(--border))]"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/assistant/doctors/view/${doctor._id}`)
                        }
                        className="flex items-center dark:text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--muted)/0.2)] dark:hover:bg-[hsl(var(--muted)/0.2)]"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/assistant/doctors/edit/${doctor._id}`)
                        }
                        className="flex items-center dark:text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--muted)/0.2)] dark:hover:bg-[hsl(var(--muted)/0.2)]"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex items-center text-[hsl(var(--color-status-error))] focus:text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] cursor-pointer hover:bg-[hsl(var(--color-status-error)/0.1)] dark:hover:bg-[hsl(var(--color-status-error)/0.1)]"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {doctor.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]">
                          <AlertDialogHeader className="flex flex-row items-center gap-3 space-y-0">
                            <div className="h-8 w-8 rounded-full bg-[hsl(var(--color-status-error-light))] dark:bg-[hsl(var(--color-status-error-light))] flex items-center justify-center">
                              <UserX className="h-4 w-4 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
                            </div>
                            <AlertDialogTitle className="text-lg font-semibold">
                              {doctor.status === "active"
                                ? "Deactivate Doctor"
                                : "Activate Doctor"}
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-4">
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
                              disabled={doctorStatusRef === doctor._id}
                              className="flex-1 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.2)] dark:hover:bg-[hsl(var(--muted)/0.2)] border-0"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                doctor._id && handleToggleStatus(doctor._id)
                              }
                              disabled={doctorStatusRef === doctor._id}
                              className={`flex-1 text-white ${
                                doctor.status === "active"
                                  ? "bg-[hsl(var(--color-status-error))]"
                                  : "bg-[hsl(var(--color-status-success))]"
                              }`}
                            >
                              {doctorStatusRef === doctor._id
                                ? "Updating..."
                                : `Yes, ${
                                    doctor.status === "active"
                                      ? "Deactivate"
                                      : "Activate"
                                  } Doctor`}
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

      <div className="px-4 sm:px-6 py-4 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
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

          <div className="flex items-center gap-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
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
                className="rounded-lg shadow-md bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                style={{ minWidth: 20 }}
              >
                {[10, 20, 30, 40, 50].map((s) => (
                  <SelectItem
                    key={s}
                    value={String(s)}
                    className="text-sm rounded-md hover:bg-[hsl(var(--color-brand-teal)/0.1)] dark:hover:bg-[hsl(var(--color-brand-teal)/0.1)] focus:bg-[hsl(var(--color-brand-teal)/0.2)] dark:focus:bg-[hsl(var(--color-brand-teal)/0.2)]"
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
  );
}