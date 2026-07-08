# Radio Free Moon — Project Overview

> An interactive 3D music exploration PWA with a scroll-navigable wireframe globe, 49-track cross-faded audio engine, genre-based preference routing, and Android packaging via Capacitor.

---

## One-Line Pitch

**Radio Free Moon** is a cross-platform (web + Android) interactive music player built in React and Three.js, where a rainbow-refracting low-poly crystal globe acts as the navigation surface for a curated 49-track album — users scroll, swipe, or arrow-key across a 7×8 spatial grid of "content points" mapped to globe rotations, with genre-aware auto-advance, crossfaded playback, and procedurally animated SVG "blob" compositions that reshape the scene per track.

---

## Role & Scope

- **Role**: Sole developer — design, architecture, implementation, and packaging.
- **Stack decisions**: Chose React + Vite + Three.js for the web runtime, Capacitor for the Android wrapper, Workbox (via `vite-plugin-pwa`) for offline-capable PWA install, and a custom audio-player hook instead of a third-party player to retain full control over crossfade logic.
- **Deliverables**:
  - Installable PWA (web, `manifest.json`, service worker with runtime audio caching).
  - Signed Android `.aab` bundle + `.apk` release (`com.moonmandigital.radiofreemoon`) targeting Google Play distribution.
  - 49-track curated music catalog with per-track color, genre, and visual-composition metadata.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI framework | **React 18** (functional components, hooks-based state) |
| Build tooling | **Vite 5** with `@vitejs/plugin-react` |
| 3D rendering | **Three.js 0.168** via **@react-three/fiber** + **@react-three/drei** |
| Mobile shell | **Capacitor 7** (Android target) |
| PWA / offline | **vite-plugin-pwa** (Workbox runtime caching for fonts + MP3 range requests) |
| Icons | **lucide-react** |
| Language | JavaScript (ESM, JSX) |
| Distribution | Google Play `.aab`, sideload `.apk`, and web PWA |

---

## Core Features

### 1. Interactive 3D Globe Navigation
- **Dual-geometry morphing**: A `THREE.IcosahedronGeometry` with subdivision level 2 (high complexity) interpolates per-vertex with a level-0 icosahedron (low complexity, 20 faces) based on the active track's composition, producing a live geometry morph rather than a geometry swap.
- **Rainbow vertex shading**: Each vertex is assigned a random hue offset; a throttled 30 FPS color loop cycles HSL across all vertices for a "rainbow crystal" look while preserving per-frame budget.
- **Wireframe overlay** layered over a semi-transparent Phong-shaded flat-shaded mesh with specular highlights.
- **Scale-inverse rotation damping**: When the globe grows for dramatic compositions, rotation speed and color-cycle rate scale inversely so larger globes feel more "majestic" without manual keyframing.
- **Entry/exit physics**: Bouncy back-ease entry (c₁ = 1.70158 overshoot constant) and quadratic-gravity fall-down exit animations.
- **Page-visibility aware**: Rotation and color updates pause when the browser tab is hidden to conserve battery.

### 2. Spatial Grid Content System
- 50 content points (1 "radio" hub card + 49 song cards) arranged on a **7-column × 8-row grid** mapped onto the sphere; each point has a precomputed `{x, y}` rotation target so scrolling feels like literally rotating the globe to face a new song.
- Navigation sources unified under a single `navigateToDirection()` reducer: wheel events, arrow keys, and touch swipes all feed the same state machine, with scroll accumulation + threshold (`120px`) debouncing to prevent over-travel on trackpads.
- Shift + vertical scroll is remapped to horizontal for keyboard-less laptops.

### 3. Genre Preference Engine
- Five genres (Lofi, Piano, Electronic, Chill, Epic), toggleable from the Radio hub card, persist via a `useUserPreferences` hook.
- Navigation skips tracks that don't match any active genre — the directional search walks the row/column until it finds a matching song, with a max-attempts safety bound and a fallback to the first valid track.
- The hub card's color scheme dynamically mirrors the last-activated genre (Lofi→green, Piano→violet, Electronic→gold, Chill→cyan, Epic→crimson).

### 4. Crossfaded Audio Engine (`useAudioPlayer` hook)
- Custom hook wrapping two `HTMLAudioElement` refs to execute **1.5-second equal-power crossfades** using 60-step `setInterval` volume ramps.
- New track fade-in is delayed by 30% of the fade window so the outgoing track's tail overlaps the incoming attack.
- `ended` event listeners are per-track, tracked via a sentinel `_endedListener` property to guarantee cleanup and prevent duplicate advances when tracks are swapped rapidly.
- On song-end, **auto-advance** chooses a random adjacent grid cell, excluding the last-visited cell (prevents ping-pong) and preferring genre-matching tracks.
- Supports pause/resume with a shorter half-duration fade for responsiveness.

### 5. Procedural "Blob Lasso" Compositions
- SVG blobs with gradient strokes and per-frame shape noise are positioned around the globe using nine named **composition states** (`default`, `rings`, `meteor`, `sky`, `atmosphere`, `portal`, `atom`, `warp`, `comet`) — each state rewires globe position/scale/complexity and blob position-mode (scattered, orbital, trailing, etc.).
- Compositions are declaratively assigned per-track in `content.js`, so a single data file drives the visual identity of all 49 songs.

### 6. Dynamic Lighting
- A colored point light follows the blob's screen position (computed via deterministic sine/cosine seeds derived from the content ID + random seed) and casts onto the globe, so the scene's accent light matches the currently active blob's color and position without manual placement.

### 7. Loading Screen
- Custom SVG **circle-to-triangle morph** using parametrically interpolated Bézier control points (magic constant `0.5522847498` for circular arcs, decayed to zero as the shape approaches a triangle), with a minimum 2 s display so the animation actually plays even on fast loads.

### 8. Mobile Packaging (Capacitor → Android)
- Capacitor wraps the built `dist/` into a native Android shell (`com.moonmandigital.radiofreemoon`).
- Signed `.aab` (App Bundle, ~259 MB — large due to bundled MP3 assets) for Play Store upload and signed `.apk` for direct sideload.
- `SIGNED_BUNDLE_GUIDE.md` and `APK_DISTRIBUTION_GUIDE.md` document the signing + release workflow.

### 9. PWA / Offline
- Workbox service worker precaches app shell (`.js`, `.css`, `.html`, `.ico`, `.png`, `.svg`).
- Runtime `CacheFirst` strategy for MP3s (range requests enabled for seekable audio playback) and Google Fonts.
- 3 MB per-file cache ceiling; audio excluded from precache to avoid bloating initial install.
- Installable via `manifest.json` with maskable icon, standalone display mode, and dark theme color `#0a0a0f`.

---

## Architecture Highlights

### Data-Driven Content Model
All 50 content points live in a single config file (`src/config/content.js`). Each entry is a plain object containing:
```js
{
  id, heading, subheading, paragraph,
  rotation: { x, y },       // precomputed globe target
  colorIndex,               // index into 10-color palette
  layoutType,               // picks a React layout component
  composition,              // picks a scene composition
  audioFile,                // /audio/tracks/*.mp3
  genres: { lofi, piano, electronic, chill, epic }  // booleans
}
```
A `getRotation(index, cols, rows)` helper deterministically derives each card's target rotation from its grid position, so adding a track = adding one row to the array.

### Layout Pluggability
Four content-layout components (`DefaultLayout`, `TADRadioLayout`, `TADSongLayout`, `TitleCardLayout`) are selected at render time via `content.layoutType`, so the card system can showcase new card formats without touching the navigation logic.

### Performance Engineering
- **Throttled updates**: Vertex-color recomputation and blob animation are both capped at 30 FPS despite a 60 FPS render loop — measured trade-off between visual smoothness and GPU/CPU budget on mid-tier Android devices.
- **Reusable `THREE.Color` objects**: A single `Color` instance is reused in the per-vertex update loop instead of allocating per iteration, eliminating GC pressure.
- **Memoized geometry and scenes**: Globe geometry, edge geometry, blob light positions, color schemes, and composition state are all `useMemo`'d keyed on their minimal inputs.
- **Explicit Three.js disposal**: `geometry.dispose()`, `edges.dispose()`, and `material.dispose()` run on unmount to prevent WebGL memory leaks during component churn.
- **Hardware-accelerated CSS**: `translateZ(0)`, `backface-visibility: hidden`, `will-change` hints on animated DOM.
- **Lerp-based camera / globe position interpolation** (2% per frame) avoids jitter from direct state syncs.

### State Machine for Transitions
The card transition pipeline uses a two-phase `isTransitioning` guard + paired fly-out/fly-in timeouts stored in a ref, with cleanup in `useEffect` teardown to prevent orphaned timers on rapid input. All input sources are blocked during transitions to guarantee state consistency.

---

## File Structure

```
globetrotter/
├── src/
│   ├── components/
│   │   ├── Globe.jsx                # 3D wireframe globe + vertex color cycling
│   │   ├── BlobLasso.jsx            # SVG blob animation system
│   │   ├── ContentCard.jsx          # Card router based on layoutType
│   │   ├── FloatingRadioButton.jsx  # Shortcut back to hub
│   │   ├── LoadingScreen.jsx        # Circle→triangle morph loader
│   │   └── content-layouts/
│   │       ├── TADRadioLayout.jsx   # Genre-selection hub card
│   │       ├── TADSongLayout.jsx    # Song card with album art + YouTube link
│   │       ├── TitleCardLayout.jsx
│   │       └── DefaultLayout.jsx
│   ├── config/
│   │   ├── content.js               # 50 content points + helpers
│   │   ├── compositions.js          # 9 named scene compositions
│   │   ├── animations.js            # Timings, scroll config, globe config
│   │   └── colors.js                # 10-entry color palette
│   ├── hooks/
│   │   ├── useAudioPlayer.js        # Crossfade + auto-advance
│   │   └── useUserPreferences.jsx   # Genre selections
│   └── App.jsx                      # Navigation reducer + scene orchestration
├── android/                         # Capacitor-generated Android project
├── public/                          # Images, audio tracks, PWA assets
├── capacitor.config.json
├── vite.config.js                   # PWA + Workbox caching rules
└── package.json
```

---

## Resume-Ready Bullets

- Built and shipped **Radio Free Moon**, a cross-platform (web PWA + Android) interactive 3D music player, as sole developer — React 18, Three.js, Capacitor, Vite.
- Engineered a **custom WebGL globe** in Three.js featuring live geometry morphing between icosahedron subdivision levels, 30 FPS HSL vertex-color cycling, scale-inverse rotation/color damping, and bounce physics entry/exit animations.
- Designed a **spatial grid navigation system** mapping 49 tracks onto a 7×8 rotation matrix, with a single directional-input reducer feeding wheel, keyboard, and touch events through a debounced scroll accumulator.
- Implemented a **custom React audio hook** with 1.5-second overlapping crossfades, automatic leak-safe `ended`-event cleanup, and genre-aware random auto-advance that excludes the last-visited track.
- Built a **preference-driven content engine** where 5 genre toggles dynamically reroute navigation, reskin the hub card, and bias random song selection — all from a single declarative content config.
- Packaged the app as a **signed Android App Bundle + APK** via Capacitor and an **installable PWA** with Workbox runtime MP3 caching (range-request support for seekable offline playback).
- Optimized for 60 FPS on mid-tier hardware via throttled color updates, reusable `THREE.Color` allocation, memoized geometry, explicit WebGL resource disposal, and `visibilitychange`-gated animation loops.

---

## Portfolio Talking Points

- **Why I built it**: Wanted a music player that felt like an *artifact* rather than a list — something closer to a physical object you rotate to explore.
- **Hardest part**: Reconciling the "always-smooth" visual animation loop (60 FPS) with the "debounced-discrete" navigation state machine (one card at a time), without letting rapid input desync the audio crossfade, card fly-in/out, and globe rotation targets.
- **Interesting constraint**: Keep the entire 49-track audio bundle installable offline without exceeding mobile storage norms or violating Workbox's per-file cache limits — solved via runtime `CacheFirst` with range requests instead of precache.
- **What I'd do next**: Swap the procedural blob SVGs for instanced Three.js meshes to free the main thread, add shader-based dithering instead of the CSS overlay, and factor genre preferences into a persisted Zustand store for multi-session memory.

---

## Keywords (for AI / ATS scanning)

React 18, React Hooks, Three.js, @react-three/fiber, @react-three/drei, WebGL, 3D graphics, Icosahedron geometry, vertex shaders, HSL color cycling, Vite, ES modules, Progressive Web App, PWA, Workbox, service worker, offline caching, Capacitor, Android App Bundle, AAB, APK, Google Play, cross-platform mobile, HTMLAudioElement, audio crossfade, Web Audio, JavaScript, JSX, state machine, requestAnimationFrame, useMemo, useCallback, useRef, performance optimization, GPU acceleration, WebGL memory management, SVG animation, Bézier interpolation, gesture input, touch events, keyboard navigation, wheel scroll accumulator, responsive design, mobile UX, signed APK, Lucide icons, Google Fonts caching, interactive data visualization, creative coding, generative UI.
