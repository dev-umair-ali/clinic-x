"use client"

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  placeholder?: string
}

export function VoiceRecorder({ onTranscription, placeholder = "Start speaking..." }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  
  const recognitionRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)
        onTranscription(fullTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        setIsPaused(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }

      recognitionRef.current.onend = () => {
        if (isRecording && !isPaused) {
          // Restart recognition if it stops unexpectedly
          recognitionRef.current.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, isPaused, onTranscription])

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) return

    setIsRecording(true)
    setIsPaused(false)
    setRecordingTime(0)
    setTranscript('')
    
    recognitionRef.current.start()
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const pauseRecording = () => {
    if (!recognitionRef.current) return

    setIsPaused(true)
    recognitionRef.current.stop()
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resumeRecording = () => {
    if (!recognitionRef.current) return

    setIsPaused(false)
    recognitionRef.current.start()
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (!recognitionRef.current) return

    setIsRecording(false)
    setIsPaused(false)
    recognitionRef.current.stop()
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) {
    return (
      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <p className="text-red-600 dark:text-red-400 text-sm">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-muted/50 p-4 rounded-lg border border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : 'text-teal-500'}`} />
          <span className="font-medium text-foreground">Voice To Text</span>
        </div>
        <span className="text-lg font-mono text-foreground">{formatTime(recordingTime)}</span>
      </div>
      
      <div className="flex gap-2 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Mic className="h-4 w-4" />
            Record
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded font-medium flex items-center gap-2 transition-colors"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded font-medium flex items-center gap-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                Resume
              </button>
            )}
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium flex items-center gap-2 transition-colors"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          </>
        )}
      </div>

      {/* Voice to Text Output - Always visible at bottom */}
      <div className="mt-4 p-4 bg-card rounded-lg border-2 border-border min-h-[100px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          <p className="text-sm font-medium text-foreground">Voice to Text Output:</p>
        </div>
        {transcript ? (
          <div className="text-sm text-foreground leading-relaxed">
            {transcript}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            {isRecording ? "Listening... Start speaking to see text appear here." : "Click Record and start speaking to see your voice converted to text here."}
          </div>
        )}
        {isRecording && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-600 dark:text-red-400">Recording in progress...</span>
          </div>
        )}
      </div>

      {/* Recording Tips */}
      <div className="text-sm text-muted-foreground mb-4">
        <p className="font-medium mb-2 text-foreground">Recording Tips</p>
        <ul className="space-y-1 text-xs">
          <li>• Speak clearly at a moderate pace</li>
          <li>• Mention medication names and dosages explicitly</li>
          <li>• Include key patient symptoms and observations</li>
          <li>• Record in a quiet environment</li>
        </ul>
      </div>
    </div>
  )
}
