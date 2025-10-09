import { useEffect, useRef, useState } from 'react'
import './StringBackground.css'

export function StringBackground({ content, isActive }) {
  const stringRef1 = useRef()
  const stringRef2 = useRef()
  const [colorTransition, setColorTransition] = useState(1)
  const [previousColors, setPreviousColors] = useState(null)

  // Generate unique colors, position, and rotation for each point
  const stringColors = [
    ['#ffd700', '#ff8c00', '#ffaa00'], // Gold/Orange/Yellow
    ['#ff00ff', '#ff00aa', '#aa00ff'], // Magenta/Pink/Purple
    ['#00ff88', '#00ffaa', '#88ff00'], // Green/Mint/Lime
    ['#ff6b6b', '#ff3333', '#ff9999'], // Red/Crimson/Pink
    ['#b388ff', '#8844ff', '#cc99ff'], // Purple/Violet/Lavender
    ['#00ffff', '#00ccff', '#66ffff'], // Cyan/Sky Blue/Aqua
  ]

  // Generate random positions that spread across the screen
  const seed1 = content.id * 3.7
  const seed2 = content.id * 7.3
  const seed3 = content.id * 11.1

  // String 1 position - independent from blobs
  const string1Position = {
    x: (Math.sin(seed1 * 1.4) * 43 + Math.cos(seed3 * 1.2) * 33 + Math.sin(seed2 * 0.9) * 24) * (window.innerWidth / 100),
    y: (Math.cos(seed2 * 1.3) * 40 + Math.sin(seed1 * 1.1) * 30 + Math.cos(seed3 * 1.4) * 26) * (window.innerHeight / 100)
  }

  // String 2 position - independent
  const string2Position = {
    x: (Math.sin(seed3 * 0.8) * 46 + Math.cos(seed1 * 1.6) * 37 + Math.sin(seed2 * 1.3) * 20) * (window.innerWidth / 100),
    y: (Math.cos(seed1 * 0.9) * 43 + Math.sin(seed3 * 1.2) * 32 + Math.cos(seed2 * 1.5) * 23) * (window.innerHeight / 100)
  }

  const string1Rotation = (Math.sin(seed1) * 120 + Math.cos(seed2) * 80 + content.id * 30) % 360
  const string2Rotation = string1Rotation + (Math.cos(seed3) * 60 + 30)

  // Generate random scale between 0.5 and 1.5 (±50%)
  const string1Scale = 0.5 + (Math.sin(seed1 + seed2) * 0.5 + 0.5)
  const string2Scale = string1Scale * (0.7 + Math.sin(seed2 * 2.3) * 0.3)

  // Generate pseudo-3D squash effect
  const scale1X = 0.7 + (Math.sin(seed1 * 1.5) * 0.3)
  const scale1Y = 0.7 + (Math.cos(seed2 * 1.5) * 0.3)
  const scale2X = 0.6 + (Math.cos(seed1 * 2.1) * 0.4)
  const scale2Y = 0.6 + (Math.sin(seed2 * 1.9) * 0.4)

  const colors = stringColors[content.id % stringColors.length]

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
    if (isActive && stringRef1.current && stringRef2.current) {
      const animateStrings = () => {
        const time = Date.now() * 0.001
        const path1 = generateStringPath(time)
        const path2 = generateStringPath(time + 1.5) // Offset timing for variation
        stringRef1.current.setAttribute('d', path1)
        stringRef2.current.setAttribute('d', path2)
        requestAnimationFrame(animateStrings)
      }
      const animation = requestAnimationFrame(animateStrings)
      return () => cancelAnimationFrame(animation)
    }
  }, [isActive])

  const generateStringPath = (time) => {
    // Create elongated blob shape (string-like)
    const points = 8
    const radiusX = 40 // Narrow width
    const radiusY = 180 // Long height
    const centerX = 200
    const centerY = 200

    let path = 'M '

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const noise = Math.sin(time * 0.5 + i) * 15
      const rx = radiusX + noise
      const ry = radiusY + noise * 2
      const x = centerX + Math.cos(angle) * rx
      const y = centerY + Math.sin(angle) * ry

      if (i === 0) {
        path += `${x},${y} `
      } else {
        const prevAngle = ((i - 1) / points) * Math.PI * 2
        const prevNoise = Math.sin(time * 0.5 + (i - 1)) * 15
        const prevRx = radiusX + prevNoise
        const prevRy = radiusY + prevNoise * 2
        const prevX = centerX + Math.cos(prevAngle) * prevRx
        const prevY = centerY + Math.sin(prevAngle) * prevRy

        const cpX = (prevX + x) / 2 + Math.sin(time * 0.3 + i) * 10
        const cpY = (prevY + y) / 2 + Math.cos(time * 0.3 + i) * 10

        path += `Q ${cpX},${cpY} ${x},${y} `
      }
    }

    path += 'Z'
    return path
  }

  return (
    <>
      {/* String 1 */}
      <svg
        className="string-background"
        viewBox="0 0 400 400"
        style={{
          transform: `translate(calc(-50% + ${string1Position.x}px), calc(-50% + ${string1Position.y}px)) rotate(${string1Rotation}deg) scale(${string1Scale}) scaleX(${scale1X}) scaleY(${scale1Y})`,
        }}
      >
        <defs>
          <filter id={`glow-string-1-${content.id}`}>
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`gradient-string-1-${content.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors[0]} />
            <stop offset="50%" stopColor={currentColors[1]} />
            <stop offset="100%" stopColor={currentColors[2]} />
          </linearGradient>
        </defs>
        <path
          ref={stringRef1}
          d={generateStringPath(0)}
          fill="none"
          stroke={`url(#gradient-string-1-${content.id})`}
          strokeWidth="3"
          filter={`url(#glow-string-1-${content.id})`}
        />
      </svg>

      {/* String 2 */}
      <svg
        className="string-background"
        viewBox="0 0 400 400"
        style={{
          transform: `translate(calc(-50% + ${string2Position.x}px), calc(-50% + ${string2Position.y}px)) rotate(${string2Rotation}deg) scale(${string2Scale}) scaleX(${scale2X}) scaleY(${scale2Y})`,
          opacity: 0.6
        }}
      >
        <defs>
          <filter id={`glow-string-2-${content.id}`}>
            <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`gradient-string-2-${content.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColors[2]} />
            <stop offset="50%" stopColor={currentColors[0]} />
            <stop offset="100%" stopColor={currentColors[1]} />
          </linearGradient>
        </defs>
        <path
          ref={stringRef2}
          d={generateStringPath(1.5)}
          fill="none"
          stroke={`url(#gradient-string-2-${content.id})`}
          strokeWidth="2.5"
          filter={`url(#glow-string-2-${content.id})`}
        />
      </svg>

    </>
  )
}
