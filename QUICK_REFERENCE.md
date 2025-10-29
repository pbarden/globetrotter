# Radio Free Moon - Quick Reference Card

## Color Schemes (colorIndex: 0-9)
```
0 = Gold/Orange     (#ffd700) - Warm, upbeat
1 = Magenta/Pink    (#ff00ff) - Energetic, vibrant
2 = Green/Mint      (#00ff88) - Fresh, natural
3 = Red/Crimson     (#ff6b6b) - Intense, passionate
4 = Purple/Violet   (#b388ff) - Dreamy, mystical
5 = Cyan/Aqua       (#00ffff) - Cool, calm
6 = Orange/Tang     (#ff9500) - Energetic, sunset
7 = Bright Green    (#00ff00) - Neon, electric
8 = Hot Pink        (#ff1493) - Bold, striking
9 = Medium Purple   (#9370db) - Royal, elegant
```

## Compositions (composition: 'name')
```
'default'     - Centered globe, scattered blobs (balanced)
'rings'       - Saturn-like rings around globe (celestial)
'meteor'      - Globe down-left, trail up-right (dynamic)
'sky'         - Large globe bottom, clouds on side (atmospheric)
'atmosphere'  - Blobs surround globe tightly (protective)
'portal'      - Small globe corner, large blobs (mystical)
'atom'        - Erratic blobs around center (energetic)
'warp'        - Tunnel depth effect (psychedelic)
'comet'       - Globe up-right, trail down-left (dynamic)
```

## Genres (genres object)
```javascript
{
  lofi: true/false,        // Lofi/chill beats
  piano: true/false,       // Piano-focused
  electronic: true/false,  // Electronic/synth
  chill: true/false,       // Chill/ambient music
  epic: true/false         // Epic/orchestral
}
```

## Template to Copy-Paste
```javascript
{
  id: X,
  iconName: 'Music',
  heading: 'SONG NAME HERE',
  subheading: 'by Tad Miller',
  paragraph: `Listen to SONG NAME HERE by Tad Miller.`,
  rotation: getRotation(X),
  colorIndex: 0,           // Change 0-9
  layoutType: 'tadSong',
  composition: 'default',  // Change to any composition
  audioFile: '/audio/tracks/SONG NAME HERE.mp3',
  genres: {
    lofi: false,
    piano: false,
    electronic: false,
    chill: false,
    epic: false
  }
}
```

## Quick Genre Tagging Guide

**Lofi tracks** - Set `lofi: true`
**Piano-heavy** - Set `piano: true`
**Electronic/synth** - Set `electronic: true`
**Chill/ambient** - Set `chill: true`
**Epic/orchestral** - Set `epic: true`

Multiple genres? Set multiple to true!

## Color + Composition Combos

**Chill Lofi:**
- Colors: 5 (Cyan), 2 (Green), 0 (Gold)
- Compositions: atmosphere, default, sky

**Upbeat Electronic:**
- Colors: 7 (Bright Green), 1 (Magenta), 8 (Hot Pink)
- Compositions: atom, meteor, warp

**Epic/Orchestral:**
- Colors: 9 (Purple), 4 (Violet), 3 (Red)
- Compositions: sky, rings, portal

**Piano Ballad:**
- Colors: 5 (Cyan), 4 (Purple), 0 (Gold)
- Compositions: default, atmosphere

**Chill/Ambient:**
- Colors: 5 (Cyan), 2 (Green), 4 (Purple)
- Compositions: atmosphere, default, sky
