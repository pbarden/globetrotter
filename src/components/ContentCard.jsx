import { memo, useMemo } from 'react'
import './ContentCard.css'
import { DefaultLayout } from './content-layouts/DefaultLayout'
import { TitleCardLayout } from './content-layouts/TitleCardLayout'

// Unified color scheme system - moved outside component to prevent recreation
const colorSchemes = [
  { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' }, // Gold/Orange/Yellow
  { primary: '#ff00ff', secondary: '#ff00aa', accent: '#aa00ff' }, // Magenta/Pink/Purple
  { primary: '#00ff88', secondary: '#00ffaa', accent: '#88ff00' }, // Green/Mint/Lime
  { primary: '#ff6b6b', secondary: '#ff3333', accent: '#ff9999' }, // Red/Crimson/Pink
  { primary: '#b388ff', secondary: '#8844ff', accent: '#cc99ff' }, // Purple/Violet/Lavender
  { primary: '#00ffff', secondary: '#00ccff', accent: '#66ffff' }, // Cyan/Sky Blue/Aqua
  { primary: '#ff9500', secondary: '#ff6b00', accent: '#ffb84d' }, // Orange/Tangerine
  { primary: '#00ff00', secondary: '#00cc00', accent: '#66ff66' }, // Bright Green/Neon
  { primary: '#ff1493', secondary: '#ff007f', accent: '#ff69b4' }, // Hot Pink/Deep Pink
  { primary: '#9370db', secondary: '#8a2be2', accent: '#ba55d3' }, // Medium Purple/Blue Violet
]

// Layout registry
const layoutComponents = {
  default: DefaultLayout,
  titleCard: TitleCardLayout
}

function ContentCardComponent({ content, isActive, needsReorientation, animationDirection, colorIndex }) {
  // Memoize current color scheme selection
  const currentScheme = useMemo(() => colorSchemes[colorIndex % colorSchemes.length], [colorIndex])

  // Get layout type from content or default to 'default'
  const layoutType = content.layoutType || 'default'
  const LayoutComponent = layoutComponents[layoutType] || DefaultLayout

  return (
    <div className={`content-card ${isActive ? 'active' : ''} ${animationDirection || ''}`}>
      <LayoutComponent content={content} currentScheme={currentScheme} />
    </div>
  )
}

export const ContentCard = memo(ContentCardComponent)
