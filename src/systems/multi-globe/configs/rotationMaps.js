// Rotation calculation for positioning cards on globes
// Calculates rotation angles for each card position based on globe size

import { GLOBE_SIZES } from './sizeSpecs'

// Calculate rotation for a given grid position
export function calculateRotation(row, col, gridSize) {
  const { rows, cols } = gridSize

  // For single card (tiny globe), fixed rotation
  if (rows === 1 && cols === 1) {
    return { x: 0, y: 0 }
  }

  // Distribute rotations evenly around sphere
  const xRotation = (row / (rows - 1)) * Math.PI - (Math.PI / 2)
  const yRotation = (col / (cols - 1)) * 2 * Math.PI

  return { x: xRotation, y: yRotation }
}

// Generate rotation map for a specific globe size
export function generateRotationMap(size, gridDimensions) {
  const { rows, cols } = gridDimensions
  const rotationMap = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      const rotation = calculateRotation(row, col, gridDimensions)

      rotationMap.push({
        id: index,
        position: { row, col },
        rotation
      })
    }
  }

  return rotationMap
}

// Predefined rotation maps for each size (for performance)
export const rotationMaps = {
  [GLOBE_SIZES.TINY]: [
    { id: 0, position: { row: 0, col: 0 }, rotation: { x: 0, y: 0 } }
  ],

  [GLOBE_SIZES.SMALL]: [
    { id: 0, position: { row: 0, col: 0 }, rotation: { x: 0, y: 0 } },
    { id: 1, position: { row: 0, col: 1 }, rotation: { x: Math.PI, y: 0 } },
    { id: 2, position: { row: 1, col: 0 }, rotation: { x: 0, y: Math.PI / 2 } },
    { id: 3, position: { row: 1, col: 1 }, rotation: { x: 0, y: -Math.PI / 2 } }
  ],

  [GLOBE_SIZES.MEDIUM]: generateRotationMap(GLOBE_SIZES.MEDIUM, { rows: 3, cols: 3 }),

  [GLOBE_SIZES.LARGE]: generateRotationMap(GLOBE_SIZES.LARGE, { rows: 4, cols: 4 })
}

// Get rotation for a specific card index
export function getRotationForCard(size, cardIndex) {
  const map = rotationMaps[size]
  if (!map || !map[cardIndex]) {
    return { x: 0, y: 0 }
  }
  return map[cardIndex].rotation
}

// Get grid position for a card index
export function getPositionForCard(size, cardIndex, gridDimensions) {
  const { cols } = gridDimensions
  const row = Math.floor(cardIndex / cols)
  const col = cardIndex % cols
  return { row, col }
}

// Get card index from grid position
export function getCardIndexFromPosition(row, col, gridDimensions) {
  const { cols } = gridDimensions
  return row * cols + col
}
