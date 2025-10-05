"use client"

import type React from "react"

interface DrumSelectorProps {
  selectedPattern: string
  selectedTrack: string
  onPatternChange: (pattern: string, track: string) => void
}

export const DrumSelector: React.FC<DrumSelectorProps> = ({ selectedPattern, selectedTrack, onPatternChange }) => {
  const patterns = [
    { id: "metronome", name: "Metronome", icon: "🎵", tracks: [] },
    {
      id: "pop",
      name: "Pop",
      icon: "🎤",
      tracks: ["basic", "with-kick", "16th-hats"],
    },
    {
      id: "funk",
      name: "Funk",
      icon: "🕺",
      tracks: ["basic", "syncopated", "groovy"],
    },
    {
      id: "rock",
      name: "Rock",
      icon: "🎸",
      tracks: ["basic", "driving", "half-time"],
    },
    {
      id: "blues",
      name: "Blues",
      icon: "🎺",
      tracks: ["shuffle", "slow-blues", "12/8"],
    },
    {
      id: "country",
      name: "Country",
      icon: "🤠",
      tracks: ["two-step", "train-beat", "waltz"],
    },
  ]

  const currentPattern = patterns.find((p) => p.id === selectedPattern)
  const trackIndex = currentPattern?.tracks.indexOf(selectedTrack) ?? -1

  const handlePatternClick = (patternId: string) => {
    const pattern = patterns.find((p) => p.id === patternId)
    if (!pattern) return

    if (patternId === "metronome") {
      onPatternChange(patternId, "none")
    } else if (pattern.tracks.length > 0) {
      onPatternChange(patternId, pattern.tracks[0])
    }
  }

  const cycleTrack = () => {
    if (!currentPattern || currentPattern.tracks.length === 0) return
    const nextIndex = (trackIndex + 1) % currentPattern.tracks.length
    onPatternChange(selectedPattern, currentPattern.tracks[nextIndex])
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Drums:</label>
      <div className="flex gap-2">
        <select
          value={selectedPattern}
          onChange={(e) => handlePatternClick(e.target.value)}
          className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {patterns.map((pattern) => (
            <option key={pattern.id} value={pattern.id}>
              {pattern.icon} {pattern.name}
            </option>
          ))}
        </select>
        {currentPattern && currentPattern.tracks.length > 0 && (
          <button
            onClick={cycleTrack}
            className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
            title={`Track: ${selectedTrack}`}
          >
            {trackIndex + 1}/{currentPattern.tracks.length}
          </button>
        )}
      </div>
      {currentPattern && currentPattern.tracks.length > 0 && (
        <div className="text-xs text-gray-600">Track: {selectedTrack}</div>
      )}
    </div>
  )
}
