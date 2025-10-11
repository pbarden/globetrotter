import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { SimplifiedGlobe } from './SimplifiedGlobe'
import './PlanetInstance.css'

/**
 * PlanetInstance - Individual planet with simplified globe
 */
function PlanetInstance({ planet, onClick, isAnimating, isSelected = false }) {
  const [isHovered, setIsHovered] = useState(false)

  const { position, radius, name, scale, size, rotation } = planet

  // Calculate center of screen
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  // When selected, move towards center (70% of the way)
  const displayX = isSelected ? position.x + (centerX - position.x) * 0.7 : position.x
  const displayY = isSelected ? position.y + (centerY - position.y) * 0.7 : position.y

  // Calculate if label should be on top
  const labelOnTop = useMemo(() => {
    const labelHeight = 50
    const bottomSpace = window.innerHeight - (position.y + radius + labelHeight)
    return bottomSpace < 20
  }, [position.y, radius])

  const handleClick = () => {
    if (!isAnimating && onClick) {
      onClick(planet)
    }
  }

  return (
    <div
      className={`planet-instance ${isHovered ? 'hovered' : ''} ${isAnimating ? 'animating' : ''} ${isSelected ? 'selected' : ''}`}
      data-size={size}
      style={{
        position: 'absolute',
        left: `${displayX}px`,
        top: `${displayY}px`,
        transform: isSelected ? 'translate(-50%, -50%) scale(1.6)' : 'translate(-50%, -50%)',
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        transition: isAnimating ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: 'none'
      }}
    >
      {/* 3D Globe */}
      <div className="planet-globe-container">
        <Canvas
          orthographic
          camera={{ position: [0, 0, 5], zoom: 120 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-5, -5, 5]} intensity={0.4} />
            <SimplifiedGlobe
              scale={scale * 0.5}
              rotation={{ x: 0, y: rotation }}
              isSelected={isSelected}
              isAnimating={isAnimating}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Circular clickable area overlay */}
      <div
        className="planet-click-area"
        style={{
          cursor: isAnimating ? 'default' : 'pointer',
          pointerEvents: isAnimating ? 'none' : 'auto'
        }}
        onMouseEnter={() => !isAnimating && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />

      {/* Planet label (visible on hover or when selected) */}
      <div className={`planet-label ${labelOnTop ? 'label-top' : ''}`}>
        <span>{name}</span>
      </div>

      {/* Hover ring effect */}
      {(isHovered || isSelected) && (
        <div className="planet-ring"></div>
      )}
    </div>
  )
}

export { PlanetInstance }
