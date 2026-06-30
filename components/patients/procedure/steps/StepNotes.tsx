"use client";

import React, { useState, useEffect } from "react";
import AudioRecorder from "@/components/ui/AudioRecorder";
import Disclaimer from "@/components/ui/Disclaimer";
import {
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Note {
  _id: string;
  transcript: string;
  voiceUrl?: string;
  createdAt: string;
}

const StepNotes = ({
  formData,
  updateFormData,
  doctorId,
  appointmentId,
  patientId,
}: any) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [currentVoiceUrl, setCurrentVoiceUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [savingStep, setSavingStep] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { patientDetails } = useSelector((state: any) => state.appointments);

  useEffect(() => {
    if (appointmentId) {
      getAllNotes();
    }
  }, [appointmentId]);

  const getAllNotes = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";
      const token = localStorage.getItem("clinic-ai-token");

      const response = await fetch(
        `${baseUrl}/doctor/notes/appointment-notes/${appointmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();
      if (result.success && result.notes) {
        const fetchedNotes = result.notes.map((note: any) => ({
          _id: note._id,
          transcript: note.rawText,
          voiceUrl: note.audioTranscriptUrl,
          createdAt: note.createdAt,
        }));
        setNotes(fetchedNotes);
        updateFormData("notes", fetchedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleAddNote = async () => {
    if (!currentTranscript.trim()) {
      toast({
        title: "Error",
        description: "Please write or record a note before adding.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setSavingStep("Saving note...");

    try {
      if (!appointmentId || !patientId || !doctorId) {
        toast({
          title: "Error",
          description: `Missing required information. Please try again.\nAppointment ID: ${appointmentId ? "✓" : "✗"}\nPatient ID: ${patientId ? "✓" : "✗"}\nDoctor ID: ${doctorId ? "✓" : "✗"}`,
          variant: "destructive",
        });
        setIsSaving(false);
        setSavingStep("");
        return;
      }
      const payload = {
        appointmentRef: appointmentId,
        doctorRef: doctorId,
        patientRef: patientId,
        clinicRef: patientDetails?.patient.clinicRef || "",
        rawText: currentTranscript,
        audioTranscriptUrl: currentVoiceUrl || "",
      };

      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

      const token = localStorage.getItem("clinic-ai-token");

      const response = await fetch(`${baseUrl}/doctor/notes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to save note: " + result.message,
          variant: "destructive",
        });
        setIsSaving(false);
        setCurrentTranscript("");
        return;
      }
      setShowSuccessMessage(true);
      getAllNotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error saving note. Please try again.\n\nError: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";
      const token = localStorage.getItem("clinic-ai-token");

      const response = await fetch(
        `${baseUrl}/doctor/notes/note/${noteToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to delete note: " + result.message,
          variant: "destructive",
        });
        return;
      }

      // Update local state after successful deletion
      const updatedNotes = notes.filter((note) => note._id !== noteToDelete);
      setNotes(updatedNotes);
      updateFormData("notes", updatedNotes);

      toast({
        title: "Success",
        description: "Note deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error deleting note: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setNoteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setNoteToDelete(null);
  };

  const handleUpdateNoteTranscript = (id: string, newTranscript: string) => {
    const updatedNotes = notes.map((note) =>
      note._id === id ? { ...note, transcript: newTranscript } : note,
    );
    setNotes(updatedNotes);
    updateFormData("notes", updatedNotes);
  };

  return (
    <div className="flex flex-col gap-6">
      <Toaster />
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-[hsl(var(--color-status-success))] text-[hsl(var(--primary-foreground))] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6" />
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Note saved successfully</p>
            </div>
          </div>
        </div>
      )}

      {/* Audio Recorder Section */}
      <div className="w-full">
        <AudioRecorder
          label="Record Voice Note"
          audioUrl={currentVoiceUrl}
          onSave={(url: string) => setCurrentVoiceUrl(url)}
          onTranscription={(text: string) => setCurrentTranscript(text)}
          setCurrentVoiceUrl={setCurrentVoiceUrl}
        />
      </div>

      {/* Main Transcription Area - Always Visible */}
      <div className="bg-gradient-to-br from-[hsl(var(--color-bg-blue-tint)/0.5)] via-[hsl(var(--color-bg-pink-tint)/0.3)] to-[hsl(var(--color-bg-pink-tint)/0.3)] dark:from-[hsl(var(--color-chart-blue)/0.2)] dark:via-[hsl(var(--color-chart-purple)/0.2)] dark:to-[hsl(var(--color-pink-vibrant)/0.2)] p-6 rounded-2xl border-2 border-[hsl(var(--color-brand-teal)/0.3)] dark:border-[hsl(var(--color-brand-teal)/0.2)] shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[hsl(var(--color-brand-teal))] to-[hsl(var(--color-brand-teal))] shadow-lg">
              <DocumentTextIcon className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[hsl(var(--foreground))]">
                Clinical Notes
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Type directly or use voice transcription above
              </p>
            </div>
          </div>
          <button
            onClick={handleAddNote}
            disabled={!currentTranscript.trim() || isSaving}
            className="px-5 py-2.5 bg-[hsl(var(--color-brand-teal))]  hover:[hsl(var(--color-brand-teal/0.2))]  disabled:from-[hsl(var(--muted))] disabled:to-[hsl(var(--muted))] disabled:cursor-not-allowed text-[hsl(var(--primary-foreground))] text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-[hsl(var(--primary-foreground))]"
                  xmlns="http://www.w3.org/2000/svg "
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-xs">{savingStep || "Saving..."}</span>
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add Note
              </>
            )}
          </button>
        </div>

        <textarea
          value={currentTranscript}
          onChange={(e) => setCurrentTranscript(e.target.value)}
          className="w-full min-h-[280px] p-5 rounded-xl border-2 border-[hsl(var(--border)/0.5)] bg-[hsl(var(--background)/0.8)] dark:bg-[hsl(var(--background)/0.8)] backdrop-blur-sm text-[hsl(var(--foreground))] resize-y focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] transition-all duration-200 text-sm leading-relaxed placeholder:text-[hsl(var(--muted-foreground)/0.5)] shadow-inner"
          placeholder="📝 Start typing your clinical notes here...

You can:
• Type notes directly
• Or click 'Transcribe' above after recording
• Edit the AI transcription as needed
• Use SOAP format: Subjective, Objective, Assessment, Plan

Example:
S: Patient reports headache for 3 days
O: BP 120/80, temp 98.6°F
A: Tension headache
P: Prescribe ibuprofen 400mg TID"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--color-status-success))] animate-pulse"></span>
            {currentTranscript.length} characters
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Click <strong>"Add Note"</strong> to save this entry
          </p>
        </div>
      </div>

      {/* Saved Notes List */}
      {notes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-[hsl(var(--color-brand-teal)/0.2)]">
            <div className="p-2 rounded-lg bg-[hsl(var(--color-brand-teal)/0.1)]">
              <DocumentTextIcon className="w-5 h-5 text-[hsl(var(--color-brand-teal))]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">
                Saved Patient Notes
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {notes.length} {notes.length === 1 ? "entry" : "entries"}{" "}
                recorded
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {notes.map((note, index) => (
              <div
                key={note._id}
                className="group bg-gradient-to-br from-[hsl(var(--muted)/0.4)] to-[hsl(var(--muted)/0.2)] dark:from-[hsl(var(--card)/0.4)] dark:to-[hsl(var(--card)/0.2)] p-5 rounded-xl border border-[hsl(var(--border)/0.5)] shadow-sm hover:shadow-md hover:border-[hsl(var(--color-brand-teal)/0.3)] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--color-brand-teal)/0.2)] to-[hsl(var(--color-brand-teal)/0.2)] border-2 border-[hsl(var(--color-brand-teal)/0.3)] shadow-sm">
                      <span className="text-base font-bold text-[hsl(var(--color-brand-teal))]">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[hsl(var(--foreground))]">
                        Note #{index + 1}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(note?._id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] transition-all duration-200"
                    title="Delete note"
                  >
                    <TrashIcon className="h-5 w-5 hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Audio Player */}
                {note.voiceUrl && (
                  <div className="mb-3 p-3 bg-[hsl(var(--background)/0.6)] dark:bg-[hsl(var(--background)/0.4)] rounded-lg border border-[hsl(var(--border)/0.5)]">
                    <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-2 block flex items-center gap-1">
                      🎵 Audio Recording
                    </label>
                    <audio
                      controls
                      src={note.voiceUrl}
                      className="w-full h-8 rounded-lg"
                    />
                  </div>
                )}

                {/* Editable Transcript */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide flex items-center gap-1">
                    📄 Transcription
                  </label>
                  <textarea
                    value={note.transcript}
                    disabled
                    // onChange={(e) => handleUpdateNoteTranscript(note._id, e.target.value)}
                    className="w-full min-h-[120px] p-3 rounded-lg border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--background)/0.6)] dark:bg-[hsl(var(--background)/0.4)] text-[hsl(var(--foreground))] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal)/0.5)] focus:border-[hsl(var(--color-brand-teal)/0.5)] transition-all duration-200 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4">
        <Disclaimer />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[hsl(var(--card))] border-2 border-[hsl(var(--border))] rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-[hsl(var(--color-status-error)/0.1)]">
                  <TrashIcon className="h-6 w-6 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">
                    Delete Note
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-[hsl(var(--foreground))] mb-6">
                Are you sure you want to delete this clinical note? This will
                permanently remove the note and its audio recording from the
                patient's records.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted)/0.8)] text-[hsl(var(--foreground))] font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[hsl(var(--color-status-error))] to-[hsl(var(--color-status-error))] hover:from-[hsl(var(--color-status-error))] hover:to-[hsl(var(--color-status-error))] text-[hsl(var(--primary-foreground))] font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Delete Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepNotes;