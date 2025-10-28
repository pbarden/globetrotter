// Content points configuration for grid navigation
// 7x6 matrix (42 points total)

const songTracks = [
  '6am Riverside',
  'A Cup of Tea',
  'Abandoned Metropolis',
  'Anti Entity',
  'Arukas Bloom',
  'Bartender',
  'Cat Caffe',
  'Cold Lake',
  'Countryside',
  'Cue',
  'Florist',
  'Flying Above the Ocean',
  'Free Fall',
  'GBL Medley',
  'Ice Cave',
  'Iced Village (8-bit Version)',
  'Iced Village (Piano Version)',
  'Morning Rain',
  'Motion',
  'Oceanside',
  'Orchestra Music',
  'Peaceful 1am in May',
  'Planet Explorer',
  'Project 2',
  'Rainy City',
  'Rainy Forest',
  'Rainy Village',
  'Remnants of the Festival',
  'Sadness and Solo',
  'Since 2am',
  'Sky Run',
  'Solved',
  'Suicidal Moon',
  'Thawing Village',
  'The First Snowfall',
  'The Lobster',
  'The Past (8-bit Version)',
  'The Past (Piano Version)',
  'Unbounded Daydream',
  'Underground',
  'Vampires Piano'
]

// Helper function to generate rotation based on grid position
const getRotation = (index, cols = 7, rows = 6) => {
  const row = Math.floor(index / cols)
  const col = index % cols

  // Create varied rotations based on position
  const xRotation = (row / rows) * Math.PI - Math.PI / 2
  const yRotation = (col / cols) * Math.PI * 2 - Math.PI

  return { x: xRotation, y: yRotation }
}

// Compositions for variety
const compositions = [
  'default', 'rings', 'meteor', 'sky', 'atmosphere',
  'portal', 'atom', 'warp', 'comet'
]

export const CONTENT_POINTS = [
  {
    id: 0,
    iconName: 'Radio',
    heading: 'Radio Free Moon',
    subheading: 'Pick the styles you\'re in the mood to hear.',
    paragraph: 'Select your favorite music genres and explore the collection.',
    rotation: { x: 0, y: 0 },
    colorIndex: 0,
    layoutType: 'tadRadio',
    composition: 'portal'
  },
  // Song cards (1-41)
  ...songTracks.map((songTitle, index) => ({
    id: index + 1,
    iconName: 'Music',
    heading: songTitle,
    subheading: 'by Tad Miller',
    paragraph: `Listen to ${songTitle} by Tad Miller.`,
    rotation: getRotation(index + 1),
    colorIndex: (index + 1) % 10,
    layoutType: 'tadSong',
    composition: compositions[(index + 1) % compositions.length],
    audioFile: `/audio/tracks/${songTitle}.mp3`
  }))
]
