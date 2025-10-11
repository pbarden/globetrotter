// Globe size specifications
// Defines visual and grid properties for each globe size

export const GLOBE_SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

export const sizeSpecs = {
  [GLOBE_SIZES.TINY]: {
    size: 'tiny',
    scale: 0.6,
    subdivision: 1, // 80 faces - simpler geometry
    gridDimensions: { rows: 1, cols: 1 },
    totalCards: 1,
    globeRadius: 1.0,
    cameraDistance: 4,
    // Special behavior: any scroll returns to map
    scrollBehavior: 'return-to-map'
  },

  [GLOBE_SIZES.SMALL]: {
    size: 'small',
    scale: 0.8,
    subdivision: 1, // 80 faces
    gridDimensions: { rows: 2, cols: 2 },
    totalCards: 4,
    globeRadius: 1.5,
    cameraDistance: 6,
    scrollBehavior: 'navigate-grid'
  },

  [GLOBE_SIZES.MEDIUM]: {
    size: 'medium',
    scale: 1.0,
    subdivision: 2, // 320 faces
    gridDimensions: { rows: 3, cols: 3 },
    totalCards: 9,
    globeRadius: 2.0,
    cameraDistance: 8,
    scrollBehavior: 'navigate-grid'
  },

  [GLOBE_SIZES.LARGE]: {
    size: 'large',
    scale: 1.2,
    subdivision: 2, // 320 faces - current complexity
    gridDimensions: { rows: 4, cols: 4 },
    totalCards: 16,
    globeRadius: 2.5,
    cameraDistance: 8,
    scrollBehavior: 'navigate-grid'
  }
}

// Planet scaling on map (reduced for overview)
export const mapPlanetScales = {
  [GLOBE_SIZES.TINY]: 0.15,
  [GLOBE_SIZES.SMALL]: 0.20,
  [GLOBE_SIZES.MEDIUM]: 0.25,
  [GLOBE_SIZES.LARGE]: 0.30
}

// Get spec for a given size
export function getSizeSpec(size) {
  return sizeSpecs[size] || sizeSpecs[GLOBE_SIZES.LARGE]
}

// Get grid dimensions for a size
export function getGridDimensions(size) {
  const spec = getSizeSpec(size)
  return spec.gridDimensions
}

// Get total card count for a size
export function getTotalCards(size) {
  const spec = getSizeSpec(size)
  return spec.totalCards
}
