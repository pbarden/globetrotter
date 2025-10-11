import { useState, useEffect, useCallback } from 'react'
import { allGlobeConfigs, getGlobeConfig, getHomePlanetConfig } from './configs/globeConfigs'
import PlanetMap from './components/planet-map/PlanetMap'
import GlobeContainer from './GlobeContainer'
import './GlobeSystem.css'

// Views in the globe system
const VIEWS = {
  HOME_PLANET: 'home-planet',
  PLANET_MAP: 'planet-map',
  GLOBE: 'globe'
}

/**
 * GlobeSystem - Main container for multi-globe system
 * Manages state and navigation between:
 * 1. Home Planet (entry point - Tiny Globe with GameTitleCard)
 * 2. Planet Map (overview of all globes)
 * 3. Individual Globes (navigate within each globe)
 */
function GlobeSystem({ onReady }) {
  // Current view state
  const [currentView, setCurrentView] = useState(VIEWS.HOME_PLANET)

  // Active globe state
  const [activeGlobeId, setActiveGlobeId] = useState(null)
  const [activeGlobe, setActiveGlobe] = useState(null)

  // Current position within active globe
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Transition states
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionType, setTransitionType] = useState('')

  // Exit sequence trigger for globe views
  const [shouldTriggerExitSequence, setShouldTriggerExitSequence] = useState(false)

  // Navigation history
  const [navigationHistory, setNavigationHistory] = useState([VIEWS.HOME_PLANET])

  // Initialize home planet
  useEffect(() => {
    const homePlanet = getHomePlanetConfig()
    setActiveGlobeId(homePlanet.id)
    setActiveGlobe(homePlanet)

    // Notify parent when ready
    if (onReady) {
      onReady()
    }
  }, [onReady])

  // Navigate to Planet Map
  const navigateToPlanetMap = useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setTransitionType('to-map')

    // Transition sequence
    setTimeout(() => {
      setCurrentView(VIEWS.PLANET_MAP)
      setActiveGlobeId(null)
      setActiveGlobe(null)
      setNavigationHistory(prev => [...prev, VIEWS.PLANET_MAP])

      setTimeout(() => {
        setIsTransitioning(false)
        setTransitionType('')
      }, 800)
    }, 400)
  }, [isTransitioning])

  // Navigate to a specific globe from map
  const navigateToGlobe = useCallback((globeId) => {
    if (isTransitioning) return

    const globeConfig = getGlobeConfig(globeId)
    if (!globeConfig) {
      console.error(`Globe not found: ${globeId}`)
      return
    }

    setIsTransitioning(true)
    setTransitionType('to-globe')

    // Transition sequence: planets roll off, globe bounces in
    setTimeout(() => {
      setCurrentView(VIEWS.GLOBE)
      setActiveGlobeId(globeId)
      setActiveGlobe(globeConfig)
      setCurrentCardIndex(0)
      setNavigationHistory(prev => [...prev, VIEWS.GLOBE])

      setTimeout(() => {
        setIsTransitioning(false)
        setTransitionType('')
      }, 650)
    }, 600)
  }, [isTransitioning])

  // Navigate to Home Planet
  const navigateToHome = useCallback(() => {
    if (isTransitioning) return

    const homePlanet = getHomePlanetConfig()

    setIsTransitioning(true)
    setTransitionType('to-home')

    setTimeout(() => {
      setCurrentView(VIEWS.HOME_PLANET)
      setActiveGlobeId(homePlanet.id)
      setActiveGlobe(homePlanet)
      setCurrentCardIndex(0)
      setNavigationHistory([VIEWS.HOME_PLANET])

      setTimeout(() => {
        setIsTransitioning(false)
        setTransitionType('')
      }, 650)
    }, 400)
  }, [isTransitioning])

  // Handle exit sequence completion
  const handleExitSequenceComplete = useCallback(() => {
    // After exit animations complete, transition to map
    setCurrentView(VIEWS.PLANET_MAP)
    setActiveGlobeId(null)
    setActiveGlobe(null)
    setNavigationHistory(prev => prev.slice(0, -1))
    setShouldTriggerExitSequence(false)

    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionType('')
    }, 100)
  }, [])

  // Back button navigation
  const navigateBack = useCallback(() => {
    if (isTransitioning || navigationHistory.length <= 1) return

    const previousView = navigationHistory[navigationHistory.length - 2]

    if (currentView === VIEWS.GLOBE) {
      // From globe -> back to map with exit sequence
      setIsTransitioning(true)
      setTransitionType('globe-to-map')
      setShouldTriggerExitSequence(true)
    } else if (currentView === VIEWS.PLANET_MAP) {
      // From map -> back to home planet
      navigateToHome()
    }
  }, [currentView, isTransitioning, navigationHistory, navigateToHome])

  // Navigate within a globe (scroll between cards)
  const navigateWithinGlobe = useCallback((direction) => {
    if (isTransitioning || !activeGlobe) return

    const { gridDimensions, navigation } = activeGlobe
    const { rows, cols } = gridDimensions
    const totalCards = rows * cols

    // Get current position
    const currentRow = Math.floor(currentCardIndex / cols)
    const currentCol = currentCardIndex % cols

    let nextRow = currentRow
    let nextCol = currentCol

    // Calculate next position based on direction
    switch (direction) {
      case 'up':
        nextRow = navigation.wrapAround ? (currentRow - 1 + rows) % rows : Math.max(0, currentRow - 1)
        break
      case 'down':
        nextRow = navigation.wrapAround ? (currentRow + 1) % rows : Math.min(rows - 1, currentRow + 1)
        break
      case 'left':
        nextCol = navigation.wrapAround ? (currentCol - 1 + cols) % cols : Math.max(0, currentCol - 1)
        break
      case 'right':
        nextCol = navigation.wrapAround ? (currentCol + 1) % cols : Math.min(cols - 1, currentCol + 1)
        break
      default:
        return
    }

    const nextIndex = nextRow * cols + nextCol

    // Only transition if position changed
    if (nextIndex !== currentCardIndex) {
      setIsTransitioning(true)
      setCurrentCardIndex(nextIndex)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 650)
    }
  }, [activeGlobe, currentCardIndex, isTransitioning])

  // Expose navigation functions for child components
  const navigationContext = {
    navigateToPlanetMap,
    navigateToGlobe,
    navigateToHome,
    navigateBack,
    navigateWithinGlobe,
    currentView,
    activeGlobeId,
    activeGlobe,
    currentCardIndex,
    isTransitioning,
    transitionType,
    allGlobes: allGlobeConfigs
  }

  // Handle navigation within globe (just update index, GlobeContainer handles animations)
  const handleGlobeNavigate = useCallback((nextIndex, direction) => {
    setCurrentCardIndex(nextIndex)
  }, [])

  return (
    <div className="globe-system">
      {/* Render appropriate view based on current state */}
      {currentView === VIEWS.HOME_PLANET && activeGlobe && (
        <GlobeContainer
          globeConfig={activeGlobe}
          currentCardIndex={currentCardIndex}
          onNavigate={handleGlobeNavigate}
          onScrollToMap={navigateToPlanetMap}
          shouldStartExitSequence={shouldTriggerExitSequence}
          onExitSequenceComplete={handleExitSequenceComplete}
          isTransitioning={isTransitioning}
          transitionType={transitionType}
        />
      )}

      {currentView === VIEWS.PLANET_MAP && (
        <PlanetMap
          globes={allGlobeConfigs}
          onPlanetClick={(globe) => {
            // Special handling: home planet goes to HOME_PLANET view, others to GLOBE view
            if (globe.id === 'home-planet') {
              navigateToHome()
            } else {
              navigateToGlobe(globe.id)
            }
          }}
          transitionType={transitionType}
        />
      )}

      {currentView === VIEWS.GLOBE && activeGlobe && (
        <GlobeContainer
          globeConfig={activeGlobe}
          currentCardIndex={currentCardIndex}
          onNavigate={handleGlobeNavigate}
          onScrollToMap={null}
          shouldStartExitSequence={shouldTriggerExitSequence}
          onExitSequenceComplete={handleExitSequenceComplete}
          isTransitioning={isTransitioning}
          transitionType={transitionType}
        />
      )}

      {/* Back button (only visible on non-home globe views) */}
      {(currentView === VIEWS.GLOBE && activeGlobeId !== 'home-planet') && (
        <button
          className="back-button"
          onClick={navigateBack}
          disabled={isTransitioning}
        >
          ← Back
        </button>
      )}

      {/* Debug info */}
      <div className="debug-info">
        <div>View: {currentView}</div>
        <div>Globe: {activeGlobeId || 'None'}</div>
        <div>Card: {currentCardIndex + 1}/{activeGlobe?.contentPoints.length || 0}</div>
        <div>Transitioning: {isTransitioning ? 'Yes' : 'No'}</div>
      </div>
    </div>
  )
}

export default GlobeSystem
