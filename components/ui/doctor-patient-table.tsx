"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Eye, UserX, Search } from "lucide-react";
import type { Patient } from "@/lib/slices/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { updatePatientStatus, fetchPatients } from "@/lib/slices/patientSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import moment from "moment";
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
import { DoctorPatient } from "@/lib/api/services/doctorPatientService";

interface PatientTableProps {
  patients: (Patient | DoctorPatient)[];
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

  return (
    <>
      <Toaster />
      <div className="bg-[hsl(var(--card))] rounded-xl shadow-md border border-[hsl(var(--border))]">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--muted))]">
              <tr>
                {[
                  "PATIENT NAME",
                  "AGE",
                  "GENDER",
                  "CLINIC",
                  "DOCTOR",
                  "LAST VISIT",
                  "STATUS",
                  "ACTION",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-[hsl(var(--muted))]/50 transition-colors"
                >
                  {/* Patient Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          patient?.profilePicture ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={`${patient.firstName} ${patient.lastName}`}
                        className="h-9 w-9 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium text-[hsl(var(--foreground))]">
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
                  <td className="px-6 py-4 text-[hsl(var(--foreground))]">
                    {patient.age} Years
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))]">
                    {patient.gender || "Male"}
                  </td>

                  {/* Clinic */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))]">
                    {(patient?.clinicRef as any)?.clinicName ||
                      "No clinic assigned"}
                  </td>

                  {/* Doctor */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))]">
                    {(patient?.doctorRef as any)?.firstName +
                      " " +
                      (patient?.doctorRef as any)?.lastName ||
                      "No doctor assigned"}
                  </td>

                  {/* Last Visit */}
                  <td className="px-6 py-4 text-[hsl(var(--foreground))]">
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
                          ? "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]"
                          : "bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))]"
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
                          className="h-8 w-8 p-0 hover:bg-[hsl(var(--muted))]"
                        >
                          <MoreHorizontal className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[hsl(var(--card))] shadow-lg rounded-md border border-[hsl(var(--border))]"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/doctor/patients/view/${patient._id}`)
                          }
                          className="cursor-pointer hover:bg-[hsl(var(--muted))]/50"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-[hsl(var(--border))]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* ---------- page controls ---------- */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))]
                   hover:text-[hsl(var(--color-brand-teal))]
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
                            ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--sidebar-foreground))] border-[hsl(var(--color-brand-teal))] shadow"
                            : "text-[hsl(var(--foreground))] border-[hsl(var(--border))]" +
                              " hover:border-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal))]"
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
                className="px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))]
                   hover:text-[hsl(var(--color-brand-teal))]
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* ---------- rows per page ---------- */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                Rows per page:
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => onItemsPerPageChange(Number(v))}
              >
                <SelectTrigger className="h-9 w-20 text-sm rounded-lg border-[hsl(var(--color-brand-teal))] focus:ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
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
    </>
  );
}
