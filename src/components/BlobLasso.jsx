import { useEffect, useRef, useState } from 'react'
import './BlobLasso.css'

export function BlobLasso({ content, isActive, randomSeed, colorIndex }) {
  const blobRef = useRef()
  const blobRef2 = useRef()
  const [colorTransition, setColorTransition] = useState(1)
  const [previousColors, setPreviousColors] = useState(null)

  // Generate unique colors, position, and rotation for each point
  const blobColors = [
    ['#ffd700', '#ff8c00', '#ffaa00'], // Gold/Orange/Yellow
    ['#ff00ff', '#ff00aa', '#aa00ff'], // Magenta/Pink/Purple
    ['#00ff88', '#00ffaa', '#88ff00'], // Green/Mint/Lime
    ['#ff6b6b', '#ff3333', '#ff9999'], // Red/Crimson/Pink
    ['#b388ff', '#8844ff', '#cc99ff'], // Purple/Violet/Lavender
    ['#00ffff', '#00ccff', '#66ffff'], // Cyan/Sky Blue/Aqua
  ]

  // Generate random positions that spread across the screen
  const seed1 = content.id * 3.7 + randomSeed
  const seed2 = content.id * 7.3 + randomSeed * 1.3
  const seed3 = content.id * 11.1 + randomSeed * 0.7

  const blobPosition = {
    x: (Math.sin(seed1) * 45 + Math.cos(seed2) * 35 + Math.sin(seed3) * 25) * (window.innerWidth / 100),
    y: (Math.cos(seed1) * 42 + Math.sin(seed2) * 32 + Math.cos(seed3) * 28) * (window.innerHeight / 100)
  }

  const blobRotation = (Math.sin(seed1) * 120 + Math.cos(seed2) * 80 + content.id * 30) % 360

  // Generate random scale between 0.5 and 1.5 (±50%)
  const blobScale = 0.5 + (Math.sin(seed1 + seed2) * 0.5 + 0.5)

  // Generate pseudo-3D squash effect (oval shapes) based on position
  // Different modals get different squash amounts/directions to simulate rotation
  const scaleX = 0.7 + (Math.sin(seed1 * 1.5) * 0.3)
  const scaleY = 0.7 + (Math.cos(seed2 * 1.5) * 0.3)

  // Second blob for depth - more independent position
  const blob2Position = {
    x: (Math.sin(seed2 * 1.3) * 48 + Math.cos(seed3 * 0.9) * 38 + Math.sin(seed1 * 1.7) * 22) * (window.innerWidth / 100),
    y: (Math.cos(seed3 * 1.1) * 45 + Math.sin(seed1 * 1.5) * 35 + Math.cos(seed2 * 0.8) * 25) * (window.innerHeight / 100)
  }
  const blob2Rotation = blobRotation + (Math.cos(seed3) * 60 + 30)
  const blob2Scale = blobScale * (0.7 + Math.sin(seed2 * 2.3) * 0.3)
  const scale2X = 0.6 + (Math.cos(seed1 * 2.1) * 0.4)
  const scale2Y = 0.6 + (Math.sin(seed2 * 1.9) * 0.4)

  const colors = blobColors[colorIndex % blobColors.length]

  // Trigger color transition when content changes
  useEffect(() => {
    if (previousColors && JSON.stringify(previousColors) !== JSON.stringify(colors)) {
      setColorTransition(0)
    }
    setPreviousColors(colors)
  }, [content.id, colors])

  // Animate color transition
  useEffect(() => {
    if (colorTransition < 1) {
      const transitionInterval = setInterval(() => {
        setColorTransition(prev => Math.min(prev + 0.015, 1)) // Slow fade over ~2 seconds
      }, 16)
      return () => clearInterval(transitionInterval)
    }
  }, [colorTransition])

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

  const currentColors = previousColors && colorTransition < 1
    ? colors.map((color, i) => interpolateColor(previousColors[i], color, colorTransition))
    : colors

  useEffect(() => {
    if (isActive && blobRef.current && blobRef2.current) {
      const animateBlob = () => {
        const time = Date.now() * 0.001
        const path = generateBlobPath(time)
        const path2 = generateBlobPath(time + 1.5) // Offset timing for variation
        blobRef.current.setAttribute('d', path)
        blobRef2.current.setAttribute('d', path2)
        requestAnimationFrame(animateBlob)
      }
      const animation = requestAnimationFrame(animateBlob)
      return () => cancelAnimationFrame(animation)
    }
  }, [isActive])

  const generateBlobPath = (time) => {
    const points = 8
    const radius = 180
    const centerX = 200
    const centerY = 200

    let path = 'M '

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const noise = Math.sin(time * 0.5 + i) * 20
      const r = radius + noise
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      if (i === 0) {
        path += `${x},${y} `
      } else {
        const prevAngle = ((i - 1) / points) * Math.PI * 2
        const prevNoise = Math.sin(time * 0.5 + (i - 1)) * 20
        const prevR = radius + prevNoise
        const prevX = centerX + Math.cos(prevAngle) * prevR
        const prevY = centerY + Math.sin(prevAngle) * prevR

        const cpX = (prevX + x) / 2 + Math.sin(time * 0.3 + i) * 15
        const cpY = (prevY + y) / 2 + Math.cos(time * 0.3 + i) * 15

        path += `Q ${cpX},${cpY} ${x},${y} `
      }
    }

    path += 'Z'
    return path
  }

  return (
    <>
      {/* Second blob for depth - behind the main blob */}
      <svg
        className="blob-lasso"
        viewBox="0 0 400 400"
        style={{
          transform: `translate(calc(-50% + ${blob2Position.x}px), calc(-50% + ${blob2Position.y}px)) rotate(${blob2Rotation}deg) scale(${blob2Scale}) scaleX(${scale2X}) scaleY(${scale2Y})`,
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
          transform: `translate(calc(-50% + ${blobPosition.x}px), calc(-50% + ${blobPosition.y}px)) rotate(${blobRotation}deg) scale(${blobScale}) scaleX(${scaleX}) scaleY(${scaleY})`,
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
