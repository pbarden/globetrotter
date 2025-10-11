import { useState, useEffect, useRef } from 'react'
import { PlanetInstance } from './PlanetInstance'
import { positionPlanetInQuadrant, getQuadrant, normalizedToScreen } from '../../configs/quadrantLayout'
import './PlanetMap.css'

/**
 * PlanetMap - Simple 2D planet map with rolling animation
 */
function PlanetMap({ globes, onPlanetClick, transitionType = '' }) {
  const [planetPositions, setPlanetPositions] = useState([])
  const [isAnimating, setIsAnimating] = useState(true)
  const [isRollingOff, setIsRollingOff] = useState(false)
  const [selectedPlanetId, setSelectedPlanetId] = useState(null)
  const animationFrame = useRef(null)
  const rafIds = useRef([]) // Track all RAF IDs for cleanup
  const timeoutIds = useRef([]) // Track all timeout IDs for cleanup
  const dimensions = { width: window.innerWidth, height: window.innerHeight }

  // Initialize planets
  useEffect(() => {
    if (!globes || globes.length === 0) return

    // Clear any existing animations
    rafIds.current.forEach(id => cancelAnimationFrame(id))
    timeoutIds.current.forEach(id => clearTimeout(id))
    rafIds.current = []
    timeoutIds.current = []

    const positionedPlanets = []

    globes.forEach((globe) => {
      const quadrant = getQuadrant(globe.quadrant)
      const baseRadius = 200
      const sizeMultiplier = {
        tiny: 0.6,
        small: 0.8,
        medium: 1.0,
        large: 1.2
      }[globe.size] || 1.0

      const planetRadius = baseRadius * sizeMultiplier

      // Calculate target position
      const normalizedPos = positionPlanetInQuadrant(quadrant, planetRadius / dimensions.width, positionedPlanets)
      const screenPos = normalizedToScreen(normalizedPos, dimensions.width, dimensions.height)

      // Start position above screen
      const startY = screenPos.y - dimensions.height - 200

      positionedPlanets.push({
        id: globe.id,
        name: globe.name,
        size: globe.size,
        config: globe,
        position: { x: screenPos.x, y: startY }, // Start above screen
        targetPosition: screenPos,
        originalPosition: screenPos,
        radius: planetRadius,
        scale: sizeMultiplier,
        rotation: Math.random() * Math.PI * 2, // FIXED rotation - does not change
        staggerIndex: positionedPlanets.length,
        isSettled: false, // Track if this planet has finished animating
        showColors: false // Start as wireframe only
      })
    })

    setPlanetPositions(positionedPlanets)
    setIsAnimating(true)

    // Animate each planet with stagger - match roll-off speed
    const dropDuration = 600 // Match roll-off duration
    const settleDuration = 250
    const staggerDelay = 300 // Faster stagger between planets

    positionedPlanets.forEach((planet, index) => {
      const timeoutId = setTimeout(() => {
        let dropStartTime = null

        const animateDrop = (currentTime) => {
          if (!dropStartTime) dropStartTime = currentTime
          const elapsed = currentTime - dropStartTime
          const progress = Math.min(elapsed / dropDuration, 1)
          const easeProgress = progress * progress // Ease in

          const startY = planet.position.y
          const targetY = planet.targetPosition.y
          const distance = targetY - startY
          const currentY = startY + distance * easeProgress

          setPlanetPositions(prev => prev.map(p => {
            if (p.id !== planet.id) return p

            return {
              ...p,
              position: { x: p.targetPosition.x, y: currentY },
              rotation: p.rotation // Keep rotation CONSTANT
            }
          }))

          if (progress < 1) {
            const rafId = requestAnimationFrame(animateDrop)
            rafIds.current.push(rafId)
          } else {
            // Start settle animation - overshoot then bounce back
            let settleStartTime = null
            const overshootAmount = 50 // Increased for more noticeable effect

            const animateSettle = (currentTime) => {
              if (!settleStartTime) settleStartTime = currentTime
              const elapsed = currentTime - settleStartTime
              const progress = Math.min(elapsed / settleDuration, 1)

              // Bounce: go down first, then back up
              // Use sine wave to create smooth bounce effect
              const overshoot = Math.sin(progress * Math.PI) * overshootAmount

              setPlanetPositions(prev => prev.map(p => {
                if (p.id !== planet.id) return p

                return {
                  ...p,
                  position: { x: p.targetPosition.x, y: p.targetPosition.y + overshoot },
                  rotation: p.rotation // Keep rotation CONSTANT
                }
              }))

              if (progress < 1) {
                const rafId = requestAnimationFrame(animateSettle)
                rafIds.current.push(rafId)
              } else {
                // Mark this planet as settled and show colors - it can start rotating now
                setPlanetPositions(prev => prev.map(p => {
                  if (p.id !== planet.id) return p
                  return { ...p, isSettled: true, showColors: true }
                }))

                // Check if this is the last planet to turn off global animation state
                if (index === positionedPlanets.length - 1) {
                  const finalTimeoutId = setTimeout(() => setIsAnimating(false), 100)
                  timeoutIds.current.push(finalTimeoutId)
                }
              }
            }

            const rafId = requestAnimationFrame(animateSettle)
            rafIds.current.push(rafId)
          }
        }

        const rafId = requestAnimationFrame(animateDrop)
        rafIds.current.push(rafId)
      }, index * staggerDelay)
      timeoutIds.current.push(timeoutId)
    })

    // Cleanup function
    return () => {
      rafIds.current.forEach(id => cancelAnimationFrame(id))
      timeoutIds.current.forEach(id => clearTimeout(id))
      rafIds.current = []
      timeoutIds.current = []
    }
  }, [globes])

  // Handle planet click - two-tap logic
  const handlePlanetClick = (planet) => {
    if (isAnimating || isRollingOff) return

    // If clicking the already selected planet, confirm and proceed
    if (selectedPlanetId === planet.id) {
      setIsRollingOff(true)

      let startTime = null
      const duration = 600

      const animateRollOff = (currentTime) => {
        if (!startTime) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease in (gravity acceleration)
        const easeProgress = progress * progress

        setPlanetPositions(prev => prev.map(p => ({
          ...p,
          position: {
            x: p.position.x,
            y: p.position.y + (dimensions.height + 300) * easeProgress
          },
          rotation: p.rotation + easeProgress * 2
        })))

        if (progress < 1) {
          const rafId = requestAnimationFrame(animateRollOff)
          rafIds.current.push(rafId)
        } else {
          const timeoutId = setTimeout(() => {
            if (onPlanetClick) {
              onPlanetClick(planet.config)
            }
          }, 100)
          timeoutIds.current.push(timeoutId)
        }
      }

      const rafId = requestAnimationFrame(animateRollOff)
      rafIds.current.push(rafId)
    } else {
      // First tap - select this planet
      setSelectedPlanetId(planet.id)

      // Calculate selected planet's display position and size (using original position)
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2
      const selectedDisplayX = planet.originalPosition.x + (centerX - planet.originalPosition.x) * 0.7
      const selectedDisplayY = planet.originalPosition.y + (centerY - planet.originalPosition.y) * 0.7
      const selectedScaledRadius = planet.radius * 1.6

      setPlanetPositions(prev => prev.map(p => {
        // First restore all planets to original position
        const restoredP = {
          ...p,
          position: { ...p.originalPosition }
        }

        if (restoredP.id === planet.id) return restoredP

        // Check if this planet overlaps with selected planet at its new position
        const dx = restoredP.position.x - selectedDisplayX
        const dy = restoredP.position.y - selectedDisplayY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = selectedScaledRadius + restoredP.radius + 50 // Extra padding

        if (distance < minDistance) {
          // Push away from selected planet
          const angle = Math.atan2(dy, dx)
          const pushDistance = minDistance - distance
          let newX = restoredP.position.x + Math.cos(angle) * pushDistance
          let newY = restoredP.position.y + Math.sin(angle) * pushDistance

          // Clamp to screen bounds with padding
          const padding = restoredP.radius + 50
          newX = Math.max(padding, Math.min(dimensions.width - padding, newX))
          newY = Math.max(padding, Math.min(dimensions.height - padding, newY))

          return {
            ...restoredP,
            position: {
              x: newX,
              y: newY
            }
          }
        }

        return restoredP
      }))
    }
  }

  return (
    <div className={`planet-map ${transitionType}`}>
      {/* Background gradient */}
      <div className="planet-map-background"></div>

      {/* Title */}
      <div className="planet-map-title">
        <h1>Planet Map</h1>
        <p>Choose your destination</p>
      </div>

      {/* Planets */}
      <div className="planets-container">
        {planetPositions.map((planet) => (
          <PlanetInstance
            key={planet.id}
            planet={planet}
            onClick={() => handlePlanetClick(planet)}
            isAnimating={!planet.isSettled || isRollingOff}
            isSelected={selectedPlanetId === planet.id}
          />
        ))}
      </div>

      {/* Instructions */}
      {!isAnimating && !isRollingOff && (
        <div className="planet-map-instructions">
          <p>{selectedPlanetId ? 'Tap again to continue' : 'Select a planet to explore'}</p>
        </div>
      )}
    </div>
  )
}

export default PlanetMap
