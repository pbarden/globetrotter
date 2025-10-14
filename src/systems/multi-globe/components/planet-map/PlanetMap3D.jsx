import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { PlanetMapScene } from './PlanetMapScene'
import './PlanetMap.css'

/**
 * PlanetMap3D - Unified 3D scene for planet map with pool ball physics
 * Single canvas with all planets as 3D objects
 */
function PlanetMap3D({ globes, onPlanetClick, transitionType = '' }) {
  return (
    <div className={`planet-map ${transitionType}`}>
      {/* Background gradient */}
      <div className="planet-map-background"></div>

      {/* Title */}
      <div className="planet-map-title">
        <h1>Moon Map</h1>
        <p>Choose your destination</p>
      </div>

      {/* Single unified 3D canvas for all planets */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.0} />
          <pointLight position={[-10, -10, 5]} intensity={0.5} />
          <PlanetMapScene
            globes={globes}
            onPlanetClick={onPlanetClick}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default PlanetMap3D
