"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { NotationLine } from "@/components/NotationLine"
import { Metronome } from "@/components/Metronome"
import { GrooveManager } from "@/components/GrooveManager"
import { SubdivisionSelector } from "@/components/SubdivisionSelector"
import { DrumSelector } from "@/components/DrumSelector"
import { ChordSelector } from "@/components/ChordSelector"
import { getAudioContext, createMetronomeSound, createBassNote } from "@/utils/audio"
import { drumPatterns, createDrumSound } from "@/utils/drums"
import { playChord } from "@/utils/chords"
import { downloadMidi } from "@/utils/midi"
import { Trash2, Download } from "lucide-react"

interface Note {
  frequency: number
  muted: boolean
  duration: number
}

interface BassGrooveCreatorProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export default function BassGrooveCreator({ isPlaying, setIsPlaying }: BassGrooveCreatorProps) {
  const [subdivision, setSubdivision] = useState(16)
  const [bars, setBars] = useState<(Note | null)[][]>([Array(16).fill(null)])
  const [barChords, setBarChords] = useState<string[]>([""])
  const [bpm, setBpm] = useState(120)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [drumPattern, setDrumPattern] = useState("metronome")
  const [drumTrack, setDrumTrack] = useState("none")
  const [bassVolume, setBassVolume] = useState(70)
  const [drumsVolume, setDrumsVolume] = useState(50)
  const [chordsVolume, setChordsVolume] = useState(30)

  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedAtBeatRef = useRef<number>(0)

  // Use refs for volume values to avoid triggering playback restart
  const bassVolumeRef = useRef(bassVolume)
  const drumsVolumeRef = useRef(drumsVolume)
  const chordsVolumeRef = useRef(chordsVolume)

  useEffect(() => {
    bassVolumeRef.current = bassVolume
  }, [bassVolume])

  useEffect(() => {
    drumsVolumeRef.current = drumsVolume
  }, [drumsVolume])

  useEffect(() => {
    chordsVolumeRef.current = chordsVolume
  }, [chordsVolume])

  const handleSubdivisionChange = (newSubdivision: number) => {
    setIsPlaying(false)
    setSubdivision(newSubdivision)
    setBars([Array(newSubdivision).fill(null)])
    setBarChords([""])
    setCurrentBeat(-1)
    pausedAtBeatRef.current = 0
  }

  const toggleNote = (barIndex: number, noteIndex: number, note: Note | null) => {
    setBars((prevBars) => {
      const newBars = [...prevBars]
      newBars[barIndex] = [...newBars[barIndex]]
      newBars[barIndex][noteIndex] = note
      return newBars
    })
  }

  const setChordForBar = (barIndex: number, chord: string) => {
    setBarChords((prev) => {
      const newChords = [...prev]
      newChords[barIndex] = chord
      return newChords
    })
  }

  const resetGroove = () => {
    setBars([Array(subdivision).fill(null)])
    setBarChords([""])
    setIsPlaying(false)
    setCurrentBeat(-1)
    pausedAtBeatRef.current = 0
  }

  const addBar = () => {
    setBars((prevBars) => [...prevBars, Array(subdivision).fill(null)])
    setBarChords((prev) => [...prev, ""])
  }

  const removeBar = (barIndex: number) => {
    if (bars.length === 1) return
    setBars((prevBars) => prevBars.filter((_, index) => index !== barIndex))
    setBarChords((prev) => prev.filter((_, index) => index !== barIndex))
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentBeat(-1)
      pausedAtBeatRef.current = 0
    }
  }

  const handleExportMidi = () => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      downloadMidi(bars, bpm, subdivision, `bass-groove-${timestamp}.mid`)
    } catch (error) {
      console.error("Error exporting MIDI:", error)
      alert("Failed to export MIDI file. Please try again.")
    }
  }

  const handleDrumPatternChange = (pattern: string, track: string) => {
    setDrumPattern(pattern)
    setDrumTrack(track)
  }

  const playMetronome = useCallback(() => {
    const audioContext = getAudioContext()
    const notesPerBeat = subdivision / 4
    const interval = 60 / bpm / notesPerBeat
    const totalBeats = bars.length * subdivision

    startTimeRef.current = audioContext.currentTime
    const startBeat = pausedAtBeatRef.current

    let nextNoteTime = audioContext.currentTime
    let scheduledBeat = startBeat

    const pattern = drumPatterns[drumPattern]?.[drumTrack]

    const scheduleNote = () => {
      const barIndex = Math.floor(scheduledBeat / subdivision)
      const beatInBar = scheduledBeat % subdivision

      // Use refs for volume to avoid dependency changes
      const drumVolume = drumsVolumeRef.current / 100
      const chordVolume = chordsVolumeRef.current / 100
      const bassVol = bassVolumeRef.current / 100

      // Play chord at the start of each bar (beat 0)
      if (beatInBar === 0 && barChords[barIndex]) {
        playChord(barChords[barIndex], 4, chordVolume)
      }

      if (drumPattern === "metronome") {
        if (beatInBar % notesPerBeat === 0) {
          createMetronomeSound(nextNoteTime)
        }
      } else {
        if (subdivision === 16 && pattern) {
          if (pattern.kick[beatInBar]) {
            createDrumSound(audioContext, nextNoteTime, "kick", drumVolume)
          }
          if (pattern.snare[beatInBar]) {
            createDrumSound(audioContext, nextNoteTime, "snare", drumVolume)
          }
          if (pattern.hihat[beatInBar]) {
            createDrumSound(audioContext, nextNoteTime, "hihat", drumVolume)
          }
        }
      }

      const note = bars[barIndex]?.[beatInBar]
      if (note && !note.muted) {
        createBassNote(nextNoteTime, note.frequency, false, note.duration, bassVol)
      } else if (note && note.muted) {
        createBassNote(nextNoteTime, 100, true, 1, bassVol)
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
  }, [bpm, bars, subdivision, drumPattern, drumTrack, barChords])

  useEffect(() => {
    if (isPlaying) {
      const audioContext = getAudioContext()
      if (audioContext.state === "suspended") {
        audioContext.resume()
      }
      playMetronome()
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
  }, [isPlaying, playMetronome])

  const handlePlayPause = () => {
    if (!isPlaying) {
      setCurrentBeat(pausedAtBeatRef.current)
    }
    setIsPlaying(!isPlaying)
  }

  const loadGroove = (groove: (Note | null)[], loadedSubdivision: number, chords?: string[]) => {
    setIsPlaying(false)
    setCurrentBeat(-1)
    pausedAtBeatRef.current = 0
    setSubdivision(loadedSubdivision)

    const numBars = Math.ceil(groove.length / loadedSubdivision)
    const newBars: (Note | null)[][] = []

    for (let i = 0; i < numBars; i++) {
      const barNotes = groove.slice(i * loadedSubdivision, (i + 1) * loadedSubdivision)
      while (barNotes.length < loadedSubdivision) {
        barNotes.push(null)
      }
      newBars.push(barNotes)
    }

    setBars(newBars)
    setBarChords(chords || Array(numBars).fill(""))
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SubdivisionSelector subdivision={subdivision} onSubdivisionChange={handleSubdivisionChange} />
        <DrumSelector
          selectedPattern={drumPattern}
          selectedTrack={drumTrack}
          onPatternChange={handleDrumPatternChange}
        />
        <div className="space-y-2">
          <label className="text-sm font-semibold">Volume:</label>
          <div className="space-y-2">
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
              <label className="text-xs w-12">Chords:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={chordsVolume}
                onChange={(e) => setChordsVolume(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8 text-right">{chordsVolume}</span>
            </div>
          </div>
        </div>
      </div>

      {drumPattern !== "metronome" && subdivision !== 16 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded mb-3 text-sm">
          <strong>Note:</strong> Drum patterns only work with 16th note subdivision.
        </div>
      )}

      <div className="mb-4">
        {bars.map((bar, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Bar {index + 1}</h2>
                <ChordSelector
                  selectedChord={barChords[index] || ""}
                  onChordChange={(chord) => setChordForBar(index, chord)}
                />
              </div>
              {bars.length > 1 && (
                <button
                  onClick={() => removeBar(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove bar"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <NotationLine
              notes={bar}
              onToggleNote={(noteIndex, note) => toggleNote(index, noteIndex, note)}
              subdivision={subdivision}
              currentBeat={currentBeat}
              barIndex={index}
              isPlaying={isPlaying}
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
        <button
          onClick={handleExportMidi}
          className="bg-purple-500 text-white px-3 py-2 text-sm rounded hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          Export MIDI
        </button>
      </div>

      <Metronome bpm={bpm} onBpmChange={setBpm} isPlaying={isPlaying} onPlayPause={handlePlayPause} />

      <GrooveManager
        currentGroove={bars.flat()}
        currentSubdivision={subdivision}
        currentChords={barChords}
        onLoadGroove={loadGroove}
        storageKey="bassGrooves"
      />
    </div>
  )
}
