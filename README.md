# Radio Free Moon

An interactive 3D music exploration experience featuring a low-poly wireframe globe with scroll-based navigation through a collection of Tad Miller's music.

## Features

- **3D Wireframe Globe**: Low-poly PlayStation-style sphere with shading effects
- **Scroll Navigation**: Scroll vertically or horizontally to rotate the globe to different music tracks
- **Music Collection**: 42 points in a 7x6 grid - 1 genre selection card and 41 song cards
- **Genre Selection**: Interactive TAD Radio card for browsing music by genre (Lofi, Piano, Electronic, Hip-hop, Epic)
- **Dynamic Song Cards**: Each song displays with album art, artist info, and YouTube link
- **Wavy Blob Effect**: Cards that need reorientation get an animated blob outline with gradient glow
- **Dithering Filter**: Retro-style dithering overlay for visual enhancement
- **Loading Screen**: Animated 3D cube loading screen
- **Performance Optimized**: Smooth 60fps animations with GPU acceleration

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components for React Three Fiber

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the site.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
globesite/
├── src/
│   ├── components/
│   │   ├── Globe.jsx              # 3D wireframe globe component
│   │   ├── ContentCard.jsx        # Modal card component
│   │   ├── ContentCard.css        # Card styles
│   │   ├── LoadingScreen.jsx      # Loading screen component
│   │   └── LoadingScreen.css      # Loading screen styles
│   ├── App.jsx                    # Main app component with scroll logic
│   ├── App.css                    # App styles
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## How It Works

### Globe Navigation

The globe has 42 content points in a 7x6 grid:
- **First point**: Radio Free Moon - Genre selection card
- **Points 1-41**: Individual song cards featuring Tad Miller's music
- Navigate by scrolling in any direction to explore the collection

### Scroll Interaction

- Vertical scroll: Rotates between front/back points
- Horizontal scroll: Rotates between left/right points
- Mixed scrolling: Accesses top/bottom points

### Visual Effects

1. **Low-poly shading**: Uses `IcosahedronGeometry` with `flatShading` for PlayStation-style graphics
2. **Wireframe overlay**: Edge geometry rendered as lines over the mesh
3. **Blob outline**: SVG path animation with gradient stroke and glow filter
4. **Dithering**: Fixed-position noise overlay for retro effect

## Performance Features

- Hardware-accelerated transforms (`translateZ(0)`, `backface-visibility: hidden`)
- RequestAnimationFrame for smooth animations
- Suspense fallback for lazy loading
- Optimized geometry (low polygon count)
- CSS `will-change` hints for animations

## Future Enhancements (PWA)

To convert to PWA:
1. Add a service worker for offline caching
2. Create a `manifest.json` file
3. Add PWA meta tags to `index.html`
4. Implement install prompt

## Browser Support

- Modern browsers with WebGL support
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## License

MIT
