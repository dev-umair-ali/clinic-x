"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause } from "lucide-react";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  placeholder?: string;
}

export function VoiceRecorder({ onTranscription, placeholder = "Start speaking..." }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        onTranscription(fullTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setIsPaused(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecording && !isPaused) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused, onTranscription]);

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) return;

    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setTranscript("");

    recognitionRef.current.start();

    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    if (!recognitionRef.current) return;

    setIsPaused(true);
    recognitionRef.current.stop();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (!recognitionRef.current) return;

    setIsPaused(false);
    recognitionRef.current.start();

    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    setIsRecording(false);
    setIsPaused(false);
    recognitionRef.current.stop();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isSupported) {
    return (
      <div className="bg-[hsl(var(--muted))] p-4 rounded-lg border border-[hsl(var(--border))]">
        <p className="text-[hsl(var(--color-status-error))] text-sm">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(var(--muted))] p-4 rounded-lg border border-[hsl(var(--border))]">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Mic className={`h-5 w-5 ${isRecording ? "text-[hsl(var(--color-status-error))]" : "text-[hsl(var(--color-brand-teal))]"}`} />
          <span className="font-medium text-[hsl(var(--foreground))]">Voice To Text</span>
        </div>
        <span className="text-lg font-mono text-[hsl(var(--foreground))]">{formatTime(recordingTime)}</span>
      </div>

      <div className="flex gap-2 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Mic className="h-4 w-4" />
            Record
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 text-[hsl(var(--muted-foreground))] rounded font-medium flex items-center gap-2 transition-colors"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white rounded font-medium flex items-center gap-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                Resume
              </button>
            )}
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-dark))] text-white rounded font-medium flex items-center gap-2 transition-colors"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          </>
        )}
      </div>

      {/* Voice to Text Output - Always visible at bottom */}
      <div className="mt-4 p-4 bg-[hsl(var(--background))] rounded-lg border-2 border-[hsl(var(--border))] min-h-[100px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[hsl(var(--color-brand-teal))] rounded-full"></div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">Voice to Text Output:</p>
        </div>
        {transcript ? (
          <div className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
            {transcript}
          </div>
        ) : (
          <div className="text-sm text-[hsl(var(--muted-foreground))] italic">
            {isRecording ? "Listening... Start speaking to see text appear here." : "Click Record and start speaking to see your voice converted to text here."}
          </div>
        )}
        {isRecording && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-[hsl(var(--color-status-error))] rounded-full animate-pulse"></div>
            <span className="text-xs text-[hsl(var(--color-status-error))]">Recording in progress...</span>
          </div>
        )}
      </div>

      {/* Recording Tips */}
      <div className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
        <p className="font-medium mb-2 text-[hsl(var(--foreground))]">Recording Tips</p>
        <ul className="space-y-1 text-xs">
          <li>• Speak clearly at a moderate pace</li>
          <li>• Mention medication names and dosages explicitly</li>
          <li>• Include key patient symptoms and observations</li>
          <li>• Record in a quiet environment</li>
        </ul>
      </div>
    </div>
  );
}