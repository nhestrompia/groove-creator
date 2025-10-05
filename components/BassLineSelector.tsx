"use client"

import type React from "react"

interface BassLineSelectorProps {
  selectedPattern: string
  onPatternChange: (pattern: string) => void
}

export const BassLineSelector: React.FC<BassLineSelectorProps> = ({ selectedPattern, onPatternChange }) => {
  const patterns = [
    { id: "none", name: "No Bass", icon: "🚫" },
    { id: "root", name: "Root Notes", icon: "🎸" },
    { id: "walking", name: "Walking Bass", icon: "🚶" },
    { id: "funk", name: "Funk", icon: "🕺" },
    { id: "rock", name: "Rock", icon: "🤘" },
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Bass Line:</label>
      <select
        value={selectedPattern}
        onChange={(e) => onPatternChange(e.target.value)}
        className="w-full px-2 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {patterns.map((pattern) => (
          <option key={pattern.id} value={pattern.id}>
            {pattern.icon} {pattern.name}
          </option>
        ))}
      </select>
    </div>
  )
}
