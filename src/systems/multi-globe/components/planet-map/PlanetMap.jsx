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
  const dimensions = { width: window.innerWidth, height: window.innerHeight }

  // Initialize planets
  useEffect(() => {
    if (!globes || globes.length === 0) return

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

      positionedPlanets.push({
        id: globe.id,
        name: globe.name,
        size: globe.size,
        config: globe,
        position: screenPos, // Start at final position - no fly-in
        targetPosition: screenPos,
        originalPosition: screenPos,
        radius: planetRadius,
        scale: sizeMultiplier,
        rotation: Math.random() * Math.PI * 2
      })
    })

    setPlanetPositions(positionedPlanets)
    setIsAnimating(false) // No animation - planets appear instantly
  }, [globes])

  // Handle planet click - two-tap logic
  const handlePlanetClick = (planet) => {
    if (isAnimating || isRollingOff) return

    // If clicking the already selected planet, confirm and proceed
    if (selectedPlanetId === planet.id) {
      setIsRollingOff(true)

      const startTime = performance.now()
      const duration = 600

      const animateRollOff = (currentTime) => {
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
          requestAnimationFrame(animateRollOff)
        } else {
          setTimeout(() => {
            if (onPlanetClick) {
              onPlanetClick(planet.config)
            }
          }, 100)
        }
      }

      requestAnimationFrame(animateRollOff)
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
            isAnimating={isAnimating || isRollingOff}
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
