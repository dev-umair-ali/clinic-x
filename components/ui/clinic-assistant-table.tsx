"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Edit, UserX } from "lucide-react";
import type { ClinicAssistant } from "@/lib/slices/clinicAssistantSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  updateClinicAssistantStatus,
  fetchClinicAssistants,
} from "@/lib/slices/clinicAssistantSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import 'react-toastify/dist/ReactToastify.css';
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

interface AssistantTableProps {
  assistants: ClinicAssistant[];
  currentPage: number;
  itemsPerPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function AssistantTable({
  assistants,
  currentPage,
  itemsPerPage,
  totalPages = 1,
  onPageChange,
  onItemsPerPageChange,
}: AssistantTableProps) {
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [deletingAssistantId, setDeletingAssistantId] = useState<string | null>(
    null
  );

  const handleToggleStatus = async (assistantId: string) => {
    try {
      setDeletingAssistantId(assistantId);

      // Find the assistant to get current status
      const assistant = assistants.find((a) => a._id === assistantId);
      if (!assistant) {
        toast({
          title: "Error",
          description: "Assistant not found.",
          variant: "destructive",
        });

        return;
      }

      // Toggle status: if active -> inactive, if inactive -> active
      const newStatus = assistant.status === "active" ? "inactive" : "active";

      // Update the assistant status using the specific status endpoint
      const response = await dispatch(
        updateClinicAssistantStatus({
          id: assistantId,
          status: newStatus,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        // Show success message based on action
        const action = newStatus === "active" ? "active" : "inactive";
        toast({
          title: "Success",
          description: `Assistant status updated to ${action} successfully!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.payload as string,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update assistant status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingAssistantId(null);
    }
  };

  const onCliCkViewAssistant = (assistantId: string) => {
    const role = user?.role;
    router.push(`/${role}/assistants/view/${assistantId}`);
  };

  const onClickEditAssistant = (assistantId: string) => {
    const role = user?.role;
    router.push(`/${role}/assistants/edit/${assistantId}`);
  };


  return (
    <>
      <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow-md">
        <Toaster />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-slate-800))] border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  ASSISTANT NAME/Email
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Departmennt
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Position
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))] dark:divide-[hsl(var(--border))]">
              {assistants.map((assistant) => (
                <tr
                  key={assistant._id}
                  className="hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50"
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[hsl(var(--color-gray-200))] dark:bg-[hsl(var(--color-slate-700))] flex items-center justify-center mr-3">
                        {assistant.profilePicture ? (
                          <img
                            src={assistant.profilePicture || "/placeholder.svg"}
                            alt={`${assistant.firstName || ""} ${assistant.lastName || ""
                              }`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                            {assistant.firstName && assistant.lastName
                              ? `${assistant.firstName[0]}${assistant.lastName[0]}`
                              : "NA"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                          {assistant.firstName || ""} {assistant.lastName || ""}
                        </div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                          {assistant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {assistant.phoneNumber}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {assistant.department}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    {assistant.position || "N/A"}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${assistant.status === "active"
                          ? "bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.2)] text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]"
                          : "bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]"
                        }`}
                    >
                       {assistant.status.charAt(0).toUpperCase() +
                        assistant.status.slice(1).replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            onCliCkViewAssistant(assistant._id)
                          }
                          // onClick={() =>
                          //   router.push(
                          //     `/admin/assistants/view/${assistant._id}`
                          //   )
                          // }
                          className="flex items-center dark:text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onClickEditAssistant(assistant._id)
                          }
                          // onClick={() =>
                          //
                          // router.push(
                          //   `/admin/assistants/edit/${assistant._id}`
                          // )
                          // }
                          className="flex items-center dark:text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--muted))]/50 dark:hover:bg-[hsl(var(--muted))]/50"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center text-[hsl(var(--color-status-error))] focus:text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] cursor-pointer hover:bg-[hsl(var(--color-status-error)/0.1)] dark:hover:bg-[hsl(var(--color-status-error)/0.2)]"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {assistant.status === "active"
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
                                {assistant.status === "active"
                                  ? "Deactivate Assistant"
                                  : "Activate Assistant"}
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mt-4">
                              Are you sure you want to{" "}
                              {assistant.status === "active"
                                ? "inactive"
                                : "active"}{" "}
                              {assistant.firstName} {assistant.lastName}?
                              {assistant.status === "active"
                                ? " This will prevent them from accessing the system."
                                : " This will allow them to access the system again."}
                            </AlertDialogDescription>
                            <AlertDialogFooter className="mt-6 gap-3">
                              <AlertDialogCancel
                                disabled={
                                  deletingAssistantId === assistant._id
                                }
                                className="flex-1 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 dark:hover:bg-[hsl(var(--muted))]/80 border-0"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleToggleStatus(assistant._id)
                                }
                                disabled={
                                  deletingAssistantId === assistant._id
                                }
                                className={`flex-1 text-white ${assistant.status === "active"
                                  ? "bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-dark))]"
                                  : "bg-[hsl(var(--color-status-success))] hover:bg-[hsl(var(--color-status-success-dark))]"
                                  }`}
                              >
                                {deletingAssistantId === assistant._id
                                  ? "Updating..."
                                  : `Yes, ${assistant.status === "active"
                                    ? "InActive"
                                    : "Active"
                                  } Assistant`}
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
                ${isActive
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
                <SelectContent className="rounded-lg shadow-md dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]" style={{ minWidth: 20 }}>
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