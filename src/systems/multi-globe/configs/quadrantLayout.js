// Quadrant layout system for Planet Map
// Defines positioning rules for planets on the map

export const quadrants = {
  topLeft: {
    id: 'topLeft',
    bounds: { x: [0, 0.5], y: [0, 0.5] },
    center: { x: 0.25, y: 0.25 }
  },
  topRight: {
    id: 'topRight',
    bounds: { x: [0.5, 1], y: [0, 0.5] },
    center: { x: 0.75, y: 0.25 }
  },
  bottomLeft: {
    id: 'bottomLeft',
    bounds: { x: [0, 0.5], y: [0.5, 1] },
    center: { x: 0.25, y: 0.75 }
  },
  bottomRight: {
    id: 'bottomRight',
    bounds: { x: [0.5, 1], y: [0.5, 1] },
    center: { x: 0.75, y: 0.75 }
  }
}

// Get quadrant by ID
export function getQuadrant(quadrantId) {
  return quadrants[quadrantId]
}

// Get all quadrant IDs
export function getQuadrantIds() {
  return Object.keys(quadrants)
}

// Random number in range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}

// Linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t
}

// Check if position overlaps existing planets
function overlapsExistingPlanets(position, radius, existingPlanets) {
  const minDistance = radius * 2.5 // Ensure spacing

  return existingPlanets.some(planet => {
    const distance = Math.hypot(
      position.x - planet.position.x,
      position.y - planet.position.y
    )
    return distance < minDistance
  })
}

// Position a planet within a quadrant
export function positionPlanetInQuadrant(quadrant, planetRadius, existingPlanets = []) {
  let attempts = 0
  let position

  do {
    // Random position within quadrant bounds
    position = {
      x: randomInRange(quadrant.bounds.x[0], quadrant.bounds.x[1]),
      y: randomInRange(quadrant.bounds.y[0], quadrant.bounds.y[1])
    }

    // Bias towards quadrant center for better distribution
    position.x = lerp(position.x, quadrant.center.x, 0.3)
    position.y = lerp(position.y, quadrant.center.y, 0.3)

    attempts++
  } while (overlapsExistingPlanets(position, planetRadius, existingPlanets) && attempts < 100)

  return position
}

// Convert normalized position (0-1) to screen pixels
export function normalizedToScreen(normalizedPos, screenWidth, screenHeight) {
  return {
    x: normalizedPos.x * screenWidth,
    y: normalizedPos.y * screenHeight
  }
}

// Convert screen pixels to normalized position (0-1)
export function screenToNormalized(screenPos, screenWidth, screenHeight) {
  return {
    x: screenPos.x / screenWidth,
    y: screenPos.y / screenHeight
  }
}
