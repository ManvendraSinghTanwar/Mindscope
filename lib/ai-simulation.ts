// Simulated AI analysis functions
export function analyzeText(text: string) {
  const words = text.toLowerCase().split(" ")

  // Simple sentiment analysis
  const positiveWords = [
    "happy",
    "good",
    "great",
    "amazing",
    "wonderful",
    "excited",
    "love",
    "joy",
    "grateful",
    "blessed",
    "fantastic",
    "excellent",
  ]
  const negativeWords = [
    "sad",
    "bad",
    "terrible",
    "awful",
    "hate",
    "angry",
    "depressed",
    "anxious",
    "worried",
    "stressed",
    "overwhelmed",
    "frustrated",
  ]
  const anxietyWords = ["nervous", "worried", "anxious", "panic", "fear", "scared", "overwhelmed", "stress"]

  const positiveCount = words.filter((word) => positiveWords.includes(word)).length
  const negativeCount = words.filter((word) => negativeWords.includes(word)).length
  const anxietyCount = words.filter((word) => anxietyWords.includes(word)).length

  const sentiment = Math.max(0.1, Math.min(0.9, (positiveCount - negativeCount + 5) / 10))

  // Determine mood
  let mood = "Neutral"
  if (sentiment > 0.7) mood = "Positive"
  else if (sentiment < 0.4) mood = "Negative"

  // Detect emotions
  const emotions = []
  if (positiveCount > 0) emotions.push("Happiness")
  if (negativeCount > 0) emotions.push("Sadness")
  if (anxietyCount > 0) emotions.push("Anxiety")
  if (words.some((w) => ["tired", "exhausted", "drained"].includes(w))) emotions.push("Fatigue")
  if (words.some((w) => ["hope", "optimistic", "future"].includes(w))) emotions.push("Hope")
  if (emotions.length === 0) emotions.push("Calm")

  // Extract themes
  const themes = []
  if (words.some((w) => ["work", "job", "boss", "colleague", "office"].includes(w))) themes.push("Work")
  if (words.some((w) => ["family", "parent", "child", "spouse", "relationship"].includes(w)))
    themes.push("Relationships")
  if (words.some((w) => ["health", "doctor", "medicine", "sick"].includes(w))) themes.push("Health")
  if (words.some((w) => ["money", "financial", "bills", "budget"].includes(w))) themes.push("Finances")
  if (words.some((w) => ["future", "goal", "plan", "dream"].includes(w))) themes.push("Future Planning")
  if (themes.length === 0) themes.push("Daily Life")

  // Generate suggestions
  const suggestions = []
  if (sentiment < 0.5) {
    suggestions.push("Consider practicing deep breathing exercises when feeling overwhelmed")
    suggestions.push("Remember that difficult emotions are temporary and valid")
  }
  if (anxietyCount > 0) {
    suggestions.push("Try the 5-4-3-2-1 grounding technique when feeling anxious")
  }
  if (positiveCount > 0) {
    suggestions.push("Your positive outlook is a strength - continue building on it")
  }
  suggestions.push("Consider speaking with a mental health professional if these feelings persist")

  return {
    mood,
    emotions,
    sentiment,
    keyThemes: themes,
    suggestions,
  }
}

export function analyzeVoice() {
  // Simulate voice analysis with random but realistic values
  const stressLevel = Math.floor(Math.random() * 60) + 20 // 20-80%
  const emotionalStates = ["Calm", "Slightly Stressed", "Anxious", "Relaxed", "Energetic", "Tired"]
  const emotionalState = emotionalStates[Math.floor(Math.random() * emotionalStates.length)]

  const pitchOptions = ["Low", "Normal", "High"]
  const paceOptions = ["Slow", "Steady", "Fast"]
  const energyOptions = ["Low", "Moderate", "High"]

  const voiceFeatures = {
    pitch: pitchOptions[Math.floor(Math.random() * pitchOptions.length)],
    pace: paceOptions[Math.floor(Math.random() * paceOptions.length)],
    energy: energyOptions[Math.floor(Math.random() * energyOptions.length)],
  }

  const riskFactors = []
  if (stressLevel > 60) riskFactors.push("Elevated stress levels detected")
  if (voiceFeatures.pace === "Fast") riskFactors.push("Rapid speech patterns may indicate anxiety")
  if (voiceFeatures.energy === "Low") riskFactors.push("Low energy levels detected")

  const recommendations = []
  if (stressLevel < 40) {
    recommendations.push("Your voice indicates good emotional stability")
    recommendations.push("Continue with current stress management practices")
  } else {
    recommendations.push("Consider taking breaks throughout the day")
    recommendations.push("Practice relaxation techniques like deep breathing")
  }

  if (voiceFeatures.energy === "Low") {
    recommendations.push("Ensure you're getting adequate sleep and nutrition")
  }

  return {
    stressLevel,
    emotionalState,
    voiceFeatures,
    riskFactors,
    recommendations,
  }
}

export function generateAIResponse(userInput: string): { content: string; suggestions: string[] } {
  const input = userInput.toLowerCase()

  let response = ""
  let suggestions: string[] = []

  if (input.includes("stress") || input.includes("overwhelmed")) {
    response =
      "I hear that you're feeling stressed and overwhelmed. These feelings are completely valid, and it's important to acknowledge them. Stress can feel consuming, but there are ways to manage it. Would you like to explore some coping strategies together?"
    suggestions = [
      "Tell me about breathing exercises",
      "I need help managing my workload",
      "What are some quick stress relief techniques?",
      "I want to talk about what's causing my stress",
    ]
  } else if (input.includes("anxious") || input.includes("anxiety") || input.includes("worried")) {
    response =
      "Anxiety can be really challenging to deal with, and I want you to know that what you're experiencing is real and valid. Many people struggle with anxious thoughts and feelings. You're not alone in this. Can you tell me more about what's been making you feel anxious lately?"
    suggestions = [
      "What is the 5-4-3-2-1 grounding technique?",
      "I have racing thoughts",
      "I'm worried about the future",
      "Help me understand my anxiety triggers",
    ]
  } else if (input.includes("sad") || input.includes("depressed") || input.includes("down")) {
    response =
      "I'm sorry you're feeling this way. Sadness and low moods are difficult emotions to carry, but they're also a natural part of the human experience. It's okay to feel sad, and it's brave of you to reach out. Remember that these feelings, while painful, are temporary. What's been weighing on your heart lately?"
    suggestions = [
      "I don't feel like doing anything",
      "How can I improve my mood?",
      "I feel isolated and alone",
      "Tell me about depression resources",
    ]
  } else if (input.includes("sleep") || input.includes("tired") || input.includes("insomnia")) {
    response =
      "Sleep issues can really impact how we feel during the day. Good sleep is so important for our mental health and overall wellbeing. There are several strategies that can help improve sleep quality. What specific sleep challenges are you experiencing?"
    suggestions = [
      "I can't fall asleep at night",
      "I wake up frequently during the night",
      "What is good sleep hygiene?",
      "I'm having nightmares",
    ]
  } else if (input.includes("work") || input.includes("job")) {
    response =
      "Work-related stress is incredibly common, and it sounds like your job is impacting your wellbeing. It's important to find ways to manage work stress and maintain boundaries. Your mental health matters more than any job. What aspects of work are causing you the most difficulty?"
    suggestions = [
      "I'm burned out from work",
      "My boss is causing me stress",
      "How do I set work boundaries?",
      "I'm considering changing jobs",
    ]
  } else if (input.includes("relationship") || input.includes("family") || input.includes("friend")) {
    response =
      "Relationships can be both a source of great joy and significant stress. It sounds like you're dealing with some interpersonal challenges. Healthy relationships require communication, boundaries, and mutual respect. What's been happening in your relationships that's concerning you?"
    suggestions = [
      "I'm having conflict with someone close to me",
      "I feel misunderstood by others",
      "How do I communicate better?",
      "I'm feeling lonely",
    ]
  } else if (input.includes("thank") || input.includes("better") || input.includes("good")) {
    response =
      "I'm so glad to hear that you're feeling better! It's wonderful that you're taking care of your mental health and reaching out for support. Remember that healing isn't always linear - there will be good days and challenging days, and that's completely normal. Keep up the great work in prioritizing your wellbeing."
    suggestions = [
      "How can I maintain this positive momentum?",
      "What should I do when I have bad days?",
      "I want to help others who are struggling",
      "Tell me about building resilience",
    ]
  } else {
    response =
      "Thank you for sharing that with me. I'm here to listen and support you through whatever you're experiencing. Your feelings and experiences are valid, and it takes courage to open up about them. How are you feeling right now, and what would be most helpful for you today?"
    suggestions = [
      "I'm not sure how I'm feeling",
      "I need coping strategies",
      "I want to understand my emotions better",
      "Can you help me find professional help?",
    ]
  }

  return { content: response, suggestions }
}
