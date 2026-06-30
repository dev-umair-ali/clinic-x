"use client";

import { useState } from "react";
import { MoreHorizontal, Search, Eye, Edit, UserX } from "lucide-react";
import type { Assistant } from "@/lib/slices/assistantSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAssistantStatus,
  fetchAssistants,
} from "@/lib/slices/assistantSlice";
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
  assistants: Assistant[];
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
  const role = user?.role;

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
        updateAssistantStatus({
          id: assistantId,
          status: newStatus,
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        toast({
          title: "Success",
          description: `Assistant has been ${newStatus === "active" ? "activated" : "deactivated"
            } successfully.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description:
            (response.payload as string) ||
            "Failed to update assistant status. Please try again.",
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
    router.push(`/${role}/assistants/view/${assistantId}`);
  };

  const onClickEditAssistant = (assistantId: string) => {
    const role = user?.role;
    router.push(`/${role}/assistants/edit/${assistantId}`);
  };
  const visiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, visiblePages); i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <Toaster />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  ASSISTANT NAME/Email
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Assigned Clinic
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Departmennt
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Position
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
              {assistants.map((assistant) => (
                <tr
                  key={assistant._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        {assistant.profilePicture ? (
                          <img
                            src={assistant.profilePicture || "/placeholder.svg"}
                            alt={`${assistant.firstName || ""} ${assistant.lastName || ""
                              }`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {assistant.firstName && assistant.lastName
                              ? `${assistant.firstName[0]}${assistant.lastName[0]}`
                              : "NA"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {assistant.firstName || ""} {assistant.lastName || ""}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {assistant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {assistant.phoneNumber}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {typeof assistant.clinicRef === "object" &&
                      assistant.clinicRef
                      ? (assistant.clinicRef as any).clinicName
                      : assistant.clinicRef || "N/A"}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {assistant.department}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {assistant.position || "N/A"}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${assistant.status === "active"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                    >
                      {assistant.status.charAt(0).toUpperCase() +
                        assistant.status.slice(1).replace(/_/g, " ")}
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
                          onClick={() => onCliCkViewAssistant(assistant._id)}
                          className="flex items-center dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onClickEditAssistant(assistant._id)}
                          className="flex items-center dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center text-red-600 focus:text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {assistant.status === "active"
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
                                {assistant.status === "active"
                                  ? "Deactivate Assistant"
                                  : "Activate Assistant"}
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-4">
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
                                disabled={deletingAssistantId === assistant._id}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-0"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleToggleStatus(assistant._id)
                                }
                                disabled={deletingAssistantId === assistant._id}
                                className={`flex-1 text-white ${assistant.status === "active"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
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

        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
            {/* ──  left: page controls  ── */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                   hover:text-teal-600 dark:hover:text-teal-400
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* page numbers */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`h-8 w-8 rounded-md text-sm border transition-colors
              ${currentPage === p
                        ? "bg-teal-600 text-white border-teal-600 shadow"
                        : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600  hover:border-teal-500 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
                      }`}
                  >
                    {p}
                  </button>
                ))}

                {totalPages > visiblePages && (
                  <>
                    <span className="text-gray-400">…</span>
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className="h-8 w-8 rounded-md text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300hover:border-teal-500 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                   hover:text-teal-600 dark:hover:text-teal-400
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            {/* ──  right: rows-per-page  ── */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Rows per page:
              </span>

              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => onItemsPerPageChange(Number(v))}
              >
                <SelectTrigger className="h-8 w-4 text-sm border-teal-500 dark:border-teal-600 focus:ring-teal-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>

                {/* force same 64 px width and pin directly below trigger */}
                <SelectContent
                  position="popper"
                  sideOffset={0}
                  className="w-16 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
                >
                  {[10, 20, 30, 40, 50].map((s) => (
                    <SelectItem
                      key={s}
                      value={String(s)}
                      className="text-sm rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/30
                     focus:bg-teal-100 dark:focus:bg-teal-900/40"
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
