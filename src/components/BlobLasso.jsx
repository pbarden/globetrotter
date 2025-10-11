import { useEffect, useRef, useState, useMemo, memo } from 'react'
import './BlobLasso.css'

function BlobLassoComponent({ content, isActive, randomSeed, colorIndex, onEntryComplete, isFirstEntry = false }) {
  const blobRef = useRef()
  const blobRef2 = useRef()
  const blobRef3 = useRef()
  const animationRef = useRef()
  const startTimeRef = useRef(0)
  const colorTransitionRef = useRef(1)
  const [colorTransition, setColorTransition] = useState(1)
  const [previousColors, setPreviousColors] = useState(null)
  const [entryProgress, setEntryProgress] = useState(0)
  const hasCalledComplete = useRef(false)
  const hasStartedAnimation = useRef(false)

  // Unified color system - matches App.jsx and ContentCard
  const blobColors = [
    ['#ffd700', '#ff8c00', '#ffaa00'], // Gold/Orange/Yellow
    ['#ff00ff', '#ff00aa', '#aa00ff'], // Magenta/Pink/Purple
    ['#00ff88', '#00ffaa', '#88ff00'], // Green/Mint/Lime
    ['#ff6b6b', '#ff3333', '#ff9999'], // Red/Crimson/Pink
    ['#b388ff', '#8844ff', '#cc99ff'], // Purple/Violet/Lavender
    ['#00ffff', '#00ccff', '#66ffff'], // Cyan/Sky Blue/Aqua
    ['#ff9500', '#ff6b00', '#ffb84d'], // Orange/Tangerine
    ['#00ff00', '#00cc00', '#66ff66'], // Bright Green/Neon
    ['#ff1493', '#ff007f', '#ff69b4'], // Hot Pink/Deep Pink
    ['#9370db', '#8a2be2', '#ba55d3'], // Medium Purple/Blue Violet
  ]

  // Generate random positions that spread across the screen
  const seed1 = content.id * 3.7 + randomSeed
  const seed2 = content.id * 7.3 + randomSeed * 1.3
  const seed3 = content.id * 11.1 + randomSeed * 0.7

  // Round to 1 decimal place to reduce precision and improve performance
  const blobPosition = {
    x: Math.round((Math.sin(seed1) * 20 + Math.cos(seed2) * 15 + Math.sin(seed3) * 10 + Math.sign(Math.sin(seed1)) * 15) * (window.innerWidth / 100) * 10) / 10,
    y: Math.round((Math.cos(seed1) * 20 + Math.sin(seed2) * 15 + Math.cos(seed3) * 10 + Math.sign(Math.cos(seed1)) * 15) * (window.innerHeight / 100) * 10) / 10
  }

  const blobRotation = Math.round((Math.sin(seed1) * 120 + Math.cos(seed2) * 80 + content.id * 30) % 360)

  // Generate random scale between 0.5 and 1.5 (±50%)
  const blobScale = Math.round((0.5 + (Math.sin(seed1 + seed2) * 0.5 + 0.5)) * 100) / 100

  // Generate pseudo-3D squash effect (oval shapes) based on position
  // Different modals get different squash amounts/directions to simulate rotation
  const scaleX = Math.round((0.7 + (Math.sin(seed1 * 1.5) * 0.3)) * 100) / 100
  const scaleY = Math.round((0.7 + (Math.cos(seed2 * 1.5) * 0.3)) * 100) / 100

  // Second blob for depth - more independent position
  const blob2Position = {
    x: Math.round((Math.sin(seed2 * 1.3) * 22 + Math.cos(seed3 * 0.9) * 17 + Math.sin(seed1 * 1.7) * 10 + Math.sign(Math.sin(seed2 * 1.3)) * 8) * (window.innerWidth / 100) * 10) / 10,
    y: Math.round((Math.cos(seed3 * 1.1) * 20 + Math.sin(seed1 * 1.5) * 15 + Math.cos(seed2 * 0.8) * 12 + Math.sign(Math.cos(seed3 * 1.1)) * 8) * (window.innerHeight / 100) * 10) / 10
  }
  const blob2Rotation = Math.round(blobRotation + (Math.cos(seed3) * 60 + 30))
  const blob2Scale = Math.round(blobScale * (0.7 + Math.sin(seed2 * 2.3) * 0.3) * 100) / 100
  const scale2X = Math.round((0.6 + (Math.cos(seed1 * 2.1) * 0.4)) * 100) / 100
  const scale2Y = Math.round((0.6 + (Math.sin(seed2 * 1.9) * 0.4)) * 100) / 100

  // Third blob for additional depth
  const blob3Position = {
    x: Math.round((Math.cos(seed3 * 1.4) * 21 + Math.sin(seed1 * 1.1) * 16 + Math.cos(seed2 * 1.6) * 11 + Math.sign(Math.cos(seed3 * 1.4)) * 8) * (window.innerWidth / 100) * 10) / 10,
    y: Math.round((Math.sin(seed2 * 1.2) * 19 + Math.cos(seed3 * 1.4) * 16 + Math.sin(seed1 * 0.9) * 13 + Math.sign(Math.sin(seed2 * 1.2)) * 8) * (window.innerHeight / 100) * 10) / 10
  }
  const blob3Rotation = Math.round(blobRotation + (Math.sin(seed1) * 70 + 60))
  const blob3Scale = Math.round(blobScale * (0.6 + Math.cos(seed3 * 2.1) * 0.3) * 100) / 100
  const scale3X = Math.round((0.65 + (Math.sin(seed2 * 2.2) * 0.35)) * 100) / 100
  const scale3Y = Math.round((0.65 + (Math.cos(seed3 * 2.0) * 0.35)) * 100) / 100

  const colors = useMemo(() => blobColors[colorIndex % blobColors.length], [colorIndex])

  // Trigger color transition when content changes
  useEffect(() => {
    if (previousColors && !previousColors.every((color, i) => color === colors[i])) {
      colorTransitionRef.current = 0
      setColorTransition(0)
    }
    setPreviousColors(colors)
  }, [content.id, colors])

  // Interpolate between old and new colors
  const interpolateColor = (color1, color2, factor) => {
    if (!color1) return color2
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)
    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)

    const r = Math.round(r1 + (r2 - r1) * factor)
    const g = Math.round(g1 + (g2 - g1) * factor)
    const b = Math.round(b1 + (b2 - b1) * factor)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const currentColors = useMemo(() => {
    if (previousColors && colorTransition < 1) {
      return colors.map((color, i) => interpolateColor(previousColors[i], color, colorTransition))
    }
    return colors
  }, [previousColors, colorTransition, colors])

  useEffect(() => {
    if (!isActive || !blobRef.current || !blobRef2.current || !blobRef3.current) return

    let lastTime = 0
    let lastUpdateTime = 0
    startTimeRef.current = performance.now() / 1000

    // If not first entry, skip animation and call complete immediately
    if (!isFirstEntry && !hasCalledComplete.current) {
      setEntryProgress(1)
      hasStartedAnimation.current = true
      if (onEntryComplete) {
        hasCalledComplete.current = true
        onEntryComplete()
      }
    }

    const animateBlob = (timestamp) => {
      if (!blobRef.current || !blobRef2.current || !blobRef3.current) return

      const currentTime = timestamp / 1000
      const elapsed = currentTime - startTimeRef.current

      // Throttle to 30fps (~33ms between updates)
      const deltaTime = timestamp - lastUpdateTime
      if (deltaTime < 33) {
        animationRef.current = requestAnimationFrame(animateBlob)
        return
      }
      lastUpdateTime = timestamp

      // Entry animation: zoom in from small to full size
      if (isFirstEntry && entryProgress < 1) {
        const entryDuration = 0.6 // 600ms
        const newProgress = Math.min(entryProgress + (deltaTime / 1000) / entryDuration, 1)
        setEntryProgress(newProgress)

        // Fire callback when complete
        if (newProgress >= 1 && !hasCalledComplete.current && onEntryComplete) {
          hasCalledComplete.current = true
          onEntryComplete()
        }
      }

      // Smooth color transition - slow fade over ~3 seconds
      if (colorTransitionRef.current < 1) {
        colorTransitionRef.current = Math.min(colorTransitionRef.current + 0.005, 1)
        setColorTransition(colorTransitionRef.current)
      }

      // Generate and update blob paths
      const path = generateBlobPath(elapsed)
      const path2 = generateBlobPath(elapsed + 1.5)
      const path3 = generateBlobPath(elapsed + 2.8)

      blobRef.current.setAttribute('d', path)
      blobRef2.current.setAttribute('d', path2)
      blobRef3.current.setAttribute('d', path3)

      animationRef.current = requestAnimationFrame(animateBlob)
    }

    animationRef.current = requestAnimationFrame(animateBlob)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  const generateBlobPath = (time) => {
    const points = 8
    const radius = 180
    const centerX = 200
    const centerY = 200
    const speed = 0.8 // Faster animation speed

    // Optimization #2: Pre-allocate array (1 M command + 8 Q commands + 1 Z)
    const pathParts = new Array(points + 2)
    let idx = 0

    // Pre-calculate first point
    const firstAngle = 0
    const firstNoise = Math.sin(time * speed) * 20
    const firstR = radius + firstNoise
    const firstX = centerX + Math.cos(firstAngle) * firstR
    const firstY = centerY + Math.sin(firstAngle) * firstR
    pathParts[idx++] = `M ${firstX.toFixed(1)},${firstY.toFixed(1)}`

    let prevX = firstX
    let prevY = firstY

    for (let i = 1; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const noise = Math.sin(time * speed + i) * 20
      const r = radius + noise
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      const cpX = (prevX + x) / 2 + Math.sin(time * 0.5 + i) * 15
      const cpY = (prevY + y) / 2 + Math.cos(time * 0.5 + i) * 15

      pathParts[idx++] = ` Q ${cpX.toFixed(1)},${cpY.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`

      prevX = x
      prevY = y
    }

    pathParts[idx] = ' Z'
    return pathParts.join('')
  }

  // Calculate entry scale: start at 0.2 (tiny) and zoom to 1.0
  const entryScale = isFirstEntry ? 0.2 + (entryProgress * 0.8) : 1

  return (
    <>
      {/* Third blob for depth - furthest back */}
      <svg
        className="blob-lasso"
        viewBox="0 0 400 400"
        style={{
          transform: `translate(calc(-50% + ${blob3Position.x}px), calc(-50% + ${blob3Position.y}px)) rotate(${blob3Rotation}deg) scale(${blob3Scale * entryScale}) scaleX(${scale3X}) scaleY(${scale3Y})`,
          opacity: 0.4,
          zIndex: -1
        }}
      >
        <defs>
          <filter id={`glow3-${content.id}`}>
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`gradient3-${content.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors[1]} />
            <stop offset="50%" stopColor={currentColors[2]} />
            <stop offset="100%" stopColor={currentColors[0]} />
          </linearGradient>
        </defs>
        <path
          ref={blobRef3}
          d={generateBlobPath(2.8)}
          fill="none"
          stroke={`url(#gradient3-${content.id})`}
          strokeWidth="2"
          filter={`url(#glow3-${content.id})`}
        />
      </svg>

      {/* Second blob for depth - behind the main blob */}
      <svg
        className="blob-lasso"
        viewBox="0 0 400 400"
        style={{
          transform: `translate(calc(-50% + ${blob2Position.x}px), calc(-50% + ${blob2Position.y}px)) rotate(${blob2Rotation}deg) scale(${blob2Scale * entryScale}) scaleX(${scale2X}) scaleY(${scale2Y})`,
          opacity: 0.5,
          zIndex: 0
        }}
      >
        <defs>
          <filter id={`glow2-${content.id}`}>
            <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`gradient2-${content.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors[2]} />
            <stop offset="50%" stopColor={currentColors[0]} />
            <stop offset="100%" stopColor={currentColors[1]} />
          </linearGradient>
        </defs>
        <path
          ref={blobRef2}
          d={generateBlobPath(1.5)}
          fill="none"
          stroke={`url(#gradient2-${content.id})`}
          strokeWidth="2.5"
          filter={`url(#glow2-${content.id})`}
        />
      </svg>

      {/* Main blob */}
      <svg
        className="blob-lasso"
        viewBox="0 0 400 400"
        style={{
          transform: `translate(calc(-50% + ${blobPosition.x}px), calc(-50% + ${blobPosition.y}px)) rotate(${blobRotation}deg) scale(${blobScale * entryScale}) scaleX(${scaleX}) scaleY(${scaleY})`,
          zIndex: 1
        }}
      >
        <defs>
          <filter id={`glow-${content.id}`}>
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`gradient-${content.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors[0]} />
            <stop offset="50%" stopColor={currentColors[1]} />
            <stop offset="100%" stopColor={currentColors[2]} />
          </linearGradient>
        </defs>
        <path
          ref={blobRef}
          d={generateBlobPath(0)}
          fill="none"
          stroke={`url(#gradient-${content.id})`}
          strokeWidth="3"
          filter={`url(#glow-${content.id})`}
        />
      </svg>
    </>
  )
}

export const BlobLasso = memo(BlobLassoComponent)
