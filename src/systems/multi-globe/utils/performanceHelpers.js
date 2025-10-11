// Performance optimization helpers
// Utilities for managing performance across multiple globes

// Performance configuration
export const performanceConfig = {
  maxActiveGlobes: 3,
  preloadDistance: 1,
  unloadDistance: 2,
  maxBlobsPerGlobe: 1,
  reduceAnimationsOnScroll: true,
  targetFPS: 60,
  throttleDelay: 16 // ~60fps
}

/**
 * Throttle function execution
 */
export function throttle(func, delay = performanceConfig.throttleDelay) {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }
  }
}

/**
 * Debounce function execution
 */
export function debounce(func, delay = 100) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Request animation frame with fallback
 */
export function requestFrame(callback) {
  return window.requestAnimationFrame(callback) ||
         window.setTimeout(callback, 1000 / performanceConfig.targetFPS)
}

/**
 * Cancel animation frame with fallback
 */
export function cancelFrame(id) {
  return window.cancelAnimationFrame(id) || clearTimeout(id)
}

/**
 * Check if device supports reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get device performance tier (rough estimate)
 */
export function getPerformanceTier() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if (!gl) return 'low'

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (!debugInfo) return 'medium'

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()

  // Very rough heuristic
  if (renderer.includes('nvidia') || renderer.includes('amd') || renderer.includes('radeon')) {
    return 'high'
  } else if (renderer.includes('intel')) {
    return 'medium'
  }

  return 'low'
}

/**
 * Memory usage estimation (if available)
 */
export function getMemoryUsage() {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize / (1024 * 1024), // MB
      total: performance.memory.totalJSHeapSize / (1024 * 1024), // MB
      limit: performance.memory.jsHeapSizeLimit / (1024 * 1024) // MB
    }
  }
  return null
}

/**
 * Simple FPS counter
 */
export class FPSCounter {
  constructor() {
    this.frames = 0
    this.lastTime = performance.now()
    this.fps = 60
  }

  update() {
    this.frames++
    const now = performance.now()
    const delta = now - this.lastTime

    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta)
      this.frames = 0
      this.lastTime = now
    }

    return this.fps
  }

  get() {
    return this.fps
  }
}

/**
 * Object pool for reusing objects
 */
export class ObjectPool {
  constructor(factory, reset, initialSize = 10) {
    this.factory = factory
    this.reset = reset
    this.pool = []

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory())
    }
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory()
  }

  release(obj) {
    this.reset(obj)
    this.pool.push(obj)
  }

  clear() {
    this.pool = []
  }
}
