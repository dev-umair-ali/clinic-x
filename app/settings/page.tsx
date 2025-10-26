"use client"

import { ProtectedRoute } from "@/components/ui/protected-route"

export default function GlobalSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "doctor", "patient"]}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Global Settings</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-700">This page provides access to general application settings.</p>
            <p className="mt-4 text-gray-500">
              *Future implementation will include theme settings, language preferences, and general app configurations.*
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
