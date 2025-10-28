# Radio Free Moon - Content Configuration Guide

This guide explains how to configure individual song cards in the Radio Free Moon application, including visual compositions, color schemes, and genre tagging.

---

## Table of Contents
1. [File Location](#file-location)
2. [Card Structure](#card-structure)
3. [Color Schemes](#color-schemes)
4. [Visual Compositions](#visual-compositions)
5. [Layout Types](#layout-types)
6. [Genre Tags](#genre-tags)
7. [Configuration Examples](#configuration-examples)

---

## File Location

All content is configured in: `src/config/content.js`

---

## Card Structure

Each song card has the following properties:

```javascript
{
  id: 1,                          // Unique ID (0-41)
  iconName: 'Music',              // Lucide icon name
  heading: 'Song Title',          // Main heading (song name)
  subheading: 'by Tad Miller',    // Subheading (artist)
  paragraph: 'Description text',  // Additional info
  rotation: { x: 0, y: 0 },      // 3D rotation (auto-calculated)
  colorIndex: 0,                  // Color scheme (0-9)
  layoutType: 'tadSong',          // Layout template
  composition: 'default',         // Globe/blob composition
  audioFile: '/audio/tracks/Song.mp3',  // Path to audio file
  genres: {                       // Genre tags
    lofi: false,
    piano: false,
    electronic: false,
    hiphop: false,
    epic: false
  }
}
```

### Audio Playback

**Automatic Playback:**
- When you navigate to a song card, the audio automatically begins playing
- The track loops continuously until you navigate away
- Songs crossfade with a 1.5 second blend when switching tracks

**Crossfading:**
- When navigating to a new song, the current track fades out over 1.5 seconds
- The new track begins fading in after 0.45 seconds (30% overlap)
- Creates a smooth, blended transition between songs

**Radio Card (ID 0):**
- Has no `audioFile` property
- Navigating to the radio card stops all audio playback

---

## Color Schemes

There are **10 color schemes** available (indexed 0-9). Set using the `colorIndex` property.

| Index | Name | Primary | Secondary | Accent | Best For |
|-------|------|---------|-----------|--------|----------|
| **0** | Gold/Orange | `#ffd700` | `#ff8c00` | `#ffaa00` | Warm, upbeat tracks |
| **1** | Magenta/Pink | `#ff00ff` | `#ff00aa` | `#aa00ff` | Energetic, vibrant |
| **2** | Green/Mint | `#00ff88` | `#00ffaa` | `#88ff00` | Fresh, natural |
| **3** | Red/Crimson | `#ff6b6b` | `#ff3333` | `#ff9999` | Intense, passionate |
| **4** | Purple/Violet | `#b388ff` | `#8844ff` | `#cc99ff` | Dreamy, mystical |
| **5** | Cyan/Aqua | `#00ffff` | `#00ccff` | `#66ffff` | Cool, calm |
| **6** | Orange/Tang | `#ff9500` | `#ff6b00` | `#ffb84d` | Energetic, sunset |
| **7** | Bright Green | `#00ff00` | `#00cc00` | `#66ff66` | Neon, electric |
| **8** | Hot Pink | `#ff1493` | `#ff007f` | `#ff69b4` | Bold, striking |
| **9** | Medium Purple | `#9370db` | `#8a2be2` | `#ba55d3` | Royal, elegant |

**Usage:**
```javascript
colorIndex: 3  // Sets Red/Crimson color scheme
```

---

## Visual Compositions

There are **9 unique compositions** that control how the globe and blobs appear. Set using the `composition` property.

### 1. **default**
- **Description**: Centered globe with scattered blobs
- **Best For**: Standard, balanced look
- **Globe**: Normal size, centered, high detail
- **Blobs**: Scattered evenly around viewport
```javascript
composition: 'default'
```

### 2. **rings**
- **Description**: Blobs form Saturn-like rings around globe
- **Best For**: Celestial, orbital themes
- **Globe**: Normal size, centered, low detail (simpler)
- **Blobs**: Large, orbital pattern, tight clustering
```javascript
composition: 'rings'
```

### 3. **meteor**
- **Description**: Globe positioned down-left, blobs trail up-right
- **Best For**: Dynamic, moving feeling
- **Globe**: Slightly smaller, positioned down-left
- **Blobs**: Trail diagonally, moderate size
```javascript
composition: 'meteor'
```

### 4. **sky**
- **Description**: Large globe at bottom (mostly off-screen), blobs like clouds
- **Best For**: Atmospheric, open feeling
- **Globe**: Very large, bottom of screen
- **Blobs**: Clustered to the side, large
```javascript
composition: 'sky'
```

### 5. **atmosphere**
- **Description**: Blobs tightly surround globe like an atmosphere
- **Best For**: Protective, enclosed feeling
- **Globe**: Normal size, centered, low detail
- **Blobs**: Orbital, close to globe, large
```javascript
composition: 'atmosphere'
```

### 6. **portal**
- **Description**: Small globe in corner, large dominant blobs
- **Best For**: Mystical, gateway themes
- **Globe**: Small, offset to corner, further back
- **Blobs**: Very large, scattered, dominant
```javascript
composition: 'portal'
```

### 7. **atom**
- **Description**: Large blobs cluster erratically around center (like electrons)
- **Best For**: Energetic, chaotic themes
- **Globe**: Normal size, centered, low detail
- **Blobs**: Very large, erratic clustering
```javascript
composition: 'atom'
```

### 8. **warp**
- **Description**: Small globe with blobs creating tunnel/depth effect
- **Best For**: Psychedelic, depth themes
- **Globe**: Very small (distant), centered, high detail
- **Blobs**: Layered at center for depth illusion
```javascript
composition: 'warp'
```

### 9. **comet**
- **Description**: Globe up-right, blobs trail down-left (reverse meteor)
- **Best For**: Dynamic, opposite meteor direction
- **Globe**: Slightly smaller, positioned up-right
- **Blobs**: Trail diagonally opposite direction
```javascript
composition: 'comet'
```

---

## Layout Types

There are **3 layout types** available:

### 1. **tadRadio** (Genre Selection Card)
- Only used for card ID 0 (the first card)
- Shows genre selection buttons
- Displays "Radio Free Moon" branding
```javascript
layoutType: 'tadRadio'
```

### 2. **tadSong** (Song Display Card)
- Used for all song cards (ID 1-41)
- Shows album art, song title, artist, YouTube button
- Displays genre icons
```javascript
layoutType: 'tadSong'
```

### 3. **default** (Legacy Grid Layout)
- Original demo layout with icon grid
- Not typically used for music cards
```javascript
layoutType: 'default'
```

---

## Genre Tags

Each song can be tagged with one or more of **5 genres**. These are boolean flags.

### Available Genres:
- **lofi**: Lofi/chill beats
- **piano**: Piano-focused tracks
- **electronic**: Electronic/synth music
- **hiphop**: Hip-hop beats
- **epic**: Epic/orchestral music

### Genre Structure:
```javascript
genres: {
  lofi: true,        // This song IS lofi
  piano: false,      // This song is NOT piano-focused
  electronic: false,
  hiphop: false,
  epic: false
}
```

### Multiple Genres Example:
A song can have multiple genre tags:
```javascript
genres: {
  lofi: true,        // Both lofi AND piano
  piano: true,
  electronic: false,
  hiphop: false,
  epic: false
}
```

---

## Configuration Examples

### Example 1: Warm Lofi Track
```javascript
{
  id: 5,
  iconName: 'Music',
  heading: 'Morning Rain',
  subheading: 'by Tad Miller',
  paragraph: 'Listen to Morning Rain by Tad Miller.',
  rotation: getRotation(5),
  colorIndex: 0,              // Gold/warm colors
  layoutType: 'tadSong',
  composition: 'atmosphere',   // Soft, enveloping feel
  audioFile: '/audio/tracks/Morning Rain.mp3',
  genres: {
    lofi: true,               // Tagged as lofi
    piano: false,
    electronic: false,
    hiphop: false,
    epic: false
  }
}
```

### Example 2: Epic Piano Track
```javascript
{
  id: 12,
  iconName: 'Music',
  heading: 'Orchestra Music',
  subheading: 'by Tad Miller',
  paragraph: 'Listen to Orchestra Music by Tad Miller.',
  rotation: getRotation(12),
  colorIndex: 9,              // Purple/royal
  layoutType: 'tadSong',
  composition: 'sky',          // Grand, expansive
  audioFile: '/audio/tracks/Orchestra Music.mp3',
  genres: {
    lofi: false,
    piano: true,              // Tagged as both
    electronic: false,
    hiphop: false,
    epic: true                // piano and epic
  }
}
```

### Example 3: Electronic Hip-Hop
```javascript
{
  id: 18,
  iconName: 'Music',
  heading: 'GBL Medley',
  subheading: 'by Tad Miller',
  paragraph: 'Listen to GBL Medley by Tad Miller.',
  rotation: getRotation(18),
  colorIndex: 7,              // Bright green/neon
  layoutType: 'tadSong',
  composition: 'atom',         // Energetic, chaotic
  audioFile: '/audio/tracks/GBL Medley.mp3',
  genres: {
    lofi: false,
    piano: false,
    electronic: true,         // Both electronic
    hiphop: true,             // and hip-hop
    epic: false
  }
}
```

### Example 4: Calm Piano Piece
```javascript
{
  id: 25,
  iconName: 'Music',
  heading: 'Peaceful 1am in May',
  subheading: 'by Tad Miller',
  paragraph: 'Listen to Peaceful 1am in May by Tad Miller.',
  rotation: getRotation(25),
  colorIndex: 5,              // Cyan/calm
  layoutType: 'tadSong',
  composition: 'default',      // Simple, clean
  audioFile: '/audio/tracks/Peaceful 1am in May.mp3',
  genres: {
    lofi: true,               // Lofi piano
    piano: true,
    electronic: false,
    hiphop: false,
    epic: false
  }
}
```

---

## Quick Reference

### To Change Song Colors:
1. Open `src/config/content.js`
2. Find your song by name or ID
3. Change `colorIndex` to 0-9 (see Color Schemes table)

### To Change Visual Composition:
1. Open `src/config/content.js`
2. Find your song
3. Change `composition` to one of: default, rings, meteor, sky, atmosphere, portal, atom, warp, comet

### To Tag Genres:
1. Open `src/config/content.js`
2. Find your song
3. Set appropriate genre flags to `true`:
```javascript
genres: {
  lofi: true,      // Change to true/false
  piano: false,    // Change to true/false
  electronic: false,
  hiphop: false,
  epic: false
}
```

### Color Scheme Quick Pick:
- **Warm vibes**: 0 (Gold), 6 (Orange)
- **Cool vibes**: 5 (Cyan), 2 (Green)
- **Energetic**: 1 (Magenta), 7 (Bright Green), 8 (Hot Pink)
- **Calm**: 4 (Purple), 9 (Medium Purple)
- **Intense**: 3 (Red)

### Composition Quick Pick:
- **Standard**: default
- **Calm/Atmospheric**: atmosphere, sky
- **Energetic**: atom, meteor, comet
- **Mystical**: portal, warp, rings

---

## Tips for Configuration

1. **Match mood to visuals**: Upbeat songs work well with bright colors (1, 7, 8) and dynamic compositions (atom, meteor)

2. **Calm songs**: Use cool colors (5, 2, 4) with gentle compositions (atmosphere, default)

3. **Epic tracks**: Use royal colors (9, 4) with expansive compositions (sky, rings)

4. **Genre consistency**: Tag accurately - this will be used for filtering in future updates

5. **Visual variety**: Avoid using the same composition and color for consecutive songs in the grid

6. **Test as you go**: Make changes, reload the browser, and navigate to the song to see results

---

## Song List (IDs 1-41)

For reference, here are all 41 songs in order:

1. 6am Riverside
2. A Cup of Tea
3. Abandoned Metropolis
4. Anti Entity
5. Arukas Bloom
6. Bartender
7. Cat Caffe
8. Cold Lake
9. Countryside
10. Cue
11. Florist
12. Flying Above the Ocean
13. Free Fall
14. GBL Medley
15. Ice Cave
16. Iced Village (8-bit Version)
17. Iced Village (Piano Version)
18. Morning Rain
19. Motion
20. Oceanside
21. Orchestra Music
22. Peaceful 1am in May
23. Planet Explorer
24. Project 2
25. Rainy City
26. Rainy Forest
27. Rainy Village
28. Remnants of the Festival
29. Sadness and Solo
30. Since 2am
31. Sky Run
32. Solved
33. Suicidal Moon
34. Thawing Village
35. The First Snowfall
36. The Lobster
37. The Past (8-bit Version)
38. The Past (Piano Version)
39. Unbounded Daydream
40. Underground
41. Vampires Piano

---

## Need Help?

- All songs start with default settings (colorIndex cycles 0-9, composition cycles through all 9)
- All genres default to `false` - you need to manually tag each song
- Changes require a browser reload to take effect
- If something breaks, check the browser console for errors

---

*Documentation for Radio Free Moon v1.0*
*Presented by Moon Man Digital*
