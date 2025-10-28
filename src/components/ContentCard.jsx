import { memo, useMemo } from 'react'
import './ContentCard.css'
import { DefaultLayout } from './content-layouts/DefaultLayout'
import { TitleCardLayout } from './content-layouts/TitleCardLayout'
import { TADRadioLayout } from './content-layouts/TADRadioLayout'
import { TADSongLayout } from './content-layouts/TADSongLayout'
import { getColorScheme } from '../config/colors'

// Layout registry
const layoutComponents = {
  default: DefaultLayout,
  titleCard: TitleCardLayout,
  tadRadio: TADRadioLayout,
  tadSong: TADSongLayout
}

function ContentCardComponent({ content, isActive, needsReorientation, animationDirection, colorIndex }) {
  // Memoize current color scheme selection
  const currentScheme = useMemo(() => getColorScheme(colorIndex), [colorIndex])

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
