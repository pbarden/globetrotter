import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Globe } from './components/Globe'
import { ContentCard } from './components/ContentCard'
import { BlobLasso } from './components/BlobLasso'
import { LoadingScreen } from './components/LoadingScreen'
import { FloatingRadioButton } from './components/FloatingRadioButton'
import { CONTENT_POINTS } from './config/content'
import { getColorScheme } from './config/colors'
import { ANIMATION_TIMINGS, SCROLL_CONFIG } from './config/animations'
import { getCompositionState } from './config/compositions'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import './App.css'

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
  const [skipAudioUpdate, setSkipAudioUpdate] = useState(false)
  const [lastVisitedCard, setLastVisitedCard] = useState(null)
  const scrollAccumulator = useRef({ x: 0, y: 0 })
  const lastScrollTime = useRef(Date.now())

  // Navigate to a specific direction
  const navigateToDirection = useCallback((direction) => {
    if (isTransitioning) return

    const currentRow = Math.floor(currentPoint / SCROLL_CONFIG.GRID_COLS)
    const currentCol = currentPoint % SCROLL_CONFIG.GRID_COLS

    let nextPoint = currentPoint
    let flyOutDir = ''
    let flyInDirection = ''

    switch (direction) {
      case 'up':
        const nextRowUp = (currentRow + 1) % SCROLL_CONFIG.GRID_ROWS
        nextPoint = nextRowUp * SCROLL_CONFIG.GRID_COLS + currentCol
        flyOutDir = 'fly-out-bottom'
        flyInDirection = 'fly-from-top'
        break
      case 'down':
        const nextRowDown = (currentRow - 1 + SCROLL_CONFIG.GRID_ROWS) % SCROLL_CONFIG.GRID_ROWS
        nextPoint = nextRowDown * SCROLL_CONFIG.GRID_COLS + currentCol
        flyOutDir = 'fly-out-top'
        flyInDirection = 'fly-from-bottom'
        break
      case 'left':
        const nextColLeft = (currentCol + 1) % SCROLL_CONFIG.GRID_COLS
        nextPoint = currentRow * SCROLL_CONFIG.GRID_COLS + nextColLeft
        flyOutDir = 'fly-out-left'
        flyInDirection = 'fly-from-right'
        break
      case 'right':
        const nextColRight = (currentCol - 1 + SCROLL_CONFIG.GRID_COLS) % SCROLL_CONFIG.GRID_COLS
        nextPoint = currentRow * SCROLL_CONFIG.GRID_COLS + nextColRight
        flyOutDir = 'fly-out-right'
        flyInDirection = 'fly-from-left'
        break
    }

    setIsTransitioning(true)
    setFlyOutDirection(flyOutDir)

    setTimeout(() => {
      setLastVisitedCard(currentPoint)
      setCurrentPoint(nextPoint)
      const newRotation = CONTENT_POINTS[nextPoint].rotation
      setTargetRotation({ x: newRotation.x, y: newRotation.y })
      setAnimationDirection(flyInDirection)
      setAnimationKey(prev => prev + 1)
      setFlyOutDirection('')
      setRandomSeed(Math.random() * 1000)

      setTimeout(() => {
        setIsTransitioning(false)
      }, ANIMATION_TIMINGS.CARD_FLY_IN_DURATION)
    }, ANIMATION_TIMINGS.CARD_FLY_OUT_DURATION)
  }, [currentPoint, isTransitioning])

  // Handle song end - auto-advance to random adjacent card
  const handleSongEnd = useCallback(() => {
    if (currentPoint === 0) return

    const directions = ['up', 'down', 'left', 'right']
    const shuffled = directions.sort(() => Math.random() - 0.5)

    for (const direction of shuffled) {
      const currentRow = Math.floor(currentPoint / SCROLL_CONFIG.GRID_COLS)
      const currentCol = currentPoint % SCROLL_CONFIG.GRID_COLS

      let candidatePoint = null
      switch (direction) {
        case 'up':
          candidatePoint = ((currentRow + 1) % SCROLL_CONFIG.GRID_ROWS) * SCROLL_CONFIG.GRID_COLS + currentCol
          break
        case 'down':
          candidatePoint = ((currentRow - 1 + SCROLL_CONFIG.GRID_ROWS) % SCROLL_CONFIG.GRID_ROWS) * SCROLL_CONFIG.GRID_COLS + currentCol
          break
        case 'left':
          candidatePoint = currentRow * SCROLL_CONFIG.GRID_COLS + ((currentCol + 1) % SCROLL_CONFIG.GRID_COLS)
          break
        case 'right':
          candidatePoint = currentRow * SCROLL_CONFIG.GRID_COLS + ((currentCol - 1 + SCROLL_CONFIG.GRID_COLS) % SCROLL_CONFIG.GRID_COLS)
          break
      }

      if (candidatePoint !== lastVisitedCard) {
        navigateToDirection(direction)
        return
      }
    }

    navigateToDirection('up')
  }, [currentPoint, lastVisitedCard, navigateToDirection])

  // Audio player with 1.5 second crossfade
  const { playTrack } = useAudioPlayer(1500, handleSongEnd)

  // Play audio when navigating to a new card
  useEffect(() => {
    // Skip audio update if flag is set (e.g., when opening radio card via button)
    if (skipAudioUpdate) {
      setSkipAudioUpdate(false)
      return
    }

    const currentContent = CONTENT_POINTS[currentPoint]
    if (currentContent?.audioFile) {
      playTrack(currentContent.audioFile)
    } else {
      // No audio file (like the radio card), stop playback
      playTrack(null)
    }
  }, [currentPoint, playTrack, skipAudioUpdate])

  // Get current color index and composition from content point
  const currentColorIndex = CONTENT_POINTS[currentPoint].colorIndex
  const currentColorScheme = useMemo(() => getColorScheme(currentColorIndex), [currentColorIndex])
  const currentComposition = useMemo(() => {
    const compositionId = CONTENT_POINTS[currentPoint].composition || 'default'
    return getCompositionState(compositionId)
  }, [currentPoint])

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

  // Optimization #3: Memoize blob light position to prevent recalculation on every render
  const blobLightPosition = useMemo(
    () => getBlobLightPosition(currentPoint),
    [currentPoint, randomSeed]
  )

  // Handle floating radio button click
  const handleRadioButtonClick = useCallback(() => {
    if (currentPoint === 0) return // Already on radio card

    // Set flag to skip audio update
    setSkipAudioUpdate(true)
    setIsTransitioning(true)
    setFlyOutDirection('fly-out-top')

    setTimeout(() => {
      setCurrentPoint(0)
      setTargetRotation(CONTENT_POINTS[0].rotation)
      setAnimationDirection('fly-from-bottom')
      setAnimationKey(prev => prev + 1)
      setRandomSeed(Math.random() * 1000)

      setTimeout(() => {
        setIsTransitioning(false)
        setFlyOutDirection('')
      }, ANIMATION_TIMINGS.CARD_FLY_IN_DURATION)
    }, ANIMATION_TIMINGS.CARD_FLY_OUT_DURATION)
  }, [currentPoint])

  // Memoize wheel handler to prevent recreation on every render
  const handleWheel = useCallback((e) => {
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
    const threshold = SCROLL_CONFIG.THRESHOLD

    if (Math.abs(scrollAccumulator.current.x) > threshold ||
        Math.abs(scrollAccumulator.current.y) > threshold) {

      let direction = ''

      // Determine direction
      if (Math.abs(scrollAccumulator.current.x) > Math.abs(scrollAccumulator.current.y)) {
        // Vertical scrolling (moves between rows, same column)
        direction = scrollAccumulator.current.x > 0 ? 'up' : 'down'
      } else {
        // Horizontal scrolling (moves between columns, same row)
        direction = scrollAccumulator.current.y > 0 ? 'left' : 'right'
      }

      // Reset accumulator immediately
      scrollAccumulator.current = { x: 0, y: 0 }

      navigateToDirection(direction)
    }
  }, [currentPoint, isTransitioning, navigateToDirection])

  // Arrow key handler - matches swipe behavior
  const handleKeyDown = useCallback((e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return
    }

    e.preventDefault()

    if (isTransitioning) {
      return
    }

    const directionMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    }

    navigateToDirection(directionMap[e.key])
  }, [isTransitioning, navigateToDirection])

  useEffect(() => {
    if (isLoading) return

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLoading, handleWheel, handleKeyDown])

  // Initialize rotation and first card animation
  useEffect(() => {
    if (!isLoading && !hasShownFirstContent) {
      setIsTransitioning(true) // Block scrolling during initial animation
      const initialRotation = CONTENT_POINTS[currentPoint].rotation
      setTargetRotation({ x: initialRotation.x, y: initialRotation.y })
      setAnimationDirection('fly-from-bottom')
      setAnimationKey(prev => prev + 1)
      setHasShownFirstContent(true)

      // Allow scrolling after initial fly-in completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, ANIMATION_TIMINGS.CARD_FLY_IN_DURATION)
    }
  }, [isLoading, hasShownFirstContent, currentPoint])

  // Determine if card needs reorientation (when it would be upside down or sideways)
  const needsReorientation = () => {
    const point = CONTENT_POINTS[currentPoint]
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
              position={blobLightPosition}
              intensity={8}
              color={currentColorScheme.primary}
              distance={50}
              decay={0.8}
            />
            <Globe
              targetRotation={targetRotation}
              position={currentComposition.globe.position}
              scale={currentComposition.globe.scale}
              complexity={currentComposition.globe.complexity || 'high'}
            />
          </Suspense>
        </Canvas>

        {/* Blob Lasso */}
        {!isLoading && (
          <BlobLasso
            content={CONTENT_POINTS[currentPoint]}
            isActive={true}
            randomSeed={randomSeed}
            colorIndex={currentColorIndex}
            compositionState={currentComposition}
          />
        )}

        {/* Content Cards */}
        <ContentCard
          key={animationKey}
          content={CONTENT_POINTS[currentPoint]}
          isActive={!isLoading && hasShownFirstContent}
          needsReorientation={needsReorientation()}
          animationDirection={flyOutDirection || animationDirection}
          colorIndex={currentColorIndex}
        />

        {/* Floating Radio Button */}
        <FloatingRadioButton
          isVisible={!isLoading && hasShownFirstContent && currentPoint !== 0}
          onClick={handleRadioButtonClick}
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
