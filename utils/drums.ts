export interface DrumPattern {
  kick: boolean[]
  snare: boolean[]
  hihat: boolean[]
}

export const drumPatterns: { [key: string]: { [track: string]: DrumPattern } } = {
  metronome: {
    none: {
      kick: [],
      snare: [],
      hihat: [],
    },
  },
  pop: {
    basic: {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
    "with-kick": {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
    "16th-hats": {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    },
  },
  funk: {
    basic: {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true],
    },
    syncopated: {
      kick: [true, false, false, true, false, false, true, false, false, false, false, false, true, false, true, false],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true],
    },
    groovy: {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, true],
    },
  },
  rock: {
    basic: {
      kick: [
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
    driving: {
      kick: [true, false, true, false, true, false, false, false, true, false, true, false, true, false, false, false],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
    "half-time": {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
  },
  blues: {
    shuffle: {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true],
    },
    "slow-blues": {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true],
    },
    "12/8": {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true],
    },
  },
  country: {
    "two-step": {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    },
    "train-beat": {
      kick: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    },
    waltz: {
      kick: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      hihat: [
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
    },
  },
}

export function createDrumSound(
  audioContext: AudioContext,
  time: number,
  type: "kick" | "snare" | "hihat" | "crash" | "ride" | "tom1" | "tom2" | "tom3",
  volume = 0.3,
) {
  if (type === "kick") {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(150, time)
    oscillator.frequency.exponentialRampToValueAtTime(0.01, time + 0.5)

    gainNode.gain.setValueAtTime(volume * 1.5, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5)

    oscillator.start(time)
    oscillator.stop(time + 0.5)
  } else if (type === "snare") {
    const bufferSize = audioContext.sampleRate * 0.2
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = audioContext.createBufferSource()
    const noiseFilter = audioContext.createBiquadFilter()
    const noiseGain = audioContext.createGain()

    noise.buffer = buffer
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(audioContext.destination)

    noiseFilter.type = "highpass"
    noiseFilter.frequency.value = 1000

    noiseGain.gain.setValueAtTime(volume, time)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)

    noise.start(time)

    const oscillator = audioContext.createOscillator()
    const oscGain = audioContext.createGain()

    oscillator.connect(oscGain)
    oscGain.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(200, time)
    oscGain.gain.setValueAtTime(volume * 0.5, time)
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

    oscillator.start(time)
    oscillator.stop(time + 0.1)
  } else if (type === "hihat") {
    const bufferSize = audioContext.sampleRate * 0.05
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = audioContext.createBufferSource()
    const filter = audioContext.createBiquadFilter()
    const gainNode = audioContext.createGain()

    noise.buffer = buffer
    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)

    filter.type = "highpass"
    filter.frequency.value = 7000

    gainNode.gain.setValueAtTime(volume * 0.6, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05)

    noise.start(time)
  } else if (type === "crash") {
    const bufferSize = audioContext.sampleRate * 1
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = audioContext.createBufferSource()
    const filter = audioContext.createBiquadFilter()
    const gainNode = audioContext.createGain()

    noise.buffer = buffer
    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)

    filter.type = "bandpass"
    filter.frequency.value = 5000

    gainNode.gain.setValueAtTime(volume * 0.8, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 1)

    noise.start(time)
  } else if (type === "ride") {
    const bufferSize = audioContext.sampleRate * 0.1
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = audioContext.createBufferSource()
    const filter = audioContext.createBiquadFilter()
    const gainNode = audioContext.createGain()

    noise.buffer = buffer
    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)

    filter.type = "bandpass"
    filter.frequency.value = 6000

    gainNode.gain.setValueAtTime(volume * 0.7, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

    noise.start(time)
  } else if (type === "tom1") {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(250, time)
    oscillator.frequency.exponentialRampToValueAtTime(100, time + 0.3)

    gainNode.gain.setValueAtTime(volume, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3)

    oscillator.start(time)
    oscillator.stop(time + 0.3)
  } else if (type === "tom2") {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(200, time)
    oscillator.frequency.exponentialRampToValueAtTime(80, time + 0.3)

    gainNode.gain.setValueAtTime(volume, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3)

    oscillator.start(time)
    oscillator.stop(time + 0.3)
  } else if (type === "tom3") {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(150, time)
    oscillator.frequency.exponentialRampToValueAtTime(60, time + 0.3)

    gainNode.gain.setValueAtTime(volume, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3)

    oscillator.start(time)
    oscillator.stop(time + 0.3)
  }
}
