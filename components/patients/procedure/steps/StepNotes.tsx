"use client";

import React, { useState, useEffect } from "react";
import AudioRecorder from "@/components/ui/AudioRecorder";
import Disclaimer from "@/components/ui/Disclaimer";
import { PlusIcon, TrashIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

interface Note {
  id: string;
  transcript: string;
  voiceUrl?: string;
  createdAt: string;
}

const StepNotes = ({ formData, updateFormData, patient, doctorId }: any) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [currentVoiceUrl, setCurrentVoiceUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Sync notes with formData
  useEffect(() => {
    if (formData.notes && Array.isArray(formData.notes)) {
      setNotes(formData.notes);
    } else {
      setNotes([]);
    }
  }, [formData.notes]);

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
      alert("Please write or record a note before adding.");
      return;
    }

    setIsSaving(true);

    try {
      // Debug: Log the entire patient object
      console.log("Full patient object:", patient);
      console.log("Passed doctorId:", doctorId);

      // Get IDs from patient prop - try multiple paths
      const appointmentId = patient?.appointment?._id 
        || patient?.appointment?.id 
        || patient?.appointmentId;
      
      const patientId = patient?._id 
        || patient?.id 
        || patient?.patientId;
      
      // Use the passed doctorId prop first, then fall back to other sources
      const finalDoctorId = doctorId 
        || patient?.appointment?.doctor 
        || patient?.appointment?.doctorId 
        || patient?.doctorId
        || localStorage.getItem("doctorId");

      // Debug log
      console.log("Extracted IDs:", { 
        appointmentId, 
        patientId, 
        doctorId: finalDoctorId,
        patientKeys: patient ? Object.keys(patient) : [],
        appointmentKeys: patient?.appointment ? Object.keys(patient.appointment) : []
      });

      // Validate required IDs
      if (!appointmentId || !patientId || !finalDoctorId) {
        console.error("Missing required IDs:", { appointmentId, patientId, doctorId: finalDoctorId });
        alert(`Missing required information. Please try again.\nAppointment ID: ${appointmentId ? '✓' : '✗'}\nPatient ID: ${patientId ? '✓' : '✗'}\nDoctor ID: ${finalDoctorId ? '✓' : '✗'}`);
        setIsSaving(false);
        return;
      }

      // Prepare payload
      const payload = {
        appointmentRef: appointmentId,
        doctorRef: finalDoctorId,
        patientRef: patientId,
        rawText: currentTranscript,
      };

      console.log("Saving note with payload:", payload);

      // Get base URL from environment variable
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";
      console.log("Using base URL:", baseUrl);
      console.log("Full API URL:", `${baseUrl}/audio-notes/create`);
      
      // Get the correct token from localStorage
      const token = localStorage.getItem("clinic-ai-token");
      console.log("Token found:", token ? "Yes" : "No");
      console.log("Token length:", token?.length || 0);
      
      const response = await fetch(`${baseUrl}/audio-notes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        console.log("Note saved successfully:", result.data);
        
        // Add note to local state
        const newNote: Note = {
          id: result.data._id || Date.now().toString(),
          transcript: currentTranscript,
          voiceUrl: currentVoiceUrl,
          createdAt: new Date().toISOString(),
        };

        const currentNotes = Array.isArray(notes) ? notes : [];
        const updatedNotes = [...currentNotes, newNote];
        setNotes(updatedNotes);
        updateFormData("notes", updatedNotes);
        
        // Clear current inputs
        setCurrentTranscript("");
        setCurrentVoiceUrl("");

        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        console.error("Failed to save note:", result.message);
        alert("Failed to save note: " + result.message);
      }
    } catch (error: any) {
      console.error("Error saving note (full error):", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      alert(`Error saving note. Please try again.\n\nError: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    updateFormData("notes", updatedNotes);
  };

  const handleUpdateNoteTranscript = (id: string, newTranscript: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, transcript: newTranscript } : note
    );
    setNotes(updatedNotes);
    updateFormData("notes", updatedNotes);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
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
        />
      </div>

      {/* Main Transcription Area - Always Visible */}
      <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 p-6 rounded-2xl border-2 border-[#1FA888]/30 dark:border-[#1FA888]/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#1FA888] to-[#1DA68F] shadow-lg">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Clinical Notes</h3>
              <p className="text-xs text-muted-foreground">Type directly or use voice transcription above</p>
            </div>
          </div>
          <button
            onClick={handleAddNote}
            disabled={!currentTranscript.trim() || isSaving}
            className="px-5 py-2.5 bg-gradient-to-r from-[#1FA888] to-[#1DA68F] hover:from-[#1DA68F] hover:to-[#1FA888] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add to Notes
              </>
            )}
          </button>
        </div>

        <textarea
          value={currentTranscript}
          onChange={(e) => setCurrentTranscript(e.target.value)}
          className="w-full min-h-[280px] p-5 rounded-xl border-2 border-border/50 bg-white/80 dark:bg-background/80 backdrop-blur-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-[#1FA888] focus:border-[#1FA888] transition-all duration-200 text-sm leading-relaxed placeholder:text-muted-foreground/50 shadow-inner"
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
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {currentTranscript.length} characters
          </p>
          <p className="text-xs text-muted-foreground">
            Click <strong>"Add to Notes"</strong> to save this entry
          </p>
        </div>
      </div>

      {/* Saved Notes List */}
      {notes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-[#1FA888]/20">
            <div className="p-2 rounded-lg bg-[#1FA888]/10">
              <DocumentTextIcon className="w-5 h-5 text-[#1FA888]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Saved Patient Notes</h3>
              <p className="text-xs text-muted-foreground">{notes.length} {notes.length === 1 ? 'entry' : 'entries'} recorded</p>
            </div>
          </div>

          <div className="space-y-3">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="group bg-gradient-to-br from-muted/40 to-muted/20 dark:from-card/40 dark:to-card/20 p-5 rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-[#1FA888]/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1FA888]/20 to-[#1DA68F]/20 border-2 border-[#1FA888]/30 shadow-sm">
                      <span className="text-base font-bold text-[#1FA888]">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Note #{index + 1}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all duration-200"
                    title="Delete note"
                  >
                    <TrashIcon className="h-5 w-5 hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Audio Player */}
                {note.voiceUrl && (
                  <div className="mb-3 p-3 bg-background/60 dark:bg-background/40 rounded-lg border border-border/50">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block flex items-center gap-1">
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    📄 Transcription
                  </label>
                  <textarea
                    value={note.transcript}
                    onChange={(e) => handleUpdateNoteTranscript(note.id, e.target.value)}
                    className="w-full min-h-[120px] p-3 rounded-lg border border-border/50 bg-background/60 dark:bg-background/40 text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#1FA888]/50 focus:border-[#1FA888]/50 transition-all duration-200 leading-relaxed"
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
    </div>
  );
};

export default StepNotes;
