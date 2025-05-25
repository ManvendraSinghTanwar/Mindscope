"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageCircle, Mic, Heart, Activity, Clock, Target, Plus } from "lucide-react"
import Link from "next/link"
import { MoodChart } from "@/components/mood-chart"
import { MoodTracker } from "@/components/mood-tracker"
import { storage, type JournalEntry, type VoiceAnalysis, type MoodEntry } from "@/lib/storage"

export default function DashboardPage() {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [recentVoiceAnalyses, setRecentVoiceAnalyses] = useState<VoiceAnalysis[]>([])
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null)
  const [showMoodTracker, setShowMoodTracker] = useState(false)

  useEffect(() => {
    // Load recent data
    const journalEntries = storage.getJournalEntries().slice(-3).reverse()
    const voiceAnalyses = storage.getVoiceAnalyses().slice(-3).reverse()
    const moodEntries = storage.getMoodEntries()

    setRecentEntries(journalEntries)
    setRecentVoiceAnalyses(voiceAnalyses)

    // Check if user has logged mood today
    const today = new Date().toISOString().split("T")[0]
    const todayMood = moodEntries.find((entry) => entry.date === today)
    setTodaysMood(todayMood || null)
  }, [])

  const getOverallWellbeing = () => {
    if (!todaysMood) return { score: 70, status: "Good", change: "+5%" }

    const avgScore = (todaysMood.mood + (10 - todaysMood.stress) + todaysMood.energy + todaysMood.sleep) / 4
    const score = Math.round((avgScore / 10) * 100)

    let status = "Good"
    if (score >= 80) status = "Excellent"
    else if (score >= 60) status = "Good"
    else if (score >= 40) status = "Fair"
    else status = "Needs Attention"

    return { score, status, change: "+5%" }
  }

  const wellbeing = getOverallWellbeing()

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
            <Link href="/dashboard" className="text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link href="/journal" className="text-gray-600 hover:text-blue-600">
              Journal
            </Link>
            <Link href="/voice" className="text-gray-600 hover:text-blue-600">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's your mental health overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Wellbeing</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{wellbeing.status}</div>
              <Progress value={wellbeing.score} className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">{wellbeing.change} from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {todaysMood ? `${todaysMood.stress}/10` : "Moderate"}
              </div>
              <Progress value={todaysMood ? (10 - todaysMood.stress) * 10 : 55} className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">-10% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todaysMood ? `${todaysMood.sleep}/10` : "7.5h"}</div>
              <Progress value={todaysMood ? todaysMood.sleep * 10 : 85} className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">Good quality sleep</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Goals</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">3/4</div>
              <Progress value={75} className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">Almost there!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Trends Chart */}
            <MoodChart />

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest mental health check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEntries.length > 0 ? (
                    recentEntries.map((entry, index) => (
                      <div key={entry.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium">Journal Entry</p>
                          <p className="text-sm text-gray-600">{entry.content.substring(0, 50)}...</p>
                        </div>
                        <Badge variant="secondary">{new Date(entry.timestamp).toLocaleDateString()}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activities</p>
                      <p className="text-sm">Start by writing in your journal or taking a voice check-in</p>
                    </div>
                  )}

                  {recentVoiceAnalyses.map((analysis, index) => (
                    <div key={analysis.id} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                      <Mic className="h-8 w-8 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Voice Check-in</p>
                        <p className="text-sm text-gray-600">
                          {analysis.emotionalState} - {analysis.stressLevel}% stress
                        </p>
                      </div>
                      <Badge variant="secondary">{new Date(analysis.timestamp).toLocaleDateString()}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Mood Tracker or Quick Actions */}
            {!todaysMood && !showMoodTracker ? (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">Daily Check-in</CardTitle>
                  <CardDescription>How are you feeling today?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowMoodTracker(true)} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Today's Mood
                  </Button>
                </CardContent>
              </Card>
            ) : showMoodTracker ? (
              <MoodTracker />
            ) : null}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start your mental health activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/journal">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Write in Journal
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/voice">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice Check-in
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/chat">
                    <Heart className="h-4 w-4 mr-2" />
                    Chat with AI
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Today's Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Insights</CardTitle>
                <CardDescription>AI-generated observations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Positive Pattern</p>
                    <p className="text-sm text-blue-700">Your morning routine seems to boost your mood consistently</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Suggestion</p>
                    <p className="text-sm text-yellow-700">
                      Consider a 5-minute break when stress levels peak around 3 PM
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Achievement</p>
                    <p className="text-sm text-green-700">You've maintained consistent sleep patterns for 5 days!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Resources */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Need Immediate Help?</CardTitle>
                <CardDescription>Crisis support resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full" size="sm">
                    Crisis Hotline: 988
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Find Local Therapist
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Emergency Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
