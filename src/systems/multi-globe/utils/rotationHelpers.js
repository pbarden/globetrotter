// Rotation helper utilities
// Functions for working with 3D rotations and orientations

/**
 * Normalize angle to -PI to PI range
 */
export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= 2 * Math.PI
  while (angle < -Math.PI) angle += 2 * Math.PI
  return angle
}

/**
 * Calculate shortest rotation difference between two angles
 */
export function getShortestRotation(from, to) {
  let diff = normalizeAngle(to - from)
  return diff
}

/**
 * Interpolate between two rotations
 */
export function lerpRotation(from, to, t) {
  return {
    x: from.x + getShortestRotation(from.x, to.x) * t,
    y: from.y + getShortestRotation(from.y, to.y) * t
  }
}

/**
 * Check if rotation would make card upside down or sideways
 */
export function needsReorientation(rotation, threshold = Math.PI / 4) {
  return Math.abs(rotation.x) > threshold || Math.abs(rotation.y) > threshold
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI)
}

/**
 * Create rotation from euler angles
 */
export function createRotation(x = 0, y = 0, z = 0) {
  return { x, y, z }
}

/**
 * Add two rotations
 */
export function addRotations(r1, r2) {
  return {
    x: normalizeAngle(r1.x + r2.x),
    y: normalizeAngle(r1.y + r2.y),
    z: normalizeAngle((r1.z || 0) + (r2.z || 0))
  }
}

/**
 * Get inverse rotation
 */
export function inverseRotation(rotation) {
  return {
    x: -rotation.x,
    y: -rotation.y,
    z: -(rotation.z || 0)
  }
}
