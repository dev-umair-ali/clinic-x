'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

type AudioRecorderProps = {
    label?: string;
    audioUrl?: string;
    onSave: (voiceUrl: string) => void;
};

const AudioRecorder = ({ label, audioUrl, onSave }: AudioRecorderProps) => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
    const [localAudioUrl, setLocalAudioUrl] = useState(audioUrl || "");

    const clearTimer = () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
    };

    const startRecording = async () => {
        if (isRecording) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            setLocalAudioUrl(url);
            onSave(url);
            setAudioChunks([]);
            clearTimer();
            setRecordingTime(0);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        setIsRecording(true);
        setIsPaused(false);

        const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
        setTimerId(interval);
    };

    const resumeRecording = () => {
        if (!mediaRecorder || !isPaused) return;
        mediaRecorder.resume();
        setIsRecording(true);
        setIsPaused(false);
        const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
        setTimerId(interval);
    };

    const stopRecording = () => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        setIsRecording(false);
        setIsPaused(false);
        clearTimer();
    };

    const resetRecording = () => {
        if (mediaRecorder?.state === "recording") mediaRecorder.stop();
        setMediaRecorder(null);
        setAudioChunks([]);
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        setLocalAudioUrl("");
        clearTimer();
        onSave("");
    };

    return (
        <div className="bg-[#F0F0F0] p-4 rounded-lg flex flex-col gap-4">
            {label && <p className="text-sm font-medium text-gray-800">{label}</p>}

            <div className="flex items-center gap-6 justify-between">
                <button
                    onClick={startRecording}
                    className="bg-[#1FA888]/15 p-4 rounded-full flex justify-center items-center w-24"
                >
                    <div className="bg-[#1FA888] w-20 p-4 rounded-full flex justify-center items-center">
                        <Image src="/assets/icons/mic.png" width={20} height={20} alt="mic" />
                    </div>
                </button>

                <div className="text-sm text-gray-800 flex flex-col justify-center items-center">
                    <p className="text-2xl font-semibold">{formatTime(recordingTime)}</p>
                    <p className="text-sm">{isRecording ? "Recording..." : "Press Mic to add voice note"}</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={resumeRecording}
                        disabled={!isPaused}
                        className="px-4 py-2 rounded bg-yellow-900 text-white disabled:opacity-50"
                    >
                        Resume
                    </button>
                    <button
                        onClick={stopRecording}
                        disabled={!isRecording}
                        className="px-4 py-2 rounded bg-red-500 text-white disabled:opacity-50"
                    >
                        Stop
                    </button>
                    <button
                        onClick={resetRecording}
                        className="px-4 py-2 rounded bg-gray-400 text-white"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {localAudioUrl && (
                <audio controls src={localAudioUrl} className="mt-2" />
            )}
        </div>
    );
};

export default AudioRecorder;
