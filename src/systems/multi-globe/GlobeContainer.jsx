import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Globe } from '../../components/Globe'
import { ContentCard } from '../../components/ContentCard'
import { BlobLasso } from '../../components/BlobLasso'
import { getSizeSpec } from './configs/sizeSpecs'
import { getNeighbors } from './utils/gridCalculations'

// Unified color system - matches ContentCard color schemes
const blobColors = [
  '#ffd700', '#ff00ff', '#00ff88', '#ff6b6b', '#b388ff',
  '#00ffff', '#ff9500', '#00ff00', '#ff1493', '#9370db',
]

/**
 * GlobeContainer - Exactly like App.jsx but accepts globeConfig
 */
function GlobeContainer({
  globeConfig,
  currentCardIndex: externalCardIndex = 0,
  onNavigate,
  onScrollToMap
}) {
  const [hasShownFirstContent, setHasShownFirstContent] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(externalCardIndex)
  const [targetRotation, setTargetRotation] = useState(null)
  const [animationDirection, setAnimationDirection] = useState('')
  const [animationKey, setAnimationKey] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [flyOutDirection, setFlyOutDirection] = useState('')
  const [randomSeed, setRandomSeed] = useState(Math.random() * 1000)
  const scrollAccumulator = useRef({ x: 0, y: 0 })
  const lastScrollTime = useRef(Date.now())

  // Get content from globeConfig instead of hardcoded
  const contentPoints = globeConfig.contentPoints
  const sizeSpec = getSizeSpec(globeConfig.size)
  const rows = sizeSpec.gridDimensions.rows
  const cols = sizeSpec.gridDimensions.cols

  // Get current color index from content point
  const currentColorIndex = contentPoints[currentPoint].content.colorIndex

  // Calculate blob position for light source (matches BlobLasso calculation)
  const getBlobLightPosition = (contentId) => {
    const seed1 = contentId * 3.7 + randomSeed
    const seed2 = contentId * 7.3 + randomSeed * 1.3
    const seed3 = contentId * 11.1 + randomSeed * 0.7

    const screenX = (Math.sin(seed1) * 45 + Math.cos(seed2) * 35 + Math.sin(seed3) * 25) * (window.innerWidth / 100)
    const screenY = (Math.cos(seed1) * 42 + Math.sin(seed2) * 32 + Math.cos(seed3) * 28) * (window.innerHeight / 100)

    const normalizedX = (screenX / window.innerWidth) * 8
    const normalizedY = -(screenY / window.innerHeight) * 6

    const blobScale = 0.5 + (Math.sin(seed1 + seed2) * 0.5 + 0.5)
    const lightDistance = 5 + blobScale * 2

    return [normalizedX, normalizedY, lightDistance]
  }

  const blobLightPosition = useMemo(
    () => getBlobLightPosition(currentPoint),
    [currentPoint, randomSeed]
  )

  // Memoize wheel handler to prevent recreation on every render
  const handleWheel = useCallback((e) => {
    e.preventDefault()

    // Block all scroll during transitions
    if (isTransitioning) {
      return
    }

    // Special behavior: if this is tiny globe, any scroll goes to map
    if (sizeSpec.scrollBehavior === 'return-to-map' && onScrollToMap) {
      onScrollToMap()
      return
    }

    const now = Date.now()
    lastScrollTime.current = now

    // Always accumulate both directions
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

      const neighbors = getNeighbors(
        currentPoint,
        rows,
        cols,
        globeConfig.navigation.wrapAround
      )

      let nextPoint = currentPoint
      let flyOutDir = ''
      let flyInDirection = ''

      // Determine direction and switch point
      if (Math.abs(scrollAccumulator.current.x) > Math.abs(scrollAccumulator.current.y)) {
        // Vertical scrolling
        if (scrollAccumulator.current.x > 0 && neighbors.down !== null) {
          nextPoint = neighbors.down
          flyOutDir = 'fly-out-bottom'
          flyInDirection = 'fly-from-top'
        } else if (scrollAccumulator.current.x < 0 && neighbors.up !== null) {
          nextPoint = neighbors.up
          flyOutDir = 'fly-out-top'
          flyInDirection = 'fly-from-bottom'
        }
      } else {
        // Horizontal scrolling
        if (scrollAccumulator.current.y > 0 && neighbors.right !== null) {
          nextPoint = neighbors.right
          flyOutDir = 'fly-out-left'
          flyInDirection = 'fly-from-right'
        } else if (scrollAccumulator.current.y < 0 && neighbors.left !== null) {
          nextPoint = neighbors.left
          flyOutDir = 'fly-out-right'
          flyInDirection = 'fly-from-left'
        }
      }

      // Reset accumulator immediately
      scrollAccumulator.current = { x: 0, y: 0 }

      if (nextPoint !== currentPoint) {
        // Stage 1: Trigger fly-out animation
        setIsTransitioning(true)
        setFlyOutDirection(flyOutDir)

        // Stage 2: Wait for fly-out to complete, then switch content and fly-in
        setTimeout(() => {
          setCurrentPoint(nextPoint)
          if (onNavigate) {
            onNavigate(nextPoint)
          }
          const newRotation = contentPoints[nextPoint].rotation
          setTargetRotation({ x: newRotation.x, y: newRotation.y })
          setAnimationDirection(flyInDirection)
          setAnimationKey(prev => prev + 1)
          setFlyOutDirection('')
          setRandomSeed(Math.random() * 1000)

          // Allow new transitions after fly-in completes
          setTimeout(() => {
            setIsTransitioning(false)
          }, 650)
        }, 400)
      }
    }
  }, [currentPoint, isTransitioning, contentPoints, rows, cols, sizeSpec, globeConfig, onNavigate, onScrollToMap])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Sync with external card index changes
  useEffect(() => {
    if (externalCardIndex !== currentPoint) {
      setCurrentPoint(externalCardIndex)
    }
  }, [externalCardIndex])

  // Initialize rotation and first card animation
  useEffect(() => {
    if (!hasShownFirstContent) {
      setIsTransitioning(true)
      const initialRotation = contentPoints[0].rotation
      setTargetRotation({ x: initialRotation.x, y: initialRotation.y })
      setAnimationDirection('fly-from-bottom')
      setAnimationKey(prev => prev + 1)
      setHasShownFirstContent(true)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 650)
    }
  }, [hasShownFirstContent, contentPoints])

  // Determine if card needs reorientation
  const needsReorientation = () => {
    const point = contentPoints[currentPoint]
    return Math.abs(point.rotation.x) > Math.PI / 4 || Math.abs(point.rotation.y) > Math.PI / 4
  }

  return (
    <div className="app-container">
      {/* Dithering overlay */}
      <div className="dither-overlay"></div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, sizeSpec.cameraDistance], fov: 50 }}
        className="globe-canvas"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-5, -5, 5]} intensity={0.6} color="#ff8c00" />
          <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffd700" />
          {/* Dynamic blob color light source */}
          <pointLight
            position={blobLightPosition}
            intensity={8}
            color={blobColors[currentColorIndex]}
            distance={50}
            decay={0.8}
          />
          <Globe
            targetRotation={targetRotation}
            scale={sizeSpec.scale}
            subdivision={sizeSpec.subdivision}
          />
        </Suspense>
      </Canvas>

      {/* Blob Lasso */}
      <BlobLasso
        content={{
          id: contentPoints[currentPoint].id,
          ...contentPoints[currentPoint].content
        }}
        isActive={true}
        randomSeed={randomSeed}
        colorIndex={currentColorIndex}
      />

      {/* Content Cards */}
      <ContentCard
        key={animationKey}
        content={contentPoints[currentPoint].content}
        isActive={hasShownFirstContent}
        needsReorientation={needsReorientation()}
        animationDirection={flyOutDirection || animationDirection}
        colorIndex={currentColorIndex}
      />

      {/* Scroll hint */}
      {hasShownFirstContent && (
        <div className="scroll-hint">
          <p>Scroll or swipe to explore</p>
          <div className="scroll-indicator">↕ ↔</div>
        </div>
      )}
    </div>
  )
}

export default GlobeContainer
