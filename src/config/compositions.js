// Visual composition states for globe and blob positioning
// Each state defines how elements are arranged in the scene

export const COMPOSITION_STATES = {
  // Default centered composition
  default: {
    id: 'default',
    globe: {
      position: [0, 0, 0],        // x, y, z in 3D space
      scale: 1,
    },
    blobs: {
      positionMode: 'scattered',   // How blobs are distributed
      centerOffset: { x: 0, y: 0 }, // Additional offset from screen center
      spreadMultiplier: 1,          // How spread out blobs are (1 = normal)
      scaleMultiplier: 1,
    }
  },

  // Blobs form rings around the globe (like Saturn)
  rings: {
    id: 'rings',
    globe: {
      position: [0, 0, 0],
      scale: 1,
    },
    blobs: {
      positionMode: 'orbital',     // Blobs orbit around center
      centerOffset: { x: 0, y: 0 },
      orbitalRadius: 280,           // Pixel distance from center
      orbitalFlatness: 0.3,         // How flat the ring is (0 = perfect circle, 1 = very elliptical)
      spreadMultiplier: 0.2,        // Very tight clustering for ring appearance
      scaleMultiplier: 3.5,         // MUCH larger - prominent rings!
    }
  },

  // Globe positioned down-left, blobs trail like a meteor
  meteor: {
    id: 'meteor',
    globe: {
      position: [-1.5, -1.5, 0],   // Down and left in 3D space
      scale: 0.9,
    },
    blobs: {
      positionMode: 'trailing',     // Blobs follow in a trail
      centerOffset: { x: 100, y: 100 }, // Offset up-right from center
      trailDirection: { x: 1, y: 1 },   // Direction of trail (up-right)
      trailSpacing: 150,            // Space between each blob in trail
      spreadMultiplier: 0.8,
      scaleMultiplier: 1.2,         // Slightly larger
    }
  },

  // Globe large at bottom (half off-screen), blobs clustered off to the side like clouds
  sky: {
    id: 'sky',
    globe: {
      position: [0, -6.5, 0],      // Way down (mostly off screen, just peek at top)
      scale: 2.5,                  // Much larger
    },
    blobs: {
      positionMode: 'clustered',   // Grouped together
      centerOffset: { x: -250, y: -200 }, // Shifted up and to the left (like clouds off to the side)
      clusterRadius: 180,           // How tight the cluster is
      spreadMultiplier: 0.6,
      scaleMultiplier: 1.8,         // Larger clouds
    }
  },

  // Blobs surround globe tightly (like atmosphere)
  atmosphere: {
    id: 'atmosphere',
    globe: {
      position: [0, 0, 0],
      scale: 1,
    },
    blobs: {
      positionMode: 'orbital',
      centerOffset: { x: 0, y: 0 },
      orbitalRadius: 200,           // Close to globe but visible
      orbitalFlatness: 0.15,        // Slight flatness
      spreadMultiplier: 0.3,
      scaleMultiplier: 2.5,         // Much larger - prominent atmosphere!
    }
  },

  // Globe small and offset, blobs large and dominant
  portal: {
    id: 'portal',
    globe: {
      position: [2, 2, -2],        // Small, in corner, further back
      scale: 0.5,
    },
    blobs: {
      positionMode: 'scattered',
      centerOffset: { x: -100, y: -100 },
      spreadMultiplier: 1.5,       // More spread out
      scaleMultiplier: 2,          // Much larger
    }
  },

  // Atom - large blobs erratically clustered around center (like electrons)
  atom: {
    id: 'atom',
    globe: {
      position: [0, 0, 0],
      scale: 1,
    },
    blobs: {
      positionMode: 'erratic',     // Random clustering around center
      centerOffset: { x: 0, y: 0 },
      clusterRadius: 250,           // How far blobs can be from center
      erraticness: 0.8,             // How chaotic the positioning is (0-1)
      spreadMultiplier: 0.6,        // Moderate spread
      scaleMultiplier: 3.0,         // Large and prominent
    }
  },

  // Warp - blobs create tunnel effect with depth
  warp: {
    id: 'warp',
    globe: {
      position: [0, 0, 0],
      scale: 0.35,                  // Much smaller globe - like it's far away in tunnel
    },
    blobs: {
      positionMode: 'tunnel',       // Blobs all centered with different scales
      centerOffset: { x: 0, y: 0 },
      tunnelDepth: 3,               // Number of depth layers (small, med, large)
      spreadMultiplier: 0.1,        // Minimal spread - keep centered
      scaleMultiplier: 1.0,         // Base multiplier, each blob scales differently
    }
  },

  // Comet - globe positioned up-right, blobs trail toward down-left (reverse meteor)
  comet: {
    id: 'comet',
    globe: {
      position: [1.5, 1.5, 0],      // Up and right in 3D space
      scale: 0.9,
    },
    blobs: {
      positionMode: 'trailing',     // Blobs follow in a trail
      centerOffset: { x: -100, y: -100 }, // Offset down-left from center
      trailDirection: { x: -1, y: -1 },   // Direction of trail (down-left)
      trailSpacing: 150,            // Space between each blob in trail
      spreadMultiplier: 0.8,
      scaleMultiplier: 1.2,         // Slightly larger
    }
  }
}

// Helper to get composition state by ID
export const getCompositionState = (stateId) => {
  return COMPOSITION_STATES[stateId] || COMPOSITION_STATES.default
}

// Calculate blob position based on composition mode
export const calculateBlobPosition = (compositionState, seed1, seed2, seed3, blobIndex, windowWidth, windowHeight) => {
  const { positionMode, centerOffset, spreadMultiplier = 1 } = compositionState.blobs

  switch (positionMode) {
    case 'orbital': {
      // Blobs orbit around center at fixed radius (rings mode)
      const { orbitalRadius = 250, orbitalFlatness = 0.3 } = compositionState.blobs

      // Distribute blobs evenly around the ring with minimal variation
      const angle = (blobIndex * Math.PI * 2 / 3) + (Math.sin(seed1) * 0.1) // Very slight angle variation
      const radiusVariation = orbitalRadius * (0.95 + Math.sin(seed2) * 0.05) // ±5% radius variation (tight ring)

      // Apply flatness to create elliptical rings
      const xRadius = radiusVariation
      const yRadius = radiusVariation * (1 - orbitalFlatness) // Flatter in Y axis

      return {
        x: Math.cos(angle) * xRadius + (centerOffset.x || 0),
        y: Math.sin(angle) * yRadius + (centerOffset.y || 0)
      }
    }

    case 'erratic': {
      // Blobs cluster erratically around center (atom mode)
      const { clusterRadius = 250, erraticness = 0.8 } = compositionState.blobs

      // Random angle and radius for each blob
      const angle = Math.sin(seed1) * Math.PI * 2
      const randomRadius = Math.abs(Math.sin(seed2)) * clusterRadius * erraticness

      // Add some chaos with the third seed
      const chaosX = Math.sin(seed3) * clusterRadius * (1 - erraticness) * 0.3
      const chaosY = Math.cos(seed3 * 1.7) * clusterRadius * (1 - erraticness) * 0.3

      return {
        x: Math.cos(angle) * randomRadius + chaosX + (centerOffset.x || 0),
        y: Math.sin(angle) * randomRadius + chaosY + (centerOffset.y || 0)
      }
    }

    case 'tunnel': {
      // Blobs all centered but at different scales to create depth illusion
      // All blobs are at center (0,0) - the depth comes from scale differences

      // Minimal variation to keep them centered
      const centerVariation = Math.sin(seed1) * 10 // Very small variation

      return {
        x: centerVariation + (centerOffset.x || 0),
        y: centerVariation + (centerOffset.y || 0)
      }
    }

    case 'trailing': {
      // Blobs trail in a direction
      const { trailDirection = { x: 1, y: 1 }, trailSpacing = 150 } = compositionState.blobs
      const trailOffset = blobIndex * trailSpacing // Space out along trail (more spacing)
      const perpNoise = Math.sin(seed3) * 40 // Slight perpendicular variation for organic feel

      return {
        x: (trailDirection.x * trailOffset) + (centerOffset.x || 0) + perpNoise,
        y: (trailDirection.y * trailOffset) + (centerOffset.y || 0) - perpNoise
      }
    }

    case 'clustered': {
      // Blobs group together tightly
      const { clusterRadius = 150 } = compositionState.blobs
      const clusterX = (Math.sin(seed1) * clusterRadius * 0.5) + (centerOffset.x || 0)
      const clusterY = (Math.cos(seed2) * clusterRadius * 0.5) + (centerOffset.y || 0)

      return {
        x: clusterX,
        y: clusterY
      }
    }

    case 'scattered':
    default: {
      // Original scattered positioning with spread multiplier
      const baseX = (Math.sin(seed1) * 20 + Math.cos(seed2) * 15 + Math.sin(seed3) * 10 + Math.sign(Math.sin(seed1)) * 15) * (windowWidth / 100)
      const baseY = (Math.cos(seed1) * 20 + Math.sin(seed2) * 15 + Math.cos(seed3) * 10 + Math.sign(Math.cos(seed1)) * 15) * (windowHeight / 100)

      return {
        x: baseX * spreadMultiplier + (centerOffset.x || 0),
        y: baseY * spreadMultiplier + (centerOffset.y || 0)
      }
    }
  }
}
