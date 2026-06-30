'use client';
import { useState, useRef } from "react";
import { MicrophoneIcon, ArrowPathIcon, PaperAirplaneIcon, CheckCircleIcon, ExclamationCircleIcon, CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  setCurrentVoiceUrl?: (text: string) => void;
};

type TranscriptionStatus = 'idle' | 'recording' | 'processing' | 'success' | 'error';

const AudioRecorder = ({ label, audioUrl, onSave, onTranscription, setCurrentVoiceUrl }: AudioRecorderProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState(audioUrl || "");
  const [transcriptionStatus, setTranscriptionStatus] = useState<TranscriptionStatus>('idle');
  const [transcriptionError, setTranscriptionError] = useState<string>('');
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [audioFile, setAudioFile] = useState<string>('');
  const [audioUploading, setAudioUploading] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);

  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const uploadAudio = async (file: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file, "recording.webm");

    const token = localStorage.getItem("clinic-ai-token");
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found. Please login again.",
        variant: "destructive",
      });
      return "";
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message || "Audio uploaded successfully!",
        variant: "default",
      });
      return result.fileUrl || "";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload audio",
        variant: "destructive",
      });
      return "";
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setTranscriptionStatus('processing');
    setTranscriptionError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en');
      formData.append('formatSOAP', 'true');
      formData.append('prompt', 'Medical consultation. Patient symptoms, diagnosis, treatment.');

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${backendUrl}/doctor/transcription/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transcription failed');
      }

      const result = await response.json();

      if (result.success && result.data?.text) {
        setTranscriptionText(result.data.text);
        onTranscription?.(result.data.text);
        setTranscriptionStatus('success');
      } else {
        throw new Error('Invalid response from transcription service');
      }
    } catch (error: any) {
      setTranscriptionError(error.message || 'Failed to transcribe audio');
      setTranscriptionStatus('error');
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        clearTimer(); // Stop the timer immediately
      }
      return;
    }

    try {
      setTranscriptionStatus('idle');
      setTranscriptionError('');
      setTranscriptionText('');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      audioChunksRef.current = chunks;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          audioChunksRef.current = chunks;
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        setLocalAudioUrl(url);
        audioBlobRef.current = blob;
        onSave(url);
        setTranscriptionStatus('idle');
        // Upload audio to S3
        setAudioUploading(true);
        try {
          const s3Url = await uploadAudio(blob);
          if (s3Url) {
            setAudioFile(s3Url);
            setCurrentVoiceUrl?.(s3Url);
            onSave(audioFile); // Pass S3 URL instead of blob URL
          } else {
            onSave(audioFile); // Fallback to local URL if upload fails
          }
        } catch (error) {
          console.error('Error uploading audio:', error);
          onSave(url); // Fallback to local URL
        } finally {
          setAudioUploading(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTranscriptionStatus('recording');
      setRecordingTime(0); // Reset timer to 0 when starting

      const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      setTimerId(interval);
    } catch (error) {
      setTranscriptionError('Microphone access denied');
      setTranscriptionStatus('error');
    }
  };

  const handleSubmit = () => {
    if (audioBlobRef.current) {
      transcribeAudio(audioBlobRef.current);
    }
  };

  const resetRecording = () => {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setMediaRecorder(null);
    audioChunksRef.current = [];
    audioBlobRef.current = null;
    setIsRecording(false);
    setRecordingTime(0);
    setLocalAudioUrl("");
    setAudioFile("");
    setAudioUploading(false);
    setTranscriptionStatus('idle');
    setTranscriptionError('');
    setTranscriptionText('');
    onTranscription?.("");
    clearTimer();
  };

  const getStatusBadge = () => {
    switch (transcriptionStatus) {
      case 'recording':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--color-status-error)/0.1)] border border-[hsl(var(--color-status-error)/0.2)] rounded-full">
            <div className="w-2 h-2 bg-[hsl(var(--color-status-error))] rounded-full animate-pulse" />
            <span className="text-xs font-medium text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]">Recording</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--color-chart-blue)/0.1)] border border-[hsl(var(--color-chart-blue)/0.2)] rounded-full">
            <CloudArrowUpIcon className="w-4 h-4 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] animate-pulse" />
            <span className="text-xs font-medium text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]">Transcribing with AI...</span>
          </div>
        );
      case 'idle':
        if (audioUploading) {
          return (
            <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--color-chart-orange)/0.1)] border border-[hsl(var(--color-chart-orange)/0.2)] rounded-full">
              <CloudArrowUpIcon className="w-4 h-4 text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))] animate-pulse" />
              <span className="text-xs font-medium text-[hsl(var(--color-chart-orange))] dark:text-[hsl(var(--color-chart-orange))]">Uploading to cloud...</span>
            </div>
          );
        }
        return null;
      case 'success':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--color-status-success)/0.1)] border border-[hsl(var(--color-status-success)/0.2)] rounded-full">
            <CheckCircleIcon className="w-4 h-4 text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]" />
            <span className="text-xs font-medium text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))]">Transcription Complete</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--color-status-error)/0.1)] border border-[hsl(var(--color-status-error)/0.2)] rounded-full">
            <ExclamationCircleIcon className="w-4 h-4 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
            <span className="text-xs font-medium text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]">Transcription Failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[hsl(var(--muted)/0.3)] to-[hsl(var(--muted)/0.5)] dark:from-[hsl(var(--card)/0.3)] dark:to-[hsl(var(--card)/0.5)] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm">
      <Toaster /> 
      {label && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{label}</p>
          {getStatusBadge()}
        </div>
      )}


      <div className="flex flex-col items-center gap-6">
        {/* Microphone Button */}
        <button
          onClick={startRecording}
          disabled={transcriptionStatus === 'processing'}
          className={`relative p-5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${isRecording
              ? "bg-[hsl(var(--color-status-error)/0.2)] hover:bg-[hsl(var(--color-status-error)/0.3)] shadow-lg shadow-[hsl(var(--color-status-error)/0.2)]"
              : "bg-[hsl(var(--color-brand-teal)/0.2)] hover:bg-[hsl(var(--color-brand-teal)/0.3)] shadow-lg shadow-[hsl(var(--color-brand-teal)/0.2)]"
            } ${transcriptionStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`p-4 rounded-full transition-all duration-300 ${isRecording
              ? "bg-gradient-to-br from-[hsl(var(--color-status-error))] to-[hsl(var(--color-red-600))] animate-pulse shadow-lg"
              : "bg-gradient-to-br from-[hsl(var(--color-brand-teal))] to-[hsl(var(--color-brand-teal))] hover:from-[hsl(var(--color-brand-teal))] hover:to-[hsl(var(--color-brand-teal))]"
            }`}>
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm shadow-inner" />
            ) : (
              <MicrophoneIcon className="h-6 w-6 text-white drop-shadow-lg" />
            )}
          </div>
          {isRecording && <div className="absolute inset-0 rounded-full border-2 border-[hsl(var(--color-status-error))] animate-ping opacity-75" />}
        </button>

        {/* Timer */}
        <div className="text-center">
          <p className="text-3xl font-bold text-[hsl(var(--foreground))] tabular-nums tracking-tight">{formatTime(recordingTime)}</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 font-medium">
            {transcriptionStatus === 'processing'
              ? <span className="text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] flex items-center gap-2 justify-center">
                <CloudArrowUpIcon className="w-4 h-4 animate-spin" />
                AI is transcribing your audio...
              </span>
              : isRecording
                ? "Recording... Click again to stop"
                : localAudioUrl
                  ? "Recording ready - Click Submit to transcribe"
                  : "Click microphone to start recording"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full max-w-md">
          <button
            onClick={resetRecording}
            disabled={transcriptionStatus === 'processing'}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[hsl(var(--color-gray-600))] to-[hsl(var(--color-gray-700))] hover:from-[hsl(var(--color-gray-700))] hover:to-[hsl(var(--color-gray-800))] disabled:from-[hsl(var(--muted))] disabled:to-[hsl(var(--muted))] disabled:text-[hsl(var(--muted-foreground))] disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={!localAudioUrl || transcriptionStatus === 'processing'}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[hsl(var(--color-brand-teal))] to-[hsl(var(--color-brand-teal))] hover:from-[hsl(var(--color-brand-teal))] hover:to-[hsl(var(--color-brand-teal))] disabled:from-[hsl(var(--muted))] disabled:to-[hsl(var(--muted))] disabled:text-[hsl(var(--muted-foreground))] disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            {transcriptionStatus === 'processing' ? (
              <>
                <CloudArrowUpIcon className="h-5 w-5 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5" />
                Transcribe
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Preview */}
      {localAudioUrl && transcriptionStatus !== 'processing' && (
        <div className="mt-6 p-4 bg-[hsl(var(--background)/0.5)] dark:bg-[hsl(var(--muted)/0.3)] rounded-lg border border-[hsl(var(--border))]">
          <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-[hsl(var(--color-status-success))]" />
            Recorded Audio
          </label>
          <audio controls src={localAudioUrl} className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--muted)/0.5)] shadow-inner" />
        </div>
      )}

      {/* Error Display */}
      {transcriptionError && (
        <div className="mt-4 p-3 bg-[hsl(var(--color-status-error)/0.1)] border border-[hsl(var(--color-status-error)/0.2)] rounded-lg">
          <p className="text-sm text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] flex items-center gap-2">
            <ExclamationCircleIcon className="w-5 h-5" />
            {transcriptionError}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-[hsl(var(--color-chart-blue)/0.1)] border border-[hsl(var(--color-chart-blue)/0.2)] rounded-lg">
        <p className="text-xs text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] flex items-center gap-2">
          <CloudArrowUpIcon className="w-4 h-4" />
          <span><strong>How to use:</strong> Click the microphone to record. Click again to stop. Press Transcribe to convert speech to text, or type notes directly below.</span>
        </p>
      </div>
    </div>
  );
};

export default AudioRecorder;