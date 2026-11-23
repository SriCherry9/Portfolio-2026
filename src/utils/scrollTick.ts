let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

/** Unlocks/creates the AudioContext — call this from a real user gesture (scroll/touch). */
export function unlockFontTickAudio() {
  getCtx()
}

/**
 * A soft, short, high "key" tick synthesized with the Web Audio API — stands in for
 * the sound of a font/letter appearing as text reveals, with no audio asset needed.
 * `variance` (0–1) nudges the pitch so a run of ticks doesn't sound mechanically identical.
 */
export function playFontTick(variance = 0) {
  const audioCtx = getCtx()
  if (!audioCtx) return

  const now = audioCtx.currentTime
  const osc  = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const baseFreq = 1500 + variance * 420

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(baseFreq, now)
  osc.frequency.exponentialRampToValueAtTime(Math.max(baseFreq * 0.55, 220), now + 0.045)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(now)
  osc.stop(now + 0.06)
}
