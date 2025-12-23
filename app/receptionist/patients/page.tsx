"use client";

import { useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { PatientTable } from "@/components/ui/patient-table";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchPatients } from "@/lib/slices/patientSlice";

export default function ReceptionistPatientsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );

  const patientsData = useMemo(() => patients, [patients]);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
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
                onClick={() => handleNavigation("/clinic/patients/add")}
                className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] min-w-[130px] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--color-brand-teal-dark))] flex justify-center items-center gap-2 font-bold text-sm transition-colors mt-4 sm:mt-0"
              >
                + Add Patient
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {/* ----- TOTAL PATIENTS ----- */}
              <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-chart-blue)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-chart-blue))]"
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
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Total Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-chart-blue))]">
                      {patientsData.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* ----- ACTIVE PATIENTS ----- */}
              <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-status-success)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-status-success))]"
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
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Active Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-status-success))]">
                      {patientsData.filter((p) => p.status === "active").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* ----- IN-ACTIVE PATIENTS ----- */}
              <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-[hsl(var(--color-chart-orange)/0.1)] rounded-full mr-4">
                    <svg
                      className="w-7 h-7 text-[hsl(var(--color-chart-orange))]"
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
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      In-Active Patients
                    </p>
                    <p className="text-3xl font-bold text-[hsl(var(--color-chart-orange))]">
                      {
                        patientsData.filter((p) => p.status === "inactive")
                          .length
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
            <PatientTable patients={patientsData} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
