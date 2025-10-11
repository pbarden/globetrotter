// Card template definitions
// Defines available card templates and their structure

export const CARD_TEMPLATES = {
  INFO: 'info',
  GAME_TITLE: 'gameTitle',
  MEDIA: 'media',
  FORM: 'form',
  STATS: 'stats'
}

// Template metadata
export const templateMeta = {
  [CARD_TEMPLATES.INFO]: {
    name: 'InfoCard',
    description: 'Current ContentCard implementation - icon, heading, subheading, paragraph with glass morphism',
    componentPath: 'components/cards/templates/InfoCardTemplate',
    requiredFields: ['iconName', 'heading', 'subheading', 'paragraph', 'colorIndex']
  },

  [CARD_TEMPLATES.GAME_TITLE]: {
    name: 'GameTitleCard',
    description: 'Item shop style card with title, subtitle, and 3 large clickable items',
    componentPath: 'components/cards/templates/GameTitleCardTemplate',
    requiredFields: ['title', 'subtitle', 'items', 'colorIndex']
  },

  [CARD_TEMPLATES.MEDIA]: {
    name: 'MediaCard',
    description: 'Image/video heavy card with caption',
    componentPath: 'components/cards/templates/MediaCardTemplate',
    requiredFields: ['mediaType', 'mediaUrl', 'caption']
  },

  [CARD_TEMPLATES.FORM]: {
    name: 'FormCard',
    description: 'Interactive form card with inputs',
    componentPath: 'components/cards/templates/FormCardTemplate',
    requiredFields: ['formTitle', 'fields']
  },

  [CARD_TEMPLATES.STATS]: {
    name: 'StatsCard',
    description: 'Data visualization card with charts',
    componentPath: 'components/cards/templates/StatsCardTemplate',
    requiredFields: ['statsTitle', 'dataPoints']
  }
}

// Validate card content against template requirements
export function validateCardContent(templateType, content) {
  const meta = templateMeta[templateType]

  if (!meta) {
    console.warn(`Unknown template type: ${templateType}`)
    return false
  }

  const missingFields = meta.requiredFields.filter(field => !(field in content))

  if (missingFields.length > 0) {
    console.warn(`Template ${templateType} missing required fields:`, missingFields)
    return false
  }

  return true
}

// Get template metadata
export function getTemplateMeta(templateType) {
  return templateMeta[templateType]
}
