import { getAudioContext } from "./audio"

const chordIntervals: { [key: string]: number[] } = {
  // Major chords (root, major third, perfect fifth)
  C: [261.63, 329.63, 392.0],
  "C#": [277.18, 349.23, 415.3],
  D: [293.66, 369.99, 440.0],
  "D#": [311.13, 392.0, 466.16],
  E: [329.63, 415.3, 493.88],
  F: [349.23, 440.0, 523.25],
  "F#": [369.99, 466.16, 554.37],
  G: [392.0, 493.88, 587.33],
  "G#": [415.3, 523.25, 622.25],
  A: [440.0, 554.37, 659.25],
  "A#": [466.16, 587.33, 698.46],
  B: [493.88, 622.25, 739.99],

  // Minor chords (root, minor third, perfect fifth)
  Cm: [261.63, 311.13, 392.0],
  "C#m": [277.18, 329.63, 415.3],
  Dm: [293.66, 349.23, 440.0],
  "D#m": [311.13, 369.99, 466.16],
  Em: [329.63, 392.0, 493.88],
  Fm: [349.23, 415.3, 523.25],
  "F#m": [369.99, 440.0, 554.37],
  Gm: [392.0, 466.16, 587.33],
  "G#m": [415.3, 493.88, 622.25],
  Am: [440.0, 523.25, 659.25],
  "A#m": [466.16, 554.37, 698.46],
  Bm: [493.88, 587.33, 739.99],

  // Dominant 7th chords (root, major third, perfect fifth, minor seventh)
  C7: [261.63, 329.63, 392.0, 466.16],
  "C#7": [277.18, 349.23, 415.3, 493.88],
  D7: [293.66, 369.99, 440.0, 523.25],
  "D#7": [311.13, 392.0, 466.16, 554.37],
  E7: [329.63, 415.3, 493.88, 587.33],
  F7: [349.23, 440.0, 523.25, 622.25],
  "F#7": [369.99, 466.16, 554.37, 659.25],
  G7: [392.0, 493.88, 587.33, 698.46],
  "G#7": [415.3, 523.25, 622.25, 739.99],
  A7: [440.0, 554.37, 659.25, 783.99],
  "A#7": [466.16, 587.33, 698.46, 830.61],
  B7: [493.88, 622.25, 739.99, 880.0],

  // Half-diminished 7th chords (root, minor third, diminished fifth, minor seventh)
  Cø7: [261.63, 311.13, 369.99, 466.16],
  "C#ø7": [277.18, 329.63, 392.0, 493.88],
  Dø7: [293.66, 349.23, 415.3, 523.25],
  "D#ø7": [311.13, 369.99, 440.0, 554.37],
  Eø7: [329.63, 392.0, 466.16, 587.33],
  Fø7: [349.23, 415.3, 493.88, 622.25],
  "F#ø7": [369.99, 440.0, 523.25, 659.25],
  Gø7: [392.0, 466.16, 554.37, 698.46],
  "G#ø7": [415.3, 493.88, 587.33, 739.99],
  Aø7: [440.0, 523.25, 622.25, 783.99],
  "A#ø7": [466.16, 554.37, 659.25, 830.61],
  Bø7: [493.88, 587.33, 698.46, 880.0],
}

export function playChord(chordName: string, duration = 1.5, volume = 0.15) {
  const frequencies = chordIntervals[chordName]
  if (!frequencies) return

  const audioContext = getAudioContext()
  const now = audioContext.currentTime

  frequencies.forEach((frequency) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(frequency, now)

    gainNode.gain.setValueAtTime(volume, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)
  })
}
