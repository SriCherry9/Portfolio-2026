const SOUND_PREF_KEY = 'xyloSoundEnabled'

let soundEnabled = true
if (typeof window !== 'undefined') {
  try {
    const stored = window.localStorage.getItem(SOUND_PREF_KEY)
    if (stored !== null) soundEnabled = stored === 'true'
  } catch {
    // localStorage unavailable — default stays on for this session
  }
}

export function isXyloSoundEnabled(): boolean {
  return soundEnabled
}

/** Turns the xylophone sound on/off everywhere it's used (letter hovers, the
 *  project-open arpeggio) and remembers the choice for next visit. */
export function setXyloSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
  try {
    window.localStorage.setItem(SOUND_PREF_KEY, String(enabled))
  } catch {
    // localStorage unavailable — preference just won't persist across visits
  }
}

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

const SAMPLE_URL = '/audio/xylophone-hit.mp3'
let bufferPromise: Promise<AudioBuffer | null> | null = null

/** Fetches and decodes the real xylophone hit sample once, caching the result
 *  (and the in-flight promise, so rapid hovers before it's ready don't each
 *  trigger their own fetch). */
function loadBuffer(audioCtx: AudioContext): Promise<AudioBuffer | null> {
  if (!bufferPromise) {
    bufferPromise = fetch(SAMPLE_URL)
      .then(res => res.arrayBuffer())
      .then(data => audioCtx.decodeAudioData(data))
      .catch(() => null)
  }
  return bufferPromise
}

/** Unlocks/creates the AudioContext — call this from a real user gesture (click/key/touch) —
 *  and kicks off loading the sample so it's decoded and ready by the time anyone hovers. */
export function unlockXyloAudio() {
  const audioCtx = getCtx()
  if (audioCtx) loadBuffer(audioCtx)
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

// The sample is treated as sounding roughly at the middle of SCALE (D5) — so
// pitching it up to the highest note and down to the lowest both stay within
// about +/-2.2x playback rate, rather than skewing the whole range to one side
// and pushing the far end into a chipmunked or over-slowed extreme.
const SAMPLE_REFERENCE_FREQ = 587.33
const MIN_RATE = 0.4
const MAX_RATE = 2.5

/** Plays the real recorded xylophone-hit sample, pitch-shifted (via playback
 *  rate, like a classic sampler) to the requested note frequency. */
export function playXyloNote(freq: number) {
  if (!soundEnabled) return
  const audioCtx = getCtx()
  if (!audioCtx) return

  loadBuffer(audioCtx).then(buffer => {
    if (!buffer) return
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    const rate = freq / SAMPLE_REFERENCE_FREQ
    source.playbackRate.value = Math.min(MAX_RATE, Math.max(MIN_RATE, rate))

    const gain = audioCtx.createGain()
    gain.gain.value = 0.9

    source.connect(gain).connect(audioCtx.destination)
    source.start()
  })
}

/** A short ascending run of notes, timed to land with the falling shapes in
 *  ProjectTransition (same 220/300/380/460ms stagger as .pt-shape--* in
 *  ProjectTransition.css) — so opening a project sounds like the shapes
 *  themselves are striking the xylophone keys on the way down. Returns a
 *  cleanup function that cancels any notes not yet played. */
export function playXyloArpeggio(): () => void {
  unlockXyloAudio()
  const delays = [220, 300, 380, 460]
  const timers = delays.map((delay, i) =>
    setTimeout(() => playXyloNote(noteFrequencyForIndex(i)), delay)
  )
  return () => timers.forEach(clearTimeout)
}
