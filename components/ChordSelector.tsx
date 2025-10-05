"use client"

import type React from "react"
import { useState } from "react"
import { Music } from "lucide-react"
import { playChord } from "@/utils/chords"

interface ChordSelectorProps {
  selectedChord: string
  onChordChange: (chord: string) => void
}

export const ChordSelector: React.FC<ChordSelectorProps> = ({ selectedChord, onChordChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRoot, setSelectedRoot] = useState("")

  const roots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

  const types = [
    { label: "Major", suffix: "" },
    { label: "Minor", suffix: "m" },
    { label: "Dom7", suffix: "7" },
    { label: "Half Dim7", suffix: "ø7" },
  ]

  const handleRootSelect = (root: string) => {
    setSelectedRoot(root)
  }

  const handleTypeSelect = (suffix: string) => {
    const chord = selectedRoot + suffix
    onChordChange(chord)
    playChord(chord)
    setIsOpen(false)
    setSelectedRoot("")
  }

  const handleClear = () => {
    onChordChange("")
    setIsOpen(false)
    setSelectedRoot("")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        title="Select chord"
      >
        <Music size={14} />
        <span>{selectedChord || "No Chord"}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute z-30 mt-1 bg-white border-2 border-gray-300 rounded shadow-lg min-w-[200px]">
            <div className="sticky top-0 bg-gray-800 text-white px-2 py-1 text-xs font-semibold">Select Chord</div>

            {!selectedRoot ? (
              <div className="p-2">
                <div className="text-xs font-semibold mb-2 text-gray-700">Choose Root:</div>
                <div className="grid grid-cols-4 gap-1">
                  {roots.map((root) => (
                    <button
                      key={root}
                      onClick={() => handleRootSelect(root)}
                      className="px-2 py-1.5 text-xs rounded bg-blue-100 hover:bg-blue-200 text-gray-700 font-medium"
                    >
                      {root}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleClear}
                  className="w-full mt-2 px-2 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Clear Chord
                </button>
              </div>
            ) : (
              <div className="p-2">
                <div className="text-xs font-semibold mb-2 text-gray-700">
                  Choose Type for <span className="text-blue-600">{selectedRoot}</span>:
                </div>
                <div className="space-y-1">
                  {types.map((type) => (
                    <button
                      key={type.suffix}
                      onClick={() => handleTypeSelect(type.suffix)}
                      className="w-full px-2 py-1.5 text-xs rounded bg-green-100 hover:bg-green-200 text-gray-700 text-left font-medium"
                    >
                      {selectedRoot}
                      {type.suffix} - {type.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedRoot("")}
                  className="w-full mt-2 px-2 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
