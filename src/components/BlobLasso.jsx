import { useEffect, useRef } from 'react'
import './BlobLasso.css'

export function BlobLasso({ content, isActive }) {
  const blobRef = useRef()

  // Generate unique colors, position, and rotation for each point
  const blobColors = [
    ['#ffd700', '#ff8c00', '#ffd700'], // Gold/Orange
    ['#ff00ff', '#00ffff', '#ff00ff'], // Magenta/Cyan
    ['#00ff88', '#0088ff', '#00ff88'], // Green/Blue
    ['#ff6b6b', '#ffd93d', '#ff6b6b'], // Red/Yellow
    ['#b388ff', '#64b5f6', '#b388ff'], // Purple/Blue
    ['#ff6f91', '#ffaa00', '#ff6f91'], // Pink/Orange
  ]

  // Generate random positions that move around the screen
  const seed1 = content.id * 3.7
  const seed2 = content.id * 7.3
  const seed3 = content.id * 11.1

  const blobPosition = {
    x: (Math.sin(seed1) * 50 + Math.cos(seed2) * 35 + Math.sin(seed3) * 25) * (window.innerWidth / 100),
    y: (Math.cos(seed1) * 45 + Math.sin(seed2) * 30 + Math.cos(seed3) * 25) * (window.innerHeight / 100)
  }

  const blobRotation = (Math.sin(seed1) * 120 + Math.cos(seed2) * 80 + content.id * 30) % 360

  // Generate random scale between 0.5 and 1.5 (±50%)
  const blobScale = 0.5 + (Math.sin(seed1 + seed2) * 0.5 + 0.5)

  // Generate pseudo-3D squash effect (oval shapes) based on position
  // Different modals get different squash amounts/directions to simulate rotation
  const scaleX = 0.7 + (Math.sin(seed1 * 1.5) * 0.3)
  const scaleY = 0.7 + (Math.cos(seed2 * 1.5) * 0.3)

  const colors = blobColors[content.id % blobColors.length]

  useEffect(() => {
    if (isActive && blobRef.current) {
      const animateBlob = () => {
        const time = Date.now() * 0.001
        const path = generateBlobPath(time)
        blobRef.current.setAttribute('d', path)
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
    <svg
      className="blob-lasso"
      viewBox="0 0 400 400"
      style={{
        transform: `translate(calc(-50% + ${blobPosition.x}px), calc(-50% + ${blobPosition.y}px)) rotate(${blobRotation}deg) scale(${blobScale}) scaleX(${scaleX}) scaleY(${scaleY})`
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
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
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
  )
}
