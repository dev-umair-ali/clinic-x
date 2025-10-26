'use client';
import { useState, useRef } from "react";
import { MicrophoneIcon, PlayIcon, StopIcon, ArrowPathIcon } from "@heroicons/react/20/solid";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

type AudioRecorderProps = {
  label?: string;
  audioUrl?: string;
  onSave: (voiceUrl: string) => void;
  onTranscription?: (text: string) => void;
};

const AudioRecorder = ({ label, audioUrl, onSave, onTranscription }: AudioRecorderProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState(audioUrl || "");
  const recognitionRef = useRef<any>(null);

  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
        : null;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      onTranscription?.(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition error", event);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  };

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setLocalAudioUrl(url);
        onSave(url);
        clearTimer();
        setRecordingTime(0);
        stopSpeechRecognition();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setIsPaused(false);

      onTranscription?.("");
      startSpeechRecognition();

      const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      setTimerId(interval);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorder || !isRecording) return;
    
    mediaRecorder.pause();
    setIsRecording(false);
    setIsPaused(true);
    clearTimer();
    stopSpeechRecognition();
  };

  const resumeRecording = () => {
    if (!mediaRecorder || !isPaused) return;

    mediaRecorder.resume();
    setIsRecording(true);
    setIsPaused(false);
    startSpeechRecognition();

    const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    setTimerId(interval);
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
    setIsPaused(false);
    clearTimer();
    stopSpeechRecognition();
  };

  const resetRecording = () => {
    if (mediaRecorder?.state === "recording") mediaRecorder.stop();
    
    setMediaRecorder(null);
    setAudioChunks([]);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setLocalAudioUrl("");
    onTranscription?.("");
    clearTimer();
    stopSpeechRecognition();
    onSave("");
  };

  return (
    <div className="bg-muted/50 dark:bg-card/50 p-4 rounded-lg border border-border flex flex-col gap-4 transition-colors duration-200">
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 sm:justify-between">
  {/* Recording Button */}
  <div className="flex-shrink-0">
    <button
      onClick={isRecording ? pauseRecording : isPaused ? resumeRecording : startRecording}
      className={`relative p-4 rounded-full transition-all duration-200 ${
        isRecording
          ? "bg-destructive/20 hover:bg-destructive/30"
          : "bg-[#1FA88824] hover:bg-primary/30"
      }`}
    >
      <div
        className={`p-3 rounded-full transition-all duration-200 ${
          isRecording
            ? "bg-destructive animate-pulse"
            : "bg-[#1FA888] hover:bg-primary/90"
        }`}
      >
        {isRecording ? (
          <div className="w-5 h-5 bg-white rounded-sm" />
        ) : isPaused ? (
          <PlayIcon className="h-5 w-5 text-primary-foreground dark:text-white" />
        ) : (
          <MicrophoneIcon className="h-5 w-5 text-primary-foreground dark:text-white" />
        )}
      </div>
      {isRecording && (
        <div className="absolute inset-0 rounded-full border-2 border-destructive animate-ping" />
      )}
    </button>
  </div>

  {/* Timer and Status */}
  <div className="text-center flex-1">
    <p className="text-2xl font-bold text-foreground tabular-nums">
      {formatTime(recordingTime)}
    </p>
    <p className="text-sm text-muted-foreground mt-1">
      {isRecording
        ? "Recording..."
        : isPaused
        ? "Paused - Click to resume"
        : "Click microphone to start recording"}
    </p>
  </div>

  {/* Control Buttons */}
  <div className="flex gap-2 flex-shrink-0">
    {isPaused && (
      <button
        onClick={resumeRecording}
        className="px-3 py-2 rounded-md bg-[#EAB308] hover:bg-primary/90 
                   text-primary-foreground dark:text-white
                   text-xs font-medium transition-colors duration-200 flex items-center gap-1"
      >
        <PlayIcon className="h-3 w-3" />
        Resume
      </button>
    )}

    <button
      onClick={stopRecording}
      className="px-3 py-2 rounded-md bg-[#EF4444] hover:bg-destructive/90 
                 disabled:bg-muted disabled:text-muted-foreground 
                 text-destructive-foreground dark:text-white
                 text-xs font-medium transition-colors duration-200 flex items-center gap-1"
    >
      <StopIcon className="h-3 w-3" />
      Stop
    </button>

    <button
      onClick={resetRecording}
      className="px-3 py-2 rounded-md bg-[#6B7280] hover:bg-muted/80 
                 text-white hover:text-foreground dark:text-white
                 text-xs font-medium transition-colors duration-200 flex items-center gap-1"
    >
      <ArrowPathIcon className="h-3 w-3" />
      Reset
    </button>
  </div>
</div>

      {/* Audio Playback */}
      {localAudioUrl && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Recorded Audio:
          </label>
          <audio 
            controls 
            src={localAudioUrl} 
            className="w-full rounded border border-border bg-background dark:bg-muted/30"
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
