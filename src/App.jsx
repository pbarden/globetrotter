import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Globe } from './components/Globe'
import { ContentCard } from './components/ContentCard'
import { BlobLasso } from './components/BlobLasso'
import { StringBackground } from './components/StringBackground'
import { LoadingScreen } from './components/LoadingScreen'
import './App.css'

// Blob colors for light source
const blobColors = [
  '#ffaa00', // Gold/Orange/Yellow
  '#ff00aa', // Magenta/Pink/Purple
  '#00ff88', // Green/Mint/Lime
  '#ff6b6b', // Red/Crimson/Pink
  '#8844ff', // Purple/Violet/Lavender
  '#00ffff', // Cyan/Sky Blue/Aqua
]

// Content for each face of the cube (6 points)
const contentPoints = [
  {
    id: 0,
    icon: '🚀',
    heading: 'Innovation',
    subheading: 'Pushing Boundaries',
    paragraph: 'Exploring new frontiers in design and technology with cutting-edge solutions.',
    rotation: { x: 0, y: 0 }
  },
  {
    id: 1,
    icon: '💡',
    heading: 'Creativity',
    subheading: 'Inspired Design',
    paragraph: 'Crafting unique experiences that blend aesthetics with functionality.',
    rotation: { x: Math.PI, y: 0 }
  },
  {
    id: 2,
    icon: '🎨',
    heading: 'Artistry',
    subheading: 'Visual Excellence',
    paragraph: 'Creating stunning visuals that capture attention and inspire imagination.',
    rotation: { x: 0, y: Math.PI / 2 }
  },
  {
    id: 3,
    icon: '⚡',
    heading: 'Performance',
    subheading: 'Lightning Fast',
    paragraph: 'Optimized for speed and efficiency without compromising quality.',
    rotation: { x: 0, y: -Math.PI / 2 }
  },
  {
    id: 4,
    icon: '🌟',
    heading: 'Excellence',
    subheading: 'Quality First',
    paragraph: 'Committed to delivering exceptional results in every project.',
    rotation: { x: Math.PI / 2, y: 0 }
  },
  {
    id: 5,
    icon: '🔮',
    heading: 'Future',
    subheading: 'Next Generation',
    paragraph: 'Building tomorrow\'s solutions with today\'s innovations.',
    rotation: { x: -Math.PI / 2, y: 0 }
  }
]

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPoint, setCurrentPoint] = useState(0)
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 })
  const [animationDirection, setAnimationDirection] = useState('')
  const [animationKey, setAnimationKey] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [flyOutDirection, setFlyOutDirection] = useState('')
  const scrollAccumulator = useRef({ x: 0, y: 0 })
  const lastScrollTime = useRef(Date.now())

  // Calculate blob position for light source (matches BlobLasso calculation)
  const getBlobLightPosition = (contentId) => {
    const seed1 = contentId * 3.7
    const seed2 = contentId * 7.3
    const seed3 = contentId * 11.1

    // Get screen position in pixels (same as BlobLasso)
    const screenX = (Math.sin(seed1) * 45 + Math.cos(seed2) * 35 + Math.sin(seed3) * 25) * (window.innerWidth / 100)
    const screenY = (Math.cos(seed1) * 42 + Math.sin(seed2) * 32 + Math.cos(seed3) * 28) * (window.innerHeight / 100)

    // Convert to normalized coordinates (-1 to 1) for 3D space
    const normalizedX = (screenX / window.innerWidth) * 8
    const normalizedY = -(screenY / window.innerHeight) * 6

    // Position light in front of globe to cast light on it
    const blobScale = 0.5 + (Math.sin(seed1 + seed2) * 0.5 + 0.5)
    const lightDistance = 5 + blobScale * 2

    return [normalizedX, normalizedY, lightDistance]
  }

  useEffect(() => {
    if (isLoading) return

    const handleWheel = (e) => {
      e.preventDefault()

      // Block all scroll during transitions
      if (isTransitioning) {
        return
      }

      const now = Date.now()
      const deltaTime = now - lastScrollTime.current
      lastScrollTime.current = now

      // Always accumulate both directions
      // If Shift is pressed, treat vertical scroll as horizontal
      if (e.shiftKey) {
        scrollAccumulator.current.y += e.deltaY
      } else {
        scrollAccumulator.current.x += e.deltaY
        scrollAccumulator.current.y += e.deltaX
      }

      // Threshold for point switching
      const threshold = 120

      if (Math.abs(scrollAccumulator.current.x) > threshold ||
          Math.abs(scrollAccumulator.current.y) > threshold) {

        let nextPoint = currentPoint
        let flyOutDir = ''
        let flyInDirection = ''

        // Determine direction and switch point
        if (Math.abs(scrollAccumulator.current.x) > Math.abs(scrollAccumulator.current.y)) {
          // Vertical scrolling
          if (scrollAccumulator.current.x > 0) {
            // Scrolling down - current flies out bottom, new comes from top
            nextPoint = (currentPoint + 1) % contentPoints.length
            flyOutDir = 'fly-out-bottom'
            flyInDirection = 'fly-from-top'
          } else {
            // Scrolling up - current flies out top, new comes from bottom
            nextPoint = (currentPoint - 1 + contentPoints.length) % contentPoints.length
            flyOutDir = 'fly-out-top'
            flyInDirection = 'fly-from-bottom'
          }
        } else {
          // Horizontal scrolling
          if (scrollAccumulator.current.y > 0) {
            // Scrolling left - current flies out left, new comes from right
            nextPoint = (currentPoint + 2) % contentPoints.length
            flyOutDir = 'fly-out-left'
            flyInDirection = 'fly-from-right'
          } else {
            // Scrolling right - current flies out right, new comes from left
            nextPoint = (currentPoint - 2 + contentPoints.length) % contentPoints.length
            flyOutDir = 'fly-out-right'
            flyInDirection = 'fly-from-left'
          }
        }

        // Reset accumulator immediately
        scrollAccumulator.current = { x: 0, y: 0 }

        // Stage 1: Trigger fly-out animation
        setIsTransitioning(true)
        setFlyOutDirection(flyOutDir)

        // Stage 2: Wait for fly-out to complete, then switch content and fly-in
        setTimeout(() => {
          setCurrentPoint(nextPoint)
          setTargetRotation(contentPoints[nextPoint].rotation)
          setAnimationDirection(flyInDirection)
          setAnimationKey(prev => prev + 1)
          setFlyOutDirection('')

          // Allow new transitions after fly-in completes
          setTimeout(() => {
            setIsTransitioning(false)
          }, 650) // Wait for fly-in to mostly complete
        }, 400) // Fly-out animation duration
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isLoading, currentPoint, isTransitioning])

  // Initialize rotation and first card animation
  useEffect(() => {
    if (!isLoading) {
      setTargetRotation(contentPoints[0].rotation)
      setAnimationDirection('fly-from-bottom')
      setAnimationKey(prev => prev + 1)
    }
  }, [isLoading])

  // Determine if card needs reorientation (when it would be upside down or sideways)
  const needsReorientation = () => {
    const point = contentPoints[currentPoint]
    return Math.abs(point.rotation.x) > Math.PI / 4 || Math.abs(point.rotation.y) > Math.PI / 4
  }

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}

      <div className="app-container">
        {/* Dithering overlay */}
        <div className="dither-overlay"></div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          className="globe-canvas"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
            <pointLight position={[-5, -5, 5]} intensity={0.6} color="#ff8c00" />
            <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffd700" />
            {/* Dynamic blob color light source - follows blob position */}
            <pointLight
              position={getBlobLightPosition(currentPoint)}
              intensity={8}
              color={blobColors[currentPoint]}
              distance={50}
              decay={0.8}
            />
            <Globe targetRotation={targetRotation} />
          </Suspense>
        </Canvas>

        {/* String Background */}
        <StringBackground
          content={contentPoints[currentPoint]}
          isActive={!isLoading}
        />

        {/* Blob Lasso */}
        <BlobLasso
          content={contentPoints[currentPoint]}
          isActive={!isLoading}
        />

        {/* Content Cards */}
        <ContentCard
          key={animationKey}
          content={contentPoints[currentPoint]}
          isActive={!isLoading}
          needsReorientation={needsReorientation()}
          animationDirection={flyOutDirection || animationDirection}
        />

        {/* Scroll hint */}
        {!isLoading && (
          <div className="scroll-hint">
            <p>Scroll or swipe to explore</p>
            <div className="scroll-indicator">↕ ↔</div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
