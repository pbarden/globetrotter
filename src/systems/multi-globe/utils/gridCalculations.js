// Grid calculation utilities
// Helper functions for working with grid-based card layouts

/**
 * Convert card index to row/col position
 */
export function indexToPosition(index, cols) {
  return {
    row: Math.floor(index / cols),
    col: index % cols
  }
}

/**
 * Convert row/col position to card index
 */
export function positionToIndex(row, col, cols) {
  return row * cols + col
}

/**
 * Get neighboring card indices
 */
export function getNeighbors(index, rows, cols, wrapAround = true) {
  const { row, col } = indexToPosition(index, cols)

  const neighbors = {
    up: null,
    down: null,
    left: null,
    right: null
  }

  // Up
  if (row > 0) {
    neighbors.up = positionToIndex(row - 1, col, cols)
  } else if (wrapAround) {
    neighbors.up = positionToIndex(rows - 1, col, cols)
  }

  // Down
  if (row < rows - 1) {
    neighbors.down = positionToIndex(row + 1, col, cols)
  } else if (wrapAround) {
    neighbors.down = positionToIndex(0, col, cols)
  }

  // Left
  if (col > 0) {
    neighbors.left = positionToIndex(row, col - 1, cols)
  } else if (wrapAround) {
    neighbors.left = positionToIndex(row, cols - 1, cols)
  }

  // Right
  if (col < cols - 1) {
    neighbors.right = positionToIndex(row, col + 1, cols)
  } else if (wrapAround) {
    neighbors.right = positionToIndex(row, 0, cols)
  }

  return neighbors
}

/**
 * Check if index is valid for grid
 */
export function isValidIndex(index, totalCards) {
  return index >= 0 && index < totalCards
}

/**
 * Clamp index to valid range
 */
export function clampIndex(index, totalCards) {
  return Math.max(0, Math.min(totalCards - 1, index))
}

/**
 * Get direction from one index to another
 */
export function getDirection(fromIndex, toIndex, cols) {
  const fromPos = indexToPosition(fromIndex, cols)
  const toPos = indexToPosition(toIndex, cols)

  const rowDiff = toPos.row - fromPos.row
  const colDiff = toPos.col - fromPos.col

  if (Math.abs(rowDiff) > Math.abs(colDiff)) {
    return rowDiff > 0 ? 'down' : 'up'
  } else {
    return colDiff > 0 ? 'right' : 'left'
  }
}

/**
 * Get all card indices in order
 */
export function getAllIndices(totalCards) {
  return Array.from({ length: totalCards }, (_, i) => i)
}

/**
 * Get distance between two positions (Manhattan distance)
 */
export function getManhattanDistance(pos1, pos2) {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col)
}
