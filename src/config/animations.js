// Animation timing and configuration

export const ANIMATION_TIMINGS = {
  // Card animations
  CARD_FLY_OUT_DURATION: 400,  // ms
  CARD_FLY_IN_DURATION: 650,   // ms

  // Blob animations
  BLOB_ENTRY_DURATION: 0.4,    // seconds
  BLOB_EXIT_DURATION: 0.4,     // seconds
  BLOB_COLOR_TRANSITION: 600,  // ms

  // Globe animations
  GLOBE_ENTRY_DURATION: 1.0,   // seconds
  GLOBE_EXIT_DURATION: 0.5,    // seconds

  // Loading screen
  LOADING_MIN_DURATION: 2000,  // ms

  // Performance throttling
  BLOB_FPS: 60,                // Target FPS for blob updates
  COLOR_UPDATE_FPS: 30,        // Target FPS for color cycling
}

export const SCROLL_CONFIG = {
  THRESHOLD: 120,              // Scroll accumulation threshold for switching
  GRID_ROWS: 5,
  GRID_COLS: 4,
}

// Globe configuration
export const GLOBE_CONFIG = {
  SIZE: 2.5,
  SUBDIVISION: 2,
  ROTATION_SPEED: {
    IDLE_Y: 0.15,
    IDLE_X: 0.05,
    COLOR_FAST: 2.0,
    COLOR_SLOW: 0.3,
  },
  ENTRY_POSITION_Y: -10,
  EXIT_POSITION_Y: -15,
}

// Blob configuration
export const BLOB_CONFIG = {
  LAYER_COUNT: 3,
  SCALE_RANGE: { min: 0.5, max: 1.5 },
  OPACITY: {
    LAYER_1: 1.0,
    LAYER_2: 0.5,
    LAYER_3: 0.4,
  },
  BLUR_RADIUS: {
    LAYER_1: 8,
    LAYER_2: 10,
    LAYER_3: 12,
  },
}
