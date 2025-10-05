let audioContext: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext is only available in the browser")
  }

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  return audioContext
}

export function createMetronomeSound(time: number) {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.setValueAtTime(880, time)
  gainNode.gain.setValueAtTime(0.5, time)
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1)

  oscillator.start(time)
  oscillator.stop(time + 0.1)
}

export function createBassNote(time: number, frequency: number, muted = false, duration = 1, volume = 0.5) {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = "sawtooth"
  oscillator.frequency.setValueAtTime(frequency, time)

  filter.type = "lowpass"
  filter.frequency.setValueAtTime(muted ? 200 : 500, time)
  filter.Q.setValueAtTime(5, time)

  const noteVolume = volume * (muted ? 0.4 : 1)
  const noteDuration = muted ? 0.1 : 0.3 * duration

  gainNode.gain.setValueAtTime(noteVolume, time)
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + noteDuration)

  oscillator.start(time)
  oscillator.stop(time + noteDuration)
}
