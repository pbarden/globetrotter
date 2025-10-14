# Globetrotter - Comprehensive Refactor Plan

> **Project Type:** PWA Video Game
> **Current State:** Main menu and foundational systems
> **Goal:** Establish scalable, reusable architecture for game development

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Core Philosophy](#core-philosophy)
3. [Refactor Strategy](#refactor-strategy)
4. [Phase 1: Foundation - Core Systems](#phase-1-foundation---core-systems)
5. [Phase 2: Visual Object Library](#phase-2-visual-object-library)
6. [Phase 3: Interaction & Animation System](#phase-3-interaction--animation-system)
7. [Phase 4: Game State & Level System](#phase-4-game-state--level-system)
8. [Phase 5: Content Pipeline](#phase-5-content-pipeline)
9. [Implementation Guidelines](#implementation-guidelines)
10. [File Structure Proposal](#file-structure-proposal)

---

## Current Architecture Analysis

### System Overview

**Entry Point:**
- `main.jsx` - Feature flag toggling between original App and multi-globe system
- Currently uses `GlobeSystem` (multi-globe mode)

**Two Operational Modes:**

1. **Original App (`App.jsx`)** - Single globe with 16 content cards (4x4 grid)
2. **Multi-Globe System (`systems/multi-globe/`)** - Multiple globes with planet map navigation

### Core Components Inventory

#### Visual Components
- **Globe.jsx** - 3D icosahedron with rainbow vertex colors, entry/exit animations
- **SimplifiedGlobe.jsx** - Lightweight version for planet map
- **BlobLasso.jsx** - Triple-layered animated SVG blobs with pseudo-3D effects
- **ContentCard.jsx** - Card container with pluggable layout system
- **LoadingScreen.jsx** - Initial loading animation

#### Layout Components
- **DefaultLayout.jsx** - Complex grid-based info card
- **TitleCardLayout.jsx** - Game title screen with menu buttons

#### Multi-Globe System
- **GlobeSystem.jsx** - Navigation controller (3 views: home planet, planet map, individual globe)
- **GlobeContainer.jsx** - Config-driven globe viewer
- **PlanetMap.jsx** - 2D planet overview with physics-based animations
- **PlanetInstance.jsx** - Individual planet representation on map

#### Configuration System
- **globeConfigs.js** - Globe definitions and content points
- **sizeSpecs.js** - Size specifications (tiny/small/medium/large)
- **rotationMaps.js** - Card rotation calculations
- **quadrantLayout.js** - Planet positioning logic
- **cardTemplates.js** - Template registry

#### Utilities
- **collisionDetection.js** - Spatial calculations
- **gridCalculations.js** - Grid navigation logic
- **performanceHelpers.js** - Optimization utilities
- **rotationHelpers.js** - 3D rotation calculations

### Strengths of Current Architecture

✅ **Unified Color System** - 10-color palette consistently applied across all components
✅ **Config-Driven Content** - Globes and cards defined via configuration objects
✅ **Layout Abstraction** - Pluggable layout system for content cards
✅ **Size Specifications** - Scalable globe sizes with associated properties
✅ **Sophisticated Animations** - Complex entry/exit sequences with proper timing
✅ **Performance Optimizations** - Memoization, RAF throttling, strategic re-renders

### Areas for Improvement

⚠️ **Component Duplication** - Globe vs SimplifiedGlobe, similar logic in App.jsx vs GlobeContainer.jsx
⚠️ **Hardcoded Styles** - Inline styles scattered throughout components
⚠️ **Limited Reusability** - Blobs tied to content cards, not general-purpose
⚠️ **No Game Logic Layer** - Missing level system, event system, entity management
⚠️ **Button Components** - No standardized button/UI component library
⚠️ **Animation Management** - Animation logic embedded in components

---

## Core Philosophy

### Video Game Object Consistency

In video games, **consistency is paramount**. Every element should behave predictably:

- **Buttons** - Same appearance, animations, sound, and behavior everywhere
- **Planets/Globes** - Same visual style, rotation, lighting regardless of context
- **Blobs** - Same animation patterns whether used for decoration, feedback, or effects
- **Transitions** - Consistent timing and easing across all state changes

### Abstraction Principle

Elements should be **context-agnostic** and **purpose-flexible**:

**Example: Blob System**
- ✅ Menu decoration (current use)
- ✅ Click/touch feedback indicator
- ✅ Static background elements in planet skies
- ✅ Animated hyperspace tunnel particles
- ✅ Enemy/collectible visual effects
- ✅ Loading screen decorations

**Example: Globe/Planet System**
- ✅ Main interactive object (current use)
- ✅ Background skybox decoration
- ✅ Minimap representation
- ✅ Collectible item
- ✅ Enemy unit
- ✅ Interactive puzzle element

### Composition Over Inheritance

Build complex systems from simple, reusable primitives:

```
Level = Scene + Entities + Events + Transitions
Entity = Visual + Behavior + State
Visual = Mesh + Material + Animation
```

---

## Refactor Strategy

### Guiding Principles

1. **Preserve Working Features** - Current menu system is functionally perfect
2. **Extract, Don't Rewrite** - Identify reusable patterns and extract them
3. **Build Libraries** - Create reusable object/component libraries
4. **Config-Driven** - Levels, entities, and experiences defined via configuration
5. **Performance First** - Maintain current optimizations, add more where needed

### Refactor Phases

**Phase 1:** Foundation - Core Systems (Color, Animation, State Management)
**Phase 2:** Visual Object Library (Globes, Blobs, Particles, UI Components)
**Phase 3:** Interaction & Animation System (Events, Gestures, Transitions)
**Phase 4:** Game State & Level System (Scenes, Levels, Progression)
**Phase 5:** Content Pipeline (Tools for creating levels/experiences)

---

## Phase 1: Foundation - Core Systems

### 1.1 Design System Foundation

**Purpose:** Establish single source of truth for all visual properties

**Files to Create:**
```
src/
  core/
    design-system/
      colors.js         - Color palette, schemes, utilities
      spacing.js        - Spacing scale, layout constants
      typography.js     - Font scales, weights, styles
      animations.js     - Animation durations, easings, keyframes
      shadows.js        - Shadow definitions
      gradients.js      - Gradient presets
```

**colors.js Example:**
```javascript
export const PALETTE = {
  primary: ['#ffd700', '#ff00ff', '#00ff88', ...],
  semantic: {
    success: '#00ff88',
    warning: '#ff9500',
    error: '#ff6b6b',
    info: '#00ffff'
  }
}

export const colorSchemes = [
  { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' },
  // ... rest from current implementation
]

export function getColorScheme(index) {
  return colorSchemes[index % colorSchemes.length]
}

export function interpolateColor(color1, color2, factor) {
  // Move from BlobLasso to shared utility
}
```

**animations.js Example:**
```javascript
export const DURATIONS = {
  instant: 0,
  fast: 200,
  normal: 400,
  slow: 650,
  verySlow: 1000
}

export const EASINGS = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
}

export const ANIMATION_SEQUENCES = {
  cardFlyIn: {
    duration: DURATIONS.slow,
    easing: EASINGS.elastic
  },
  globeBounce: {
    duration: DURATIONS.verySlow,
    easing: EASINGS.bounce
  }
  // ... extract current animation patterns
}
```

### 1.2 State Management Layer

**Purpose:** Centralized state for game progression, settings, user data

**Files to Create:**
```
src/
  core/
    state/
      GameStateManager.js    - Global game state
      SettingsManager.js     - User settings/preferences
      ProgressionManager.js  - Level unlocks, achievements
      hooks/
        useGameState.js
        useSettings.js
        useProgression.js
```

**GameStateManager.js Example:**
```javascript
class GameStateManager {
  constructor() {
    this.state = {
      currentLevel: null,
      currentScene: 'home',
      playerData: {},
      flags: {},
      inventory: []
    }
    this.listeners = []
  }

  setState(updates) {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  // ... methods for level transitions, scene management
}

export const gameState = new GameStateManager()
```

### 1.3 Event System

**Purpose:** Decoupled event handling for game interactions

**Files to Create:**
```
src/
  core/
    events/
      EventBus.js           - Central event dispatcher
      gameEvents.js         - Game event constants
      InputManager.js       - Unified input handling
```

**EventBus.js Example:**
```javascript
class EventBus {
  constructor() {
    this.events = {}
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
    return () => this.off(event, callback)
  }

  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(data))
  }

  off(event, callback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }
}

export const eventBus = new EventBus()
```

**gameEvents.js Example:**
```javascript
export const GAME_EVENTS = {
  // Navigation
  SCENE_TRANSITION_START: 'scene:transition:start',
  SCENE_TRANSITION_COMPLETE: 'scene:transition:complete',

  // Interaction
  ENTITY_CLICK: 'entity:click',
  ENTITY_HOVER: 'entity:hover',

  // Game State
  LEVEL_START: 'level:start',
  LEVEL_COMPLETE: 'level:complete',

  // UI
  BUTTON_CLICK: 'ui:button:click',
  MODAL_OPEN: 'ui:modal:open',
  MODAL_CLOSE: 'ui:modal:close'
}
```

### 1.4 Utility Library Consolidation

**Purpose:** Centralize all helper functions

**Files to Reorganize:**
```
src/
  core/
    utils/
      math.js               - Mathematical utilities
      geometry.js           - 3D calculations, rotations
      grid.js               - Grid navigation (from gridCalculations.js)
      collision.js          - Collision detection
      performance.js        - Performance optimization helpers
      animation.js          - Animation utilities (RAF, interpolation)
```

**Extract from existing:**
- `rotationHelpers.js` → `geometry.js`
- `gridCalculations.js` → `grid.js`
- `collisionDetection.js` → `collision.js`
- `performanceHelpers.js` → `performance.js`

---

## Phase 2: Visual Object Library

### 2.1 Globe/Planet System Unification

**Current Issue:** `Globe.jsx` and `SimplifiedGlobe.jsx` have duplicated logic

**Solution:** Single configurable Globe component

**Files to Create/Modify:**
```
src/
  entities/
    globe/
      Globe.jsx                  - Unified globe component
      GlobeGeometry.js           - Geometry generation
      GlobeMaterial.js           - Material configuration
      GlobeAnimations.js         - Animation behaviors
      presets/
        StandardGlobe.jsx        - Full-featured globe (current Globe.jsx)
        SimplifiedGlobe.jsx      - Lightweight globe (current SimplifiedGlobe.jsx)
        StaticGlobe.jsx          - Non-animated background version
        MiniGlobe.jsx            - Minimap/icon version
```

**Globe.jsx (Unified) Architecture:**
```javascript
export function Globe({
  // Visual
  scale = 1,
  subdivision = 2,
  colorMode = 'rainbow', // 'rainbow' | 'solid' | 'wireframe' | 'static'

  // Behavior
  enableRotation = true,
  enableIdleSpin = true,
  targetRotation = null,

  // Animation
  enableEntryAnimation = true,
  enableExitAnimation = false,
  entryStyle = 'bounce', // 'bounce' | 'fade' | 'fall' | 'none'

  // Performance
  enableColorCycling = true,
  colorUpdateRate = 30, // fps

  // Lighting
  enablePointLights = true,
  customLights = [],

  // Events
  onClick = null,
  onHover = null,
  onAnimationComplete = null,

  // Three.js
  ...threeProps
}) {
  // Unified implementation that handles all use cases
}
```

**Preset Usage:**
```javascript
// In main globe viewer
<StandardGlobe
  targetRotation={rotation}
  onAnimationComplete={handleComplete}
/>

// In planet map
<SimplifiedGlobe
  size="small"
  enableIdleSpin
  colorUpdateRate={15} // Lower for performance
/>

// In background
<StaticGlobe
  scale={0.3}
  enableRotation={false}
  colorMode="wireframe"
/>
```

### 2.2 Blob System Abstraction

**Current Issue:** Blobs are tied to ContentCard context

**Solution:** General-purpose blob system

**Files to Create:**
```
src/
  entities/
    blob/
      Blob.jsx                   - Single blob component
      BlobGroup.jsx              - Multiple blob orchestration
      BlobAnimator.js            - Animation engine
      BlobGeometry.js            - Path generation
      presets/
        DecorationBlobs.jsx      - Current BlobLasso implementation
        ParticleBlob.jsx         - Single particle blob
        BackgroundBlobs.jsx      - Static/slow-moving background
        InteractionBlob.jsx      - Click/touch feedback
        HyperspaceBlobs.jsx      - Tunnel effect blobs
```

**Blob.jsx Architecture:**
```javascript
export function Blob({
  // Position
  position = { x: 0, y: 0 },
  positionMode = 'fixed', // 'fixed' | 'random' | 'follow-cursor' | 'physics'

  // Visual
  colors = ['#ffd700', '#ff8c00', '#ffaa00'],
  gradientMode = 'linear', // 'linear' | 'radial'
  scale = 1,
  rotation = 0,
  squash = { x: 1, y: 1 }, // Pseudo-3D squashing

  // Animation
  animationSpeed = 0.8,
  morphSpeed = 1,
  enablePulse = false,
  pulseRange = [0.9, 1.1],

  // Behavior
  enablePhysics = false,
  velocity = { x: 0, y: 0 },

  // Entry/Exit
  entryAnimation = 'scale', // 'scale' | 'fade' | 'none'
  exitAnimation = 'scale',
  staggerDelay = 0,

  // Performance
  updateRate = 30, // fps
  simplifyPath = false,

  // Events
  onClick = null,
  onHover = null,
  onAnimationComplete = null
}) {
  // Unified blob implementation
}
```

**BlobGroup.jsx Usage:**
```javascript
// Decorative blobs (current use case)
<BlobGroup
  count={3}
  positionMode="random"
  colors={getColorScheme(colorIndex)}
  stagger={100}
/>

// Click feedback
<BlobGroup
  count={5}
  positionMode="physics"
  entryAnimation="burst"
  lifetime={1000}
  onComplete={cleanup}
/>

// Background decoration
<BlobGroup
  count={10}
  positionMode="random"
  animationSpeed={0.2}
  scale={0.5}
  opacity={0.3}
/>
```

### 2.3 UI Component Library

**Purpose:** Standardized, reusable UI components

**Files to Create:**
```
src/
  components/
    ui/
      Button/
        Button.jsx
        Button.css
        variants.js          - Button style variants
      Card/
        Card.jsx
        CardHeader.jsx
        CardBody.jsx
        CardFooter.jsx
      Modal/
        Modal.jsx
        ModalTransitions.js
      Input/
        Input.jsx
        TextInput.jsx
        Slider.jsx
        Toggle.jsx
      Icon/
        Icon.jsx
        IconButton.jsx
      Layout/
        Container.jsx
        Grid.jsx
        Flex.jsx
        Spacer.jsx
```

**Button.jsx Example:**
```javascript
export function Button({
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'medium', // 'small' | 'medium' | 'large'
  colorScheme = null, // Uses theme if null
  icon = null,
  iconPosition = 'right', // 'left' | 'right'
  isDisabled = false,
  isLoading = false,
  onClick = null,
  children
}) {
  const scheme = colorScheme || useThemeColors()
  const styles = getButtonStyles(variant, size, scheme)

  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      style={styles}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && <Icon name={icon} />}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && <Icon name={icon} />}
      {isLoading && <LoadingSpinner />}
    </button>
  )
}
```

**Usage in TitleCardLayout:**
```javascript
// Before (inline styles)
<button
  className="menu-button floating-card"
  style={{
    borderColor: currentScheme.primary + '66',
    background: `linear-gradient(...)`
  }}
>
  <Icons.Settings ... />
  <span ...>Settings</span>
</button>

// After (standardized)
<Button
  variant="secondary"
  icon="Settings"
  colorScheme={currentScheme}
>
  Settings
</Button>
```

### 2.4 Content Layout System Enhancement

**Current State:** 2 layouts (Default, TitleCard)

**Goal:** Expand to support multiple game screens

**Files to Create:**
```
src/
  components/
    layouts/
      registry.js               - Layout registry
      LayoutRenderer.jsx        - Dynamic layout renderer

      game-layouts/
        TitleScreenLayout.jsx   - Current TitleCardLayout
        InfoCardLayout.jsx      - Current DefaultLayout
        LevelSelectLayout.jsx   - NEW: Level selection grid
        InventoryLayout.jsx     - NEW: Inventory management
        DialogueLayout.jsx      - NEW: Character dialogue
        PauseMenuLayout.jsx     - NEW: Pause screen
        StatsLayout.jsx         - NEW: Player stats/progress
        ShopLayout.jsx          - NEW: In-game shop
        MapLayout.jsx           - NEW: World map view
        BattleLayout.jsx        - NEW: Battle/combat screen
```

**registry.js Example:**
```javascript
import { TitleScreenLayout } from './game-layouts/TitleScreenLayout'
import { InfoCardLayout } from './game-layouts/InfoCardLayout'
// ... imports

export const LAYOUT_TYPES = {
  TITLE_SCREEN: 'titleScreen',
  INFO_CARD: 'infoCard',
  LEVEL_SELECT: 'levelSelect',
  INVENTORY: 'inventory',
  DIALOGUE: 'dialogue',
  PAUSE_MENU: 'pauseMenu',
  // ... more
}

export const layoutRegistry = {
  [LAYOUT_TYPES.TITLE_SCREEN]: TitleScreenLayout,
  [LAYOUT_TYPES.INFO_CARD]: InfoCardLayout,
  [LAYOUT_TYPES.LEVEL_SELECT]: LevelSelectLayout,
  // ... more
}

export function getLayout(type) {
  return layoutRegistry[type] || InfoCardLayout
}
```

**LayoutRenderer.jsx:**
```javascript
export function LayoutRenderer({ type, content, ...props }) {
  const LayoutComponent = getLayout(type)
  return <LayoutComponent content={content} {...props} />
}
```

### 2.5 Particle System

**Purpose:** Flexible particle effects for visual polish

**Files to Create:**
```
src/
  entities/
    particles/
      Particle.jsx              - Single particle
      ParticleEmitter.jsx       - Particle spawner
      ParticleSystem.jsx        - Full particle system manager
      presets/
        ExplosionParticles.jsx
        TrailParticles.jsx
        SparkleParticles.jsx
        DustParticles.jsx
```

**ParticleEmitter.jsx Example:**
```javascript
export function ParticleEmitter({
  position = { x: 0, y: 0 },
  emissionRate = 10, // particles per second
  particleLifetime = 1000, // ms
  particleConfig = {},
  emitterShape = 'point', // 'point' | 'circle' | 'rectangle'
  direction = { min: 0, max: 360 },
  velocity = { min: 1, max: 5 },
  gravity = 0,
  maxParticles = 100,
  autoStart = true,
  duration = null // null = infinite
}) {
  // Particle emission logic
}
```

---

## Phase 3: Interaction & Animation System

### 3.1 Animation Controller

**Purpose:** Centralized animation orchestration

**Files to Create:**
```
src/
  core/
    animation/
      AnimationController.js    - Central animation manager
      AnimationSequence.js      - Chain multiple animations
      TransitionManager.js      - Scene/state transitions
      hooks/
        useAnimation.js
        useTransition.js
        useSequence.js
```

**AnimationController.js Example:**
```javascript
class AnimationController {
  constructor() {
    this.animations = new Map()
    this.raf = null
  }

  register(id, animation) {
    this.animations.set(id, {
      ...animation,
      startTime: null,
      progress: 0,
      state: 'idle' // 'idle' | 'running' | 'paused' | 'complete'
    })
  }

  play(id) {
    const anim = this.animations.get(id)
    if (!anim) return

    anim.state = 'running'
    anim.startTime = performance.now()
    this.startLoop()
  }

  // ... pause, stop, update methods
}

export const animationController = new AnimationController()
```

**useAnimation Hook:**
```javascript
export function useAnimation(config) {
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = useCallback(() => {
    const id = generateId()
    animationController.register(id, {
      duration: config.duration,
      easing: config.easing,
      onUpdate: setProgress,
      onComplete: config.onComplete
    })
    animationController.play(id)
    setIsPlaying(true)
  }, [config])

  return { progress, isPlaying, play, pause, stop }
}
```

### 3.2 Gesture System

**Purpose:** Unified input handling (mouse, touch, keyboard, gamepad)

**Files to Create:**
```
src/
  core/
    input/
      GestureRecognizer.js      - Detect swipes, pinches, etc.
      InputMapper.js            - Map inputs to game actions
      KeyboardHandler.js        - Keyboard input
      GamepadHandler.js         - Gamepad support
      hooks/
        useGesture.js
        useKeyboard.js
        useGamepad.js
```

**GestureRecognizer.js Example:**
```javascript
class GestureRecognizer {
  constructor(element) {
    this.element = element
    this.gestures = {
      swipe: { threshold: 50, timeLimit: 300 },
      pinch: { threshold: 20 },
      longPress: { duration: 500 }
    }
    this.setupListeners()
  }

  on(gesture, callback) {
    // Subscribe to gesture events
  }

  detectSwipe(startEvent, endEvent) {
    const deltaX = endEvent.clientX - startEvent.clientX
    const deltaY = endEvent.clientY - startEvent.clientY
    const deltaTime = endEvent.timeStamp - startEvent.timeStamp

    if (Math.abs(deltaX) > this.gestures.swipe.threshold ||
        Math.abs(deltaY) > this.gestures.swipe.threshold) {
      return {
        direction: this.getSwipeDirection(deltaX, deltaY),
        velocity: this.calculateVelocity(deltaX, deltaY, deltaTime)
      }
    }
    return null
  }

  // ... more gesture detection logic
}
```

### 3.3 Transition System

**Purpose:** Smooth scene/state transitions

**Files to Create:**
```
src/
  core/
    transitions/
      TransitionRegistry.js     - Available transition effects
      SceneTransition.jsx       - Scene transition wrapper
      presets/
        FadeTransition.jsx
        SlideTransition.jsx
        ZoomTransition.jsx
        DissolveTransition.jsx
```

**Example Transition Definitions:**
```javascript
export const TRANSITIONS = {
  FADE: {
    name: 'fade',
    duration: 400,
    in: { opacity: [0, 1] },
    out: { opacity: [1, 0] }
  },

  SLIDE_LEFT: {
    name: 'slideLeft',
    duration: 650,
    in: { x: [100, 0], opacity: [0, 1] },
    out: { x: [0, -100], opacity: [1, 0] }
  },

  ZOOM: {
    name: 'zoom',
    duration: 500,
    in: { scale: [0.8, 1], opacity: [0, 1] },
    out: { scale: [1, 1.2], opacity: [1, 0] }
  }
}
```

---

## Phase 4: Game State & Level System

### 4.1 Scene System

**Purpose:** Container for game experiences (levels, menus, cutscenes)

**Files to Create:**
```
src/
  game/
    scenes/
      Scene.js                  - Base scene class
      SceneManager.js           - Scene lifecycle management

      types/
        MenuScene.js            - Menu scenes
        GameplayScene.js        - Gameplay levels
        CutsceneScene.js        - Story sequences
        TransitionScene.js      - Loading/transitions
```

**Scene.js Architecture:**
```javascript
export class Scene {
  constructor(config) {
    this.id = config.id
    this.name = config.name
    this.entities = []
    this.cameras = []
    this.lights = []
    this.background = config.background
    this.music = config.music
  }

  // Lifecycle methods
  async load() {
    // Load assets, initialize entities
  }

  start() {
    // Begin scene logic
  }

  update(deltaTime) {
    // Update all entities
    this.entities.forEach(entity => entity.update(deltaTime))
  }

  pause() {
    // Pause scene
  }

  resume() {
    // Resume scene
  }

  unload() {
    // Clean up resources
  }

  // Entity management
  addEntity(entity) {
    this.entities.push(entity)
  }

  removeEntity(entityId) {
    this.entities = this.entities.filter(e => e.id !== entityId)
  }

  getEntity(entityId) {
    return this.entities.find(e => e.id === entityId)
  }
}
```

**SceneManager.js:**
```javascript
class SceneManager {
  constructor() {
    this.scenes = new Map()
    this.currentScene = null
    this.isTransitioning = false
  }

  register(scene) {
    this.scenes.set(scene.id, scene)
  }

  async transitionTo(sceneId, transitionConfig = {}) {
    if (this.isTransitioning) return
    this.isTransitioning = true

    const nextScene = this.scenes.get(sceneId)
    if (!nextScene) throw new Error(`Scene not found: ${sceneId}`)

    // 1. Exit current scene
    if (this.currentScene) {
      await this.currentScene.exit(transitionConfig)
    }

    // 2. Load next scene
    await nextScene.load()

    // 3. Enter next scene
    await nextScene.enter(transitionConfig)

    // 4. Update current scene
    this.currentScene = nextScene
    this.isTransitioning = false

    // 5. Emit event
    eventBus.emit(GAME_EVENTS.SCENE_TRANSITION_COMPLETE, { sceneId })
  }

  getCurrentScene() {
    return this.currentScene
  }
}

export const sceneManager = new SceneManager()
```

### 4.2 Entity System

**Purpose:** Unified object management (ECS-lite architecture)

**Files to Create:**
```
src/
  game/
    entities/
      Entity.js                 - Base entity class
      EntityManager.js          - Entity lifecycle
      components/
        Transform.js            - Position, rotation, scale
        Visual.js               - Renderable component
        Behavior.js             - Logic component
        Collider.js             - Collision component
        Animator.js             - Animation component
        AudioSource.js          - Audio component
```

**Entity.js:**
```javascript
export class Entity {
  constructor(config) {
    this.id = config.id || generateId()
    this.name = config.name
    this.components = new Map()
    this.active = true
  }

  addComponent(type, component) {
    this.components.set(type, component)
    component.entity = this
    return this
  }

  getComponent(type) {
    return this.components.get(type)
  }

  hasComponent(type) {
    return this.components.has(type)
  }

  removeComponent(type) {
    const component = this.components.get(type)
    if (component) {
      component.destroy()
      this.components.delete(type)
    }
  }

  update(deltaTime) {
    if (!this.active) return
    this.components.forEach(component => {
      if (component.update) {
        component.update(deltaTime)
      }
    })
  }

  destroy() {
    this.components.forEach(component => component.destroy())
    this.components.clear()
    this.active = false
  }
}
```

**Example Entity Usage:**
```javascript
// Create a spinning globe entity
const globe = new Entity({ name: 'MainGlobe' })
  .addComponent('transform', new Transform({
    position: { x: 0, y: 0, z: 0 },
    scale: 1.2
  }))
  .addComponent('visual', new Visual({
    mesh: 'globe',
    material: 'rainbow'
  }))
  .addComponent('animator', new Animator({
    animations: ['idle-spin', 'bounce-entry']
  }))
  .addComponent('behavior', new Behavior({
    onUpdate: (entity, deltaTime) => {
      // Custom logic
    }
  }))

scene.addEntity(globe)
```

### 4.3 Level System

**Purpose:** Config-driven level definitions

**Files to Create:**
```
src/
  game/
    levels/
      Level.js                  - Level class
      LevelLoader.js            - Load level from config
      LevelRegistry.js          - All level definitions

      definitions/
        tutorial/
          level-01.js
          level-02.js
        world-01/
          level-01.js
          level-02.js
```

**Level Definition Example:**
```javascript
// levels/definitions/tutorial/level-01.js
export const tutorialLevel01 = {
  id: 'tutorial-01',
  name: 'Welcome to Globetrotter',

  scene: {
    background: 'space-gradient',
    music: 'ambient-01',

    entities: [
      {
        type: 'globe',
        id: 'main-globe',
        config: {
          size: 'large',
          position: { x: 0, y: 0, z: 0 },
          contentPoints: [
            {
              id: 0,
              layout: 'titleScreen',
              content: {
                heading: 'Tutorial',
                subheading: 'Learn the Basics',
                // ...
              }
            }
            // ... more content points
          ]
        }
      },
      {
        type: 'blob-group',
        id: 'decoration-blobs',
        config: {
          count: 5,
          positionMode: 'random',
          colors: 'scheme-0'
        }
      }
    ],

    cameras: [
      {
        id: 'main-camera',
        position: { x: 0, y: 0, z: 8 },
        fov: 50
      }
    ],

    lights: [
      { type: 'ambient', intensity: 0.3 },
      { type: 'point', position: [10, 10, 10], intensity: 1.2 }
    ]
  },

  progression: {
    objectives: [
      { id: 'scroll-tutorial', description: 'Scroll in any direction' },
      { id: 'visit-all-cards', description: 'Visit all 16 content points' }
    ],

    unlocks: ['tutorial-02'], // What levels unlock on completion

    rewards: {
      experience: 100,
      items: ['basic-badge']
    }
  },

  events: [
    {
      trigger: 'on-start',
      actions: [
        { type: 'show-message', text: 'Welcome! Try scrolling.' }
      ]
    },
    {
      trigger: 'on-objective-complete',
      objectiveId: 'scroll-tutorial',
      actions: [
        { type: 'show-message', text: 'Great! Keep exploring.' }
      ]
    }
  ]
}
```

### 4.4 Progression System

**Purpose:** Track player progress, unlocks, achievements

**Files to Create:**
```
src/
  game/
    progression/
      ProgressionManager.js     - Track player progress
      UnlockSystem.js           - Manage unlockables
      AchievementSystem.js      - Track achievements
      SaveSystem.js             - Save/load player data
```

**ProgressionManager.js:**
```javascript
class ProgressionManager {
  constructor() {
    this.playerData = {
      levelsCompleted: [],
      levelsUnlocked: ['tutorial-01'],
      achievements: [],
      stats: {
        totalPlayTime: 0,
        cardsVisited: 0,
        globesExplored: 0
      },
      inventory: []
    }
  }

  completeLevel(levelId, rewards) {
    if (!this.playerData.levelsCompleted.includes(levelId)) {
      this.playerData.levelsCompleted.push(levelId)

      // Unlock new levels
      if (rewards.unlocks) {
        this.playerData.levelsUnlocked.push(...rewards.unlocks)
      }

      // Add rewards
      if (rewards.items) {
        this.playerData.inventory.push(...rewards.items)
      }

      this.save()
      eventBus.emit(GAME_EVENTS.LEVEL_COMPLETE, { levelId, rewards })
    }
  }

  isLevelUnlocked(levelId) {
    return this.playerData.levelsUnlocked.includes(levelId)
  }

  save() {
    localStorage.setItem('globetrotter-save', JSON.stringify(this.playerData))
  }

  load() {
    const saved = localStorage.getItem('globetrotter-save')
    if (saved) {
      this.playerData = JSON.parse(saved)
    }
  }
}

export const progressionManager = new ProgressionManager()
```

---

## Phase 5: Content Pipeline

### 5.1 Level Editor (Future Enhancement)

**Purpose:** Visual tool for creating levels

**Concept:**
- Drag-and-drop entity placement
- Visual globe content editing
- Event trigger configuration
- Export to level definition JSON

**Files (Conceptual):**
```
src/
  tools/
    level-editor/
      LevelEditor.jsx
      EntityPalette.jsx
      PropertiesPanel.jsx
      ScenePreview.jsx
      ExportTool.jsx
```

### 5.2 Content Validation

**Purpose:** Validate level definitions before runtime

**Files to Create:**
```
src/
  game/
    validation/
      LevelValidator.js         - Validate level configs
      EntityValidator.js        - Validate entity configs
      SchemaDefinitions.js      - JSON schemas
```

**LevelValidator.js Example:**
```javascript
export class LevelValidator {
  validate(levelConfig) {
    const errors = []

    // Check required fields
    if (!levelConfig.id) errors.push('Missing level ID')
    if (!levelConfig.scene) errors.push('Missing scene definition')

    // Validate entities
    if (levelConfig.scene.entities) {
      levelConfig.scene.entities.forEach((entity, index) => {
        if (!entity.type) {
          errors.push(`Entity ${index} missing type`)
        }
        if (!entity.id) {
          errors.push(`Entity ${index} missing ID`)
        }
      })
    }

    // Validate events
    if (levelConfig.events) {
      levelConfig.events.forEach((event, index) => {
        if (!event.trigger) {
          errors.push(`Event ${index} missing trigger`)
        }
        if (!event.actions || event.actions.length === 0) {
          errors.push(`Event ${index} has no actions`)
        }
      })
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}
```

### 5.3 Asset Management

**Purpose:** Centralized asset loading and caching

**Files to Create:**
```
src/
  core/
    assets/
      AssetLoader.js            - Load and cache assets
      AssetManifest.js          - Asset registry
      preloader.js              - Preload critical assets
```

**AssetLoader.js:**
```javascript
class AssetLoader {
  constructor() {
    this.cache = new Map()
    this.loading = new Map()
  }

  async load(assetPath, type) {
    // Check cache
    if (this.cache.has(assetPath)) {
      return this.cache.get(assetPath)
    }

    // Check if already loading
    if (this.loading.has(assetPath)) {
      return this.loading.get(assetPath)
    }

    // Load asset
    const loadPromise = this.loadAsset(assetPath, type)
    this.loading.set(assetPath, loadPromise)

    try {
      const asset = await loadPromise
      this.cache.set(assetPath, asset)
      this.loading.delete(assetPath)
      return asset
    } catch (error) {
      this.loading.delete(assetPath)
      throw error
    }
  }

  async loadAsset(assetPath, type) {
    switch (type) {
      case 'image':
        return this.loadImage(assetPath)
      case 'audio':
        return this.loadAudio(assetPath)
      case 'json':
        return this.loadJSON(assetPath)
      case 'model':
        return this.loadModel(assetPath)
      default:
        throw new Error(`Unknown asset type: ${type}`)
    }
  }

  // ... specific loading methods
}

export const assetLoader = new AssetLoader()
```

---

## Implementation Guidelines

### Migration Strategy

**Step 1: Create New Structure (No Breaking Changes)**
- Create all new folders/files alongside existing code
- Don't modify existing components yet
- Build new systems independently

**Step 2: Extract Utilities First**
- Move shared utilities to `core/utils/`
- Update imports across codebase
- Test thoroughly

**Step 3: Build Design System**
- Create `core/design-system/`
- Extract colors, animations, spacing
- Start using in new components

**Step 4: Refactor One Component at a Time**
- Start with smallest impact (e.g., Button)
- Replace inline styles with design system
- Test each component individually

**Step 5: Unify Globe System**
- Create new unified Globe component
- Test with existing use cases
- Replace Globe.jsx and SimplifiedGlobe.jsx
- Update all imports

**Step 6: Abstract Blob System**
- Extract blob logic to new structure
- Create BlobGroup wrapper
- Replace BlobLasso with DecorationBlobs preset
- Test visual parity

**Step 7: Build Game Systems**
- Implement Scene system
- Implement Entity system
- Convert existing globe views to Scenes
- Test scene transitions

**Step 8: Create First Config-Driven Level**
- Define tutorial level in new format
- Load level via LevelLoader
- Test full level flow
- Iterate on level schema

### Testing Approach

**Visual Regression Testing:**
- Take screenshots before refactor
- Compare after each component refactor
- Ensure pixel-perfect visual parity

**Performance Testing:**
- Measure FPS before/after
- Check memory usage
- Ensure no performance degradation

**Manual Testing Checklist:**
- [ ] Globe rotation smooth
- [ ] Card transitions work
- [ ] Blob animations consistent
- [ ] Planet map navigation
- [ ] Color schemes applied correctly
- [ ] Buttons respond properly
- [ ] Keyboard navigation works
- [ ] Touch gestures work on mobile
- [ ] Loading screen displays
- [ ] Scene transitions smooth

### Code Style Guidelines

**Naming Conventions:**
- Components: `PascalCase` (e.g., `Globe.jsx`)
- Utilities: `camelCase` (e.g., `calculateRotation.js`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `ANIMATION_DURATIONS`)
- CSS Classes: `kebab-case` (e.g., `globe-container`)

**File Organization:**
```
Component/
  Component.jsx       - Main component
  Component.css       - Styles
  Component.test.js   - Tests
  index.js            - Barrel export
  utils.js            - Component-specific utilities
  constants.js        - Component constants
```

**Import Order:**
```javascript
// 1. React
import { useState, useEffect } from 'react'

// 2. Third-party libraries
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'

// 3. Core systems
import { eventBus, GAME_EVENTS } from '@/core/events'
import { getColorScheme } from '@/core/design-system'

// 4. Components
import { Button } from '@/components/ui/Button'
import { Globe } from '@/entities/globe'

// 5. Utilities
import { calculateRotation } from '@/core/utils/geometry'

// 6. Styles
import './Component.css'
```

**Component Structure:**
```javascript
/**
 * ComponentName - Brief description
 *
 * @param {Object} props - Component props
 * @param {string} props.propName - Description
 * @returns {JSX.Element}
 */
export function ComponentName({
  // Destructure props with defaults
  prop1 = defaultValue,
  prop2,
  ...rest
}) {
  // 1. Hooks
  const [state, setState] = useState(initialState)
  const ref = useRef(null)

  // 2. Derived values
  const derivedValue = useMemo(() => calculate(prop1), [prop1])

  // 3. Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    }
  }, [dependencies])

  // 4. Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependencies])

  // 5. Render helpers
  const renderSubComponent = () => {
    return <div>...</div>
  }

  // 6. Return JSX
  return (
    <div className="component-name">
      {renderSubComponent()}
    </div>
  )
}
```

---

## File Structure Proposal

```
globetrotter/
├── public/
│   └── assets/
│       ├── images/
│       ├── audio/
│       ├── models/
│       └── fonts/
│
├── src/
│   │
│   ├── core/                           # Core engine systems
│   │   ├── design-system/              # Visual design tokens
│   │   │   ├── colors.js
│   │   │   ├── spacing.js
│   │   │   ├── typography.js
│   │   │   ├── animations.js
│   │   │   ├── shadows.js
│   │   │   └── gradients.js
│   │   │
│   │   ├── state/                      # State management
│   │   │   ├── GameStateManager.js
│   │   │   ├── SettingsManager.js
│   │   │   ├── ProgressionManager.js
│   │   │   └── hooks/
│   │   │       ├── useGameState.js
│   │   │       ├── useSettings.js
│   │   │       └── useProgression.js
│   │   │
│   │   ├── events/                     # Event system
│   │   │   ├── EventBus.js
│   │   │   ├── gameEvents.js
│   │   │   └── InputManager.js
│   │   │
│   │   ├── animation/                  # Animation system
│   │   │   ├── AnimationController.js
│   │   │   ├── AnimationSequence.js
│   │   │   ├── TransitionManager.js
│   │   │   └── hooks/
│   │   │       ├── useAnimation.js
│   │   │       ├── useTransition.js
│   │   │       └── useSequence.js
│   │   │
│   │   ├── input/                      # Input handling
│   │   │   ├── GestureRecognizer.js
│   │   │   ├── InputMapper.js
│   │   │   ├── KeyboardHandler.js
│   │   │   ├── GamepadHandler.js
│   │   │   └── hooks/
│   │   │       ├── useGesture.js
│   │   │       ├── useKeyboard.js
│   │   │       └── useGamepad.js
│   │   │
│   │   ├── assets/                     # Asset management
│   │   │   ├── AssetLoader.js
│   │   │   ├── AssetManifest.js
│   │   │   └── preloader.js
│   │   │
│   │   ├── utils/                      # Core utilities
│   │   │   ├── math.js
│   │   │   ├── geometry.js
│   │   │   ├── grid.js
│   │   │   ├── collision.js
│   │   │   ├── performance.js
│   │   │   └── animation.js
│   │   │
│   │   └── transitions/                # Scene transitions
│   │       ├── TransitionRegistry.js
│   │       ├── SceneTransition.jsx
│   │       └── presets/
│   │           ├── FadeTransition.jsx
│   │           ├── SlideTransition.jsx
│   │           ├── ZoomTransition.jsx
│   │           └── DissolveTransition.jsx
│   │
│   ├── components/                     # UI components
│   │   ├── ui/                         # Reusable UI elements
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.css
│   │   │   │   ├── variants.js
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── CardHeader.jsx
│   │   │   │   ├── CardBody.jsx
│   │   │   │   └── CardFooter.jsx
│   │   │   ├── Modal/
│   │   │   ├── Input/
│   │   │   ├── Icon/
│   │   │   └── Layout/
│   │   │
│   │   ├── layouts/                    # Content layouts
│   │   │   ├── registry.js
│   │   │   ├── LayoutRenderer.jsx
│   │   │   └── game-layouts/
│   │   │       ├── TitleScreenLayout.jsx
│   │   │       ├── InfoCardLayout.jsx
│   │   │       ├── LevelSelectLayout.jsx
│   │   │       ├── InventoryLayout.jsx
│   │   │       ├── DialogueLayout.jsx
│   │   │       ├── PauseMenuLayout.jsx
│   │   │       ├── StatsLayout.jsx
│   │   │       ├── ShopLayout.jsx
│   │   │       ├── MapLayout.jsx
│   │   │       └── BattleLayout.jsx
│   │   │
│   │   └── common/                     # Shared components
│   │       ├── LoadingScreen.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── DebugPanel.jsx
│   │
│   ├── entities/                       # Game objects
│   │   ├── globe/
│   │   │   ├── Globe.jsx               # Unified globe component
│   │   │   ├── GlobeGeometry.js
│   │   │   ├── GlobeMaterial.js
│   │   │   ├── GlobeAnimations.js
│   │   │   ├── index.js
│   │   │   └── presets/
│   │   │       ├── StandardGlobe.jsx
│   │   │       ├── SimplifiedGlobe.jsx
│   │   │       ├── StaticGlobe.jsx
│   │   │       └── MiniGlobe.jsx
│   │   │
│   │   ├── blob/
│   │   │   ├── Blob.jsx                # Single blob
│   │   │   ├── BlobGroup.jsx           # Multiple blobs
│   │   │   ├── BlobAnimator.js
│   │   │   ├── BlobGeometry.js
│   │   │   ├── index.js
│   │   │   └── presets/
│   │   │       ├── DecorationBlobs.jsx
│   │   │       ├── ParticleBlob.jsx
│   │   │       ├── BackgroundBlobs.jsx
│   │   │       ├── InteractionBlob.jsx
│   │   │       └── HyperspaceBlobs.jsx
│   │   │
│   │   └── particles/
│   │       ├── Particle.jsx
│   │       ├── ParticleEmitter.jsx
│   │       ├── ParticleSystem.jsx
│   │       └── presets/
│   │           ├── ExplosionParticles.jsx
│   │           ├── TrailParticles.jsx
│   │           ├── SparkleParticles.jsx
│   │           └── DustParticles.jsx
│   │
│   ├── game/                           # Game logic
│   │   ├── scenes/
│   │   │   ├── Scene.js
│   │   │   ├── SceneManager.js
│   │   │   └── types/
│   │   │       ├── MenuScene.js
│   │   │       ├── GameplayScene.js
│   │   │       ├── CutsceneScene.js
│   │   │       └── TransitionScene.js
│   │   │
│   │   ├── entities/                   # ECS system
│   │   │   ├── Entity.js
│   │   │   ├── EntityManager.js
│   │   │   └── components/
│   │   │       ├── Transform.js
│   │   │       ├── Visual.js
│   │   │       ├── Behavior.js
│   │   │       ├── Collider.js
│   │   │       ├── Animator.js
│   │   │       └── AudioSource.js
│   │   │
│   │   ├── levels/
│   │   │   ├── Level.js
│   │   │   ├── LevelLoader.js
│   │   │   ├── LevelRegistry.js
│   │   │   └── definitions/
│   │   │       ├── tutorial/
│   │   │       │   ├── level-01.js
│   │   │       │   └── level-02.js
│   │   │       └── world-01/
│   │   │           ├── level-01.js
│   │   │           └── level-02.js
│   │   │
│   │   ├── progression/
│   │   │   ├── ProgressionManager.js
│   │   │   ├── UnlockSystem.js
│   │   │   ├── AchievementSystem.js
│   │   │   └── SaveSystem.js
│   │   │
│   │   └── validation/
│   │       ├── LevelValidator.js
│   │       ├── EntityValidator.js
│   │       └── SchemaDefinitions.js
│   │
│   ├── systems/                        # Existing multi-globe system (legacy)
│   │   └── multi-globe/                # Keep for reference during migration
│   │       └── ...                     # Will be deprecated
│   │
│   ├── tools/                          # Development tools
│   │   └── level-editor/               # Future: visual level editor
│   │       ├── LevelEditor.jsx
│   │       ├── EntityPalette.jsx
│   │       ├── PropertiesPanel.jsx
│   │       ├── ScenePreview.jsx
│   │       └── ExportTool.jsx
│   │
│   ├── App.jsx                         # Main app (legacy)
│   ├── App.css
│   ├── main.jsx                        # Entry point
│   ├── index.css                       # Global styles
│   └── GameApp.jsx                     # NEW: Main game app using new systems
│
├── package.json
├── vite.config.js
├── REFACTOR_PLAN.md                    # This document
└── README.md
```

### Folder Rationale

**`core/`** - Engine-level systems used everywhere
- Design system for visual consistency
- State management for game data
- Event bus for decoupled communication
- Animation/transition systems
- Input handling

**`components/`** - Reusable UI components
- `ui/` - General-purpose UI elements (Button, Modal, etc.)
- `layouts/` - Content layout templates
- `common/` - Shared app-level components (LoadingScreen, etc.)

**`entities/`** - Visual game objects (the "actors")
- `globe/` - Planet/globe system
- `blob/` - Blob particle system
- `particles/` - General particle effects

**`game/`** - Game-specific logic
- `scenes/` - Scene system (levels, menus, etc.)
- `entities/` - ECS entity system
- `levels/` - Level definitions
- `progression/` - Player progress tracking

**`systems/multi-globe/`** - Legacy system kept for reference during migration

**`tools/`** - Development tools (future level editor)

---

## Migration Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Create `core/design-system/` folder structure
- [ ] Extract colors from current components → `colors.js`
- [ ] Extract animations → `animations.js`
- [ ] Create `core/state/GameStateManager.js`
- [ ] Create `core/events/EventBus.js`
- [ ] Consolidate utilities into `core/utils/`
- [ ] Test all utility functions

### Phase 2: Visual Objects (Week 3-4)
- [ ] Create `entities/globe/Globe.jsx` (unified)
- [ ] Test Globe with StandardGlobe preset
- [ ] Test Globe with SimplifiedGlobe preset
- [ ] Replace existing Globe components
- [ ] Create `entities/blob/Blob.jsx`
- [ ] Create `entities/blob/BlobGroup.jsx`
- [ ] Create DecorationBlobs preset
- [ ] Replace BlobLasso with DecorationBlobs
- [ ] Test visual parity

### Phase 3: UI Components (Week 5)
- [ ] Create `components/ui/Button/`
- [ ] Create button variants
- [ ] Replace inline button styles across app
- [ ] Create `components/ui/Card/`
- [ ] Create `components/ui/Modal/`
- [ ] Update layouts to use new components

### Phase 4: Game Systems (Week 6-8)
- [ ] Create `game/scenes/Scene.js`
- [ ] Create `game/scenes/SceneManager.js`
- [ ] Create `game/entities/Entity.js`
- [ ] Create entity components (Transform, Visual, etc.)
- [ ] Convert home planet view to Scene
- [ ] Convert planet map to Scene
- [ ] Test scene transitions

### Phase 5: Levels (Week 9-10)
- [ ] Design level definition schema
- [ ] Create `game/levels/Level.js`
- [ ] Create `game/levels/LevelLoader.js`
- [ ] Define tutorial level 01 in new format
- [ ] Test level loading
- [ ] Create LevelValidator
- [ ] Migrate existing globe configs to level format

### Phase 6: Polish (Week 11-12)
- [ ] Performance audit
- [ ] Visual regression testing
- [ ] Cross-browser testing
- [ ] Mobile testing (touch gestures)
- [ ] Accessibility audit
- [ ] Documentation
- [ ] Code cleanup
- [ ] Remove deprecated code

---

## Success Criteria

### Technical Goals
✅ **Consistency** - All buttons, globes, blobs behave identically everywhere
✅ **Reusability** - 90%+ code reuse for similar features
✅ **Performance** - No degradation from current (60fps maintained)
✅ **Maintainability** - New levels/features added via config, not code
✅ **Scalability** - Architecture supports 100+ levels

### User Experience Goals
✅ **Visual Parity** - Refactor produces identical appearance
✅ **Smooth Transitions** - All animations feel polished
✅ **Responsive** - Works on desktop, tablet, mobile
✅ **Accessibility** - Keyboard navigation, screen reader support
✅ **Fast Loading** - Initial load < 3 seconds

### Developer Experience Goals
✅ **Clear Structure** - New developers understand architecture quickly
✅ **Easy Extensions** - Adding new entity type takes < 1 hour
✅ **Good Documentation** - All systems documented with examples
✅ **Type Safety** - Consider TypeScript migration
✅ **Testing** - Unit tests for core systems

---

## Next Steps

### Immediate Actions (This Week)
1. Review this refactor plan with team
2. Prioritize phases based on needs
3. Set up version control branch for refactor
4. Create `core/` folder structure
5. Begin Phase 1 implementation

### Key Decisions Needed
- **TypeScript?** - Should we migrate to TypeScript during refactor?
- **Testing Framework?** - Which testing library (Jest, Vitest, React Testing Library)?
- **State Management?** - Custom vs. Zustand/Redux?
- **Build Tool?** - Continue with Vite or consider alternatives?
- **CSS Strategy?** - CSS Modules, Styled Components, or continue with CSS files?

### Risk Mitigation
- **Regression Risk** - Mitigated by visual regression testing
- **Performance Risk** - Mitigated by continuous benchmarking
- **Timeline Risk** - Phased approach allows shipping incrementally
- **Breaking Changes** - Deprecated code kept until full migration complete

---

## Conclusion

This refactor plan establishes a **game-first architecture** that prioritizes:

1. **Reusability** - Build once, use everywhere
2. **Consistency** - Same behavior, always
3. **Scalability** - Ready for 100+ levels
4. **Maintainability** - Config-driven content
5. **Performance** - Optimized from the start

The current codebase is **functionally excellent** - this refactor extracts that excellence into reusable systems that will accelerate future development.

**Estimated Timeline:** 12 weeks (3 months) for complete refactor
**Recommended Approach:** Incremental migration, shipping working features continuously
**End Result:** Scalable video game architecture ready for full production

---

*Document Version: 1.0*
*Last Updated: 2025-10-14*
*Author: Claude Code*
*Status: Draft - Awaiting Review*
