"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { Eye, RotateCcw, ArrowLeft, Plus, FileText, X } from "lucide-react";
import { AcceptPrescriptionModal } from "@/components/ui/AcceptPrescriptionModal";
import { RejectPrescriptionModal } from "@/components/ui/RejectPrescriptionModal";
import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

// Dummy prescription data
const prescriptionHistory = [
  {
    id: 1,
    date: "15/01/2024",
    medication: "Amoxicillin 500mg",
    dosage: "500mg twice daily",
  },
  {
    id: 2,
    date: "15/01/2024",
    medication: "Amoxicillin 500mg",
    dosage: "500mg twice daily",
  },
  {
    id: 3,
    date: "15/01/2024",
    medication: "Amoxicillin 500mg",
    dosage: "500mg twice daily",
  },
  {
    id: 4,
    date: "15/01/2024",
    medication: "Amoxicillin 500mg",
    dosage: "500mg twice daily",
  },
  {
    id: 5,
    date: "15/01/2024",
    medication: "Amoxicillin 500mg",
    dosage: "500mg twice daily",
  },
  {
    id: 6,
    date: "15/01/2024",
    medication: "Amoxicillin 500mg",
    dosage: "500mg twice daily",
  },
];

const dummyPatients = [
  "John Carter",
  "Emily Davis",
  "Michael Thompson",
  "Olivia Bennett",
  "James Miller",
  "William Parker",
];

export default function PrescriptionDashboard() {
  /* ====== MODAL STATE ====== */
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    (typeof prescriptionHistory)[0] | null
  >(null);

  const openAccept = (row: (typeof prescriptionHistory)[0]) => {
    setSelectedRow(row);
    setAcceptOpen(true);
  };
  const openReject = (row: (typeof prescriptionHistory)[0]) => {
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

  // Main view state
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);

  // Add prescription form state
  const [selectedPatient, setSelectedPatient] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [savedMedications, setSavedMedications] = useState([
    "Medication Name - Date",
    "Medication Name - Date",
  ]);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [form, setForm] = useState("");
  const [refills, setRefills] = useState("");
  const [times, setTimes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [doNotRefill, setDoNotRefill] = useState(false);
  const [substitutionPermissible, setSubstitutionPermissible] = useState(false);
  const [doNotSubstitute, setDoNotSubstitute] = useState(false);

  // Handlers
  const handleViewPrescription = () => {
    setShowPrescriptionDetails(true);
  };

  const handleAddPrescription = () => {
    setCurrentView("add");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setShowPrescriptionDetails(false);
    // Reset form
    setSelectedPatient("");
    setMedicationName("");
    setDosage("");
    setInstructions("");
    setForm("");
    setRefills("");
    setTimes("");
    setDiagnosis("");
    setDoNotRefill(false);
    setSubstitutionPermissible(false);
    setDoNotSubstitute(false);
  };

  const handleVoiceTranscription = (text: string) => {
    setInstructions(text);
  };

  const handleAddNewMedication = () => {
    if (medicationName && dosage) {
      setSavedMedications([
        ...savedMedications,
        `${medicationName} ${dosage} - ${new Date().toLocaleDateString()}`,
      ]);
      setMedicationName("");
      setDosage("");
    }
  };

  const handleSavePrescription = () => {
    const prescriptionData = {
      selectedPatient,
      medicationName,
      dosage,
      instructions,
      form,
      refills,
      times,
      diagnosis,
      doNotRefill,
      substitutionPermissible,
      doNotSubstitute,
    };
    console.log("Saving prescription:", prescriptionData);
    // Show success message
    alert("✅ Prescription saved successfully!");
    // Optionally go back to list
    handleBackToList();
  };

  // Render Add Prescription View
  if (currentView === "add") {
    return (
      <ProtectedRoute allowedRoles={["receptionist", "clinic", "admin"]}>
        <div className="min-h-screen bg-[hsl(var(--background))]">
          {/* Header */}
          <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] sticky top-0 z-10">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-[hsl(var(--muted))]/50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[hsl(var(--foreground))]">
                    Add Prescription
                  </h1>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Convert voice recordings to structured prescriptions using
                    AI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <div className="bg-[hsl(var(--card))] rounded-lg p-4 sm:p-6 shadow-sm border border-[hsl(var(--border))]">
                  <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
                    Select Patient
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowPatientDropdown(!showPatientDropdown)
                      }
                      className="w-full p-3 border border-[hsl(var(--border))] rounded-lg text-left bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]/50 flex items-center justify-between transition-colors"
                    >
                      <span
                        className={
                          selectedPatient
                            ? "text-[hsl(var(--foreground))]"
                            : "text-[hsl(var(--muted-foreground))]"
                        }
                      >
                        {selectedPatient || "Select Patient"}
                      </span>
                      <svg
                        className="h-4 w-4 text-[hsl(var(--muted-foreground))]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {showPatientDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {dummyPatients.map((patient) => (
                          <button
                            key={patient}
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowPatientDropdown(false);
                            }}
                            className="w-full p-3 text-left hover:bg-[hsl(var(--muted))]/50 border-b border-[hsl(var(--border))] last:border-b-0 text-[hsl(var(--foreground))] transition-colors"
                          >
                            {patient}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Voice Recording */}
                <div className="bg-[hsl(var(--card))] rounded-lg p-4 sm:p-6 shadow-sm border border-[hsl(var(--border))]">
                  <VoiceRecorder
                    onTranscription={handleVoiceTranscription}
                    placeholder="Start speaking to dictate prescription..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-[hsl(var(--card))] rounded-lg p-4 sm:p-6 shadow-sm border border-[hsl(var(--border))]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        Prescription Details
                      </span>
                    </div>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  {/* Saved Medications */}
                  <div className="mb-6">
                    <h3 className="font-medium text-[hsl(var(--foreground))] mb-3">
                      Saved Medications
                    </h3>
                    <div className="space-y-2">
                      {savedMedications.map((med, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-[hsl(var(--border))] rounded bg-[hsl(var(--muted))]/30"
                        >
                          <span className="text-[hsl(var(--muted-foreground))]">{med}</span>
                          <button
                            onClick={() =>
                              setSavedMedications(
                                savedMedications.filter((_, i) => i !== index)
                              )
                            }
                            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--color-status-error))] transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medication Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Medication Name"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                        className="p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        className="p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      />
                    </div>
                    <div className="relative">
                      <textarea
                        placeholder="Instructions / SIG (how to take it) - Use voice recording on the left or type here"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      />
                      {instructions && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-[hsl(var(--color-brand-teal-light))] text-[hsl(var(--color-brand-teal))] dark:bg-[hsl(var(--color-brand-teal))/0.3] dark:text-[hsl(var(--color-brand-teal))] px-2 py-1 rounded text-xs font-medium">
                            {instructions.includes("voice")
                              ? "Voice Input"
                              : "Text Input"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Form (tablet, liquid, etc.)"
                        value={form}
                        onChange={(e) => setForm(e.target.value)}
                        className="p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      />
                      {/* Make inner inputs responsive */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Refills"
                          value={refills}
                          onChange={(e) => setRefills(e.target.value)}
                          className="w-full p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                        />
                        <input
                          type="text"
                          placeholder="Times"
                          value={times}
                          onChange={(e) => setTimes(e.target.value)}
                          className="w-full p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={doNotRefill}
                          onChange={(e) => setDoNotRefill(e.target.checked)}
                          className="rounded border-[hsl(var(--border))]"
                        />
                        <span className="text-sm text-[hsl(var(--foreground))]">
                          Do Not Refill
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={substitutionPermissible}
                          onChange={(e) =>
                            setSubstitutionPermissible(e.target.checked)
                          }
                          className="rounded border-[hsl(var(--border))]"
                        />
                        <span className="text-sm text-[hsl(var(--foreground))]">
                          Substitution Permissible
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={doNotSubstitute}
                          onChange={(e) => setDoNotSubstitute(e.target.checked)}
                          className="rounded border-[hsl(var(--border))]"
                        />
                        <span className="text-sm text-[hsl(var(--foreground))]">
                          Do Not Substitute
                        </span>
                      </label>
                    </div>
                    <textarea
                      placeholder="Diagnosis or notes (optional)"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-transparent bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                    />
                    <button
                      onClick={handleAddNewMedication}
                      disabled={!medicationName || !dosage}
                      className="text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] font-medium flex items-center gap-2 disabled:text-[hsl(var(--muted-foreground))] disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Medication
                    </button>

                    {/* Disclaimer */}
                    <div className="bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.1)] p-4 rounded-lg border border-[hsl(var(--color-chart-blue))] dark:border-[hsl(var(--color-chart-blue))]">
                      <div className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-[hsl(var(--color-chart-blue))] mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] text-sm">
                            ⚠️ AI Disclaimer
                          </p>
                          <p className="text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] text-sm mt-1">
                            This prescription is generated using AI and may
                            contain errors. Please review carefully and make
                            necessary corrections before finalizing.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleSavePrescription}
                        // disabled={!selectedPatient || !medicationName}
                        className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] disabled:bg-[hsl(var(--muted))] disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Prescription
                      </button>
                      <button
                        onClick={handleViewPrescription}
                        className="flex-1 bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]/50 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] py-3 rounded-lg font-medium transition-colors"
                      >
                        View Prescription
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Render Main Prescription List View
  return (
    <ProtectedRoute allowedRoles={["receptionist", "clinic", "admin"]}>
      <div className="flex-1 overflow-y-auto bg-[hsl(var(--background))] min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                Prescription History
              </h1>
              <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                Convert voice recordings to structured prescriptions using AI
              </p>
            </div>
            <button
              onClick={handleAddPrescription}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Prescription
            </button>
          </div>

          {/* Prescription History Table */}
          <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm overflow-hidden border border-[hsl(var(--border))]">
            <div className="p-4 sm:p-6 border-b border-[hsl(var(--border))]">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                Prescription History
              </h2>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {prescriptionHistory.map((prescription, index) => (
                <div
                  key={prescription.id}
                  className="p-4 border-b border-[hsl(var(--border))] last:border-b-0"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))]">
                          {prescription.medication}
                        </p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {prescription.dosage}
                        </p>
                      </div>
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        {prescription.date}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleViewPrescription}
                        className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 flex-1 justify-center"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button className="bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]/50 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 flex-1 justify-center">
                        <RotateCcw className="h-3 w-3" />
                        Refill
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[hsl(var(--muted))]/30">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-[hsl(var(--foreground))]">
                      DATE
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[hsl(var(--foreground))]">
                      MEDICATION
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[hsl(var(--foreground))]">
                      DOSAGE
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[hsl(var(--foreground))]">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionHistory.map((prescription, index) => (
                    <tr
                      key={prescription.id}
                      className={`${
                        index % 2 === 0 ? "bg-[hsl(var(--card))]" : "bg-[hsl(var(--muted))]/30"
                      } hover:bg-[hsl(var(--muted))]/50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-[hsl(var(--foreground))]">
                        {prescription.date}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--foreground))]">
                        {prescription.medication}
                      </td>
                      <td className="py-4 px-6 text-[hsl(var(--foreground))]">
                        {prescription.dosage}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={handleViewPrescription}
                            className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-4 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                          <button
                            onClick={() => openAccept(prescription)}
                            className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-4 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <FaCheck className="h-3 w-3" />
                            Accept
                          </button>
                          <button
                            onClick={() => openReject(prescription)}
                            className="bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]/50 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] px-4 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
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
            <div className="p-4 sm:p-6 border-t border-[hsl(var(--border))]">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button className="px-3 py-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[hsl(var(--color-brand-teal))] text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] text-sm transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm transition-colors">
                  Next
                </button>
                <span className="ml-4 text-[hsl(var(--muted-foreground))] text-sm">
                  10 /Pages
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Details Modal */}
        {showPrescriptionDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none bg-[hsl(var(--background))]/50">
            <div className="bg-[hsl(var(--card))] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[hsl(var(--border))] pointer-events-auto">
              <div className="p-4 sm:p-6 border-b border-[hsl(var(--border))]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[hsl(var(--color-chart-blue))]" />
                    <h2 className="text-lg sm:text-xl font-semibold text-[hsl(var(--foreground))]">
                      Prescription Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowPrescriptionDetails(false)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                {/* State and Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      State
                    </h3>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      State of New Jersey
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      Date Prescribed
                    </h3>
                    <p className="font-medium text-[hsl(var(--foreground))]">Dec 15, 2024</p>
                  </div>
                </div>

                {/* Prescriber Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      Prescriber Name
                    </h3>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      PANKAJ RAMANLAL SHIROLWALA, M.D.
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                      (732) 442-2211
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      NPI Number: 1003882523
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                      DEA: BS9168091
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      Prescriber Address
                    </h3>
                    <p className="text-sm text-[hsl(var(--foreground))]">
                      609 AMBOY AVENUE, SUITE 101,
                    </p>
                    <p className="text-sm text-[hsl(var(--foreground))]">
                      PERTH AMBOY, NJ 08861
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                      (732) 326-0517
                    </p>
                  </div>
                </div>

                {/* Patient Details */}
                <div>
                  <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
                    Patient Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                        Patient Name
                      </h4>
                      <p className="font-medium text-[hsl(var(--foreground))]">
                        {selectedPatient || "Sarah Conner"}
                      </p>
                      <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 mt-4">
                        Patient Details
                      </h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Complete medical history available in patient records.
                        Regular checkups recommended for ongoing treatment
                        monitoring.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                        Patient Address
                      </h4>
                      <p className="text-sm text-[hsl(var(--foreground))]">
                        609 AMBOY AVENUE, SUITE 101,
                      </p>
                      <p className="text-sm text-[hsl(var(--foreground))]">
                        PERTH AMBOY, NJ 08861
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prescription Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      Substitution Permissible
                    </h4>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {substitutionPermissible ? "YES" : "NO"}
                    </p>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 mt-4">
                      Generic Substitute
                    </h4>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {!doNotSubstitute ? "YES" : "NO"}
                    </p>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 mt-4">
                      Medication
                    </h4>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {medicationName || "Amoxicillin 500mg"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      Do Not Refill
                    </h4>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {doNotRefill ? "YES" : "NO"}
                    </p>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 mt-4">
                      Refills
                    </h4>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {refills || "2 Times Weekly"}
                    </p>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 mt-4">
                      Dosage
                    </h4>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {dosage || "500mg twice daily"}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                    Instructions
                  </h4>
                  <p className="text-sm text-[hsl(var(--foreground))]">
                    {instructions ||
                      "Take with food for 7 days. Complete the full course even if symptoms improve."}
                  </p>
                </div>

                {diagnosis && (
                  <div>
                    <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                      Diagnosis/Notes
                    </h4>
                    <p className="text-sm text-[hsl(var(--foreground))]">{diagnosis}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white py-3 rounded-lg font-medium transition-colors">
                    Download
                  </button>
                  {/* <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors">
                    📧 Send to Pharmacy
                  </button> */}
                  <button
                    onClick={() => setShowPrescriptionDetails(false)}
                    className="flex-1 bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]/50 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] py-3 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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