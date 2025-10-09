import { useEffect, useRef, useState } from 'react'
import './ZigzagBackground.css'

export function ZigzagBackground({ content, isActive }) {
  const zigzagRef1 = useRef()
  const zigzagRef2 = useRef()
  const zigzagRef3 = useRef()
  const [colorTransition, setColorTransition] = useState(1)
  const [previousColors, setPreviousColors] = useState(null)

  // Generate unique colors
  const zigzagColors = [
    ['#ffd700', '#ff8c00', '#ffaa00'], // Gold/Orange/Yellow
    ['#ff00ff', '#ff00aa', '#aa00ff'], // Magenta/Pink/Purple
    ['#00ff88', '#00ffaa', '#88ff00'], // Green/Mint/Lime
    ['#ff6b6b', '#ff3333', '#ff9999'], // Red/Crimson/Pink
    ['#b388ff', '#8844ff', '#cc99ff'], // Purple/Violet/Lavender
    ['#00ffff', '#00ccff', '#66ffff'], // Cyan/Sky Blue/Aqua
  ]

  const colors = zigzagColors[content.id % zigzagColors.length]

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
        setColorTransition(prev => Math.min(prev + 0.015, 1))
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

  // Generate random positions for 3 zigzags
  const seed1 = content.id * 5.1
  const seed2 = content.id * 8.7
  const seed3 = content.id * 13.3

  const zigzag1Position = {
    x: (Math.sin(seed1) * 40 + Math.cos(seed2) * 30) * (window.innerWidth / 100),
    y: (Math.cos(seed1) * 35 + Math.sin(seed2) * 25) * (window.innerHeight / 100)
  }

  const zigzag2Position = {
    x: (Math.sin(seed2) * 45 + Math.cos(seed3) * 35) * (window.innerWidth / 100),
    y: (Math.cos(seed2) * 40 + Math.sin(seed3) * 30) * (window.innerHeight / 100)
  }

  const zigzag3Position = {
    x: (Math.sin(seed3) * 50 + Math.cos(seed1) * 40) * (window.innerWidth / 100),
    y: (Math.cos(seed3) * 45 + Math.sin(seed1) * 35) * (window.innerHeight / 100)
  }

  const zigzag1Rotation = (Math.sin(seed1) * 180 + content.id * 20) % 360
  const zigzag2Rotation = (Math.sin(seed2) * 180 + content.id * 40) % 360
  const zigzag3Rotation = (Math.sin(seed3) * 180 + content.id * 60) % 360

  return (
    <>
      {/* Zigzag 1 */}
      <svg
        className="zigzag-background"
        viewBox="0 0 400 800"
        style={{
          transform: `translate(calc(-50% + ${zigzag1Position.x}px), calc(-50% + ${zigzag1Position.y}px)) rotate(${zigzag1Rotation}deg)`,
        }}
      >
        <defs>
          <linearGradient id={`zigzag-gradient-1-${content.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors[0]} stopOpacity="0.3" />
            <stop offset="50%" stopColor={currentColors[1]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={currentColors[2]} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 100,50 L 150,150 L 100,250 L 150,350 L 100,450 L 150,550 L 100,650 L 150,750"
          fill="none"
          stroke={`url(#zigzag-gradient-1-${content.id})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Zigzag 2 */}
      <svg
        className="zigzag-background"
        viewBox="0 0 400 800"
        style={{
          transform: `translate(calc(-50% + ${zigzag2Position.x}px), calc(-50% + ${zigzag2Position.y}px)) rotate(${zigzag2Rotation}deg)`,
        }}
      >
        <defs>
          <linearGradient id={`zigzag-gradient-2-${content.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors[2]} stopOpacity="0.3" />
            <stop offset="50%" stopColor={currentColors[0]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={currentColors[1]} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 250,100 L 200,200 L 250,300 L 200,400 L 250,500 L 200,600 L 250,700"
          fill="none"
          stroke={`url(#zigzag-gradient-2-${content.id})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Zigzag 3 */}
      <svg
        className="zigzag-background"
        viewBox="0 0 400 800"
        style={{
          transform: `translate(calc(-50% + ${zigzag3Position.x}px), calc(-50% + ${zigzag3Position.y}px)) rotate(${zigzag3Rotation}deg)`,
        }}
      >
        <defs>
          <linearGradient id={`zigzag-gradient-3-${content.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentColors[1]} stopOpacity="0.3" />
            <stop offset="50%" stopColor={currentColors[2]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={currentColors[0]} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 300,75 L 350,175 L 300,275 L 350,375 L 300,475 L 350,575 L 300,675"
          fill="none"
          stroke={`url(#zigzag-gradient-3-${content.id})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </>
  )
}
