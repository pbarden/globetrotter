// Globe configuration definitions
// Defines the actual globes in the system with their content

import { GLOBE_SIZES } from './sizeSpecs'
import { getRotationForCard } from './rotationMaps'

// Adventure Globe - Large globe with game abilities and mechanics
export const portfolioGlobeConfig = {
  id: 'portfolio-globe',
  name: 'Adventure',
  size: GLOBE_SIZES.LARGE,
  quadrant: 'bottomRight', // Position on map

  // Content points - Game abilities and mechanics
  contentPoints: [
    // Row 0
    {
      id: 0,
      templateType: 'info',
      content: {
        iconName: 'Zap',
        heading: 'Lightning Strike',
        subheading: 'Electric Mastery',
        paragraph: 'Harness the raw power of electricity to strike down enemies with devastating bolts of pure energy.',
        colorIndex: 0
      },
      position: { row: 0, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 0)
    },
    {
      id: 1,
      templateType: 'info',
      content: {
        iconName: 'Shield',
        heading: 'Force Barrier',
        subheading: 'Ultimate Defense',
        paragraph: 'Create an impenetrable shield of energy that deflects all incoming attacks and protects allies.',
        colorIndex: 1
      },
      position: { row: 0, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 1)
    },
    {
      id: 2,
      templateType: 'info',
      content: {
        iconName: 'Flame',
        heading: 'Inferno Blast',
        subheading: 'Pyro Power',
        paragraph: 'Unleash a devastating wave of flames that engulfs everything in its path with scorching heat.',
        colorIndex: 2
      },
      position: { row: 0, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 2)
    },
    {
      id: 3,
      templateType: 'info',
      content: {
        iconName: 'Wind',
        heading: 'Cyclone Rush',
        subheading: 'Wind Walker',
        paragraph: 'Command the winds to propel yourself at incredible speeds while evading all danger.',
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
        iconName: 'Sparkles',
        heading: 'Star Burst',
        subheading: 'Cosmic Strike',
        paragraph: 'Channel celestial energy into explosive projectiles that rain down from the heavens above.',
        colorIndex: 4
      },
      position: { row: 1, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 4)
    },
    {
      id: 5,
      templateType: 'info',
      content: {
        iconName: 'Heart',
        heading: 'Life Surge',
        subheading: 'Healing Wave',
        paragraph: 'Restore vitality to yourself and allies with a powerful pulse of regenerative energy.',
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
        heading: 'Sniper Focus',
        subheading: 'Perfect Aim',
        paragraph: 'Enter a state of absolute concentration where every shot finds its mark with deadly precision.',
        colorIndex: 6
      },
      position: { row: 1, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 6)
    },
    {
      id: 7,
      templateType: 'info',
      content: {
        iconName: 'Ghost',
        heading: 'Shadow Step',
        subheading: 'Stealth Mode',
        paragraph: 'Become one with the shadows and move unseen through enemy territory with perfect silence.',
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
        iconName: 'Sword',
        heading: 'Blade Dance',
        subheading: 'Melee Master',
        paragraph: 'Execute a series of lightning-fast sword strikes that overwhelm opponents in close combat.',
        colorIndex: 8
      },
      position: { row: 2, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 8)
    },
    {
      id: 9,
      templateType: 'info',
      content: {
        iconName: 'Mountain',
        heading: 'Earth Shatter',
        subheading: 'Geo Control',
        paragraph: 'Summon the power of earth to create devastating shockwaves that rupture the ground itself.',
        colorIndex: 9
      },
      position: { row: 2, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 9)
    },
    {
      id: 10,
      templateType: 'info',
      content: {
        iconName: 'Snowflake',
        heading: 'Frost Nova',
        subheading: 'Ice Magic',
        paragraph: 'Freeze your enemies in their tracks with an explosive burst of absolute zero temperature.',
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
        heading: 'Champion Mode',
        subheading: 'Ultimate Power',
        paragraph: 'Temporarily ascend to champion status, multiplying all your abilities and becoming unstoppable.',
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
        heading: 'Mind Control',
        subheading: 'Psychic Force',
        paragraph: 'Bend the will of your enemies and turn them into temporary allies with telepathic power.',
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
        heading: 'Crystal Shield',
        subheading: 'Rare Defense',
        paragraph: 'Summon crystalline armor that absorbs damage and reflects attacks back at your foes.',
        colorIndex: 3
      },
      position: { row: 3, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 13)
    },
    {
      id: 14,
      templateType: 'info',
      content: {
        iconName: 'Compass',
        heading: 'Path Finder',
        subheading: 'Navigator',
        paragraph: 'Reveal hidden paths and secret passages while marking objectives across all dimensions.',
        colorIndex: 4
      },
      position: { row: 3, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.LARGE, 14)
    },
    {
      id: 15,
      templateType: 'info',
      content: {
        iconName: 'Rocket',
        heading: 'Boost Jump',
        subheading: 'Zero Gravity',
        paragraph: 'Launch yourself skyward with explosive force and traverse vast distances with aerial mobility.',
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

// Powers Globe - Elemental powers and special abilities
export const skillsGlobeConfig = {
  id: 'skills-globe',
  name: 'Powers',
  size: GLOBE_SIZES.SMALL,
  quadrant: 'topRight',

  contentPoints: [
    {
      id: 0,
      templateType: 'info',
      content: {
        iconName: 'Flame',
        heading: 'Fire Element',
        subheading: 'Pyromancer',
        paragraph: 'Master the ancient art of fire magic and incinerate all who stand in your way.',
        colorIndex: 0
      },
      position: { row: 0, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 0)
    },
    {
      id: 1,
      templateType: 'info',
      content: {
        iconName: 'Droplet',
        heading: 'Water Element',
        subheading: 'Hydromancer',
        paragraph: 'Control the flow of water to heal allies or crush enemies with tidal forces.',
        colorIndex: 1
      },
      position: { row: 0, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 1)
    },
    {
      id: 2,
      templateType: 'info',
      content: {
        iconName: 'Wind',
        heading: 'Air Element',
        subheading: 'Aeromancer',
        paragraph: 'Become one with the wind and soar through the skies with unmatched freedom.',
        colorIndex: 2
      },
      position: { row: 1, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.SMALL, 2)
    },
    {
      id: 3,
      templateType: 'info',
      content: {
        iconName: 'Mountain',
        heading: 'Earth Element',
        subheading: 'Geomancer',
        paragraph: 'Command stone and soil to create unbreakable defenses and devastating earthquakes.',
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

// Worlds Globe - Different game realms and dimensions
export const projectsGlobeConfig = {
  id: 'projects-globe',
  name: 'Worlds',
  size: GLOBE_SIZES.MEDIUM,
  quadrant: 'bottomLeft',

  contentPoints: [
    {
      id: 0,
      templateType: 'info',
      content: {
        iconName: 'Sunrise',
        heading: 'Dawn Kingdom',
        subheading: 'The First Light',
        paragraph: 'A majestic realm where eternal sunrise bathes golden fields and crystal towers in warm light.',
        colorIndex: 0
      },
      position: { row: 0, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 0)
    },
    {
      id: 1,
      templateType: 'info',
      content: {
        iconName: 'Moon',
        heading: 'Twilight Vale',
        subheading: 'Realm of Shadows',
        paragraph: 'A mysterious land shrouded in perpetual dusk where magic flows through ancient forests.',
        colorIndex: 1
      },
      position: { row: 0, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 1)
    },
    {
      id: 2,
      templateType: 'info',
      content: {
        iconName: 'Snowflake',
        heading: 'Frost Peaks',
        subheading: 'Frozen Heights',
        paragraph: 'Towering mountains of eternal ice where only the bravest adventurers dare to tread.',
        colorIndex: 2
      },
      position: { row: 0, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 2)
    },
    {
      id: 3,
      templateType: 'info',
      content: {
        iconName: 'Volcano',
        heading: 'Ember Wastes',
        subheading: 'Land of Fire',
        paragraph: 'A scorched desert of lava flows and volcanic ash where dragons make their ancient lairs.',
        colorIndex: 3
      },
      position: { row: 1, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 3)
    },
    {
      id: 4,
      templateType: 'info',
      content: {
        iconName: 'Trees',
        heading: 'Emerald Grove',
        subheading: 'Living Forest',
        paragraph: 'An enchanted woodland where nature spirits dwell among trees older than time itself.',
        colorIndex: 4
      },
      position: { row: 1, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 4)
    },
    {
      id: 5,
      templateType: 'info',
      content: {
        iconName: 'Waves',
        heading: 'Azure Depths',
        subheading: 'Ocean Kingdom',
        paragraph: 'A vast underwater realm of sunken ruins and bioluminescent creatures in the deep abyss.',
        colorIndex: 5
      },
      position: { row: 1, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 5)
    },
    {
      id: 6,
      templateType: 'info',
      content: {
        iconName: 'CloudSun',
        heading: 'Sky Citadel',
        subheading: 'Floating Islands',
        paragraph: 'Magnificent cities suspended in the clouds connected by bridges of solid light.',
        colorIndex: 6
      },
      position: { row: 2, col: 0 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 6)
    },
    {
      id: 7,
      templateType: 'info',
      content: {
        iconName: 'Zap',
        heading: 'Storm Plains',
        subheading: 'Electric Fields',
        paragraph: 'Endless grasslands where lightning storms rage eternally and thunder echoes across the horizon.',
        colorIndex: 7
      },
      position: { row: 2, col: 1 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 7)
    },
    {
      id: 8,
      templateType: 'info',
      content: {
        iconName: 'Stars',
        heading: 'Cosmic Void',
        subheading: 'Between Worlds',
        paragraph: 'A mysterious dimension of swirling stardust where reality bends and time has no meaning.',
        colorIndex: 8
      },
      position: { row: 2, col: 2 },
      rotation: getRotationForCard(GLOBE_SIZES.MEDIUM, 8)
    }
  ],

  navigation: {
    allowScroll: true,
    scrollToMap: false,
    wrapAround: true,
    transitionDuration: 650
  }
}

// All globe configurations
export const allGlobeConfigs = [
  portfolioGlobeConfig,
  skillsGlobeConfig,
  projectsGlobeConfig
]

// Get globe config by ID
export function getGlobeConfig(globeId) {
  return allGlobeConfigs.find(config => config.id === globeId)
}
