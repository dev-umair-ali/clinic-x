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
    // Check if speech recognition is supported
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
          // Only restart if we're still supposed to be recording and not paused
          if (isRecording && !isPaused) {
            // Add a small delay before restarting to prevent conflicts
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
  }, []) // Removed dependencies to prevent unnecessary recreation

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
      // Wait a bit before starting new recognition
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
      <div className="s mx-auto bg-background border border-border rounded-lg p-6 text-center ">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MicOff className="h-5 w-5 text-red-500" />
          <span className="font-medium text-red-600">Voice Recognition Not Available</span>
        </div>
        <p className="text-red-600 text-sm">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice features.
        </p>
      </div>
    )
  }

  return (
    <div className=" mx-auto bg-background  border-border rounded-lg p-6 w-full">
      <div className="flex items-center  gap-2 mb-8">
        <FaMicrophone className="h-4 w-4 text-[#1FA888]" />
        <h2 className="text-base font-medium text-foreground">Voice To Prescription</h2>
      </div>

      <div className="flex flex-col items-center mb-8 ">
        <div
          className={`w-20 h-20 rounded-full ${isRecording ? "bg-red-200" : "bg-[#1fa88874]"} flex items-center justify-center transition-all duration-200 shadow-lg`}
        >
          <button
            onClick={!isRecording ? startRecording : isPaused ? resumeRecording : pauseRecording}
            className={`w-10 h-10 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#1FA888] hover:bg-teal-600"} flex items-center justify-center transition-all duration-200 shadow-lg`}
          >
            <FaMicrophone className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="mt-6 text-xl font-medium text-foreground">{formatTime(recordingTime)}</div>
      </div>

      {isRecording && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Live Transcription</label>
          <textarea
            value={convertText}
            onChange={(e) => {
              setConvertText(e.target.value)
              onTranscription(e.target.value)
            }}
            placeholder="Start speaking... Your voice will be converted to text here"
            className="w-full min-h-[80px] p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[#1FA888]"
            rows={3}
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-600">Recording... Speak now</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-8">
        <button
          onClick={pauseRecording}
          disabled={!isRecording}
          className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground rounded-lg font-medium transition-colors"
        >
          Pause
        </button>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="flex-1 py-3 px-4 bg-[#1FA888] hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
        >
          {isRecording ? "Stop" : "Record"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-3 text-foreground">Recording Tips</p>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Speak clearly at a moderate pace</li>
          <li>• Mention medication names and dosages explicitly</li>
          <li>• Include key patient symptoms and observations</li>
          <li>• Record in a quiet environment</li>
        </ul>
      </div>

      {transcript && (
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Transcription:</p>
            <button onClick={clearTranscript} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          </div>
          <div className="text-sm text-foreground leading-relaxed">{transcript}</div>
        </div>
      )}
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
