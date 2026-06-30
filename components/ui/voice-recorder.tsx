"use client"

import { useState, useEffect, useRef } from "react"
import { MicOff } from "lucide-react"
import { FaMicrophone } from "react-icons/fa"

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  placeholder?: string
}

export function VoiceRecorder({ onTranscription, placeholder = "Start speaking..." }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [convertText, setConvertText] = useState("")

  const recognitionRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRecognitionActiveRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onstart = () => {
          isRecognitionActiveRef.current = true
        }

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          const fullTranscript = finalTranscript || interimTranscript
          if (fullTranscript.trim()) {
            setTranscript((prev) => (finalTranscript ? prev + finalTranscript : fullTranscript))
            setConvertText((prev) => (finalTranscript ? prev + finalTranscript : fullTranscript))
            onTranscription(finalTranscript ? transcript + finalTranscript : fullTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          if (event.error !== "no-speech" && event.error !== "audio-capture") {
            setIsRecording(false)
            setIsPaused(false)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          }
          isRecognitionActiveRef.current = false
        }

        recognitionRef.current.onend = () => {
          isRecognitionActiveRef.current = false
          if (isRecording && !isPaused) {
            setTimeout(() => {
              if (isRecording && !isPaused && !isRecognitionActiveRef.current) {
                try {
                  recognitionRef.current.start()
                } catch (error) {
                  console.error("Error restarting recognition:", error)
                }
              }
            }, 100)
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current && isRecognitionActiveRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("Error stopping recognition:", error)
        }
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      isRecognitionActiveRef.current = false
    }
  }, [])

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) {
      console.error("Speech recognition not supported or not available")
      return
    }

    if (isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping existing recognition:", error)
      }
      setTimeout(() => startRecording(), 200)
      return
    }

    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setTranscript("")
      setConvertText("")

      recognitionRef.current.start()

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsRecording(false)
      isRecognitionActiveRef.current = false
    }
  }

  const pauseRecording = () => {
    if (!recognitionRef.current || !isRecognitionActiveRef.current) return

    try {
      setIsPaused(true)
      recognitionRef.current.stop()

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } catch (error) {
      console.error("Error pausing recording:", error)
    }
  }

  const resumeRecording = () => {
    if (!recognitionRef.current || isRecognitionActiveRef.current) return

    try {
      setIsPaused(false)
      recognitionRef.current.start()

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error resuming recording:", error)
      setIsPaused(true)
    }
  }

  const stopRecording = () => {
    if (!recognitionRef.current) return

    try {
      setIsRecording(false)
      setIsPaused(false)

      if (isRecognitionActiveRef.current) {
        recognitionRef.current.stop()
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } catch (error) {
      console.error("Error stopping recording:", error)
    }
  }

  const clearTranscript = () => {
    setTranscript("")
    onTranscription("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!isSupported) {
    return (
      <div className="mx-auto bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MicOff className="h-5 w-5 text-[hsl(var(--color-status-error))]" />
          <span className="font-medium text-[hsl(var(--color-status-error))]">Voice Recognition Not Available</span>
        </div>
        <p className="text-[hsl(var(--color-status-error))] text-sm">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice features.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-6 w-full">
      <div className="flex items-center gap-2 mb-8">
        <FaMicrophone className="h-4 w-4 text-[hsl(var(--color-brand-teal))]" />
        <h2 className="text-base font-medium text-[hsl(var(--foreground))]">Voice To Prescription</h2>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
          style={{
            backgroundColor: isRecording ? 'hsl(var(--color-status-error)/0.2)' : 'hsl(var(--color-brand-teal)/0.4)'
          }}
        >
          <button
            onClick={!isRecording ? startRecording : isPaused ? resumeRecording : pauseRecording}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: isRecording ? 'hsl(var(--color-status-error))' : 'hsl(var(--color-brand-teal))'
            }}
            onMouseEnter={(e) => {
              if (isRecording) {
                e.currentTarget.style.backgroundColor = 'hsl(var(--color-status-error-dark))';
              } else {
                e.currentTarget.style.backgroundColor = 'hsl(var(--color-brand-teal-dark))';
              }
            }}
            onMouseLeave={(e) => {
              if (isRecording) {
                e.currentTarget.style.backgroundColor = 'hsl(var(--color-status-error))';
              } else {
                e.currentTarget.style.backgroundColor = 'hsl(var(--color-brand-teal))';
              }
            }}
          >
            <FaMicrophone className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="mt-6 text-xl font-medium text-[hsl(var(--foreground))]">{formatTime(recordingTime)}</div>
      </div>

      {isRecording && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Live Transcription</label>
          <textarea
            value={convertText}
            onChange={(e) => {
              setConvertText(e.target.value)
              onTranscription(e.target.value)
            }}
            placeholder="Start speaking... Your voice will be converted to text here"
            className="w-full min-h-[80px] p-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))]"
            rows={3}
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-[hsl(var(--color-status-error))] rounded-full animate-pulse"></div>
            <span className="text-xs text-[hsl(var(--color-status-error))]">Recording... Speak now</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-8">
        <button
          onClick={pauseRecording}
          disabled={!isRecording}
          className="flex-1 py-3 px-4 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted)/0.8)] disabled:opacity-50 disabled:cursor-not-allowed text-[hsl(var(--muted-foreground))] rounded-lg font-medium transition-colors"
        >
          Pause
        </button>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="flex-1 py-3 px-4 text-white rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: 'hsl(var(--color-brand-teal))'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--color-brand-teal-dark))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--color-brand-teal))';
          }}
        >
          {isRecording ? "Stop" : "Record"}
        </button>
      </div>

      <div className="text-sm text-[hsl(var(--muted-foreground))]">
        <p className="font-medium mb-3 text-[hsl(var(--foreground))]">Recording Tips</p>
        <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
          <li>• Speak clearly at a moderate pace</li>
          <li>• Mention medication names and dosages explicitly</li>
          <li>• Include key patient symptoms and observations</li>
          <li>• Record in a quiet environment</li>
        </ul>
      </div>

      {transcript && (
        <div className="mt-6 p-4 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">Transcription:</p>
            <button onClick={clearTranscript} className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              Clear
            </button>
          </div>
          <div className="text-sm text-[hsl(var(--foreground))] leading-relaxed">{transcript}</div>
        </div>
      )}
    </div>
  )
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}