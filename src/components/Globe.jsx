import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Globe({ rotation, targetRotation }) {
  const meshRef = useRef()
  const edgesRef = useRef()

  // Create icosahedron geometry for low-poly look
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.5, 2)
  }, [])

  // Create edges geometry for wireframe
  const edges = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15)
  }, [geometry])

  // Animate rotation smoothly towards target
  useFrame(() => {
    if (meshRef.current && targetRotation) {
      meshRef.current.rotation.x += (targetRotation.x - meshRef.current.rotation.x) * 0.05
      meshRef.current.rotation.y += (targetRotation.y - meshRef.current.rotation.y) * 0.05
    }

    if (edgesRef.current && targetRotation) {
      edgesRef.current.rotation.x += (targetRotation.x - edgesRef.current.rotation.x) * 0.05
      edgesRef.current.rotation.y += (targetRotation.y - edgesRef.current.rotation.y) * 0.05
    }
  })

  return (
    <group>
      {/* Low-poly shaded mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial
          color="#DAA520"
          emissive="#8B6914"
          emissiveIntensity={0.2}
          flatShading={true}
          shininess={80}
          specular="#FFD700"
        />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments ref={edgesRef} geometry={edges}>
        <lineBasicMaterial color="#B8860B" linewidth={1} />
      </lineSegments>
    </group>
  )
}
