"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"

interface Note {
  frequency: number
  muted: boolean
  duration: number
}

interface GrooveManagerProps {
  currentGroove: (Note | null)[]
  currentSubdivision: number
  currentChords?: string[]
  onLoadGroove: (groove: (Note | null)[], subdivision: number, chords?: string[]) => void
  storageKey: string
}

interface SavedGroove {
  name: string
  groove: (Note | null)[]
  subdivision: number
  chords?: string[]
}

export const GrooveManager: React.FC<GrooveManagerProps> = ({
  currentGroove,
  currentSubdivision,
  currentChords,
  onLoadGroove,
  storageKey,
}) => {
  const [grooveName, setGrooveName] = useState("")
  const [savedGrooves, setSavedGrooves] = useState<SavedGroove[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSavedGrooves(parsed)
      }
    } catch (error) {
      console.error("Error loading saved grooves:", error)
    }
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedGrooves))
    } catch (error) {
      console.error("Error saving grooves:", error)
    }
  }, [savedGrooves, storageKey])

  const saveGroove = () => {
    if (grooveName && grooveName.trim()) {
      const name = grooveName.trim()
      const existingIndex = savedGrooves.findIndex((g) => g.name === name)

      if (existingIndex >= 0) {
        setSavedGrooves((prev) => {
          const newGrooves = [...prev]
          newGrooves[existingIndex] = {
            name,
            groove: [...currentGroove],
            subdivision: currentSubdivision,
            chords: currentChords ? [...currentChords] : undefined,
          }
          return newGrooves
        })
      } else {
        setSavedGrooves((prev) => [
          ...prev,
          {
            name,
            groove: [...currentGroove],
            subdivision: currentSubdivision,
            chords: currentChords ? [...currentChords] : undefined,
          },
        ])
      }

      setGrooveName("")
    }
  }

  const deleteGroove = (name: string) => {
    setSavedGrooves((prev) => prev.filter((g) => g.name !== name))
  }

  const loadGrooveHandler = (savedGroove: SavedGroove) => {
    const grooveCopy = savedGroove.groove.map((note) => (note ? { ...note } : null))
    onLoadGroove(grooveCopy, savedGroove.subdivision, savedGroove.chords)
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-semibold">Saved Grooves</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={grooveName}
          onChange={(e) => setGrooveName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveGroove()}
          placeholder="Groove name"
          className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={saveGroove}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!grooveName.trim()}
        >
          Save Groove
        </button>
      </div>

      {savedGrooves.length > 0 ? (
        <div className="space-y-2">
          {savedGrooves.map((savedGroove) => (
            <div
              key={savedGroove.name}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3 hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => loadGrooveHandler(savedGroove)}
                className="flex-1 text-left font-medium text-gray-700 hover:text-blue-600"
              >
                {savedGroove.name}{" "}
                <span className="text-xs text-gray-500">
                  ({savedGroove.subdivision === 16 ? "16ths" : savedGroove.subdivision === 32 ? "32nds" : "triplets"})
                </span>
              </button>
              <button
                onClick={() => deleteGroove(savedGroove.name)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
                title="Delete groove"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No saved grooves yet. Create and save your first groove!</p>
      )}
    </div>
  )
}
