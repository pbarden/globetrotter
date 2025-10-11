import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { SimplifiedGlobe } from './SimplifiedGlobe'
import { positionPlanetInQuadrant, getQuadrant, normalizedToScreen } from '../../configs/quadrantLayout'
import * as THREE from 'three'

/**
 * Individual planet in the 3D scene
 */
function Planet3D({ planet, onHover, onUnhover, onClick, isAnimating }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { viewport } = useThree()

  useFrame(() => {
    if (meshRef.current && planet.position) {
      // Convert screen position to 3D world position
      const newX = (planet.position.x / window.innerWidth - 0.5) * viewport.width
      const newY = -(planet.position.y / window.innerHeight - 0.5) * viewport.height

      meshRef.current.position.x = newX
      meshRef.current.position.y = newY

      // Rotate based on velocity (pool ball rolling effect)
      if (planet.velocity) {
        meshRef.current.rotation.x += planet.velocity.y * 0.00005
        meshRef.current.rotation.y += planet.velocity.x * 0.00005
      }

      // Gentle rotation when hovered
      if (hovered) {
        meshRef.current.rotation.y += 0.01
      }
    }
  })

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (!isAnimating) {
      setHovered(true)
      onHover?.()
    }
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    onUnhover?.()
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (!isAnimating) {
      onClick?.(planet)
    }
  }

  // Convert pixel radius to world space scale
  const worldScale = planet.radius ? (planet.radius / window.innerHeight) * viewport.height * 0.01 : 0.5

  return (
    <group
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* The actual globe sphere */}
      <SimplifiedGlobe
        scale={worldScale}
        rotation={meshRef.current?.rotation}
      />

      {/* Glow effect */}
      {hovered && (
        <mesh scale={worldScale * 1.2}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#6a5acd"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* HTML label */}
      {hovered && (
        <Html
          position={[0, -worldScale * 1.3, 0]}
          center
          style={{
            pointerEvents: 'none',
            transition: 'opacity 0.3s'
          }}
        >
          <div className="planet-label-3d">
            <span>{planet.name}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

/**
 * PlanetMapScene - Manages all planets in unified 3D space with physics
 */
export function PlanetMapScene({ globes, onPlanetClick }) {
  const [planets, setPlanets] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isRollingOff, setIsRollingOff] = useState(false)
  const physicsRef = useRef(null)
  const animationStartTime = useRef(null)

  // Initialize planets
  useEffect(() => {
    if (!globes || globes.length === 0) return

    const dimensions = { width: window.innerWidth, height: window.innerHeight }
    const positionedPlanets = []

    globes.forEach((globe, index) => {
      const quadrant = getQuadrant(globe.quadrant)
      const baseRadius = 150
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

      // Start position (off screen)
      const side = Math.floor(Math.random() * 4)
      let startX, startY

      switch (side) {
        case 0: // Top
          startX = Math.random() * dimensions.width
          startY = -planetRadius * 2
          break
        case 1: // Right
          startX = dimensions.width + planetRadius * 2
          startY = Math.random() * dimensions.height
          break
        case 2: // Bottom
          startX = Math.random() * dimensions.width
          startY = dimensions.height + planetRadius * 2
          break
        case 3: // Left
          startX = -planetRadius * 2
          startY = Math.random() * dimensions.height
          break
        default:
          startX = dimensions.width / 2
          startY = -planetRadius * 2
      }

      // Calculate initial velocity toward target
      const dx = screenPos.x - startX
      const dy = screenPos.y - startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const speed = 800 + Math.random() * 400

      positionedPlanets.push({
        id: globe.id,
        name: globe.name,
        size: globe.size,
        config: globe,
        position: { x: startX, y: startY },
        targetPosition: screenPos,
        velocity: {
          x: (dx / distance) * speed,
          y: (dy / distance) * speed
        },
        radius: planetRadius,
        scale: sizeMultiplier,
        mass: sizeMultiplier,
        isSettled: false
      })
    })

    setPlanets(positionedPlanets)
    setIsAnimating(true)
    animationStartTime.current = performance.now()
  }, [globes])

  // Physics update loop
  useFrame((state, delta) => {
    if (isRollingOff) {
      // Roll-off animation
      setPlanets(prev => prev.map(p => ({
        ...p,
        position: {
          x: p.position.x,
          y: p.position.y + 1500 * delta
        },
        velocity: {
          x: p.velocity.x,
          y: p.velocity.y + 2000 * delta // Gravity acceleration
        }
      })))
      return
    }

    if (!isAnimating) return

    const elapsed = performance.now() - animationStartTime.current
    const maxDuration = 2000 // Faster: 2 seconds max

    setPlanets(prev => {
      const updated = prev.map(planet => {
        if (planet.isSettled) return planet

        // Check if close to target - settle faster
        const dx = planet.targetPosition.x - planet.position.x
        const dy = planet.targetPosition.y - planet.position.y
        const distToTarget = Math.sqrt(dx * dx + dy * dy)

        // If close to target or time's up, ease to target
        if (distToTarget < 50 || elapsed > maxDuration * 0.6) {
          const easeSpeed = 0.15
          const newX = planet.position.x + dx * easeSpeed
          const newY = planet.position.y + dy * easeSpeed

          if (distToTarget < 2) {
            return {
              ...planet,
              position: { x: planet.targetPosition.x, y: planet.targetPosition.y },
              velocity: { x: 0, y: 0 },
              isSettled: true
            }
          }

          return {
            ...planet,
            position: { x: newX, y: newY },
            velocity: { x: dx * easeSpeed, y: dy * easeSpeed }
          }
        }

        // Physics movement
        const friction = 0.97
        const newVelX = planet.velocity.x * friction
        const newVelY = planet.velocity.y * friction
        const newX = planet.position.x + newVelX * delta
        const newY = planet.position.y + newVelY * delta

        // Boundary bounce
        let finalVelX = newVelX
        let finalVelY = newVelY
        let finalX = newX
        let finalY = newY

        const restitution = 0.6

        if (newX - planet.radius < 0) {
          finalX = planet.radius
          finalVelX = Math.abs(newVelX) * restitution
        } else if (newX + planet.radius > window.innerWidth) {
          finalX = window.innerWidth - planet.radius
          finalVelX = -Math.abs(newVelX) * restitution
        }

        if (newY - planet.radius < 0) {
          finalY = planet.radius
          finalVelY = Math.abs(newVelY) * restitution
        } else if (newY + planet.radius > window.innerHeight) {
          finalY = window.innerHeight - planet.radius
          finalVelY = -Math.abs(newVelY) * restitution
        }

        return {
          ...planet,
          position: { x: finalX, y: finalY },
          velocity: { x: finalVelX, y: finalVelY }
        }
      })

      // Check if all settled
      if (updated.every(p => p.isSettled)) {
        setIsAnimating(false)
      }

      return updated
    })
  })

  const handlePlanetClick = (planet) => {
    if (isAnimating || isRollingOff) return

    setIsRollingOff(true)

    // After roll-off, navigate
    setTimeout(() => {
      onPlanetClick?.(planet.config)
    }, 800)
  }

  return (
    <>
      {planets.map(planet => (
        <Planet3D
          key={planet.id}
          planet={planet}
          isAnimating={isAnimating || isRollingOff}
          onClick={handlePlanetClick}
        />
      ))}
    </>
  )
}
