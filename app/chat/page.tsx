"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Heart, Send, Bot, User, Lightbulb, Shield, Phone, MessageCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { storage, type ChatMessage } from "@/lib/storage"
import { generateAIResponse } from "@/lib/ai-simulation"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChatHistory()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const loadChatHistory = () => {
    const chatHistory = storage.getChatMessages()
    if (chatHistory.length === 0) {
      // Add initial welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "ai",
        content:
          "Hello! I'm your AI mental health companion. I'm here to listen, provide support, and help you explore your thoughts and feelings. How are you doing today?",
        timestamp: new Date(),
        suggestions: [
          "I'm feeling stressed about work",
          "I've been having trouble sleeping",
          "I'm feeling anxious lately",
          "I want to talk about my mood",
        ],
      }
      setMessages([welcomeMessage])
      storage.saveChatMessage(welcomeMessage)
    } else {
      setMessages(chatHistory)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    storage.saveChatMessage(userMessage)
    setInputMessage("")
    setIsTyping(true)

    // Always use Llama API for chat
    try {
      const res = await fetch("/api/llama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content, mode: "chat" })
      })
      const data = await res.json()
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.result || "(No response)",
        timestamp: new Date(),
        suggestions: [],
      }
      setMessages((prev) => [...prev, aiResponse])
      storage.saveChatMessage(aiResponse)
    } catch {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Llama API error",
        timestamp: new Date(),
        suggestions: [],
      }
      setMessages((prev) => [...prev, aiResponse])
      storage.saveChatMessage(aiResponse)
    }
    setIsTyping(false)
  }

  const clearChat = () => {
    storage.clearChatMessages()
    loadChatHistory()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputMessage)
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
            <Link href="/chat" className="text-blue-600 font-medium">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mental Health Companion</h1>
              <p className="text-gray-600">
                A supportive AI assistant trained to provide empathetic mental health support
              </p>
            </div>
            <Button variant="outline" onClick={clearChat} className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span>Clear Chat</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <span>Chat with AI Companion</span>
                </CardTitle>
                <CardDescription>A safe space to express your thoughts and receive supportive guidance</CardDescription>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                          <div
                            className={`flex items-start space-x-2 ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                message.type === "user" ? "bg-blue-600" : "bg-purple-600"
                              }`}
                            >
                              {message.type === "user" ? (
                                <User className="h-4 w-4 text-white" />
                              ) : (
                                <Bot className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div
                              className={`rounded-lg p-3 ${
                                message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.type === "user" ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>

                          {/* AI Suggestions */}
                          {message.type === "ai" && message.suggestions && (
                            <div className="mt-3 ml-10">
                              <p className="text-xs text-gray-500 mb-2">Quick responses:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => sendMessage(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message here..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button onClick={() => sendMessage(inputMessage)} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>How I Can Help</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p>Active listening and emotional support</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Coping strategies and techniques</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Heart className="h-4 w-4 text-purple-600 mt-0.5" />
                    <p>Stress and anxiety management</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Brain className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p>Mindfulness and self-reflection</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Reminders */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-700 flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Important Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-yellow-700">
                  <p>• I'm an AI assistant, not a replacement for professional therapy</p>
                  <p>• I encourage seeking professional help when needed</p>
                  <p>• In crisis situations, please contact emergency services</p>
                  <p>• Your conversations are private and secure</p>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Resources */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Crisis Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full" size="sm">
                    Crisis Text Line: Text HOME to 741741
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    National Suicide Prevention: 988
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Emergency Services: 911
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conversation Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Be honest about your feelings</p>
                  <p>• Take your time to express yourself</p>
                  <p>• Ask for specific coping strategies</p>
                  <p>• Let me know if you need professional resources</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
