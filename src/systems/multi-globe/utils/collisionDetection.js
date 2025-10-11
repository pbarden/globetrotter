// Collision detection utilities
// For pool ball physics and planet positioning

/**
 * Check if two circles overlap
 */
export function circlesOverlap(pos1, radius1, pos2, radius2) {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < (radius1 + radius2)
}

/**
 * Get distance between two points
 */
export function getDistance(pos1, pos2) {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Check collision and calculate response velocities
 * Returns new velocities for both objects after elastic collision
 */
export function resolveCollision(obj1, obj2, restitution = 0.7) {
  const { position: pos1, velocity: vel1, mass: mass1 = 1 } = obj1
  const { position: pos2, velocity: vel2, mass: mass2 = 1 } = obj2

  // Calculate collision normal
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) return { vel1, vel2 } // Avoid division by zero

  // Normalize collision vector
  const nx = dx / distance
  const ny = dy / distance

  // Relative velocity
  const dvx = vel2.x - vel1.x
  const dvy = vel2.y - vel1.y

  // Relative velocity in collision normal direction
  const dvn = dvx * nx + dvy * ny

  // Don't resolve if velocities are separating
  if (dvn > 0) return { vel1, vel2 }

  // Calculate impulse scalar
  const impulse = (-(1 + restitution) * dvn) / (1 / mass1 + 1 / mass2)

  // Apply impulse to velocities
  const impulseX = impulse * nx
  const impulseY = impulse * ny

  return {
    vel1: {
      x: vel1.x - impulseX / mass1,
      y: vel1.y - impulseY / mass1
    },
    vel2: {
      x: vel2.x + impulseX / mass2,
      y: vel2.y + impulseY / mass2
    }
  }
}

/**
 * Check collision with boundary and return bounce velocity
 */
export function resolveBoundaryCollision(position, velocity, radius, bounds, restitution = 0.7) {
  const { x, y } = position
  const { vx, vy } = velocity
  const { minX, maxX, minY, maxY } = bounds

  let newVx = vx
  let newVy = vy

  // Left/right boundaries
  if (x - radius < minX) {
    newVx = Math.abs(vx) * restitution
  } else if (x + radius > maxX) {
    newVx = -Math.abs(vx) * restitution
  }

  // Top/bottom boundaries
  if (y - radius < minY) {
    newVy = Math.abs(vy) * restitution
  } else if (y + radius > maxY) {
    newVy = -Math.abs(vy) * restitution
  }

  return { x: newVx, y: newVy }
}

/**
 * Separate overlapping circles
 */
export function separateCircles(pos1, radius1, pos2, radius2) {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0 || distance >= radius1 + radius2) {
    return { pos1, pos2 }
  }

  // Calculate overlap
  const overlap = (radius1 + radius2) - distance

  // Normalize direction
  const nx = dx / distance
  const ny = dy / distance

  // Separate by half the overlap each
  const separationX = nx * overlap * 0.5
  const separationY = ny * overlap * 0.5

  return {
    pos1: {
      x: pos1.x - separationX,
      y: pos1.y - separationY
    },
    pos2: {
      x: pos2.x + separationX,
      y: pos2.y + separationY
    }
  }
}

/**
 * Check if point is inside bounds
 */
export function isInsideBounds(position, radius, bounds) {
  const { x, y } = position
  const { minX, maxX, minY, maxY } = bounds

  return (
    x - radius >= minX &&
    x + radius <= maxX &&
    y - radius >= minY &&
    y + radius <= maxY
  )
}

/**
 * Clamp position to bounds
 */
export function clampToBounds(position, radius, bounds) {
  const { x, y } = position
  const { minX, maxX, minY, maxY } = bounds

  return {
    x: Math.max(minX + radius, Math.min(maxX - radius, x)),
    y: Math.max(minY + radius, Math.min(maxY - radius, y))
  }
}
