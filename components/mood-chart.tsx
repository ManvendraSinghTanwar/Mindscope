"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type MoodEntry } from "@/lib/storage"

export function MoodChart() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([])

  useEffect(() => {
    const entries = storage.getMoodEntries()
    // Generate sample data if none exists
    if (entries.length === 0) {
      const sampleData: MoodEntry[] = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        sampleData.push({
          id: `sample-${i}`,
          date: date.toISOString().split("T")[0],
          mood: Math.floor(Math.random() * 4) + 6, // 6-10
          stress: Math.floor(Math.random() * 5) + 3, // 3-8
          energy: Math.floor(Math.random() * 4) + 5, // 5-9
          sleep: Math.floor(Math.random() * 3) + 7, // 7-10
        })
      }
      sampleData.forEach((entry) => storage.saveMoodEntry(entry))
      setMoodData(sampleData)
    } else {
      setMoodData(entries.slice(-7)) // Last 7 days
    }
  }, [])

  const maxValue = 10
  const chartHeight = 200

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends (Last 7 Days)</CardTitle>
        <CardDescription>Track your emotional patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: chartHeight + 40 }}>
          {/* Chart area */}
          <div
            className="relative bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4"
            style={{ height: chartHeight }}
          >
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map((value) => (
              <div
                key={value}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ bottom: `${(value / maxValue) * (chartHeight - 40)}px` }}
              >
                <span className="absolute -left-8 -top-2 text-xs text-gray-500">{value}</span>
              </div>
            ))}

            {/* Data lines */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Mood line */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                points={moodData
                  .map((entry, index) => {
                    const x = (index / (moodData.length - 1)) * 100
                    const y = 100 - (entry.mood / maxValue) * 80
                    return `${x}%,${y}%`
                  })
                  .join(" ")}
              />

              {/* Stress line */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="5,5"
                points={moodData
                  .map((entry, index) => {
                    const x = (index / (moodData.length - 1)) * 100
                    const y = 100 - (entry.stress / maxValue) * 80
                    return `${x}%,${y}%`
                  })
                  .join(" ")}
              />

              {/* Energy line */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                points={moodData
                  .map((entry, index) => {
                    const x = (index / (moodData.length - 1)) * 100
                    const y = 100 - (entry.energy / maxValue) * 80
                    return `${x}%,${y}%`
                  })
                  .join(" ")}
              />

              {/* Data points */}
              {moodData.map((entry, index) => {
                const x = (index / (moodData.length - 1)) * 100
                const moodY = 100 - (entry.mood / maxValue) * 80
                return (
                  <circle
                    key={`mood-${index}`}
                    cx={`${x}%`}
                    cy={`${moodY}%`}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-blue-600"></div>
              <span className="text-sm text-gray-600">Mood</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500"></div>
              <span className="text-sm text-gray-600">Stress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-green-600"></div>
              <span className="text-sm text-gray-600">Energy</span>
            </div>
          </div>

          {/* Date labels */}
          <div className="flex justify-between mt-2 px-4">
            {moodData.map((entry, index) => (
              <span key={index} className="text-xs text-gray-500">
                {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
