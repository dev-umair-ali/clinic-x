"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";

export default function PrescriptionDashboard() {
  /* ====== MODAL STATE ====== */
  const [chartId, setChartId] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex-1 overflow-y-auto bg-[hsl(var(--background))] min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                Prescription History
              </h1>
            </div>
          </div>

          {/* Prescription History Table */}
          <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm overflow-hidden border border-[hsl(var(--border))]">
            <div className="p-4 sm:p-6 border-b border-[hsl(var(--border))]">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                Prescription History
              </h2>
            </div>

            {/* Prescription iFrame */}
            <div className="w-full h-[600px] sm:h-[700px] lg:h-[800px]">
              <iframe
                src={`https://ssu.scriptsure.com/chart/${chartId || ''}/prescriptions?sessiontoken=${sessionToken || ''}&darkmode=off`}
                className="w-full h-full border-0"
                title="Prescription List"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}