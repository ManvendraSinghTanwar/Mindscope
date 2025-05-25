"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Brain, User, Bell, Shield, Download, Trash2, Eye, Smartphone, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { storage } from "@/lib/storage"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [userProfile, setUserProfile] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    timezone: "Eastern Time (ET)",
  })

  useEffect(() => {
    const userSettings = storage.getUserSettings()
    setSettings(userSettings)
  }, [])

  const updateSetting = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    }
    setSettings(newSettings)
  }

  const saveSettings = async () => {
    setIsSaving(true)

    // Simulate save time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    storage.saveUserSettings(settings)
    setIsSaving(false)
    setSaveSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const exportData = () => {
    const allData = {
      journalEntries: storage.getJournalEntries(),
      voiceAnalyses: storage.getVoiceAnalyses(),
      chatMessages: storage.getChatMessages(),
      moodEntries: storage.getMoodEntries(),
      settings: storage.getUserSettings(),
    }

    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `mindscope-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const deleteAllData = () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      localStorage.clear()
      alert("All data has been deleted. You will be redirected to the home page.")
      window.location.href = "/"
    }
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
            <Link href="/voice" className="text-gray-600 hover:text-blue-600">
              Voice Check
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-blue-600">
              AI Companion
            </Link>
            <Link href="/settings" className="text-blue-600 font-medium">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account, privacy, and preferences</p>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={userProfile.timezone}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Privacy & Data</span>
                </CardTitle>
                <CardDescription>Control how your data is used and stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Data Analytics</Label>
                    <p className="text-sm text-gray-600">Allow anonymized data to improve AI models</p>
                  </div>
                  <Switch
                    checked={settings.privacy?.dataAnalytics ?? true}
                    onCheckedChange={(checked) => updateSetting("privacy", "dataAnalytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Voice Data Retention</Label>
                    <p className="text-sm text-gray-600">Keep voice recordings for trend analysis</p>
                  </div>
                  <Switch
                    checked={settings.privacy?.voiceRetention ?? false}
                    onCheckedChange={(checked) => updateSetting("privacy", "voiceRetention", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Research Participation</Label>
                    <p className="text-sm text-gray-600">Contribute to mental health research (anonymous)</p>
                  </div>
                  <Switch
                    checked={settings.privacy?.researchParticipation ?? true}
                    onCheckedChange={(checked) => updateSetting("privacy", "researchParticipation", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Data Export & Deletion</h4>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2" onClick={exportData}>
                      <Download className="h-4 w-4" />
                      <span>Export My Data</span>
                    </Button>
                    <Button variant="destructive" className="flex items-center space-x-2" onClick={deleteAllData}>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Daily Check-in Reminders</Label>
                    <p className="text-sm text-gray-600">Gentle reminders to log your mood</p>
                  </div>
                  <Switch
                    checked={settings.notifications?.dailyReminders ?? true}
                    onCheckedChange={(checked) => updateSetting("notifications", "dailyReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Progress Reports</Label>
                    <p className="text-sm text-gray-600">Summary of your mental health trends</p>
                  </div>
                  <Switch
                    checked={settings.notifications?.weeklyReports ?? true}
                    onCheckedChange={(checked) => updateSetting("notifications", "weeklyReports", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Crisis Alert System</Label>
                    <p className="text-sm text-gray-600">Emergency notifications for concerning patterns</p>
                  </div>
                  <Switch
                    checked={settings.notifications?.crisisAlerts ?? true}
                    onCheckedChange={(checked) => updateSetting("notifications", "crisisAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Research Updates</Label>
                    <p className="text-sm text-gray-600">Latest mental health research and tips</p>
                  </div>
                  <Switch
                    checked={settings.notifications?.researchUpdates ?? false}
                    onCheckedChange={(checked) => updateSetting("notifications", "researchUpdates", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={isSaving} className="px-8">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save All Settings"
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan</span>
                    <Badge>Free</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member Since</span>
                    <span className="text-sm text-gray-600">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Usage</span>
                    <span className="text-sm text-gray-600">
                      {(
                        (JSON.stringify(storage.getJournalEntries()).length +
                          JSON.stringify(storage.getVoiceAnalyses()).length +
                          JSON.stringify(storage.getChatMessages()).length) /
                        1024
                      ).toFixed(1)}{" "}
                      KB
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Privacy Policy
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Download Mobile App
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Crisis Text Line:</strong> Text HOME to 741741
                  </p>
                  <p>
                    <strong>National Suicide Prevention:</strong> 988
                  </p>
                  <p>
                    <strong>Emergency Services:</strong> 911
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
