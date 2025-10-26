"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MicIcon, UserIcon, ClockIcon, FileTextIcon, PlayIcon, PauseIcon, PencilIcon, DownloadIcon, Trash2Icon, ArrowLeft, Upload, AlertCircle } from 'lucide-react'
import { ProtectedRoute } from "@/components/ui/protected-route"

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
}

const initialAudioRecords: AudioRecord[] = [
  {
    id: "1",
    title: "Follow-up Consultation",
    status: "transcribed",
    patientName: "Sarah Johnson",
    dateTime: "3:45 - 15/01/2024",
    fileSize: "2.1 MB",
    recordDate: "2024-01-15",
    transcription: "Patient reports improvement in symptoms. Blood pressure stable at 120/80...",
    isPlaying: false,
    progress: 0,
  },
  {
    id: "2",
    title: "Follow-up Consultation",
    status: "pending",
    patientName: "Sarah Johnson",
    dateTime: "3:45 - 15/01/2024",
    fileSize: "2.1 MB",
    recordDate: "2024-01-15",
    transcription: undefined,
    isPlaying: true, // This one is playing/paused in the screenshot
    progress: 60, // Example progress
  },
  {
    id: "3",
    title: "Follow-up Consultation",
    status: "pending",
    patientName: "Sarah Johnson",
    dateTime: "3:45 - 15/01/2024",
    fileSize: "2.1 MB",
    recordDate: "2024-01-15",
    transcription: undefined,
    isPlaying: false, // This one is stopped in the screenshot
    progress: 0,
  },
]

export default function AudioSummaryHistory() {
  const [records, setRecords] = useState<AudioRecord[]>(initialAudioRecords)
  const [currentView, setCurrentView] = useState<'list' | 'upload'>('list')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const togglePlayPause = (id: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id
          ? { ...record, isPlaying: !record.isPlaying, progress: record.isPlaying ? record.progress : 0 }
          : { ...record, isPlaying: false, progress: 0 } // Stop others when one plays
      )
    )
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Simulate upload progress
      setUploadProgress(42.24)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(42.24)
    }
  }

  // List View Component
  const ListView = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Audio Summary & History</h1>
          <Button
            className="bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white px-4 py-2 rounded-md"
            onClick={() => setCurrentView('upload')}
          >
            Audio Summary
          </Button>
        </div>
        
        <div className="space-y-6">
          {records.map((record) => (
            <Card key={record.id} className="p-6 shadow-sm border border-border bg-card">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-3 rounded-full">
                      <MicIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold text-foreground">{record.title}</h2>
                        <Badge
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            record.status === "transcribed"
                              ? "bg-[#1DA68F] text-white hover:bg-[#1DA68F]"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {record.status === "transcribed" ? "Transcribed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-3">
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
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{record.fileSize}</p>
                    <p>{record.recordDate}</p>
                  </div>
                </div>
                
                {record.transcription && (
                  <div className="bg-muted/50 p-4 rounded-lg mb-4 flex items-start space-x-2 border border-border">
                    <FileTextIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Transcription</p>
                      <p className="text-sm text-muted-foreground mt-1">{record.transcription}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="px-4 py-2 rounded-md flex items-center space-x-2 bg-[#1DA68F] text-white hover:bg-[#1DA68F]/90"
                      onClick={() => togglePlayPause(record.id)}
                    >
                      {record.isPlaying ? (
                        <PauseIcon className="w-5 h-5" />
                      ) : (
                        <PlayIcon className="w-5 h-5" />
                      )}
                      <span>{record.isPlaying ? "Pause" : "Play"}</span>
                    </Button>
                    <Button className="px-4 py-2 rounded-md flex items-center space-x-2 text-foreground hover:bg-muted/50 border border-border bg-background">
                      <PencilIcon className="w-5 h-5" />
                      <span>Edit</span>
                    </Button>
                    <Button className="px-4 py-2 rounded-md flex items-center space-x-2 text-foreground hover:bg-muted/50 border border-border bg-background">
                      <DownloadIcon className="w-5 h-5" />
                      <span>Download</span>
                    </Button>
                    <Button className="px-4 py-2 rounded-md flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-300 dark:border-red-800 bg-background">
                      <Trash2Icon className="w-5 h-5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                  {record.isPlaying && (
                    <div className="flex items-center space-x-2 ml-0 md:ml-4 md:flex-1">
                      <div className="h-2 bg-muted rounded-full flex-1">
                        <div
                          className="h-full bg-[#1DA68F] rounded-full"
                          style={{ width: `${record.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">3:45</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  // Upload View Component
  const UploadView = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Button 
            variant="ghost"
            className="text-[#1DA68F] hover:bg-transparent p-0 h-auto font-normal"
            onClick={() => setCurrentView('list')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audio Summary
          </Button>
        </div>

        {/* Page title */}
        <h1 className="text-2xl font-bold text-foreground mb-12">Audio Summary & History</h1>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Audio Upload Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-1 h-6 bg-[#1DA68F] rounded-full"></div>
              <h2 className="text-lg font-semibold text-foreground">Audio Upload</h2>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-[#1DA68F] bg-[#1DA68F]/5"
                  : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16">
                  <svg viewBox="0 0 64 64" className="w-full h-full text-muted-foreground">
                    <path fill="currentColor" d="M32 8c-1.1 0-2 .9-2 2v20.6l-7.3-7.3c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l10 10c.4.4.9.6 1.4.6s1-.2 1.4-.6l10-10c.8-.8.8-2 0-2.8s-2-.8-2.8 0L34 30.6V10c0-1.1-.9-2-2-2z"/>
                    <path fill="currentColor" d="M48 32c-1.1 0-2 .9-2 2v18H18V34c0-1.1-.9-2-2-2s-2 .9-2 2v20c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V34c0-1.1-.9-2-2-2z"/>
                    <circle fill="currentColor" cx="32" cy="20" r="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload audio file</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drag and drop your audio file here, or click to browse
                  </p>
                </div>
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a,.aac"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button
                      className="bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white px-6 py-2 rounded-md"
                      asChild
                    >
                      <span className="cursor-pointer">Choose File</span>
                    </Button>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported formats: MP3, WAV, M4A, AAC (Max: 100MB)
                </p>
                
                {/* Progress bar - shown when file is selected */}
                {selectedFile && (
                  <div className="w-full">
                    <div className="bg-[#1DA68F] text-white px-3 py-1 rounded text-sm font-medium inline-block">
                      {selectedFile.name} ({uploadProgress}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated Summary Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-foreground">Generated Summary</h2>
            </div>
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6">
                <svg viewBox="0 0 64 64" className="w-full h-full text-muted-foreground">
                  <rect x="16" y="8" width="32" height="44" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <rect x="20" y="16" width="24" height="2" fill="currentColor"/>
                  <rect x="20" y="22" width="24" height="2" fill="currentColor"/>
                  <rect x="20" y="28" width="16" height="2" fill="currentColor"/>
                  <rect x="12" y="12" width="32" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload an audio file to generate a clinical summary
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Best Practices for Audio Upload:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="text-foreground mr-2">•</span>
              <span>Ensure clear audio quality with minimal background noise</span>
            </li>
            <li className="flex items-start">
              <span className="text-foreground mr-2">•</span>
              <span>Speak clearly and at normal pace</span>
            </li>
            <li className="flex items-start">
              <span className="text-foreground mr-2">•</span>
              <span>Include patient consent for recording when applicable</span>
            </li>
            <li className="flex items-start">
              <span className="text-foreground mr-2">•</span>
              <span>Review generated summary for accuracy before saving</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mb-8">
          <Button className="bg-[#1DA68F] hover:bg-[#1DA68F]/90 text-white px-6 py-2 rounded-md flex items-center space-x-2">
            <span>✓</span>
            <span>Save</span>
          </Button>
          <Button variant="outline" className="px-6 py-2 rounded-md border-border text-foreground hover:bg-muted/50 flex items-center space-x-2">
            <span>✏️</span>
            <span>Edit</span>
          </Button>
          <Button variant="outline" className="text-red-600 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-2 rounded-md flex items-center space-x-2">
            <span>🗑️</span>
            <span>Delete</span>
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Disclaimer</p>
              <p className="text-sm text-muted-foreground">
                This is generated using AI and may contain errors. Please review carefully and make necessary corrections before finalizing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      {currentView === 'list' ? <ListView /> : <UploadView />}
    </ProtectedRoute>
  )
}
