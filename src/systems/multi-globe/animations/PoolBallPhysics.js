// Pool Ball Physics Animation System
// Simulates pool ball-style entry animation for planets on first map visit

import { resolveCollision, resolveBoundaryCollision, separateCircles } from '../utils/collisionDetection'

// Physics configuration
export const physicsConfig = {
  initialSpeed: { min: 200, max: 500 }, // pixels/second
  launchAngle: { min: 0, max: 360 }, // degrees
  friction: 0.98, // Velocity multiplier per frame
  restitution: 0.7, // Bounciness (0-1)
  minVelocity: 5, // Stop when slower than this
  collisionDamping: 0.85, // Energy lost in collisions
  settleDuration: 3000, // Max time to settle (ms)
  staggerDelay: 100 // Delay between each planet launch
}

/**
 * Create initial planet state with off-screen position and random velocity
 */
export function createPlanetPhysicsState(planetConfig, index, screenWidth, screenHeight, planetRadius) {
  const angle = Math.random() * Math.PI * 2
  const speed = physicsConfig.initialSpeed.min +
                Math.random() * (physicsConfig.initialSpeed.max - physicsConfig.initialSpeed.min)

  // Use existing position if provided (already off-screen), otherwise create new
  let startX, startY

  if (planetConfig.position) {
    startX = planetConfig.position.x
    startY = planetConfig.position.y
  } else {
    // Fallback: create new off-screen position
    const side = Math.floor(Math.random() * 4)
    switch (side) {
      case 0: // Top
        startX = Math.random() * screenWidth
        startY = -planetRadius * 2
        break
      case 1: // Right
        startX = screenWidth + planetRadius * 2
        startY = Math.random() * screenHeight
        break
      case 2: // Bottom
        startX = Math.random() * screenWidth
        startY = screenHeight + planetRadius * 2
        break
      case 3: // Left
        startX = -planetRadius * 2
        startY = Math.random() * screenHeight
        break
      default:
        startX = screenWidth / 2
        startY = -planetRadius * 2
    }
  }

  // Calculate velocity direction towards center of screen
  const centerX = screenWidth / 2
  const centerY = screenHeight / 2
  const towardsCenterAngle = Math.atan2(centerY - startY, centerX - startX)

  // Add some randomness to the angle (±45 degrees)
  const randomAngle = towardsCenterAngle + (Math.random() - 0.5) * (Math.PI / 2)

  return {
    id: planetConfig.id,
    position: { x: startX, y: startY },
    velocity: {
      x: Math.cos(randomAngle) * speed,
      y: Math.sin(randomAngle) * speed
    },
    radius: planetRadius,
    mass: 1,
    targetPosition: planetConfig.targetPosition, // Final position after settling
    isSettled: false,
    launchDelay: index * physicsConfig.staggerDelay
  }
}

/**
 * Update physics simulation for one frame
 */
export function updatePhysics(planets, deltaTime, bounds) {
  const dt = deltaTime / 1000 // Convert to seconds

  // Update positions and velocities
  planets.forEach(planet => {
    if (planet.isSettled) return

    // Update position
    planet.position.x += planet.velocity.x * dt
    planet.position.y += planet.velocity.y * dt

    // Apply friction
    planet.velocity.x *= physicsConfig.friction
    planet.velocity.y *= physicsConfig.friction

    // Check if velocity is below minimum (settled)
    const speed = Math.sqrt(
      planet.velocity.x * planet.velocity.x +
      planet.velocity.y * planet.velocity.y
    )

    if (speed < physicsConfig.minVelocity) {
      planet.isSettled = true
      planet.velocity.x = 0
      planet.velocity.y = 0
    }
  })

  // Handle collisions between planets
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i]
      const p2 = planets[j]

      if (p1.isSettled && p2.isSettled) continue

      const dx = p2.position.x - p1.position.x
      const dy = p2.position.y - p1.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Check collision
      if (distance < p1.radius + p2.radius) {
        // Separate overlapping circles
        const separated = separateCircles(
          p1.position,
          p1.radius,
          p2.position,
          p2.radius
        )

        p1.position = separated.pos1
        p2.position = separated.pos2

        // Calculate collision response
        const collision = resolveCollision(
          {
            position: p1.position,
            velocity: p1.velocity,
            mass: p1.mass
          },
          {
            position: p2.position,
            velocity: p2.velocity,
            mass: p2.mass
          },
          physicsConfig.restitution
        )

        // Apply collision damping
        p1.velocity.x = collision.vel1.x * physicsConfig.collisionDamping
        p1.velocity.y = collision.vel1.y * physicsConfig.collisionDamping
        p2.velocity.x = collision.vel2.x * physicsConfig.collisionDamping
        p2.velocity.y = collision.vel2.y * physicsConfig.collisionDamping
      }
    }
  }

  // Handle boundary collisions
  planets.forEach(planet => {
    if (planet.isSettled) return

    const newVel = resolveBoundaryCollision(
      planet.position,
      { vx: planet.velocity.x, vy: planet.velocity.y },
      planet.radius,
      bounds,
      physicsConfig.restitution
    )

    planet.velocity.x = newVel.x
    planet.velocity.y = newVel.y
  })

  return planets
}

/**
 * Ease planets to their final positions once physics settles
 */
export function easeToTarget(planets, deltaTime) {
  const easingSpeed = 0.1 // How fast to ease to target

  planets.forEach(planet => {
    if (!planet.targetPosition) return

    const dx = planet.targetPosition.x - planet.position.x
    const dy = planet.targetPosition.y - planet.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 1) {
      // Snapped to target
      planet.position.x = planet.targetPosition.x
      planet.position.y = planet.targetPosition.y
      planet.isSettled = true
    } else {
      // Ease towards target
      planet.position.x += dx * easingSpeed
      planet.position.y += dy * easingSpeed
    }
  })

  return planets
}

/**
 * Check if all planets have settled
 */
export function allPlanetsSettled(planets) {
  return planets.every(planet => planet.isSettled)
}

/**
 * Main physics animation loop
 * Returns a promise that resolves when animation is complete
 */
export function runPoolBallAnimation(
  planets,
  screenWidth,
  screenHeight,
  onUpdate,
  onComplete
) {
  const bounds = {
    minX: 0,
    maxX: screenWidth,
    minY: 0,
    maxY: screenHeight
  }

  let lastTime = performance.now()
  let elapsedTime = 0
  let rafId

  const animate = (currentTime) => {
    const deltaTime = currentTime - lastTime
    lastTime = currentTime
    elapsedTime += deltaTime

    // Update physics
    updatePhysics(planets, deltaTime, bounds)

    // After some time, start easing to targets
    if (elapsedTime > physicsConfig.settleDuration * 0.7) {
      easeToTarget(planets, deltaTime)
    }

    // Call update callback
    if (onUpdate) {
      onUpdate(planets)
    }

    // Check if complete
    if (allPlanetsSettled(planets) || elapsedTime > physicsConfig.settleDuration) {
      // Snap all to target positions
      planets.forEach(planet => {
        if (planet.targetPosition) {
          planet.position.x = planet.targetPosition.x
          planet.position.y = planet.targetPosition.y
          planet.isSettled = true
        }
      })

      if (onUpdate) {
        onUpdate(planets)
      }

      if (onComplete) {
        onComplete(planets)
      }
    } else {
      rafId = requestAnimationFrame(animate)
    }
  }

  rafId = requestAnimationFrame(animate)

  // Return cancel function
  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  }
}
