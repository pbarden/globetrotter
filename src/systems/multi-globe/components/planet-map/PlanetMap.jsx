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

      // Random start position off screen
      const side = Math.floor(Math.random() * 4)
      let startX, startY

      switch (side) {
        case 0: startX = Math.random() * dimensions.width; startY = -planetRadius * 3; break
        case 1: startX = dimensions.width + planetRadius * 3; startY = Math.random() * dimensions.height; break
        case 2: startX = Math.random() * dimensions.width; startY = dimensions.height + planetRadius * 3; break
        case 3: startX = -planetRadius * 3; startY = Math.random() * dimensions.height; break
        default: startX = dimensions.width / 2; startY = -planetRadius * 3;
      }

      positionedPlanets.push({
        id: globe.id,
        name: globe.name,
        size: globe.size,
        config: globe,
        position: { x: startX, y: startY },
        targetPosition: screenPos,
        radius: planetRadius,
        scale: sizeMultiplier,
        rotation: 0
      })
    })

    setPlanetPositions(positionedPlanets)

    // Start animation
    const startTime = performance.now()
    const duration = 1500 // 1.5 seconds

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      setPlanetPositions(prev => prev.map(planet => {
        const dx = planet.targetPosition.x - planet.position.x
        const dy = planet.targetPosition.y - planet.position.y

        // Calculate new position
        const newX = planet.position.x + dx * 0.08
        const newY = planet.position.y + dy * 0.08

        // Calculate rotation based on movement
        const moveDistance = Math.sqrt(dx * dx + dy * dy)
        const rotationIncrement = moveDistance * 0.002

        return {
          ...planet,
          position: progress < 1 ? { x: newX, y: newY } : planet.targetPosition,
          rotation: planet.rotation + rotationIncrement
        }
      }))

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [globes])

  // Handle planet click
  const handlePlanetClick = (planet) => {
    if (isAnimating || isRollingOff) return

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
        rotation: p.rotation + easeProgress * 10
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
          />
        ))}
      </div>

      {/* Instructions */}
      {!isAnimating && !isRollingOff && (
        <div className="planet-map-instructions">
          <p>Click on any planet to explore</p>
        </div>
      )}
    </div>
  )
}

export default PlanetMap
