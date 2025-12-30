'use client';
import { useState, useRef } from "react";
import { MicrophoneIcon, ArrowPathIcon, PaperAirplaneIcon, CheckCircleIcon, ExclamationCircleIcon, CloudArrowUpIcon } from "@heroicons/react/20/solid";

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

type TranscriptionStatus = 'idle' | 'recording' | 'processing' | 'success' | 'error';

const AudioRecorder = ({ label, audioUrl, onSave, onTranscription }: AudioRecorderProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState(audioUrl || "");
  const [transcriptionStatus, setTranscriptionStatus] = useState<TranscriptionStatus>('idle');
  const [transcriptionError, setTranscriptionError] = useState<string>('');
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);

  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
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
      
      const response = await fetch(`${backendUrl}/api/transcribe`, {
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
      console.error('Transcription error:', error);
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

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setLocalAudioUrl(url);
        audioBlobRef.current = blob;
        onSave(url);
        setTranscriptionStatus('idle');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTranscriptionStatus('recording');
      setRecordingTime(0); // Reset timer to 0 when starting

      const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      setTimerId(interval);
    } catch (error) {
      console.error("Error accessing microphone:", error);
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
    setTranscriptionStatus('idle');
    setTranscriptionError('');
    setTranscriptionText('');
    onTranscription?.("");
    clearTimer();
    onSave("");
  };

  const handleTranscriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTranscriptionText(newText);
    onTranscription?.(newText);
  };

  const getStatusBadge = () => {
    switch (transcriptionStatus) {
      case 'recording':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Recording</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <CloudArrowUpIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Transcribing with AI...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Transcription Complete</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <ExclamationCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Transcription Failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-muted/30 to-muted/50 dark:from-card/30 dark:to-card/50 p-6 rounded-xl border border-border shadow-sm">
      {label && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {getStatusBadge()}
        </div>
      )}
      
      <div className="flex flex-col items-center gap-6">
        {/* Microphone Button */}
        <button 
          onClick={startRecording} 
          disabled={transcriptionStatus === 'processing'}
          className={`relative p-5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isRecording 
              ? "bg-red-500/20 hover:bg-red-500/30 shadow-lg shadow-red-500/20" 
              : "bg-[#1FA888]/20 hover:bg-[#1FA888]/30 shadow-lg shadow-[#1FA888]/20"
          } ${transcriptionStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isRecording 
              ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse shadow-lg" 
              : "bg-gradient-to-br from-[#1FA888] to-[#1DA68F] hover:from-[#1DA68F] hover:to-[#1FA888]"
          }`}>
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm shadow-inner" />
            ) : (
              <MicrophoneIcon className="h-6 w-6 text-white drop-shadow-lg" />
            )}
          </div>
          {isRecording && <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />}
        </button>

        {/* Timer */}
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{formatTime(recordingTime)}</p>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {transcriptionStatus === 'processing' 
              ? <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2 justify-center">
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
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Reset
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!localAudioUrl || transcriptionStatus === 'processing'}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#1FA888] to-[#1DA68F] hover:from-[#1DA68F] hover:to-[#1FA888] disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
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
        <div className="mt-6 p-4 bg-background/50 dark:bg-muted/30 rounded-lg border border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            Recorded Audio
          </label>
          <audio controls src={localAudioUrl} className="w-full rounded-lg border border-border bg-background dark:bg-muted/50 shadow-inner" />
        </div>
      )}

      {/* Error Display */}
      {transcriptionError && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <ExclamationCircleIcon className="w-5 h-5" />
            {transcriptionError}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <CloudArrowUpIcon className="w-4 h-4" />
          <span><strong>How to use:</strong> Click the microphone to record. Click again to stop. Press Transcribe to convert speech to text, or type notes directly below.</span>
        </p>
      </div>
    </div>
  );
};

export default AudioRecorder;
