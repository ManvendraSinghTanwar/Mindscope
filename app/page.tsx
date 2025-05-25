import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MessageCircle, Mic, BarChart3, Shield, Heart, Users, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MindScope</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="#privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Mental Health
            <span className="text-blue-600 block">Early Detection & Support</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Detect early signs of mental health issues through AI analysis of your language, voice, and behavior. Get
            personalized support while maintaining complete privacy and control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="/dashboard">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1M+</div>
              <div className="text-gray-600">People Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-gray-600">Privacy Protected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-gray-600">AI Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Mental Health Support</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides multiple ways to monitor and support your mental wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Text Emotion Analysis</CardTitle>
                <CardDescription>
                  Journal your thoughts or chat with our AI. Advanced NLP analyzes your emotional patterns and provides
                  insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Mic className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Voice Stress Detection</CardTitle>
                <CardDescription>
                  Record voice samples to detect early signs of depression, anxiety, and stress through audio analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <Heart className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>AI Chat Companion</CardTitle>
                <CardDescription>
                  Empathetic AI support available 24/7. Provides coping strategies and encourages professional help when
                  needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Personal Dashboard</CardTitle>
                <CardDescription>
                  Track your emotional trends over time with beautiful visualizations and personalized insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy & Ethics Section */}
      <section id="privacy" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Privacy-First Approach</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your mental health data is sensitive. We've built MindScope with privacy and ethics at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Data Anonymization</CardTitle>
                <CardDescription>
                  All personal data is anonymized and encrypted. We never store identifiable information with your
                  mental health data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>User Consent</CardTitle>
                <CardDescription>
                  You maintain complete control. No decisions are made without your explicit consent and understanding.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Explainable AI</CardTitle>
                <CardDescription>
                  Our AI provides clear explanations for its assessments, helping you understand the reasoning behind
                  insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Take Control of Your Mental Health?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are proactively monitoring and improving their mental wellbeing with MindScope.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
            <Link href="/dashboard">Start Your Free Assessment</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="text-xl font-bold">MindScope</span>
              </div>
              <p className="text-gray-400">
                AI-powered mental health support that puts your privacy and wellbeing first.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Text Analysis</li>
                <li>Voice Detection</li>
                <li>AI Companion</li>
                <li>Dashboard</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Mental Health Resources</li>
                <li>Crisis Support</li>
                <li>Professional Help</li>
                <li>Research</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 MindScope. All rights reserved. This platform is not a substitute for professional medical
              advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
