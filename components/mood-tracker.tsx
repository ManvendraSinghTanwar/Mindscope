"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { storage, type MoodEntry } from "@/lib/storage"
import { Heart, Zap, Moon, AlertTriangle } from "lucide-react"

export function MoodTracker() {
  const [mood, setMood] = useState([7])
  const [stress, setStress] = useState([5])
  const [energy, setEnergy] = useState([6])
  const [sleep, setSleep] = useState([7])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      mood: mood[0],
      stress: stress[0],
      energy: energy[0],
      sleep: sleep[0],
      notes: notes.trim() || undefined,
    }

    storage.saveMoodEntry(entry)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setNotes("")
    }, 3000)
  }

  const getMoodEmoji = (value: number) => {
    if (value <= 3) return "😢"
    if (value <= 5) return "😕"
    if (value <= 7) return "😐"
    if (value <= 8) return "🙂"
    return "😊"
  }

  const getStressColor = (value: number) => {
    if (value <= 3) return "text-green-600"
    if (value <= 6) return "text-yellow-600"
    return "text-red-600"
  }

  if (submitted) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you for checking in!</h3>
            <p className="text-green-600">Your mood has been recorded. Keep taking care of yourself.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Mood Check-in</CardTitle>
        <CardDescription>Track how you're feeling today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span>Overall Mood</span>
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getMoodEmoji(mood[0])}</span>
              <span className="text-sm font-medium">{mood[0]}/10</span>
            </div>
          </div>
          <Slider value={mood} onValueChange={setMood} max={10} min={1} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Very Low</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Stress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span>Stress Level</span>
            </Label>
            <span className={`text-sm font-medium ${getStressColor(stress[0])}`}>{stress[0]}/10</span>
          </div>
          <Slider value={stress} onValueChange={setStress} max={10} min={1} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Very Relaxed</span>
            <span>Very Stressed</span>
          </div>
        </div>

        {/* Energy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>Energy Level</span>
            </Label>
            <span className="text-sm font-medium">{energy[0]}/10</span>
          </div>
          <Slider value={energy} onValueChange={setEnergy} max={10} min={1} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Sleep */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center space-x-2">
              <Moon className="h-4 w-4 text-blue-600" />
              <span>Sleep Quality</span>
            </Label>
            <span className="text-sm font-medium">{sleep[0]}/10</span>
          </div>
          <Slider value={sleep} onValueChange={setSleep} max={10} min={1} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Additional Notes (Optional)</Label>
          <Textarea
            placeholder="How are you feeling today? Any specific thoughts or events you'd like to note?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Recording...
            </>
          ) : (
            "Record Today's Mood"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
