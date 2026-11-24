let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

/** Unlocks/creates the AudioContext — call this from a real user gesture (click/key/touch). */
export function unlockXyloAudio() {
  getCtx()
}

/** A ping-ponging two-octave-ish scale, so sweeping across a long run of letters
 *  rises and falls smoothly instead of hitting a jarring jump back to the bottom. */
const SCALE = [
  261.63, 293.66, 329.63, 392.0, 440.0,   // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.0,  // C5 D5 E5 G5 A5
  1046.5, 1174.66, 1318.51,               // C6 D6 E6
]

export function noteFrequencyForIndex(i: number): number {
  const period = (SCALE.length - 1) * 2
  const pos = ((i % period) + period) % period
  const idx = pos < SCALE.length ? pos : period - pos
  return SCALE[idx]
}

/** A short, bright, percussive tone — a struck xylophone bar — synthesized so no
 *  audio asset is needed. A fast-decaying high harmonic gives the "clack" of the
 *  mallet strike, layered over a longer-ringing fundamental. */
export function playXyloNote(freq: number) {
  const audioCtx = getCtx()
  if (!audioCtx) return

  const now = audioCtx.currentTime

  const fundamental = audioCtx.createOscillator()
  fundamental.type = 'sine'
  fundamental.frequency.setValueAtTime(freq, now)

  const harmonic = audioCtx.createOscillator()
  harmonic.type = 'sine'
  harmonic.frequency.setValueAtTime(freq * 3.97, now) // slightly inharmonic, like a real bar

  const fundGain = audioCtx.createGain()
  fundGain.gain.setValueAtTime(0.0001, now)
  fundGain.gain.exponentialRampToValueAtTime(0.42, now + 0.004)
  fundGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)

  const harmGain = audioCtx.createGain()
  harmGain.gain.setValueAtTime(0.0001, now)
  harmGain.gain.exponentialRampToValueAtTime(0.16, now + 0.003)
  harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

  const master = audioCtx.createGain()
  master.gain.value = 0.55

  fundamental.connect(fundGain).connect(master)
  harmonic.connect(harmGain).connect(master)
  master.connect(audioCtx.destination)

  fundamental.start(now)
  harmonic.start(now)
  fundamental.stop(now + 0.6)
  harmonic.stop(now + 0.14)
}
