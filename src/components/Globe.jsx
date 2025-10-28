import { useRef, useMemo, memo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLOBE_CONFIG, ANIMATION_TIMINGS } from '../config/animations'

function GlobeComponent({ rotation, targetRotation, scale = 1, position = [0, 0, 0], subdivision = GLOBE_CONFIG.SUBDIVISION, isExiting = false }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const edgesRef = useRef()
  const groupRef = useRef()
  const timeRef = useRef(0)
  const rotationVelocity = useRef(0)
  const entryAnimationRef = useRef(0)
  const exitAnimationRef = useRef(0)
  const idleRotationRef = useRef({ x: 0, y: 0 })
  const lastColorUpdateTime = useRef(0)
  const basePosition = useMemo(() => position, [position[0], position[1], position[2]])

  // Smooth position interpolation - the "sexy" movement
  const currentPosition = useRef([0, 0, 0])
  const targetPosition = useRef([0, 0, 0])
  const currentScale = useRef(1)
  const targetScale = useRef(1)

  // Page visibility - pause rotation when tab is inactive
  const isPageVisibleRef = useRef(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Create icosahedron geometry with random hue offsets for each vertex
  const { geometry, hueOffsets } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(GLOBE_CONFIG.SIZE, subdivision)
    const offsets = []
    const colors = []

    // Assign random hue offsets to each vertex for rainbow crystal effect
    for (let i = 0; i < geo.attributes.position.count; i++) {
      offsets.push(Math.random() * 360)
      // Initialize with a color
      colors.push(1, 1, 1)
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    return { geometry: geo, hueOffsets: offsets }
  }, [subdivision])

  // Create edges geometry for wireframe
  const edges = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  // Create reusable color object for vertex updates (Optimization #10)
  const color = useMemo(() => new THREE.Color(), [])

  // Update target position and scale when props change
  useMemo(() => {
    targetPosition.current = [...basePosition]
    targetScale.current = scale
  }, [basePosition, scale])

  // Animate rotation and colors
  useFrame((state, delta) => {
    // Smooth position and scale interpolation - slow and sexy
    // Lerp factor: lower = slower, more elegant movement (0.02 = ~2% per frame)
    const lerpFactor = 0.02

    currentPosition.current[0] += (targetPosition.current[0] - currentPosition.current[0]) * lerpFactor
    currentPosition.current[1] += (targetPosition.current[1] - currentPosition.current[1]) * lerpFactor
    currentPosition.current[2] += (targetPosition.current[2] - currentPosition.current[2]) * lerpFactor
    currentScale.current += (targetScale.current - currentScale.current) * lerpFactor

    // Exit animation - fall down (REVERSE of entry)
    if (isExiting && groupRef.current) {
      const newProgress = Math.min(exitAnimationRef.current + delta * 2, 1)
      exitAnimationRef.current = newProgress

      // Fall with gravity (quadratic)
      const easedProgress = newProgress * newProgress
      groupRef.current.position.set(
        currentPosition.current[0],
        currentPosition.current[1] - (Math.abs(GLOBE_CONFIG.EXIT_POSITION_Y) * easedProgress),
        currentPosition.current[2]
      )
      groupRef.current.scale.setScalar(currentScale.current)
      return // Skip other animations
    }

    // Entry animation with bounce
    if (entryAnimationRef.current < 1 && groupRef.current) {
      // Slower at the beginning, faster towards the end
      const speed = entryAnimationRef.current < 0.3 ? 0.7 : 1.0
      const newProgress = Math.min(entryAnimationRef.current + delta * speed, 1)
      entryAnimationRef.current = newProgress

      // Back ease-out with overshoot
      const t = newProgress
      const c1 = 1.70158
      const c3 = c1 + 1
      const easedProgress = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)

      // Move from bottom to final position (using smoothly interpolated position)
      const entryOffset = GLOBE_CONFIG.ENTRY_POSITION_Y + (Math.abs(GLOBE_CONFIG.ENTRY_POSITION_Y) * easedProgress)
      groupRef.current.position.set(
        currentPosition.current[0],
        currentPosition.current[1] + entryOffset,
        currentPosition.current[2]
      )
      groupRef.current.scale.setScalar(currentScale.current)
    } else if (entryAnimationRef.current >= 1 && groupRef.current) {
      // Animation complete, apply smooth interpolated position and scale
      groupRef.current.position.set(
        currentPosition.current[0],
        currentPosition.current[1],
        currentPosition.current[2]
      )
      groupRef.current.scale.setScalar(currentScale.current)
    }

    // Only update rotation and colors when page is visible
    if (isPageVisibleRef.current) {
      // Idle rotation - slow continuous spin (only after entry animation completes)
      // Scale inversely affects rotation speed: larger = slower (more majestic)
      if (entryAnimationRef.current >= 1) {
        const scaleInverseFactor = 1 / currentScale.current
        idleRotationRef.current.y += delta * GLOBE_CONFIG.ROTATION_SPEED.IDLE_Y * scaleInverseFactor
        idleRotationRef.current.x += delta * GLOBE_CONFIG.ROTATION_SPEED.IDLE_X * scaleInverseFactor
      }

      // Calculate rotation velocity and target rotation with idle rotation (optimization: calculate once)
      const effectiveTarget = targetRotation || { x: 0, y: 0 }
      const targetWithIdle = {
        x: effectiveTarget.x + idleRotationRef.current.x,
        y: effectiveTarget.y + idleRotationRef.current.y
      }

      if (meshRef.current) {
        const currentRotX = meshRef.current.rotation.x
        const currentRotY = meshRef.current.rotation.y

        const deltaX = targetWithIdle.x - currentRotX
        const deltaY = targetWithIdle.y - currentRotY
        rotationVelocity.current = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // Apply scale-based rotation damping: larger globe rotates slower
        const scaleInverseFactor = 1 / currentScale.current
        const rotationSpeed = 0.05 * scaleInverseFactor

        meshRef.current.rotation.x += deltaX * rotationSpeed
        meshRef.current.rotation.y += deltaY * rotationSpeed
      }

      if (edgesRef.current) {
        // Apply same scale-based rotation to wireframe
        const scaleInverseFactor = 1 / currentScale.current
        const rotationSpeed = 0.05 * scaleInverseFactor

        edgesRef.current.rotation.x += (targetWithIdle.x - edgesRef.current.rotation.x) * rotationSpeed
        edgesRef.current.rotation.y += (targetWithIdle.y - edgesRef.current.rotation.y) * rotationSpeed
      }

      // Update time for color cycling
      // Scale inversely affects color cycling: larger globe = slower color shifts
      const isRotating = Math.abs(rotationVelocity.current) > 0.01
      const baseTimeSpeed = isRotating ? GLOBE_CONFIG.ROTATION_SPEED.COLOR_FAST : GLOBE_CONFIG.ROTATION_SPEED.COLOR_SLOW
      const scaleInverseFactor = 1 / currentScale.current
      const timeSpeed = baseTimeSpeed * scaleInverseFactor
      timeRef.current += delta * timeSpeed
    }

    // Update vertex colors with rainbow cycling (Optimizations #1 & #10: Throttled updates + reusable color object)
    const now = state.clock.elapsedTime
    const shouldUpdateColors = now - lastColorUpdateTime.current > (1 / ANIMATION_TIMINGS.COLOR_UPDATE_FPS)

    if (shouldUpdateColors && geometry.attributes.color) {
      lastColorUpdateTime.current = now
      const colors = geometry.attributes.color.array

      for (let i = 0; i < hueOffsets.length; i++) {
        const hue = (hueOffsets[i] + timeRef.current * 30) % 360
        const saturation = 0.9 + Math.sin(timeRef.current + i) * 0.1 // Very saturated rainbow
        const lightness = 0.65 + Math.sin(timeRef.current * 0.5 + i * 0.5) * 0.2

        color.setHSL(hue / 360, saturation, lightness)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b
      }

      geometry.attributes.color.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Crystal mesh with rainbow refraction */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial
          ref={materialRef}
          color="#b8d4ff"
          emissive="#cce5ff"
          emissiveIntensity={0.08}
          flatShading={true}
          shininess={150}
          specular="#e0f0ff"
          vertexColors={true}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments ref={edgesRef} geometry={edges}>
        <lineBasicMaterial color="#aaccff" linewidth={1} opacity={0.2} transparent={true} />
      </lineSegments>
    </group>
  )
}

export const Globe = memo(GlobeComponent)
