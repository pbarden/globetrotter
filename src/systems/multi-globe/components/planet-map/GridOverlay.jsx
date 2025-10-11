import { useEffect, useRef, memo } from 'react'
import './GridOverlay.css'

/**
 * GridOverlay - Animated neon-blue grid lines for planet map background
 * Uses same erratic animation style as BlobLasso
 */
function GridOverlayComponent() {
  const containerRef = useRef()
  const animationRef = useRef()
  const startTimeRef = useRef(0)
  const lineRefs = useRef([])

  // Detect mobile/desktop
  const isMobile = window.innerWidth < 768
  const horizontalLines = isMobile ? 2 : 5
  const verticalLines = isMobile ? 4 : 3

  useEffect(() => {
    if (!containerRef.current) return

    startTimeRef.current = performance.now() / 1000
    let lastUpdateTime = performance.now()

    const animateGrid = (timestamp) => {
      if (!containerRef.current) return

      const currentTime = timestamp / 1000
      const elapsed = currentTime - startTimeRef.current

      // Throttle to 30fps
      const deltaTime = timestamp - lastUpdateTime
      if (deltaTime < 33) {
        animationRef.current = requestAnimationFrame(animateGrid)
        return
      }
      lastUpdateTime = timestamp

      // Update horizontal lines
      for (let i = 0; i < horizontalLines; i++) {
        if (lineRefs.current[i]) {
          const yPos = ((i + 1) / (horizontalLines + 1)) * 100
          const path = generateHorizontalLinePath(elapsed + i * 0.5, yPos, i)
          lineRefs.current[i].setAttribute('d', path)
        }
      }

      // Update vertical lines
      for (let i = 0; i < verticalLines; i++) {
        const index = horizontalLines + i
        if (lineRefs.current[index]) {
          const xPos = ((i + 1) / (verticalLines + 1)) * 100
          const path = generateVerticalLinePath(elapsed + i * 0.5, xPos, i)
          lineRefs.current[index].setAttribute('d', path)
        }
      }

      animationRef.current = requestAnimationFrame(animateGrid)
    }

    animationRef.current = requestAnimationFrame(animateGrid)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [horizontalLines, verticalLines])

  // Generate horizontal line path
  const generateHorizontalLinePath = (time, yPos, lineIndex) => {
    const points = 20
    const amplitude = 2 // Wave amplitude in percentage
    const speed = 0.5

    const pathParts = []

    for (let i = 0; i <= points; i++) {
      const t = i / points
      const x = t * 100
      const noise1 = Math.sin(time * speed + i * 0.5 + lineIndex * 2) * amplitude
      const noise2 = Math.cos(time * speed * 0.7 + i * 0.3 + lineIndex) * amplitude * 0.5
      const y = yPos + noise1 + noise2

      if (i === 0) {
        pathParts.push(`M ${x.toFixed(2)},${y.toFixed(2)}`)
      } else {
        pathParts.push(` L ${x.toFixed(2)},${y.toFixed(2)}`)
      }
    }

    return pathParts.join('')
  }

  // Generate vertical line path
  const generateVerticalLinePath = (time, xPos, lineIndex) => {
    const points = 20
    const amplitude = 2 // Wave amplitude in percentage
    const speed = 0.5

    const pathParts = []

    for (let i = 0; i <= points; i++) {
      const t = i / points
      const y = t * 100
      const noise1 = Math.sin(time * speed + i * 0.5 + lineIndex * 2) * amplitude
      const noise2 = Math.cos(time * speed * 0.7 + i * 0.3 + lineIndex) * amplitude * 0.5
      const x = xPos + noise1 + noise2

      if (i === 0) {
        pathParts.push(`M ${x.toFixed(2)},${y.toFixed(2)}`)
      } else {
        pathParts.push(` L ${x.toFixed(2)},${y.toFixed(2)}`)
      }
    }

    return pathParts.join('')
  }

  return (
    <div className="grid-overlay" ref={containerRef}>
      <svg className="grid-overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal lines */}
        {Array.from({ length: horizontalLines }).map((_, index) => (
          <path
            key={`h-${index}`}
            ref={el => lineRefs.current[index] = el}
            d=""
            fill="none"
            stroke="#00ccff"
            strokeWidth="0.8"
            opacity="0.8"
            filter="url(#neon-glow)"
          />
        ))}

        {/* Vertical lines */}
        {Array.from({ length: verticalLines }).map((_, index) => (
          <path
            key={`v-${index}`}
            ref={el => lineRefs.current[horizontalLines + index] = el}
            d=""
            fill="none"
            stroke="#00ccff"
            strokeWidth="0.8"
            opacity="0.8"
            filter="url(#neon-glow)"
          />
        ))}
      </svg>
    </div>
  )
}

export const GridOverlay = memo(GridOverlayComponent)
