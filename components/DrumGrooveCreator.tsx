"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DrumNotationLine } from "@/components/DrumNotationLine"
import { Metronome } from "@/components/Metronome"
import { DrumGrooveManager } from "@/components/DrumGrooveManager"
import { SubdivisionSelector } from "@/components/SubdivisionSelector"
import { BassLineSelector } from "@/components/BassLineSelector"
import { getAudioContext, createBassNote } from "@/utils/audio"
import { createDrumSound } from "@/utils/drums"
import { bassLinePatterns } from "@/utils/basslines"
import { Trash2 } from "lucide-react"

interface DrumGrooveCreatorProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export default function DrumGrooveCreator({ isPlaying, setIsPlaying }: DrumGrooveCreatorProps) {
  const [subdivision, setSubdivision] = useState(16)
  const [drumBars, setDrumBars] = useState<{
    kick: boolean[][]
    snare: boolean[][]
    hihat: boolean[][]
    crash: boolean[][]
    ride: boolean[][]
    tom1: boolean[][]
    tom2: boolean[][]
    tom3: boolean[][]
  }>({
    kick: [Array(16).fill(false)],
    snare: [Array(16).fill(false)],
    hihat: [Array(16).fill(false)],
    crash: [Array(16).fill(false)],
    ride: [Array(16).fill(false)],
    tom1: [Array(16).fill(false)],
    tom2: [Array(16).fill(false)],
    tom3: [Array(16).fill(false)],
  })
  const [bpm, setBpm] = useState(120)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [bassLinePattern, setBassLinePattern] = useState("none")
  const [drumsVolume, setDrumsVolume] = useState(70)
  const [bassVolume, setBassVolume] = useState(50)

  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedAtBeatRef = useRef<number>(0)

  const drumsVolumeRef = useRef(drumsVolume)
  const bassVolumeRef = useRef(bassVolume)

  useEffect(() => {
    drumsVolumeRef.current = drumsVolume
  }, [drumsVolume])

  useEffect(() => {
    bassVolumeRef.current = bassVolume
  }, [bassVolume])

  const handleSubdivisionChange = (newSubdivision: number) => {
    setIsPlaying(false)
    setSubdivision(newSubdivision)
    setDrumBars({
      kick: [Array(newSubdivision).fill(false)],
      snare: [Array(newSubdivision).fill(false)],
      hihat: [Array(newSubdivision).fill(false)],
      crash: [Array(newSubdivision).fill(false)],
      ride: [Array(newSubdivision).fill(false)],
      tom1: [Array(newSubdivision).fill(false)],
      tom2: [Array(newSubdivision).fill(false)],
      tom3: [Array(newSubdivision).fill(false)],
    })
    setCurrentBeat(-1)
    pausedAtBeatRef.current = 0
  }

  const toggleDrumNote = (
    drumType: "kick" | "snare" | "hihat" | "crash" | "ride" | "tom1" | "tom2" | "tom3",
    barIndex: number,
    noteIndex: number,
  ) => {
    setDrumBars((prev) => {
      const newBars = { ...prev }
      newBars[drumType] = [...newBars[drumType]]
      newBars[drumType][barIndex] = [...newBars[drumType][barIndex]]
      newBars[drumType][barIndex][noteIndex] = !newBars[drumType][barIndex][noteIndex]
      return newBars
    })
  }

  const addBar = () => {
    setDrumBars((prev) => ({
      kick: [...prev.kick, Array(subdivision).fill(false)],
      snare: [...prev.snare, Array(subdivision).fill(false)],
      hihat: [...prev.hihat, Array(subdivision).fill(false)],
      crash: [...prev.crash, Array(subdivision).fill(false)],
      ride: [...prev.ride, Array(subdivision).fill(false)],
      tom1: [...prev.tom1, Array(subdivision).fill(false)],
      tom2: [...prev.tom2, Array(subdivision).fill(false)],
      tom3: [...prev.tom3, Array(subdivision).fill(false)],
    }))
  }

  const removeBar = (barIndex: number) => {
    if (drumBars.kick.length === 1) return
    setDrumBars((prev) => ({
      kick: prev.kick.filter((_, i) => i !== barIndex),
      snare: prev.snare.filter((_, i) => i !== barIndex),
      hihat: prev.hihat.filter((_, i) => i !== barIndex),
      crash: prev.crash.filter((_, i) => i !== barIndex),
      ride: prev.ride.filter((_, i) => i !== barIndex),
      tom1: prev.tom1.filter((_, i) => i !== barIndex),
      tom2: prev.tom2.filter((_, i) => i !== barIndex),
      tom3: prev.tom3.filter((_, i) => i !== barIndex),
    }))
  }

  const resetGroove = () => {
    setDrumBars({
      kick: [Array(subdivision).fill(false)],
      snare: [Array(subdivision).fill(false)],
      hihat: [Array(subdivision).fill(false)],
      crash: [Array(subdivision).fill(false)],
      ride: [Array(subdivision).fill(false)],
      tom1: [Array(subdivision).fill(false)],
      tom2: [Array(subdivision).fill(false)],
      tom3: [Array(subdivision).fill(false)],
    })
    setIsPlaying(false)
    setCurrentBeat(-1)
    pausedAtBeatRef.current = 0
  }

  const playGroove = useCallback(() => {
    const audioContext = getAudioContext()
    const notesPerBeat = subdivision / 4
    const interval = 60 / bpm / notesPerBeat
    const totalBeats = drumBars.kick.length * subdivision

    startTimeRef.current = audioContext.currentTime
    const startBeat = pausedAtBeatRef.current

    let nextNoteTime = audioContext.currentTime
    let scheduledBeat = startBeat

    const bassPattern = bassLinePatterns[bassLinePattern]
    const drumVol = drumsVolumeRef.current / 100
    const bassVol = bassVolumeRef.current / 100

    const scheduleNote = () => {
      const barIndex = Math.floor(scheduledBeat / subdivision)
      const beatInBar = scheduledBeat % subdivision

      // Play drums
      if (drumBars.kick[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "kick", drumVol)
      }
      if (drumBars.snare[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "snare", drumVol)
      }
      if (drumBars.hihat[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "hihat", drumVol)
      }
      if (drumBars.crash[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "crash", drumVol)
      }
      if (drumBars.ride[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "ride", drumVol)
      }
      if (drumBars.tom1[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "tom1", drumVol)
      }
      if (drumBars.tom2[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "tom2", drumVol)
      }
      if (drumBars.tom3[barIndex]?.[beatInBar]) {
        createDrumSound(audioContext, nextNoteTime, "tom3", drumVol)
      }

      // Play bass line if selected
      if (bassPattern && subdivision === 16) {
        const note = bassPattern[beatInBar % bassPattern.length]
        if (note) {
          createBassNote(nextNoteTime, note, false, 1, bassVol)
        }
      }

      nextNoteTime += interval
      scheduledBeat = (scheduledBeat + 1) % totalBeats
    }

    const scheduler = () => {
      while (nextNoteTime < audioContext.currentTime + 0.1) {
        scheduleNote()
      }

      const elapsedTime = audioContext.currentTime - startTimeRef.current
      const currentBeatFloat = startBeat + elapsedTime / interval
      const displayBeat = Math.floor(currentBeatFloat) % totalBeats

      setCurrentBeat(displayBeat)

      intervalRef.current = window.requestAnimationFrame(scheduler)
    }

    scheduler()
  }, [bpm, drumBars, subdivision, bassLinePattern])

  useEffect(() => {
    if (isPlaying) {
      const audioContext = getAudioContext()
      if (audioContext.state === "suspended") {
        audioContext.resume()
      }
      playGroove()
    } else {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current)
      }
      if (currentBeat >= 0) {
        pausedAtBeatRef.current = currentBeat
      }
    }

    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current)
      }
    }
  }, [isPlaying, playGroove])

  const handlePlayPause = () => {
    if (!isPlaying) {
      setCurrentBeat(pausedAtBeatRef.current)
    }
    setIsPlaying(!isPlaying)
  }

  const loadGroove = (
    drumGroove: {
      kick: boolean[][]
      snare: boolean[][]
      hihat: boolean[][]
      crash: boolean[][]
      ride: boolean[][]
      tom1: boolean[][]
      tom2: boolean[][]
      tom3: boolean[][]
    },
    loadedSubdivision: number,
  ) => {
    setIsPlaying(false)
    setCurrentBeat(-1)
    pausedAtBeatRef.current = 0
    setSubdivision(loadedSubdivision)
    setDrumBars(drumGroove)
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SubdivisionSelector subdivision={subdivision} onSubdivisionChange={handleSubdivisionChange} />
        <BassLineSelector selectedPattern={bassLinePattern} onPatternChange={setBassLinePattern} />
        <div className="space-y-2">
          <label className="text-sm font-semibold">Volume:</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-xs w-12">Drums:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={drumsVolume}
                onChange={(e) => setDrumsVolume(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8 text-right">{drumsVolume}</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs w-12">Bass:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={bassVolume}
                onChange={(e) => setBassVolume(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8 text-right">{bassVolume}</span>
            </div>
          </div>
        </div>
      </div>

      {bassLinePattern !== "none" && subdivision !== 16 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded mb-3 text-sm">
          <strong>Note:</strong> Bass lines only work with 16th note subdivision.
        </div>
      )}

      <div className="mb-4">
        {drumBars.kick.map((_, barIndex) => (
          <div key={barIndex} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Bar {barIndex + 1}</h2>
              {drumBars.kick.length > 1 && (
                <button
                  onClick={() => removeBar(barIndex)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove bar"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <DrumNotationLine
              drumBars={drumBars}
              barIndex={barIndex}
              subdivision={subdivision}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
              onToggleDrumNote={toggleDrumNote}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={addBar}
          className="bg-green-500 text-white px-3 py-2 text-sm rounded hover:bg-green-600 transition-colors"
        >
          Add Bar
        </button>
        <button
          onClick={resetGroove}
          className="bg-red-500 text-white px-3 py-2 text-sm rounded hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <Metronome bpm={bpm} onBpmChange={setBpm} isPlaying={isPlaying} onPlayPause={handlePlayPause} />

      <DrumGrooveManager
        currentDrumBars={drumBars}
        currentSubdivision={subdivision}
        onLoadGroove={loadGroove}
        storageKey="drumGrooves"
      />
    </div>
  )
}
