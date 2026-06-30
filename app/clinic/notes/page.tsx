"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MicIcon, UserIcon, ClockIcon, FileTextIcon, PlayIcon, PauseIcon, DownloadIcon, Loader2 } from 'lucide-react'
import { ProtectedRoute } from "@/components/ui/protected-route"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchAllNotes } from "@/lib/slices/noteSlice"
import { useToast } from "@/hooks/use-toast"
import type { Note } from "@/lib/api/services/noteService"
import moment from "moment";

interface AudioRecord {
  id: string
  title: string
  status: "transcribed" | "pending"
  patientName: string
  dateTime: string
  fileSize: string
  recordDate: string
  transcription?: string
  isPlaying: boolean
  progress: number // 0-100
  patientId?: string
  appointmentId?: string
  audioFileUrl?: string
  audioTranscriptUrl?: string
  summary?: string
  duration?: string
  createdAt?: string
}


export default function AudioSummaryHistory() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { notes, loading, error } = useSelector((state: RootState) => state.notes)
  const { user } = useSelector((state: RootState) => state.auth)
  const [records, setRecords] = useState<AudioRecord[]>([])
  const role  = user?.role || "clinic"

  // Fetch notes on component mount
  useEffect(() => {
    if (user?.clinicId) {
      dispatch(fetchAllNotes({ role, params: { clinicId: user.clinicId } }))

    }
  }, [dispatch, user?.clinicId])

  // Transform API notes to AudioRecord format
  useEffect(() => {
    if (notes.length > 0) {
      const transformedRecords: AudioRecord[] = notes.map((note: Note) => {
        const patientName = typeof note?.patientRef === 'object'
          ? `${note.patientRef.firstName} ${note.patientRef.lastName}`
          : 'Unknown Patient'

        const createdDate = typeof note.appointmentRef === 'object' && note.appointmentRef?.date
          ? new Date(note.appointmentRef.date)
          : new Date()
        const formattedTime = createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        const formattedDate = createdDate.toLocaleDateString('en-GB').replace(/\//g, '/')

        return {
          id: note._id,
          title: typeof note.appointmentRef === 'object' && note.appointmentRef?.service
            ? note.appointmentRef.service
            : 'Untitled',
          status: typeof note.appointmentRef === 'object' && note.appointmentRef?.status
            ? note.appointmentRef.status
            : 'Unknown',
          patientName,
          dateTime: `${formattedTime} - ${formattedDate}`,
          fileSize: note.fileSize || '0 MB',
          recordDate: createdDate.toISOString().split('T')[0],
          transcription: note.rawText,
          isPlaying: false,
          progress: 0,
          patientId: typeof note.patientRef === 'object' ? note.patientRef._id : note.patientRef,
          appointmentId: note.appointmentRef && typeof note.appointmentRef === 'object' ? note.appointmentRef._id : note.appointmentId,
          audioFileUrl: note.audioTranscriptUrl,
          summary: note.rawText,
          duration: note.duration,
          createdAt: note.createdAt,
        }
      })
      setRecords(transformedRecords)
    }
  }, [notes])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDownload = async (url: string, filename: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "No audio file available for download",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${filename}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      toast({
        title: "Success",
        description: "Audio file downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download audio file",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="min-h-screen bg-[hsl(var(--background))] p-6">
        <div className="max-w-7xl mx-auto">

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--color-brand-teal))]" />
            </div>
          )}

          {!loading && records.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[hsl(var(--muted-foreground))]">No audio notes found. Upload your first audio recording.</p>
            </div>
          )}

          <div className="space-y-6">
            {records.map((record) => (
              <Card key={record.id} className="p-6 shadow-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-[hsl(var(--muted))] p-3 rounded-full">
                        <MicIcon className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{record.title}</h2>
                          <Badge
                            className={`px-2 py-1 rounded-md text-xs font-medium ${record.status === "transcribed"
                              ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal))]"
                              : "bg-[hsl(var(--color-status-warning)/0.1)] text-[hsl(var(--color-status-warning))] hover:bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)] dark:text-[hsl(var(--color-status-warning))]"
                              }`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-[hsl(var(--muted-foreground))] mt-1 gap-3">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{record.patientName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{record.dateTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-[hsl(var(--muted-foreground))]">
                      <p>{moment(record?.createdAt).format('lll')}</p>
                    </div>
                  </div>

                  {record.transcription && (
                    <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg mb-4 flex items-start space-x-2 border border-[hsl(var(--border))]">
                      <FileTextIcon className="w-5 h-5 text-[hsl(var(--muted-foreground))] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">Transcription</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{record.transcription}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {record?.audioFileUrl !== "" && (

                        <Button
                          className="px-4 py-2 rounded-md flex items-center space-x-2 bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--color-brand-teal-dark))]"
                          onClick={() => window.open(record.audioFileUrl, '_blank')}
                        >
                          <PlayIcon className="w-5 h-5" />
                          <span>{"Play"}</span>
                        </Button>
                      )}
                      <Button
                        className="px-4 py-2 rounded-md flex items-center space-x-2 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                        onClick={() => router.push(`/clinic/notes/view/${record.id}`)}
                      >
                        <span>View</span>
                      </Button>
                      <Button 
                        className="px-4 py-2 rounded-md flex items-center space-x-2 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                        onClick={() => handleDownload(record.audioFileUrl || '', record.title)}
                        disabled={!record.audioFileUrl}
                      >
                        <DownloadIcon className="w-5 h-5" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}