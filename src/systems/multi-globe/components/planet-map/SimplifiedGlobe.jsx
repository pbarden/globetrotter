import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * SimplifiedGlobe - Lightweight blocky globe for planet map
 * Uses same icosahedron structure as full Globe but with fewer subdivisions
 */
export function SimplifiedGlobe({ scale = 1, rotation = null }) {
  const meshRef = useRef()
  const edgesRef = useRef()
  const timeRef = useRef(0)
  const color = useMemo(() => new THREE.Color(), [])

  // Create icosahedron geometry with fewer subdivisions (blocky look)
  const { geometry, hueOffsets } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.5, 0) // subdivision 0 = very blocky (20 faces)
    const offsets = []
    const colors = []

    // Assign random hue offsets to each vertex
    for (let i = 0; i < geo.attributes.position.count; i++) {
      offsets.push(Math.random() * 360)
      colors.push(1, 1, 1)
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    return { geometry: geo, hueOffsets: offsets }
  }, [])

  // Create edges geometry for wireframe
  const edges = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  // Update rotation when it changes
  useEffect(() => {
    if (meshRef.current && rotation) {
      meshRef.current.rotation.x = rotation.x
      meshRef.current.rotation.y = rotation.y
    }
    if (edgesRef.current && rotation) {
      edgesRef.current.rotation.x = rotation.x
      edgesRef.current.rotation.y = rotation.y
    }
  }, [rotation])

  // Animate colors
  useFrame((state, delta) => {
    timeRef.current += delta * 0.3 // Slower color cycling

    if (geometry.attributes.color) {
      const colors = geometry.attributes.color.array

      for (let i = 0; i < hueOffsets.length; i++) {
        const hue = (hueOffsets[i] + timeRef.current * 30) % 360
        const saturation = 0.9 + Math.sin(timeRef.current + i) * 0.1
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
    <group scale={scale}>
      {/* Backlight glow behind the globe */}
      <pointLight
        position={[0, 0, -2]}
        intensity={2}
        distance={8}
        color="#6a5acd"
        decay={2}
      />

      {/* Crystal mesh with rainbow refraction */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial
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
