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

      // Tumble like dice based on angular velocity
      if (planet.angularVelocity && isAnimating) {
        meshRef.current.rotation.x += planet.angularVelocity.x
        meshRef.current.rotation.y += planet.angularVelocity.y
        meshRef.current.rotation.z += planet.angularVelocity.z
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
        size={planet.size}
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

      // NO ANIMATION - planets start at target position immediately
      positionedPlanets.push({
        id: globe.id,
        name: globe.name,
        size: globe.size,
        config: globe,
        position: screenPos, // Start at target, not off-screen
        targetPosition: screenPos,
        velocity: { x: 0, y: 0 }, // No velocity
        angularVelocity: { x: 0, y: 0, z: 0 },
        radius: planetRadius,
        scale: sizeMultiplier,
        mass: sizeMultiplier,
        bounceCount: 0,
        isSettled: true // Already settled, no animation
      })
    })

    setPlanets(positionedPlanets)
    setIsAnimating(false) // No animation needed
    animationStartTime.current = performance.now()
  }, [globes])

  // Physics update loop - simple roll in with tumbling
  useFrame((state, delta) => {
    if (isRollingOff) {
      setPlanets(prev => prev.map(p => ({
        ...p,
        position: {
          x: p.position.x,
          y: p.position.y + 1500 * delta
        },
        velocity: {
          x: p.velocity.x,
          y: p.velocity.y + 2000 * delta
        }
      })))
      return
    }

    if (!isAnimating) return

    setPlanets(prev => {
      const next = []

      for (let i = 0; i < prev.length; i++) {
        const p = prev[i]

        if (p.isSettled) {
          next.push(p)
          continue
        }

        const vel = Math.sqrt(p.velocity.x ** 2 + p.velocity.y ** 2)
        const angVel = Math.sqrt(p.angularVelocity.x ** 2 + p.angularVelocity.y ** 2 + p.angularVelocity.z ** 2)

        // Settle when nearly stopped - don't snap to target, just stop where they are
        if (vel < 2 && angVel < 0.001) {
          next.push({
            ...p,
            velocity: { x: 0, y: 0 },
            angularVelocity: { x: 0, y: 0, z: 0 },
            isSettled: true
          })
          continue
        }

        // Apply friction
        const friction = 0.96
        const newVelX = p.velocity.x * friction
        const newVelY = p.velocity.y * friction

        // Update position
        const newX = p.position.x + newVelX * delta
        const newY = p.position.y + newVelY * delta

        // Angular velocity decays proportional to linear velocity for smooth stop
        const velocityFactor = Math.max(0, Math.min(1, vel / 500))
        const angularFriction = 0.85 - (0.3 * (1 - velocityFactor)) // 0.85 when fast, 0.55 when slow

        const newAngularVelocity = {
          x: p.angularVelocity.x * angularFriction,
          y: p.angularVelocity.y * angularFriction,
          z: p.angularVelocity.z * angularFriction
        }

        next.push({
          ...p,
          position: { x: newX, y: newY },
          velocity: { x: newVelX, y: newVelY },
          angularVelocity: newAngularVelocity
        })
      }

      // Check if all settled
      if (next.every(p => p.isSettled)) {
        setIsAnimating(false)
      }

      return next
    })
  })

  const handlePlanetClick = (planet) => {
    if (isAnimating || isRollingOff) return

    setIsRollingOff(true)

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
