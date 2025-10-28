// Content points configuration for grid navigation
// 7x8 matrix (49 songs + 1 radio = 50 points total, filling 50/56 positions)

const songTracks = [
  {
    title: '6am Riverside',
    file: '6am_Riverside',
    colorIndex: 5,
    composition: 'atmosphere',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'A Cup of Tea',
    file: 'A_Cup_of_Tea',
    colorIndex: 2,
    composition: 'portal',
    genres: { lofi: true, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Abandoned Metropolis',
    file: 'Abandoned_Metropolis',
    colorIndex: 4,
    composition: 'sky',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Anti Entity',
    file: 'Anti_Entity',
    colorIndex: 6,
    composition: 'comet',
    genres: { lofi: false, piano: true, electronic: false, chill: false, epic: true }
  },
  {
    title: 'Arukas Bloom',
    file: 'Arukas_Bloom',
    colorIndex: 8,
    composition: 'comet',
    genres: { lofi: true, piano: false, electronic: false, chill: false, epic: true }
  },
  {
    title: 'Bartender',
    file: 'Bartender',
    colorIndex: 7,
    composition: 'rings',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Cat Caffe',
    file: 'Cat_Caffe',
    colorIndex: 3,
    composition: 'default',
    genres: { lofi: false, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Ceasefire',
    file: 'Ceasefire',
    colorIndex: 9,
    composition: 'comet',
    genres: { lofi: false, piano: false, electronic: false, chill: false, epic: true }
  },
  {
    title: 'Cold Lake',
    file: 'Cold_Lake',
    colorIndex: 5,
    composition: 'atmosphere',
    genres: { lofi: true, piano: true, electronic: true, chill: false, epic: false }
  },
  {
    title: 'Countryside',
    file: 'Countryside',
    colorIndex: 0,
    composition: 'sky',
    genres: { lofi: false, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Cue',
    file: 'Cue',
    colorIndex: 4,
    composition: 'atmosphere',
    genres: { lofi: true, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'The End',
    file: 'The_End_8-bit_Version',
    colorIndex: 9,
    composition: 'rings',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'The End',
    file: 'The_End_Piano_Version',
    colorIndex: 8,
    composition: 'portal',
    genres: { lofi: false, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'The First Snowfall',
    file: 'The_First_Snowfall',
    colorIndex: 9,
    composition: 'meteor',
    genres: { lofi: true, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Florist',
    file: 'Florist',
    colorIndex: 2,
    composition: 'atom',
    genres: { lofi: true, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Flying Above the Ocean',
    file: 'Flying_Above_the_Ocean',
    colorIndex: 5,
    composition: 'sky',
    genres: { lofi: false, piano: true, electronic: true, chill: true, epic: false }
  },
  {
    title: 'Forward Operating Base',
    file: 'Forward_Operating_Base',
    colorIndex: 6,
    composition: 'warp',
    genres: { lofi: false, piano: false, electronic: false, chill: false, epic: true }
  },
  {
    title: 'Free Fall',
    file: 'Free_Fall',
    colorIndex: 8,
    composition: 'portal',
    genres: { lofi: false, piano: false, electronic: true, chill: false, epic: false }
  },
  {
    title: 'GBL Medley',
    file: 'GBL_Medley',
    colorIndex: 7,
    composition: 'atom',
    genres: { lofi: false, piano: false, electronic: true, chill: false, epic: false }
  },
  {
    title: 'Ice Cave',
    file: 'Ice_Cave',
    colorIndex: 5,
    composition: 'sky',
    genres: { lofi: true, piano: false, electronic: true, chill: true, epic: false }
  },
  {
    title: 'Iced Village',
    file: 'Iced_Village_8-bit_Version',
    colorIndex: 9,
    composition: 'atmosphere',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Iced Village',
    file: 'Iced_Village_Piano_Version',
    colorIndex: 1,
    composition: 'default',
    genres: { lofi: false, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'The Lobster',
    file: 'The_Lobster',
    colorIndex: 3,
    composition: 'comet',
    genres: { lofi: false, piano: true, electronic: false, chill: false, epic: false }
  },
  {
    title: 'Morning Rain',
    file: 'Morning_Rain',
    colorIndex: 6,
    composition: 'atom',
    genres: { lofi: false, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Motion',
    file: 'Motion',
    colorIndex: 2,
    composition: 'rings',
    genres: { lofi: false, piano: false, electronic: true, chill: true, epic: false }
  },
  {
    title: 'Oceanside',
    file: 'Oceanside',
    colorIndex: 3,
    composition: 'meteor',
    genres: { lofi: false, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Ooame',
    file: 'Ooame',
    colorIndex: 4,
    composition: 'comet',
    genres: { lofi: true, piano: false, electronic: true, chill: true, epic: false }
  },
  {
    title: 'Orchestra Music',
    file: 'Orchestra_Music',
    colorIndex: 9,
    composition: 'portal',
    genres: { lofi: false, piano: false, electronic: false, chill: false, epic: true }
  },
  {
    title: 'The Past',
    file: 'The_Past_8-bit_Version',
    colorIndex: 5,
    composition: 'default',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'The Past',
    file: 'The_Past_Piano_Version',
    colorIndex: 5,
    composition: 'default',
    genres: { lofi: false, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Peaceful 1am in May',
    file: 'Peaceful_1am_in_May',
    colorIndex: 1,
    composition: 'atmosphere',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Planet Explorer',
    file: 'Planet_Explorer',
    colorIndex: 5,
    composition: 'sky',
    genres: { lofi: false, piano: true, electronic: false, chill: true, epic: true }
  },
  {
    title: 'Project 2',
    file: 'Project_2',
    colorIndex: 7,
    composition: 'default',
    genres: { lofi: false, piano: false, electronic: true, chill: false, epic: false }
  },
  {
    title: 'Rainy City',
    file: 'Rainy_City',
    colorIndex: 8,
    composition: 'rings',
    genres: { lofi: true, piano: false, electronic: true, chill: true, epic: false }
  },
  {
    title: 'Rainy Forest',
    file: 'Rainy_Forest',
    colorIndex: 7,
    composition: 'atom',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Rainy Village',
    file: 'Rainy_Village',
    colorIndex: 1,
    composition: 'sky',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Remnants of the Festival',
    file: 'Remnants_of_the_Festival',
    colorIndex: 8,
    composition: 'portal',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Revenge',
    file: 'Revenge',
    colorIndex: 3,
    composition: 'atmosphere',
    genres: { lofi: false, piano: false, electronic: false, chill: false, epic: true }
  },
  {
    title: 'Sadness and Solo',
    file: 'Sadness_and_Solo',
    colorIndex: 2,
    composition: 'meteor',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Settlement of the Frontier',
    file: 'Settlement_of_the_Frontier',
    colorIndex: 6,
    composition: 'rings',
    genres: { lofi: false, piano: true, electronic: false, chill: false, epic: true }
  },
  {
    title: 'Since 2am',
    file: 'Since_2am',
    colorIndex: 5,
    composition: 'comet',
    genres: { lofi: true, piano: false, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Sky Run',
    file: 'Sky_Run',
    colorIndex: 0,
    composition: 'default',
    genres: { lofi: false, piano: false, electronic: true, chill: false, epic: false }
  },
  {
    title: 'Solved',
    file: 'Solved',
    colorIndex: 4,
    composition: 'atom',
    genres: { lofi: false, piano: true, electronic: false, chill: false, epic: false }
  },
  {
    title: 'Suicidal Moon',
    file: 'Suicidal_Moon',
    colorIndex: 9,
    composition: 'warp',
    genres: { lofi: true, piano: false, electronic: true, chill: true, epic: false }
  },
  {
    title: 'Unbounded Daydream',
    file: 'Unbounded_Daydream',
    colorIndex: 0,
    composition: 'sky',
    genres: { lofi: false, piano: true, electronic: false, chill: true, epic: false }
  },
  {
    title: 'Underground',
    file: 'Underground',
    colorIndex: 8,
    composition: 'atmosphere',
    genres: { lofi: false, piano: false, electronic: true, chill: false, epic: false }
  },
  {
    title: 'Vampires Piano',
    file: 'Vampires_Piano',
    colorIndex: 3,
    composition: 'portal',
    genres: { lofi: false, piano: true, electronic: false, chill: false, epic: false }
  },
  {
    title: 'Wind Run',
    file: 'Wind_Run',
    colorIndex: 8,
    composition: 'comet',
    genres: { lofi: false, piano: false, electronic: false, chill: false, epic: true }
  }
]

// Helper function to generate rotation based on grid position
const getRotation = (index, cols = 7, rows = 8) => {
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
  // Song cards (1-49)
  ...songTracks.map((song, index) => ({
    id: index + 1,
    iconName: 'Music',
    heading: song.title,
    subheading: 'by Tad Miller',
    paragraph: `Listen to ${song.title} by Tad Miller.`,
    rotation: getRotation(index + 1),
    colorIndex: song.colorIndex !== undefined ? song.colorIndex : (index + 1) % 10,
    layoutType: 'tadSong',
    composition: song.composition || compositions[(index + 1) % compositions.length],
    audioFile: `/audio/tracks/${song.file}.mp3`,
    genres: song.genres || {
      lofi: false,
      piano: false,
      electronic: false,
      chill: false,
      epic: false
    }
  }))
]
