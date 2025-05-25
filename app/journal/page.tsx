"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, MessageCircle, Save, Smile, Meh, TrendingUp, BookOpen, Lightbulb, Frown, Trash2 } from "lucide-react"
import Link from "next/link"
import { storage, type JournalEntry } from "@/lib/storage"

export default function JournalPage() {
  const [journalEntry, setJournalEntry] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)

  useEffect(() => {
    loadRecentEntries()
  }, [])

  const loadRecentEntries = () => {
    const entries = storage.getJournalEntries().slice(-5).reverse()
    setRecentEntries(entries)
  }

   const handleAnalyze = async () => {
      if (!journalEntry.trim()) return;

      setIsAnalyzing(true);

    try {
      const response = await fetch("/api/llama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: journalEntry , mode: "journal"}),
      });

      const data = await response.json();

      // If `data` is already a valid JSON object, use it directly
      if (data.error) {
        setAnalysis({
          mood: "Unknown",
          emotions: [],
          sentiment: 0.5,
          keyThemes: [],
          suggestions: [data.error || "LLaMA parsing error", ...(data.raw ? [data.raw] : [])],
        });
      } else {
        setAnalysis(data);
      }
    } catch (err) {
      setAnalysis({
        mood: "Unknown",
        emotions: [],
        sentiment: 0.5,
        keyThemes: [],
        suggestions: ["LLaMA API error"],
      });
    }

    setIsAnalyzing(false);
  };
  
  const handleSave = async () => {
    if (!journalEntry.trim()) return

    setIsSaving(true)

    const entry: JournalEntry = {
      id: currentEntryId || Date.now().toString(),
      content: journalEntry,
      timestamp: new Date(),
      analysis: analysis || undefined,
    }

    storage.saveJournalEntry(entry)

    // Simulate save time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    setCurrentEntryId(entry.id)
    loadRecentEntries()
  }

  const loadEntry = (entry: JournalEntry) => {
    setJournalEntry(entry.content)
    setAnalysis(entry.analysis || null)
    setCurrentEntryId(entry.id)
  }

  const startNewEntry = () => {
    setJournalEntry("")
    setAnalysis(null)
    setCurrentEntryId(null)
  }

  const handleDeleteEntry = (entryId: string) => {
    storage.deleteJournalEntry(entryId)
    // If the deleted entry is currently loaded, clear it
    if (currentEntryId === entryId) {
      setJournalEntry("")
      setAnalysis(null)
      setCurrentEntryId(null)
    }
    loadRecentEntries()
  }

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "positive":
        return <Smile className="h-4 w-4 text-green-600" />
      case "negative":
        return <Frown className="h-4 w-4 text-red-600" />
      default:
        return <Meh className="h-4 w-4 text-yellow-600" />
    }
  }

  const writingPrompts = [
    {
      title: "Three things I'm grateful for today...",
      description: "Gratitude practice",
      prompt: "Today I'm grateful for:\n1. \n2. \n3. \n\nThese things make me feel grateful because...",
    },
    {
      title: "A challenge I overcame recently...",
      description: "Resilience reflection",
      prompt: "Recently I faced a challenge when... I overcame it by... This experience taught me that...",
    },
    {
      title: "How I'm feeling right now and why...",
      description: "Emotional check-in",
      prompt: "Right now I'm feeling... I think this is because... What I need most today is...",
    },
    {
      title: "My hopes for tomorrow...",
      description: "Future focus",
      prompt: "Tomorrow I hope to... I'm looking forward to... One thing I want to accomplish is...",
    },
  ]

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
            <Link href="/journal" className="text-blue-600 font-medium">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Journal</h1>
          <p className="text-gray-600">Express your thoughts and let AI help you understand your emotional patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Journal Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>{currentEntryId ? "Edit Entry" : "New Entry"}</span>
                    </CardTitle>
                    <CardDescription>
                      Write about your day, feelings, thoughts, or anything on your mind
                    </CardDescription>
                  </div>
                  {currentEntryId && (
                    <Button variant="outline" onClick={startNewEntry}>
                      New Entry
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="How are you feeling today? What's on your mind? Share your thoughts, experiences, or anything you'd like to reflect on..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">{journalEntry.length} characters</div>
                    <div className="flex space-x-2">
                      <Button variant="outline" disabled={!journalEntry.trim() || isSaving} onClick={handleSave}>
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Entry
                          </>
                        )}
                      </Button>
                      <Button onClick={handleAnalyze} disabled={!journalEntry.trim() || isAnalyzing}>
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Analyze Entry
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>AI Analysis</span>
                  </CardTitle>
                  <CardDescription>Insights from your journal entry</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Mood & Sentiment */}
                    <div>
                      <h4 className="font-medium mb-3">Overall Mood & Sentiment</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getMoodIcon(analysis.mood)}
                          <span className="font-medium">{analysis.mood}</span>
                        </div>
                        <Progress value={analysis.sentiment * 100} className="flex-1" />
                        <span className="text-sm text-gray-600">{Math.round(analysis.sentiment * 100)}% positive</span>
                      </div>
                    </div>

                    {/* Detected Emotions */}
                    <div>
                      <h4 className="font-medium mb-3">Detected Emotions</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.emotions.map((emotion: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Key Themes */}
                    <div>
                      <h4 className="font-medium mb-3">Key Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keyThemes.map((theme: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span>Personalized Insights</span>
                      </h4>
                      <div className="space-y-2">
                        {analysis.suggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">{suggestion}</p>
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
            {/* Writing Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Writing Prompts</CardTitle>
                <CardDescription>Need inspiration? Try these prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {writingPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-3"
                      onClick={() => setJournalEntry(prompt.prompt)}
                    >
                      <div>
                        <p className="font-medium">{prompt.title}</p>
                        <p className="text-sm text-gray-600">{prompt.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your journal history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEntries.length > 0 ? (
                    recentEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                        onClick={() => loadEntry(entry)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{new Date(entry.timestamp).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-2">
                            {entry.analysis && getMoodIcon(entry.analysis.mood)}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-60 group-hover:opacity-100"
                              title="Delete entry"
                              onClick={e => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{entry.content.substring(0, 100)}...</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No entries yet</p>
                      <p className="text-xs">Start writing to see your history</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Privacy Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600">
                  Your journal entries are encrypted and stored locally. Only you can access your personal content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
