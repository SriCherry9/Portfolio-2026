import { useEffect, useRef, useState } from 'react'
import type { HandLandmarker as HandLandmarkerType, HandLandmarkerResult } from '@mediapipe/tasks-vision'

export type HandTrackingStage = 'start' | 'loading' | 'active' | 'denied' | 'unsupported'

interface UseHandTrackingOptions {
  onResults: (results: HandLandmarkerResult) => void
  numHands?: number
}

// Shared camera + MediaPipe HandLandmarker bootstrapping used by every
// camera-driven playground item — handles permission/model loading state
// and feeds detections into onResults on a requestAnimationFrame loop.
export function useHandTracking({ onResults, numHands = 2 }: UseHandTrackingOptions) {
  const [stage, setStage] = useState<HandTrackingStage>('start')

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<HandLandmarkerType | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const onResultsRef = useRef(onResults)
  useEffect(() => {
    onResultsRef.current = onResults
  })

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(track => track.stop())
      landmarkerRef.current?.close()
    }
  }, [])

  useEffect(() => {
    if (stage !== 'active') return

    const loop = () => {
      const video = videoRef.current
      const landmarker = landmarkerRef.current
      if (video && landmarker && video.readyState >= 2) {
        onResultsRef.current(landmarker.detectForVideo(video, performance.now()))
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [stage])

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStage('unsupported')
      return
    }
    setStage('loading')
    try {
      const [{ HandLandmarker, FilesetResolver }, stream] = await Promise.all([
        import('@mediapipe/tasks-vision'),
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }),
      ])

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
      )
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands,
      })
      landmarkerRef.current = landmarker

      streamRef.current = stream
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()

      setStage('active')
    } catch (err) {
      console.error('Hand tracking setup failed:', err)
      setStage('denied')
    }
  }

  return { stage, start, videoRef }
}
