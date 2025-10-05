interface Note {
  frequency: number
  muted: boolean
  duration: number
}

function frequencyToMidiNote(frequency: number): number {
  return Math.round(12 * Math.log2(frequency / 440) + 69)
}

export function exportToMidi(bars: (Note | null)[][], bpm: number, subdivision: number): Blob {
  const HEADER_CHUNK_TYPE = [0x4d, 0x54, 0x68, 0x64]
  const TRACK_CHUNK_TYPE = [0x4d, 0x54, 0x72, 0x6b]

  const ticksPerQuarterNote = 480
  const microsecondsPerQuarterNote = Math.round(60000000 / bpm)

  const writeVariableLength = (value: number): number[] => {
    const bytes: number[] = []
    let buffer = value & 0x7f
    while ((value >>= 7)) {
      bytes.unshift((buffer & 0x7f) | 0x80)
      buffer = value & 0x7f
    }
    bytes.push(buffer)
    return bytes
  }

  const write32Bit = (value: number): number[] => [
    (value >> 24) & 0xff,
    (value >> 16) & 0xff,
    (value >> 8) & 0xff,
    value & 0xff,
  ]

  const write16Bit = (value: number): number[] => [(value >> 8) & 0xff, value & 0xff]

  const events: number[] = []

  events.push(0x00, 0xff, 0x51, 0x03)
  events.push(...write32Bit(microsecondsPerQuarterNote).slice(1))

  events.push(0x00, 0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08)

  const ticksPerNote = ticksPerQuarterNote / (subdivision / 4)
  let deltaTicks = 0

  bars.forEach((bar) => {
    bar.forEach((note) => {
      if (note && !note.muted) {
        const midiNote = frequencyToMidiNote(note.frequency)
        const velocity = 100
        const noteDuration = Math.round(ticksPerNote * note.duration)

        events.push(...writeVariableLength(deltaTicks))
        events.push(0x90, midiNote, velocity)
        deltaTicks = 0

        events.push(...writeVariableLength(noteDuration))
        events.push(0x80, midiNote, 0x00)
        deltaTicks = Math.max(0, ticksPerNote - noteDuration)
      } else {
        deltaTicks += ticksPerNote
      }
    })
  })

  events.push(...writeVariableLength(deltaTicks))
  events.push(0xff, 0x2f, 0x00)

  const midiData: number[] = []

  midiData.push(...HEADER_CHUNK_TYPE)
  midiData.push(...write32Bit(6))
  midiData.push(...write16Bit(0))
  midiData.push(...write16Bit(1))
  midiData.push(...write16Bit(ticksPerQuarterNote))

  midiData.push(...TRACK_CHUNK_TYPE)
  midiData.push(...write32Bit(events.length))
  midiData.push(...events)

  return new Blob([new Uint8Array(midiData)], { type: "audio/midi" })
}

export function downloadMidi(bars: (Note | null)[][], bpm: number, subdivision: number, filename: string) {
  try {
    const blob = exportToMidi(bars, bpm, subdivision)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error("Error downloading MIDI:", error)
    throw error
  }
}
