"use client";

import { useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { DoctorTable } from "@/components/ui/doctor-table";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchDoctors } from "@/lib/slices/doctorSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Users, UserCheck, User } from "lucide-react"; // icons for the boxes

export default function AdminDoctorsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { doctors, loading, error } = useSelector(
    (state: RootState) => state.doctors
  );
  const doctorsData = useMemo(() => doctors, [doctors])

  useEffect(() => {
    // Fetch doctors when component mounts
    dispatch(fetchDoctors());
  }, [dispatch])

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Calculate active doctors count
  const activeDoctorsCount = doctorsData.filter(doctor => doctor.status === "active").length;
  const inactiveDoctorsCount = doctorsData.filter(doctor => doctor.status === "inactive").length;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Doctors
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and monitor all doctors across your clinics
              </p>
            </div>
            <Button
              onClick={() => handleNavigation("/admin/doctors/add")}
              className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Doctor</span>
            </Button>
          </div>

          {/* Stats Boxes */}
          {/* Stats Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-6 min-h-[110px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Doctors
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {doctorsData.length}
                </p>
              </div>
            </div>

            <div className="flex items-center p-6 min-h-[110px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <UserCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Doctor
                </p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {activeDoctorsCount}
                </p>
              </div>
            </div>

            <div className="flex items-center p-6 min-h-[110px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <User className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inactive Doctors
                </p>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {inactiveDoctorsCount}
                </p>
              </div>
            </div>
          </div>

          {/* Error Handling */}
          {error && doctorsData.length === 0 && (
            <div className="mb-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Loading / Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Loading doctors...
              </span>
            </div>
          ) : (
            <DoctorTable doctors={doctorsData} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}