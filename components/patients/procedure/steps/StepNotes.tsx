"use client";

import React, { useState } from "react";
import Input from "@/components/ui/ProcedureInput";
import AudioRecorder from "@/components/ui/AudioRecorder";
import Disclaimer from "@/components/ui/Disclaimer";

const StepNotes = ({ formData, updateFormData }: any) => {
  const [savedNote, setSavedNote] = useState<any>(null);

  const handleSave = () => {
    const note = {
      voiceUrl: formData.notes?.voiceUrl || "",
      transcript: formData.notes?.transcript || "",
      createdAt: new Date().toISOString(),
    };
    updateFormData("notes", note);
    setSavedNote(note);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col justify-between gap-6">
      {/* Audio Recorder Section */}
      <div className="w-full">
        <AudioRecorder
          label="Voice Note"
          audioUrl={formData.notes?.voiceUrl}
          onSave={(url: string) =>
            updateFormData("notes", { ...formData.notes, voiceUrl: url })
          }
          onTranscription={(text: string) =>
            updateFormData("notes", { ...formData.notes, transcript: text })
          }
        />
      </div>

      {/* Live Transcription Section */}
      <div className="bg-primary/10 dark:bg-primary/20 p-4 w-full rounded-lg border border-primary/20 dark:border-primary/30 transition-colors">
        <div className="space-y-3">
          <Input
            label="Live Transcription (Editable)"
            type="textarea"
            placeholder="Voice transcription will appear here..."
            value={formData.notes?.transcript || ""}
            onChange={(val: string) =>
              updateFormData("notes", { ...formData.notes, transcript: val })
            }
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1DA68F] hover:bg-primary/90 
dark:bg-primary dark:hover:bg-primary/80 
min-w-[130px] text-primary-foreground dark:text-white 
rounded-md transition-all duration-200 
flex justify-center items-center gap-2 text-sm font-medium 
shadow-sm hover:shadow-md active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Voice Note
          </button>
        </div>
      </div>

      {/* Saved Note Display */}
      {savedNote && (
        <div className="bg-card dark:bg-card/50 p-4 rounded-lg shadow-sm border border-border dark:border-border/50 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h4 className="text-base font-semibold text-primary dark:text-primary">
              Saved Voice Note
            </h4>
            <p className="text-xs text-muted-foreground bg-muted dark:bg-muted/50 px-2 py-1 rounded-md">
              Created: {formatDate(savedNote.createdAt)}
            </p>
          </div>

          {/* Audio Player */}
          {savedNote.voiceUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Audio Recording:
              </label>
              <audio
                controls
                src={savedNote.voiceUrl}
                className="w-full rounded-md border border-border dark:border-border/50 bg-background dark:bg-background/50 transition-colors"
              />
            </div>
          )}

          {/* Transcript Display */}
          {savedNote.transcript && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Transcript:
              </label>
              <div className="p-3 bg-muted dark:bg-muted/50 border border-border dark:border-border/50 rounded-md text-sm text-foreground whitespace-pre-wrap leading-relaxed transition-colors">
                {savedNote.transcript}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border dark:border-border/50">
            <button
              onClick={() => setSavedNote(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted dark:hover:bg-muted/50"
            >
              Clear Display
            </button>
            {savedNote.voiceUrl && (
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = savedNote.voiceUrl;
                  link.download = `voice-note-${
                    new Date().toISOString().split("T")[0]
                  }.wav`;
                  link.click();
                }}
                className="text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                Download Audio
              </button>
            )}
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
