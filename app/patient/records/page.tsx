"use client"

import { ProtectedRoute } from "@/components/ui/protected-route"

export default function PatientMedicalRecordsPage() {
  const mockMedicalRecords = [
    {
      id: "REC001",
      date: "2024-07-15",
      type: "Consultation Note",
      doctor: "Dr. Sarah Chen",
      summary: "Routine check-up, patient in good health.",
    },
    {
      id: "REC002",
      date: "2024-06-01",
      type: "Lab Results",
      doctor: "Dr. Michael Rodriguez",
      summary: "Blood test results: all within normal range.",
    },
    {
      id: "REC003",
      date: "2024-05-20",
      type: "Diagnosis Report",
      doctor: "Dr. Sarah Chen",
      summary: "Diagnosis of seasonal allergies, prescribed antihistamines.",
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Medical Records</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-700">This page will provide access to your comprehensive medical records.</p>
            <p className="mt-4 text-gray-500">
              *Future implementation will include lab results, visit summaries, vaccination history, and more.*
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
