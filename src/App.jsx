import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Globe } from './components/Globe'
import { ContentCard } from './components/ContentCard'
import { BlobLasso } from './components/BlobLasso'
import { LoadingScreen } from './components/LoadingScreen'
import './App.css'

// Unified color system - matches ContentCard color schemes
const blobColors = [
  '#ffd700', // Gold/Orange/Yellow
  '#ff00ff', // Magenta/Pink/Purple
  '#00ff88', // Green/Mint/Lime
  '#ff6b6b', // Red/Crimson/Pink
  '#b388ff', // Purple/Violet/Lavender
  '#00ffff', // Cyan/Sky Blue/Aqua
  '#ff9500', // Orange/Tangerine
  '#00ff00', // Bright Green/Neon
  '#ff1493', // Hot Pink/Deep Pink
  '#9370db', // Medium Purple/Blue Violet
]

// Content in a 4x4 matrix (16 points)
const contentPoints = [
  // Row 0
  {
    id: 0,
    iconName: 'Rocket',
    heading: 'Innovation',
    subheading: 'Pushing Boundaries',
    paragraph: 'Exploring new frontiers in design and technology with cutting-edge solutions.',
    rotation: { x: 0, y: 0 },
    colorIndex: 0
  },
  {
    id: 1,
    iconName: 'Lightbulb',
    heading: 'Creativity',
    subheading: 'Inspired Design',
    paragraph: 'Crafting unique experiences that blend aesthetics with functionality.',
    rotation: { x: Math.PI, y: 0 },
    colorIndex: 1
  },
  {
    id: 2,
    iconName: 'Palette',
    heading: 'Artistry',
    subheading: 'Visual Excellence',
    paragraph: 'Creating stunning visuals that capture attention and inspire imagination.',
    rotation: { x: 0, y: Math.PI / 2 },
    colorIndex: 2
  },
  {
    id: 3,
    iconName: 'Zap',
    heading: 'Performance',
    subheading: 'Lightning Fast',
    paragraph: 'Optimized for speed and efficiency without compromising quality.',
    rotation: { x: 0, y: -Math.PI / 2 },
    colorIndex: 3
  },
  // Row 1
  {
    id: 4,
    iconName: 'Star',
    heading: 'Excellence',
    subheading: 'Quality First',
    paragraph: 'Committed to delivering exceptional results in every project.',
    rotation: { x: Math.PI / 2, y: 0 },
    colorIndex: 4
  },
  {
    id: 5,
    iconName: 'Sparkles',
    heading: 'Future',
    subheading: 'Next Generation',
    paragraph: 'Building tomorrow\'s solutions with today\'s innovations.',
    rotation: { x: -Math.PI / 2, y: 0 },
    colorIndex: 5
  },
  {
    id: 6,
    iconName: 'Target',
    heading: 'Precision',
    subheading: 'Pixel Perfect',
    paragraph: 'Attention to detail in every aspect of design and development.',
    rotation: { x: 0, y: 0 },
    colorIndex: 6
  },
  {
    id: 7,
    iconName: 'Users',
    heading: 'Diversity',
    subheading: 'Inclusive Design',
    paragraph: 'Creating experiences that welcome and engage everyone.',
    rotation: { x: Math.PI, y: 0 },
    colorIndex: 7
  },
  // Row 2
  {
    id: 8,
    iconName: 'Flame',
    heading: 'Passion',
    subheading: 'Driven by Purpose',
    paragraph: 'Fueled by enthusiasm and dedication to excellence.',
    rotation: { x: 0, y: Math.PI / 2 },
    colorIndex: 8
  },
  {
    id: 9,
    iconName: 'Globe',
    heading: 'Global',
    subheading: 'Worldwide Reach',
    paragraph: 'Connecting people and ideas across the world.',
    rotation: { x: 0, y: -Math.PI / 2 },
    colorIndex: 9
  },
  {
    id: 10,
    iconName: 'Layers',
    heading: 'Experience',
    subheading: 'User Focused',
    paragraph: 'Designing memorable interactions that resonate.',
    rotation: { x: Math.PI / 2, y: 0 },
    colorIndex: 0
  },
  {
    id: 11,
    iconName: 'Trophy',
    heading: 'Achievement',
    subheading: 'Award Winning',
    paragraph: 'Recognized for outstanding work and innovation.',
    rotation: { x: -Math.PI / 2, y: 0 },
    colorIndex: 1
  },
  // Row 3
  {
    id: 12,
    iconName: 'Brain',
    heading: 'Intelligence',
    subheading: 'Smart Solutions',
    paragraph: 'Leveraging AI and data to create intelligent experiences.',
    rotation: { x: 0, y: 0 },
    colorIndex: 2
  },
  {
    id: 13,
    iconName: 'Gem',
    heading: 'Premium',
    subheading: 'Luxury Design',
    paragraph: 'Crafting high-end experiences with sophistication.',
    rotation: { x: Math.PI, y: 0 },
    colorIndex: 3
  },
  {
    id: 14,
    iconName: 'Navigation',
    heading: 'Direction',
    subheading: 'Clear Vision',
    paragraph: 'Guiding projects with strategic thinking and clarity.',
    rotation: { x: 0, y: Math.PI / 2 },
    colorIndex: 4
  },
  {
    id: 15,
    iconName: 'PartyPopper',
    heading: 'Entertainment',
    subheading: 'Engaging Content',
    paragraph: 'Creating delightful experiences that captivate audiences.',
    rotation: { x: 0, y: -Math.PI / 2 },
    colorIndex: 5
  }
]

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasShownFirstContent, setHasShownFirstContent] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(0)
  const [targetRotation, setTargetRotation] = useState(null)
  const [animationDirection, setAnimationDirection] = useState('')
  const [animationKey, setAnimationKey] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [flyOutDirection, setFlyOutDirection] = useState('')
  const [randomSeed, setRandomSeed] = useState(Math.random() * 1000)
  const scrollAccumulator = useRef({ x: 0, y: 0 })
  const lastScrollTime = useRef(Date.now())

  // Get current color index from content point
  const currentColorIndex = contentPoints[currentPoint].colorIndex

  // Calculate blob position for light source (matches BlobLasso calculation)
  const getBlobLightPosition = (contentId) => {
    const seed1 = contentId * 3.7 + randomSeed
    const seed2 = contentId * 7.3 + randomSeed * 1.3
    const seed3 = contentId * 11.1 + randomSeed * 0.7

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

        // 4x4 matrix navigation
        const currentRow = Math.floor(currentPoint / 4)
        const currentCol = currentPoint % 4

        // Determine direction and switch point
        if (Math.abs(scrollAccumulator.current.x) > Math.abs(scrollAccumulator.current.y)) {
          // Vertical scrolling (moves between rows, same column)
          if (scrollAccumulator.current.x > 0) {
            // Scrolling down - move to next row
            const nextRow = (currentRow + 1) % 4
            nextPoint = nextRow * 4 + currentCol
            flyOutDir = 'fly-out-bottom'
            flyInDirection = 'fly-from-top'
          } else {
            // Scrolling up - move to previous row
            const nextRow = (currentRow - 1 + 4) % 4
            nextPoint = nextRow * 4 + currentCol
            flyOutDir = 'fly-out-top'
            flyInDirection = 'fly-from-bottom'
          }
        } else {
          // Horizontal scrolling (moves between columns, same row)
          if (scrollAccumulator.current.y > 0) {
            // Scrolling left - move to next column
            const nextCol = (currentCol + 1) % 4
            nextPoint = currentRow * 4 + nextCol
            flyOutDir = 'fly-out-left'
            flyInDirection = 'fly-from-right'
          } else {
            // Scrolling right - move to previous column
            const nextCol = (currentCol - 1 + 4) % 4
            nextPoint = currentRow * 4 + nextCol
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
          const newRotation = contentPoints[nextPoint].rotation
          setTargetRotation({ x: newRotation.x, y: newRotation.y })
          setAnimationDirection(flyInDirection)
          setAnimationKey(prev => prev + 1)
          setFlyOutDirection('')
          // Randomize positions on each scroll
          setRandomSeed(Math.random() * 1000)

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
    if (!isLoading && !hasShownFirstContent) {
      setIsTransitioning(true) // Block scrolling during initial animation
      const initialRotation = contentPoints[0].rotation
      setTargetRotation({ x: initialRotation.x, y: initialRotation.y })
      setAnimationDirection('fly-from-bottom')
      setAnimationKey(prev => prev + 1)
      setHasShownFirstContent(true)

      // Allow scrolling after initial fly-in completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 650) // Match the fly-in animation duration
    }
  }, [isLoading, hasShownFirstContent])

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
              color={blobColors[currentColorIndex]}
              distance={50}
              decay={0.8}
            />
            <Globe targetRotation={targetRotation} />
          </Suspense>
        </Canvas>

        {/* Blob Lasso */}
        {!isLoading && (
          <BlobLasso
            content={contentPoints[currentPoint]}
            isActive={true}
            randomSeed={randomSeed}
            colorIndex={currentColorIndex}
          />
        )}

        {/* Content Cards */}
        <ContentCard
          key={animationKey}
          content={contentPoints[currentPoint]}
          isActive={!isLoading && hasShownFirstContent}
          needsReorientation={needsReorientation()}
          animationDirection={flyOutDirection || animationDirection}
          colorIndex={currentColorIndex}
        />

        {/* Scroll hint */}
        {!isLoading && hasShownFirstContent && (
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
