// Simple localStorage wrapper for data persistence
export interface JournalEntry {
  id: string
  content: string
  timestamp: Date
  analysis?: {
    mood: string
    emotions: string[]
    sentiment: number
    keyThemes: string[]
    suggestions: string[]
  }
}

export interface VoiceAnalysis {
  id: string
  timestamp: Date
  stressLevel: number
  emotionalState: string
  voiceFeatures: {
    pitch: string
    pace: string
    energy: string
  }
  riskFactors: string[]
  recommendations: string[]
}

export interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export interface MoodEntry {
  id: string
  date: string
  mood: number // 1-10 scale
  stress: number
  energy: number
  sleep: number
  notes?: string
}

class Storage {
  private getItem<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : []
  }

  private setItem<T>(key: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Journal methods
  getJournalEntries(): JournalEntry[] {
    return this.getItem<JournalEntry>("journal_entries").map((entry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }))
  }

  saveJournalEntry(entry: JournalEntry): void {
    const entries = this.getJournalEntries()
    const existingIndex = entries.findIndex((e) => e.id === entry.id)
    if (existingIndex >= 0) {
      entries[existingIndex] = entry
    } else {
      entries.push(entry)
    }
    this.setItem("journal_entries", entries)
  }

  deleteJournalEntry(entryId: string): void {
    const entries = this.getJournalEntries().filter((e) => e.id !== entryId)
    this.setItem("journal_entries", entries)
  }

  // Voice analysis methods
  getVoiceAnalyses(): VoiceAnalysis[] {
    return this.getItem<VoiceAnalysis>("voice_analyses").map((analysis) => ({
      ...analysis,
      timestamp: new Date(analysis.timestamp),
    }))
  }

  saveVoiceAnalysis(analysis: VoiceAnalysis): void {
    const analyses = this.getVoiceAnalyses()
    analyses.push(analysis)
    this.setItem("voice_analyses", analyses)
  }

  deleteVoiceAnalysis(id: string): void {
    const analyses = this.getVoiceAnalyses().filter((a) => a.id !== id)
    this.setItem("voice_analyses", analyses)
  }

  // Chat methods
  getChatMessages(): ChatMessage[] {
    return this.getItem<ChatMessage>("chat_messages").map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }))
  }

  saveChatMessage(message: ChatMessage): void {
    const messages = this.getChatMessages()
    messages.push(message)
    this.setItem("chat_messages", messages)
  }

  clearChatMessages(): void {
    this.setItem("chat_messages", [])
  }

  // Mood tracking methods
  getMoodEntries(): MoodEntry[] {
    return this.getItem<MoodEntry>("mood_entries")
  }

  saveMoodEntry(entry: MoodEntry): void {
    const entries = this.getMoodEntries()
    const existingIndex = entries.findIndex((e) => e.date === entry.date)
    if (existingIndex >= 0) {
      entries[existingIndex] = entry
    } else {
      entries.push(entry)
    }
    this.setItem("mood_entries", entries)
  }

  // User settings
  getUserSettings() {
    if (typeof window === "undefined") return {}
    const settings = localStorage.getItem("user_settings")
    return settings
      ? JSON.parse(settings)
      : {
          notifications: {
            dailyReminders: true,
            weeklyReports: true,
            crisisAlerts: true,
            researchUpdates: false,
          },
          privacy: {
            dataAnalytics: true,
            voiceRetention: false,
            researchParticipation: true,
          },
        }
  }

  saveUserSettings(settings: any): void {
    if (typeof window === "undefined") return
    localStorage.setItem("user_settings", JSON.stringify(settings))
  }
}

export const storage = new Storage()
