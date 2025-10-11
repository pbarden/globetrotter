import { memo } from 'react'
import { CARD_TEMPLATES, validateCardContent } from '../../configs/cardTemplates'

// Import card templates
import { ContentCard } from '../../../../components/ContentCard' // Existing InfoCard
import { GameTitleCardTemplate } from './templates/GameTitleCardTemplate'

/**
 * TemplateRenderer - Selects and renders appropriate card template
 * Based on templateType, renders the corresponding card component
 */
function TemplateRendererComponent({
  templateType,
  content,
  isActive,
  needsReorientation,
  animationDirection,
  colorIndex
}) {
  // Validate content against template requirements
  if (!validateCardContent(templateType, content)) {
    console.error(`Invalid content for template: ${templateType}`, content)
    return null
  }

  // Render appropriate template based on type
  switch (templateType) {
    case CARD_TEMPLATES.INFO:
      // Use existing ContentCard component (InfoCard template)
      return (
        <ContentCard
          content={content}
          isActive={isActive}
          needsReorientation={needsReorientation}
          animationDirection={animationDirection}
          colorIndex={colorIndex}
        />
      )

    case CARD_TEMPLATES.GAME_TITLE:
      // GameTitleCard template
      return (
        <GameTitleCardTemplate
          content={content}
          isActive={isActive}
          animationDirection={animationDirection}
          colorIndex={colorIndex}
        />
      )

    case CARD_TEMPLATES.MEDIA:
      // MediaCard template (placeholder)
      return (
        <div className="media-card-placeholder">
          <p>MediaCard Template (Not Yet Implemented)</p>
          <p>Media: {content.mediaUrl}</p>
        </div>
      )

    case CARD_TEMPLATES.FORM:
      // FormCard template (placeholder)
      return (
        <div className="form-card-placeholder">
          <p>FormCard Template (Not Yet Implemented)</p>
          <p>Form: {content.formTitle}</p>
        </div>
      )

    case CARD_TEMPLATES.STATS:
      // StatsCard template (placeholder)
      return (
        <div className="stats-card-placeholder">
          <p>StatsCard Template (Not Yet Implemented)</p>
          <p>Stats: {content.statsTitle}</p>
        </div>
      )

    default:
      console.warn(`Unknown template type: ${templateType}`)
      return (
        <div className="unknown-template">
          <p>Unknown Template: {templateType}</p>
        </div>
      )
  }
}

export const TemplateRenderer = memo(TemplateRendererComponent)
