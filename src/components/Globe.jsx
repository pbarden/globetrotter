import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GlobeComponent({ rotation, targetRotation, scale = 1, subdivision = 2, isExiting = false }) {
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

  // Create icosahedron geometry with random hue offsets for each vertex
  const { geometry, hueOffsets } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.5, subdivision)
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

  // Animate rotation and colors
  useFrame((state, delta) => {
    // Exit animation - fall down (REVERSE of entry)
    if (isExiting && groupRef.current) {
      const newProgress = Math.min(exitAnimationRef.current + delta * 2, 1)
      exitAnimationRef.current = newProgress

      // Fall with gravity (quadratic)
      const easedProgress = newProgress * newProgress
      groupRef.current.position.y = 0 - (15 * easedProgress)
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

      // Move from bottom (y = -10) to center (y = 0)
      groupRef.current.position.y = -10 + (10 * easedProgress)
    }

    // Idle rotation - slow continuous spin (only after entry animation completes)
    if (entryAnimationRef.current >= 1) {
      idleRotationRef.current.y += delta * 0.15 // Slow Y-axis rotation
      idleRotationRef.current.x += delta * 0.05 // Very slow X-axis rotation
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

      meshRef.current.rotation.x += deltaX * 0.05
      meshRef.current.rotation.y += deltaY * 0.05
    }

    if (edgesRef.current) {
      // Apply same idle rotation to wireframe (reuse targetWithIdle)
      edgesRef.current.rotation.x += (targetWithIdle.x - edgesRef.current.rotation.x) * 0.05
      edgesRef.current.rotation.y += (targetWithIdle.y - edgesRef.current.rotation.y) * 0.05
    }

    // Update time for color cycling
    const isRotating = Math.abs(rotationVelocity.current) > 0.01
    const timeSpeed = isRotating ? 2.0 : 0.3 // Speed up color changes during rotation
    timeRef.current += delta * timeSpeed

    // Update vertex colors with rainbow cycling (Optimizations #1 & #10: Throttled updates + reusable color object)
    const now = state.clock.elapsedTime
    const shouldUpdateColors = now - lastColorUpdateTime.current > 0.033 // ~30fps throttle (reduced from 60fps)

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
    <group ref={groupRef} scale={scale}>
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
