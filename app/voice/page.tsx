"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Mic, MicOff, Square, BarChart3, Volume2, AlertCircle, CheckCircle, Play, Pause } from "lucide-react"
import Link from "next/link"
import { storage, type VoiceAnalysis } from "@/lib/storage"
import { analyzeVoice } from "@/lib/ai-simulation"

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recentAnalyses, setRecentAnalyses] = useState<VoiceAnalysis[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const intervalRef = useRef<NodeJS.Timeout>()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadRecentAnalyses()
    checkMicrophonePermission()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately
    } catch (error) {
      setHasPermission(false)
    }
  }

  const loadRecentAnalyses = () => {
    const analyses = storage.getVoiceAnalyses().slice(-5).reverse()
    setRecentAnalyses(analyses)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      setAnalysis(null)

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setHasPermission(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
    }

    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Start analysis after a short delay
    setTimeout(() => {
      handleAnalyze()
    }, 500)
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Simulate analysis time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const analysisResult = analyzeVoice()
    const voiceAnalysis: VoiceAnalysis = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...analysisResult,
    }

    setAnalysis(voiceAnalysis)
    storage.saveVoiceAnalysis(voiceAnalysis)
    loadRecentAnalyses()
    setIsAnalyzing(false)
  }

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MindScope</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/journal" className="text-gray-600 hover:text-blue-600">
                Journal
              </Link>
              <Link href="/voice" className="text-blue-600 font-medium">
                Voice Check
              </Link>
              <Link href="/chat" className="text-gray-600 hover:text-blue-600">
                AI Companion
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-blue-600">
                Settings
              </Link>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-red-700">Microphone Access Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Mic className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                Voice analysis requires microphone access. Please enable microphone permissions in your browser
                settings.
              </p>
              <Button onClick={checkMicrophonePermission}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MindScope</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/journal" className="text-gray-600 hover:text-blue-600">
              Journal
            </Link>
            <Link href="/voice" className="text-blue-600 font-medium">
              Voice Check
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-blue-600">
              AI Companion
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-blue-600">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Stress Detection</h1>
          <p className="text-gray-600">Record a voice sample to analyze your emotional state and stress levels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recording Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                  <span>Voice Recording</span>
                </CardTitle>
                <CardDescription>
                  Speak naturally for 30-60 seconds about your day or how you're feeling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  {/* Recording Visualization */}
                  <div className="relative">
                    <div
                      className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                        isRecording ? "border-red-500 bg-red-50 animate-pulse" : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="h-12 w-12 text-red-600" />
                      ) : (
                        <Mic className="h-12 w-12 text-blue-600" />
                      )}
                    </div>

                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                    )}
                  </div>

                  {/* Recording Timer */}
                  {isRecording && <div className="text-2xl font-mono text-red-600">{formatTime(recordingTime)}</div>}

                  {/* Recording Controls */}
                  <div className="space-y-4">
                    {!isRecording ? (
                      <Button size="lg" onClick={startRecording} className="px-8" disabled={hasPermission === false}>
                        <Mic className="h-5 w-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button size="lg" variant="destructive" onClick={stopRecording} className="px-8">
                        <Square className="h-5 w-5 mr-2" />
                        Stop Recording
                      </Button>
                    )}

                    {/* Audio Playback */}
                    {audioUrl && !isRecording && (
                      <div className="flex items-center justify-center space-x-4">
                        <Button variant="outline" onClick={playRecording}>
                          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          {isPlaying ? "Pause" : "Play"} Recording
                        </Button>
                        <span className="text-sm text-gray-600">{formatTime(recordingTime)} recorded</span>
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="flex items-center justify-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>Analyzing voice patterns...</span>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="text-sm text-gray-600 max-w-md mx-auto">
                    <p className="mb-2">For best results:</p>
                    <ul className="text-left space-y-1">
                      <li>• Speak in a quiet environment</li>
                      <li>• Talk naturally about your day or feelings</li>
                      <li>• Record for at least 30 seconds</li>
                      <li>• Ensure your microphone is working</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Voice Analysis Results</span>
                  </CardTitle>
                  <CardDescription>AI analysis of your voice patterns and emotional indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Stress Level */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Stress Level</h4>
                        <span className="text-sm text-gray-600">{analysis.stressLevel}%</span>
                      </div>
                      <Progress value={analysis.stressLevel} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {analysis.stressLevel < 30
                          ? "Low stress detected"
                          : analysis.stressLevel < 60
                            ? "Moderate stress detected"
                            : "High stress detected"}
                      </p>
                    </div>

                    {/* Emotional State */}
                    <div>
                      <h4 className="font-medium mb-2">Emotional State</h4>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {analysis.emotionalState}
                      </Badge>
                    </div>

                    {/* Voice Features */}
                    <div>
                      <h4 className="font-medium mb-3">Voice Characteristics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Pitch</p>
                          <p className="font-medium">{analysis.voiceFeatures.pitch}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Pace</p>
                          <p className="font-medium">{analysis.voiceFeatures.pace}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Energy</p>
                          <p className="font-medium">{analysis.voiceFeatures.energy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    {analysis.riskFactors.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span>Areas to Monitor</span>
                        </h4>
                        <div className="space-y-2">
                          {analysis.riskFactors.map((factor: string, index: number) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                              <p className="text-sm text-yellow-800">{factor}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Recommendations</span>
                      </h4>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Recording Tips</CardTitle>
                <CardDescription>Get the most accurate analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Find a quiet space without background noise</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Speak naturally, as you would in conversation</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Record for 30-60 seconds for best results</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Talk about your day, feelings, or any topic</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Analyses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Voice Checks</CardTitle>
                <CardDescription>Your voice analysis history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAnalyses.length > 0 ? (
                    recentAnalyses.map((analysis) => (
                      <div key={analysis.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {new Date(analysis.timestamp).toLocaleDateString()}
                          </span>
                          <Badge variant={analysis.stressLevel < 40 ? "secondary" : "outline"}>
                            {analysis.stressLevel < 40 ? "Low Stress" : "Moderate"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {analysis.emotionalState}, {analysis.stressLevel}% stress level
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No voice checks yet</p>
                      <p className="text-xs">Record your first voice sample</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Voice Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600">
                  Voice recordings are processed locally and immediately deleted after analysis. Only anonymized
                  patterns are stored.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} style={{ display: "none" }} />
      )}
    </div>
  )
}
