"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { AcceptPrescriptionModal } from "@/components/ui/AcceptPrescriptionModal";
import { RejectPrescriptionModal } from "@/components/ui/RejectPrescriptionModal";
import { Eye, RotateCcw, Plus, FileText } from "lucide-react";
import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

const prescriptionHistory = [
  { id: 1, date: "15/01/2024", medication: "Amoxicillin 500mg", dosage: "500mg twice daily" },
  { id: 2, date: "15/01/2024", medication: "Amoxicillin 500mg", dosage: "500mg twice daily" },
  { id: 3, date: "15/01/2024", medication: "Amoxicillin 500mg", dosage: "500mg twice daily" },
  { id: 4, date: "15/01/2024", medication: "Amoxicillin 500mg", dosage: "500mg twice daily" },
  { id: 5, date: "15/01/2024", medication: "Amoxicillin 500mg", dosage: "500mg twice daily" },
  { id: 6, date: "15/01/2024", medication: "Amoxicillin 500mg", dosage: "500mg twice daily" },
];

export default function PrescriptionDashboard() {
  /* ====== MODAL STATE ====== */
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<typeof prescriptionHistory[0] | null>(null);

  const openAccept = (row: typeof prescriptionHistory[0]) => {
    setSelectedRow(row);
    setAcceptOpen(true);
  };
  const openReject = (row: typeof prescriptionHistory[0]) => {
    setSelectedRow(row);
    setRejectOpen(true);
  };

  const handleAccept = () => {
    console.log("✅ ACCEPTED", selectedRow);
    setAcceptOpen(false);
  };
  const handleReject = (reason: string) => {
    console.log("❌ REJECTED", selectedRow, reason);
    setRejectOpen(false);
  };

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="flex-1 overflow-y-auto bg-background min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Prescription History</h1>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Prescription History</h2>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {prescriptionHistory.map((prescription) => (
                <div key={prescription.id} className="p-4 border-b border-border last:border-b-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{prescription.medication}</p>
                        <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{prescription.date}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openAccept(prescription)}
                        className="bg-[#1FA888] hover:bg-teal-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 flex-1 justify-center"
                      >
                        <FaCheck  className="h-3 w-3" />
                        Accept
                      </button>
                      <button
                        onClick={() => openReject(prescription)}
                        className="bg-background hover:bg-muted/50 text-foreground border border-border px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 flex-1 justify-center"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-foreground">DATE</th>
                    <th className="text-left py-3 px-6 font-medium text-foreground">MEDICATION</th>
                    <th className="text-left py-3 px-6 font-medium text-foreground">DOSAGE</th>
                    <th className="text-left py-3 px-6 font-medium text-foreground">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionHistory.map((prescription, index) => (
                    <tr
                      key={prescription.id}
                      className={`${index % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-muted/50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-foreground">{prescription.date}</td>
                      <td className="py-4 px-6 text-foreground">{prescription.medication}</td>
                      <td className="py-4 px-6 text-foreground">{prescription.dosage}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openAccept(prescription)}
                            className="bg-[#1FA888] hover:bg-teal-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <FaCheck className="h-3 w-3" />
                            Accept
                          </button>
                          <button
                            onClick={() => openReject(prescription)}
                            className="bg-background hover:bg-muted/50 text-foreground border border-border px-4 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <FcCancel className="h-3 w-3" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 sm:p-6 border-t border-border">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button className="px-3 py-1 text-muted-foreground hover:text-foreground text-sm transition-colors">Previous</button>
                <button className="px-3 py-1 bg-[#1FA888] text-white rounded text-sm">1</button>
                <button className="px-3 py-1 text-foreground hover:text-foreground text-sm transition-colors">2</button>
                <button className="px-3 py-1 text-muted-foreground hover:text-foreground text-sm transition-colors">Next</button>
                <span className="ml-4 text-muted-foreground text-sm">10 /Pages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <AcceptPrescriptionModal
        open={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        onConfirm={handleAccept}
        medication={selectedRow?.medication || ""}
        dosage={selectedRow?.dosage || ""}
      />
      <RejectPrescriptionModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        medication={selectedRow?.medication || ""}
        dosage={selectedRow?.dosage || ""}
      />
    </ProtectedRoute>
  );
}