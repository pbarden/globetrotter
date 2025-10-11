// Globe configuration definitions
// Defines the actual globes in the system with their content

import { GLOBE_SIZES } from './sizeSpecs'
import { getRotationForCard } from './rotationMaps'

// Home Planet - Tiny globe with GameTitleCard (entry point)
export const homePlanetConfig = {
  id: 'home-planet',
  name: 'Home',
  size: GLOBE_SIZES.TINY,
  quadrant: 'topLeft', // Position on map

  contentPoints: [
    {
      id: 0,
      position: { row: 0, col: 0 },
      rotation: { x: 0, y: 0 },
      templateType: 'gameTitle',
      content: {
        layoutType: 'titleCard',
        iconName: 'Sparkles',
        heading: 'Globetrotter',
        subheading: 'An Interactive Journey',
        paragraph: 'Scroll in any direction to explore the universe. Discover planets, unlock secrets, and navigate through the cosmic web of creativity.',
        colorIndex: 0
      }
    }
  ],

  navigation: {
    allowScroll: true,
    scrollToMap: true, // Any scroll goes to map
    wrapAround: false,
    transitionDuration: 650
  }
}

// Portfolio Globe - Large globe with InfoCards (current implementation)
export const portfolioGlobeConfig = {
  id: 'portfolio-globe',
  name: 'Portfolio',
  size: GLOBE_SIZES.LARGE,
  quadrant: 'bottomRight', // Position on map

  // Content points from current App.jsx (16 cards)
  contentPoints: [
    // Row 0
    {
      id: 0,
      templateType: 'info',
      content: {
        iconName: 'Rocket',
        heading: 'Innovation',
        subheading: 'Pushing Boundaries',
        paragraph: 'Exploring new frontiers in design and technology with cutting-edge solutions.',
        colorIndex: 0
      },
      position: { row: 0, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 0)
    },
    {
      id: 1,
      templateType: 'info',
      content: {
        iconName: 'Lightbulb',
        heading: 'Creativity',
        subheading: 'Inspired Design',
        paragraph: 'Crafting unique experiences that blend aesthetics with functionality.',
        colorIndex: 1
      },
      position: { row: 0, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 1)
    },
    {
      id: 2,
      templateType: 'info',
      content: {
        iconName: 'Palette',
        heading: 'Artistry',
        subheading: 'Visual Excellence',
        paragraph: 'Creating stunning visuals that capture attention and inspire imagination.',
        colorIndex: 2
      },
      position: { row: 0, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 2)
    },
    {
      id: 3,
      templateType: 'info',
      content: {
        iconName: 'Zap',
        heading: 'Performance',
        subheading: 'Lightning Fast',
        paragraph: 'Optimized for speed and efficiency without compromising quality.',
        colorIndex: 3
      },
      position: { row: 0, col: 3 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 3)
    },
    // Row 1
    {
      id: 4,
      templateType: 'info',
      content: {
        iconName: 'Star',
        heading: 'Excellence',
        subheading: 'Quality First',
        paragraph: 'Committed to delivering exceptional results in every project.',
        colorIndex: 4
      },
      position: { row: 1, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 4)
    },
    {
      id: 5,
      templateType: 'info',
      content: {
        iconName: 'Sparkles',
        heading: 'Future',
        subheading: 'Next Generation',
        paragraph: 'Building tomorrow\'s solutions with today\'s innovations.',
        colorIndex: 5
      },
      position: { row: 1, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 5)
    },
    {
      id: 6,
      templateType: 'info',
      content: {
        iconName: 'Target',
        heading: 'Precision',
        subheading: 'Pixel Perfect',
        paragraph: 'Attention to detail in every aspect of design and development.',
        colorIndex: 6
      },
      position: { row: 1, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 6)
    },
    {
      id: 7,
      templateType: 'info',
      content: {
        iconName: 'Users',
        heading: 'Diversity',
        subheading: 'Inclusive Design',
        paragraph: 'Creating experiences that welcome and engage everyone.',
        colorIndex: 7
      },
      position: { row: 1, col: 3 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 7)
    },
    // Row 2
    {
      id: 8,
      templateType: 'info',
      content: {
        iconName: 'Flame',
        heading: 'Passion',
        subheading: 'Driven by Purpose',
        paragraph: 'Fueled by enthusiasm and dedication to excellence.',
        colorIndex: 8
      },
      position: { row: 2, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 8)
    },
    {
      id: 9,
      templateType: 'info',
      content: {
        iconName: 'Globe',
        heading: 'Global',
        subheading: 'Worldwide Reach',
        paragraph: 'Connecting people and ideas across the world.',
        colorIndex: 9
      },
      position: { row: 2, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 9)
    },
    {
      id: 10,
      templateType: 'info',
      content: {
        iconName: 'Layers',
        heading: 'Experience',
        subheading: 'User Focused',
        paragraph: 'Designing memorable interactions that resonate.',
        colorIndex: 0
      },
      position: { row: 2, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 10)
    },
    {
      id: 11,
      templateType: 'info',
      content: {
        iconName: 'Trophy',
        heading: 'Achievement',
        subheading: 'Award Winning',
        paragraph: 'Recognized for outstanding work and innovation.',
        colorIndex: 1
      },
      position: { row: 2, col: 3 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 11)
    },
    // Row 3
    {
      id: 12,
      templateType: 'info',
      content: {
        iconName: 'Brain',
        heading: 'Intelligence',
        subheading: 'Smart Solutions',
        paragraph: 'Leveraging AI and data to create intelligent experiences.',
        colorIndex: 2
      },
      position: { row: 3, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 12)
    },
    {
      id: 13,
      templateType: 'info',
      content: {
        iconName: 'Gem',
        heading: 'Premium',
        subheading: 'Luxury Design',
        paragraph: 'Crafting high-end experiences with sophistication.',
        colorIndex: 3
      },
      position: { row: 3, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 13)
    },
    {
      id: 14,
      templateType: 'info',
      content: {
        iconName: 'Navigation',
        heading: 'Direction',
        subheading: 'Clear Vision',
        paragraph: 'Guiding projects with strategic thinking and clarity.',
        colorIndex: 4
      },
      position: { row: 3, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 14)
    },
    {
      id: 15,
      templateType: 'info',
      content: {
        iconName: 'PartyPopper',
        heading: 'Entertainment',
        subheading: 'Engaging Content',
        paragraph: 'Creating delightful experiences that captivate audiences.',
        colorIndex: 5
      },
      position: { row: 3, col: 3 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 15)
    }
  ],

  navigation: {
    allowScroll: true,
    scrollToMap: false,
    wrapAround: true,
    transitionDuration: 650
  }
}

// Example Small Globe - Skills showcase
export const skillsGlobeConfig = {
  id: 'skills-globe',
  name: 'Skills',
  size: GLOBE_SIZES.SMALL,
  quadrant: 'topRight',

  contentPoints: [
    {
      id: 0,
      templateType: 'info',
      content: {
        iconName: 'Code',
        heading: 'Development',
        subheading: 'Full Stack',
        paragraph: 'Expert in modern web technologies and frameworks.',
        colorIndex: 0
      },
      position: { row: 0, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 0)
    },
    {
      id: 1,
      templateType: 'info',
      content: {
        iconName: 'Paintbrush',
        heading: 'Design',
        subheading: 'UI/UX',
        paragraph: 'Creating beautiful and intuitive user experiences.',
        colorIndex: 1
      },
      position: { row: 0, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 1)
    },
    {
      id: 2,
      templateType: 'info',
      content: {
        iconName: 'Database',
        heading: 'Data',
        subheading: 'Management',
        paragraph: 'Efficient data structures and database optimization.',
        colorIndex: 2
      },
      position: { row: 1, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 2)
    },
    {
      id: 3,
      templateType: 'info',
      content: {
        iconName: 'Cloud',
        heading: 'Cloud',
        subheading: 'Infrastructure',
        paragraph: 'Scalable cloud solutions and DevOps practices.',
        colorIndex: 3
      },
      position: { row: 1, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 3)
    }
  ],

  navigation: {
    allowScroll: true,
    scrollToMap: false,
    wrapAround: true,
    transitionDuration: 650
  }
}

// Example Medium Globe - Projects showcase
export const projectsGlobeConfig = {
  id: 'projects-globe',
  name: 'Projects',
  size: GLOBE_SIZES.MEDIUM,
  quadrant: 'bottomLeft',

  contentPoints: Array.from({ length: 9 }, (_, index) => ({
    id: index,
    templateType: 'info',
    content: {
      iconName: ['Package', 'Blocks', 'Box', 'Container', 'Grid', 'Layout', 'Layers', 'Maximize', 'Monitor'][index],
      heading: `Project ${index + 1}`,
      subheading: 'Featured Work',
      paragraph: `Description of project ${index + 1} showcasing expertise and creativity.`,
      colorIndex: index % 10
    },
    position: { row: Math.floor(index / 3), col: index % 3 },
    rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, index)
  })),

  navigation: {
    allowScroll: true,
    scrollToMap: false,
    wrapAround: true,
    transitionDuration: 650
  }
}

// All globe configurations
export const allGlobeConfigs = [
  homePlanetConfig,
  portfolioGlobeConfig,
  skillsGlobeConfig,
  projectsGlobeConfig
]

// Get globe config by ID
export function getGlobeConfig(globeId) {
  return allGlobeConfigs.find(config => config.id === globeId)
}

// Get home planet config
export function getHomePlanetConfig() {
  return homePlanetConfig
}
