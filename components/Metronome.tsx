"use client"

import type React from "react"

interface MetronomeProps {
  bpm: number
  onBpmChange: (bpm: number) => void
  isPlaying: boolean
  onPlayPause: () => void
}

export const Metronome: React.FC<MetronomeProps> = ({ bpm, onBpmChange, isPlaying, onPlayPause }) => {
  return (
    <div className="flex items-center space-x-4 mt-4">
      <button
        className={`px-4 py-2 rounded ${
          isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white transition-colors`}
        onClick={onPlayPause}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
      <div className="flex items-center space-x-2 flex-1">
        <span className="text-sm font-semibold whitespace-nowrap">BPM:</span>
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="flex-1 max-w-xs"
        />
        <span className="text-lg font-semibold w-12 text-center">{bpm}</span>
      </div>
    </div>
  )
}
