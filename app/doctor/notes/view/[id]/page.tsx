"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    FileTextIcon,
    PlayIcon,
    PauseIcon,
    Loader2,
    AlertCircle,
    User,
    Calendar,
    FileAudio,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchNote } from "@/lib/slices/noteSlice";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";
import { Toaster } from "@/components/ui/toaster";

export default function ViewNotePage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement>(null);

    const noteId = params?.id as string;
    const { note, loading, error } = useSelector((state: RootState) => state.notes);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Fetch note on mount
    useEffect(() => {
        if (noteId) {
            dispatch(fetchNote(noteId));
        }
    }, [dispatch, noteId]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    // Audio event handlers
    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const getPatientName = () => {
        if (!note?.patientRef) return "Unknown Patient";
        if (typeof note.patientRef === "object") {
            return `${note.patientRef.firstName} ${note.patientRef.lastName}`;
        }
        return "Unknown Patient";
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--color-brand-teal))]" />
                </div>
            </ProtectedRoute>
        );
    }

    if (!note) {
        return (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <Toaster /> 
                <div className="min-h-screen bg-[hsl(var(--background))] p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
                            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Note not found</h2>
                            <p className="text-[hsl(var(--muted-foreground))] mb-4">
                                The note you're looking for doesn't exist or has been deleted.
                            </p>
                            <Button
                                onClick={() => router.push("/doctor/notes")}
                                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
                            >
                                Back to Notes
                            </Button>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={["doctor"]}>
            <div className="min-h-screen bg-[hsl(var(--background))] p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back button */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            className="text-[hsl(var(--color-brand-teal))] hover:bg-transparent p-0 h-auto font-normal"
                            onClick={() => router.push("/doctor/notes")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Audio Summary
                        </Button>
                    </div>

                    {/* Page title and status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                                {typeof note.appointmentRef === 'object' && note.appointmentRef?.service || "Untitled"}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{getPatientName()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{moment(note.createdAt).format("lll")}</span>
                                </div>
                            </div>
                        </div>
                        <Badge
                            className={`px-3 py-1 rounded-md text-sm font-medium ${"bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal))]"}`}
                        >
                            {typeof note.appointmentRef === 'object' && note.appointmentRef?.status ? note.appointmentRef.status.charAt(0).toUpperCase() + note.appointmentRef.status.slice(1) : "Unknown Status"}
                        </Badge>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Audio Player Section */}
                        <Card className="border border-[hsl(var(--border))]">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-1 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full"></div>
                                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Audio Recording</h2>
                                </div>

                                {note.audioTranscriptUrl ? (
                                    <div className="space-y-4">
                                        {/* Audio file info */}
                                        <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg border border-[hsl(var(--border))]">
                                            <div className="flex items-center gap-3 mb-3">
                                                <FileAudio className="w-5 h-5 text-[hsl(var(--color-brand-teal))]" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                                                        {typeof note.appointmentRef === 'object' && note.appointmentRef?.service || "Untitled"}.mp3
                                                    </p>
                                                    {/* <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {note.fileSize || "Unknown size"} • {note.duration || formatTime(duration)}
                          </p> */}
                                                </div>
                                            </div>

                                            {/* Audio controls */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        onClick={handlePlayPause}
                                                        className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))] h-10 w-10 p-0 rounded-full"
                                                    >
                                                        {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
                                                    </Button>
                                                    <div className="flex-1">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max={duration || 0}
                                                            value={currentTime}
                                                            onChange={handleSeek}
                                                            className="w-full h-2 bg-[hsl(var(--muted))] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--color-brand-teal))]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
                                                    <span>{formatTime(currentTime)}</span>
                                                    <span>{formatTime(duration)}</span>
                                                </div>
                                            </div>

                                            {/* Hidden audio element */}
                                            <audio
                                                ref={audioRef}
                                                src={note.audioFileUrl}
                                                onTimeUpdate={handleTimeUpdate}
                                                onLoadedMetadata={handleLoadedMetadata}
                                                onEnded={() => setIsPlaying(false)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-[hsl(var(--border))] rounded-lg">
                                        <FileAudio className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">No audio file available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* CPT Codes Section */}
                        <Card className="border border-[hsl(var(--border))]">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-1 h-6 bg-[hsl(var(--color-chart-purple))] rounded-full"></div>
                                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">CPT Codes</h2>
                                </div>

                                {(note as any)?.cptCodeRef && (note as any).cptCodeRef.cpt_codes && (note as any).cptCodeRef.cpt_codes.length > 0 ? (
                                    <div className="space-y-3">
                                        {/* Parse CPT codes from summary or display as-is */}
                                        <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg border border-[hsl(var(--border))]">
                                            <div className="space-y-2">
                                                {/* Example CPT codes - replace with actual parsed data */}

                                                {(note as any).cptCodeRef?.cpt_codes?.map((code: any) => (
                                                    <>
                                                        <div className="flex items-start gap-3 p-3 bg-[hsl(var(--background))] rounded border border-[hsl(var(--border))]">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{code.code}</p>
                                                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                                                    Office/Outpatient Visit - Established Patient
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-[hsl(var(--border))] rounded-lg">
                                        <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">No CPT codes generated yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transcription Section */}
                    <Card className="border border-[hsl(var(--border))] mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-1 h-6 bg-[hsl(var(--color-chart-blue))] rounded-full"></div>
                                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Transcription</h2>
                            </div>

                            {note.rawText ? (
                                <div className="bg-[hsl(var(--muted)/0.5)] p-6 rounded-lg border border-[hsl(var(--border))]">
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
                                            {note.rawText}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-[hsl(var(--border))] rounded-lg">
                                    <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                                        No transcription available
                                    </p>
                                    {note.status === "pending" && (
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                            Audio is being processed. Check back later.
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Clinical Summary Section */}
                    {note.summary && (
                        <Card className="border border-[hsl(var(--border))] mb-8">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-1 h-6 bg-[hsl(var(--color-chart-green))] rounded-full"></div>
                                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Clinical Summary</h2>
                                </div>

                                <div className="bg-[hsl(var(--muted)/0.5)] p-6 rounded-lg border border-[hsl(var(--border))]">
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
                                            {note.summary}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))] rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-[hsl(var(--muted-foreground))] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Disclaimer</p>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    This transcription and summary are generated using AI and may contain errors. Please review
                                    carefully and make necessary corrections before using for clinical purposes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}