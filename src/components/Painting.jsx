import { useEffect, useRef } from 'react'
import { createLivingPainting } from '../lib/living-painting.js'

export default function Painting({ calm }) {
  const canvas = useRef(null)
  const picture = useRef(null)

  useEffect(() => {
    if (calm) return
    const image = picture.current
    let cancelled = false
    let dispose
    const start = () => {
      if (cancelled || !image.naturalWidth) return
      dispose = createLivingPainting(canvas.current, image)
    }
    // The real image paints first, and remains the fallback on every device.
    if (image.complete) start()
    else image.addEventListener('load', start, { once: true })
    return () => {
      cancelled = true
      image.removeEventListener('load', start)
      dispose?.()
    }
  }, [calm])

  return (
    <div className="paint-scene">
      <img ref={picture} className="paint-still" src="./assets/painting/river-landscape.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" />
      <canvas ref={canvas} className="paint-canvas" aria-hidden="true" />
    </div>
  )
}
