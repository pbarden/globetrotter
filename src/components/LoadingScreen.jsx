import { useEffect, useState, useRef, memo } from 'react'
import './LoadingScreen.css'

// Helper function to morph circle to triangle
const getCircleToTrianglePath = (t) => {
  const centerX = 75
  const centerY = 75
  const radius = 55

  // Circle starting points (3 points equally spaced on circle perimeter)
  const circleTop = { x: centerX, y: centerY - radius }
  const circleBottomLeft = { x: centerX - radius * 0.866, y: centerY + radius * 0.5 }
  const circleBottomRight = { x: centerX + radius * 0.866, y: centerY + radius * 0.5 }

  // Triangle ending points
  const triangleTop = { x: centerX, y: 20 }
  const triangleBottomLeft = { x: 20, y: 130 }
  const triangleBottomRight = { x: 130, y: 130 }

  // Smoothly interpolate the 3 corner points
  const p1 = {
    x: circleTop.x + (triangleTop.x - circleTop.x) * t,
    y: circleTop.y + (triangleTop.y - circleTop.y) * t
  }
  const p2 = {
    x: circleBottomLeft.x + (triangleBottomLeft.x - circleBottomLeft.x) * t,
    y: circleBottomLeft.y + (triangleBottomLeft.y - circleBottomLeft.y) * t
  }
  const p3 = {
    x: circleBottomRight.x + (triangleBottomRight.x - circleBottomRight.x) * t,
    y: circleBottomRight.y + (triangleBottomRight.y - circleBottomRight.y) * t
  }

  // Calculate control points for bezier curves to create smooth circle at t=0
  // For a circle, we need control points offset perpendicular to the radial direction
  // Magic number 0.5522847498 is the optimal bezier constant for circular arcs
  const bezierConstant = 0.5522847498
  const controlDistance = radius * bezierConstant * (1 - t) // Reduce curvature as we approach triangle

  // Control points for the three curved segments
  // From p1 (top) to p2 (bottom-left)
  const cp1_1 = {
    x: p1.x - controlDistance * 0.866 * (1 - t),
    y: p1.y + controlDistance * 0.5 * (1 - t)
  }
  const cp1_2 = {
    x: p2.x + controlDistance * 0.5 * (1 - t),
    y: p2.y - controlDistance * 0.866 * (1 - t)
  }

  // From p2 (bottom-left) to p3 (bottom-right)
  const cp2_1 = {
    x: p2.x + controlDistance * 0.5 * (1 - t),
    y: p2.y + controlDistance * 0.5 * (1 - t)
  }
  const cp2_2 = {
    x: p3.x - controlDistance * 0.5 * (1 - t),
    y: p3.y + controlDistance * 0.5 * (1 - t)
  }

  // From p3 (bottom-right) to p1 (top)
  const cp3_1 = {
    x: p3.x + controlDistance * 0.866 * (1 - t),
    y: p3.y - controlDistance * 0.5 * (1 - t)
  }
  const cp3_2 = {
    x: p1.x + controlDistance * (1 - t),
    y: p1.y + controlDistance * (1 - t)
  }

  // Use cubic bezier (C) for better circle approximation
  return `M ${p1.x} ${p1.y}
          C ${cp1_1.x} ${cp1_1.y}, ${cp1_2.x} ${cp1_2.y}, ${p2.x} ${p2.y}
          C ${cp2_1.x} ${cp2_1.y}, ${cp2_2.x} ${cp2_2.y}, ${p3.x} ${p3.y}
          C ${cp3_1.x} ${cp3_1.y}, ${cp3_2.x} ${cp3_2.y}, ${p1.x} ${p1.y} Z`
}

// Helper function to morph triangle to square
const getTriangleToSquarePath = (t) => {
  // Triangle starting points (3 corners)
  const triangleTop = { x: 75, y: 20 }
  const triangleBottomLeft = { x: 20, y: 130 }
  const triangleBottomRight = { x: 130, y: 130 }

  // Square ending points (4 corners)
  const squareTopLeft = { x: 20, y: 20 }
  const squareTopRight = { x: 130, y: 20 }
  const squareBottomLeft = { x: 20, y: 130 }
  const squareBottomRight = { x: 130, y: 130 }

  // Top of triangle splits into two corners of square
  const p1 = {
    x: triangleTop.x + (squareTopLeft.x - triangleTop.x) * t,
    y: triangleTop.y + (squareTopLeft.y - triangleTop.y) * t
  }
  const p2 = {
    x: triangleTop.x + (squareTopRight.x - triangleTop.x) * t,
    y: triangleTop.y + (squareTopRight.y - triangleTop.y) * t
  }

  // Bottom corners stay mostly in place
  const p3 = {
    x: triangleBottomRight.x + (squareBottomRight.x - triangleBottomRight.x) * t,
    y: triangleBottomRight.y + (squareBottomRight.y - triangleBottomRight.y) * t
  }
  const p4 = {
    x: triangleBottomLeft.x + (squareBottomLeft.x - triangleBottomLeft.x) * t,
    y: triangleBottomLeft.y + (squareBottomLeft.y - triangleBottomLeft.y) * t
  }

  // Use slight curves early on, then straighten to sharp corners
  const curveAmount = 5 * (1 - t)

  if (t < 0.5) {
    // Early transition: still curved
    return `M ${p1.x} ${p1.y}
            Q ${(p1.x + p2.x) / 2} ${p1.y - curveAmount} ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            Q ${(p3.x + p4.x) / 2} ${p3.y + curveAmount} ${p4.x} ${p4.y}
            L ${p1.x} ${p1.y} Z`
  } else {
    // Later transition: sharp lines
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`
  }
}

// Helper function to morph square back to circle
const getSquareToCirclePath = (t) => {
  const centerX = 75
  const centerY = 75
  const radius = 55

  // Square points (4 corners)
  const squareTopLeft = { x: 20, y: 20 }
  const squareTopRight = { x: 130, y: 20 }
  const squareBottomLeft = { x: 20, y: 130 }
  const squareBottomRight = { x: 130, y: 130 }

  // Circle points (4 points equally spaced on circle)
  const circleTop = { x: centerX, y: centerY - radius }
  const circleRight = { x: centerX + radius, y: centerY }
  const circleBottom = { x: centerX, y: centerY + radius }
  const circleLeft = { x: centerX - radius, y: centerY }

  if (t > 0.99) {
    // Perfect circle at end to seamlessly loop back to start
    return `M ${centerX} ${centerY - radius}
            A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}
            A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius}
            A ${radius} ${radius} 0 0 1 ${centerX - radius} ${centerY}
            A ${radius} ${radius} 0 0 1 ${centerX} ${centerY - radius} Z`
  }

  // Interpolate 4 corners of square to 4 points on circle
  const p1 = {
    x: squareTopLeft.x + (circleTop.x - squareTopLeft.x) * t,
    y: squareTopLeft.y + (circleTop.y - squareTopLeft.y) * t
  }
  const p2 = {
    x: squareTopRight.x + (circleRight.x - squareTopRight.x) * t,
    y: squareTopRight.y + (circleRight.y - squareTopRight.y) * t
  }
  const p3 = {
    x: squareBottomRight.x + (circleBottom.x - squareBottomRight.x) * t,
    y: squareBottomRight.y + (circleBottom.y - squareBottomRight.y) * t
  }
  const p4 = {
    x: squareBottomLeft.x + (circleLeft.x - squareBottomLeft.x) * t,
    y: squareBottomLeft.y + (circleLeft.y - squareBottomLeft.y) * t
  }

  // Gradually increase curve amount to round out the corners
  // Early: straight lines (square), Late: strong curves (circle)
  const curveStrength = t * t // Quadratic easing for smooth curve introduction
  const curve = radius * 0.5 * curveStrength

  return `M ${p1.x} ${p1.y}
          Q ${p1.x + curve} ${p1.y - curve * 0.3} ${p2.x} ${p2.y}
          Q ${p2.x + curve * 0.3} ${p2.y + curve} ${p3.x} ${p3.y}
          Q ${p3.x - curve} ${p3.y + curve * 0.3} ${p4.x} ${p4.y}
          Q ${p4.x - curve * 0.3} ${p4.y - curve} ${p1.x} ${p1.y} Z`
}

function LoadingScreenComponent({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [showTapToContinue, setShowTapToContinue] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [, forceUpdate] = useState({})
  const animationTimeRef = useRef(0)
  const lastFrameTimeRef = useRef(performance.now())
  const svgRef = useRef(null)
  const audioRef = useRef(null)

  // Optimized animation loop for morphing shape
  useEffect(() => {
    let animationFrameId

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastFrameTimeRef.current
      lastFrameTimeRef.current = currentTime

      // Only update animation time if not paused
      if (!isPaused) {
        animationTimeRef.current += deltaTime

        // Force update only every 2 frames (30fps instead of 60fps for better performance)
        if (Math.floor(animationTimeRef.current / 33) !== Math.floor((animationTimeRef.current - deltaTime) / 33)) {
          forceUpdate({})
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPaused])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let progressAnimationId
    let loadingComplete = false
    let lastProgressUpdate = 0
    let shouldContinue = true

    const checkResources = async () => {
      // Wait for critical resources
      const promises = []

      // Wait for document ready
      if (document.readyState !== 'complete') {
        promises.push(new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true })
        }))
      }

      // Simulate minimum loading time to show animation
      promises.push(new Promise(resolve => setTimeout(resolve, 1500)))

      await Promise.all(promises)
      loadingComplete = true
    }

    // Start resource checking
    checkResources()

    // Progress animation using requestAnimationFrame
    const animateProgress = (timestamp) => {
      // Update every ~30ms (similar to setInterval behavior)
      if (timestamp - lastProgressUpdate > 30) {
        lastProgressUpdate = timestamp

        setProgress((prev) => {
          if (loadingComplete && prev >= 100) {
            setShowTapToContinue(true)
            setIsPaused(true) // Pause the morphing animation
            shouldContinue = false
            return 100
          }
          // Slow down progress near 100 if resources aren't ready
          const increment = (loadingComplete || prev < 90) ? 2 : 0.5
          return Math.min(prev + increment, loadingComplete ? 100 : 95)
        })
      }

      // Continue animation if not complete
      if (shouldContinue) {
        progressAnimationId = requestAnimationFrame(animateProgress)
      }
    }

    progressAnimationId = requestAnimationFrame(animateProgress)

    return () => {
      if (progressAnimationId) cancelAnimationFrame(progressAnimationId)
    }
  }, [onLoadComplete])

  // Handle tap to continue
  const handleContinue = () => {
    if (showTapToContinue) {
      // Play boot sound on user interaction
      const audio = new Audio('/audio/Boot.mp3')
      audioRef.current = audio
      audio.play().catch((error) => {
        console.log('Audio playback failed:', error.message)
      })

      setIsReady(true)
      setTimeout(() => onLoadComplete(), 1500)
    }
  }

  return (
    <div className={`loading-screen ${isReady ? 'fade-out' : ''}`} onClick={handleContinue}>
      <div className="loading-content">
        <div className="loading-globe">
          {/* Morphing shape animation - loops infinitely */}
          <div className="morphing-shape-container">
            <svg ref={svgRef} width="150" height="150" viewBox="0 0 150 150" className="morphing-svg">
              <defs>
                <filter id="neon-glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {(() => {
                // Calculate which phase we're in (faster loop - 1.5 seconds per full cycle)
                const loopProgress = (animationTimeRef.current / 15) % 100 // Loop every 1.5 seconds
                const phase = loopProgress

                // Add brief pauses at the end of each transition (morph in 90% of phase, pause for 10%)
                const pausePercentage = 10 // 10% of each phase is pause
                const morphPercentage = 100 - pausePercentage

                let pathData
                if (phase < 33) {
                  // Circle to Triangle morph (0-33%)
                  const phaseProgress = (phase / 33) * 100
                  const t = phaseProgress <= morphPercentage ? (phaseProgress / morphPercentage) : 1
                  pathData = getCircleToTrianglePath(t)
                } else if (phase < 66) {
                  // Triangle to Square morph (33-66%)
                  const phaseProgress = ((phase - 33) / 33) * 100
                  const t = phaseProgress <= morphPercentage ? (phaseProgress / morphPercentage) : 1
                  pathData = getTriangleToSquarePath(t)
                } else {
                  // Square to Circle morph (66-100%)
                  const phaseProgress = ((phase - 66) / 34) * 100
                  const t = phaseProgress <= morphPercentage ? (phaseProgress / morphPercentage) : 1
                  pathData = getSquareToCirclePath(t)
                }

                return (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#6a5acd"
                    strokeWidth="3"
                    filter="url(#neon-glow)"
                    className={isPaused ? 'trace-animation' : ''}
                  />
                )
              })()}
            </svg>
          </div>
        </div>
        <h1 className="loading-title">moon man digital</h1>
        <p className="loading-subtitle">presents</p>
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }}></div>
        </div>
        {showTapToContinue ? (
          <p className="tap-to-continue">tap to continue</p>
        ) : (
          <p className="loading-text">{progress}%</p>
        )}
      </div>
    </div>
  )
}

export const LoadingScreen = memo(LoadingScreenComponent)
