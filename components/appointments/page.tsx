"use client"

import { useEffect } from "react"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { AppointmentTable } from "@/components/ui/appointment-table"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchAppointments } from "@/lib/slices/appointmentSlice"

export default function AdminAppointmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading, error } = useSelector((state: RootState) => state.appointments)

  useEffect(() => {
    // Fetch appointments when component mounts
    dispatch(fetchAppointments());
  }, [dispatch]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Appointment Management</h1>
          
          {error && appointments.length === 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              ✅ Successfully loaded {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          ) : (
            <AppointmentTable appointments={appointments} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
