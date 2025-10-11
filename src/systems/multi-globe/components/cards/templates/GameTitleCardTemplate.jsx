import { memo, useMemo } from 'react'
import './GameTitleCardTemplate.css'

// Color schemes (matches ContentCard system)
const colorSchemes = [
  { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' },
  { primary: '#ff00ff', secondary: '#ff00aa', accent: '#aa00ff' },
  { primary: '#00ff88', secondary: '#00ffaa', accent: '#88ff00' },
  { primary: '#ff6b6b', secondary: '#ff3333', accent: '#ff9999' },
  { primary: '#b388ff', secondary: '#8844ff', accent: '#cc99ff' },
  { primary: '#00ffff', secondary: '#00ccff', accent: '#66ffff' },
  { primary: '#ff9500', secondary: '#ff6b00', accent: '#ffb84d' },
  { primary: '#00ff00', secondary: '#00cc00', accent: '#66ff66' },
  { primary: '#ff1493', secondary: '#ff007f', accent: '#ff69b4' },
  { primary: '#9370db', secondary: '#8a2be2', accent: '#ba55d3' },
]

/**
 * GameTitleCardTemplate - Item shop style card
 * Used for home planet and main title screens
 * Features: Large title, subtitle, 3 clickable item cards
 */
function GameTitleCardTemplateComponent({
  content,
  isActive,
  animationDirection,
  colorIndex = 0,
  onItemClick
}) {
  // Memoize current color scheme
  const currentScheme = useMemo(
    () => colorSchemes[colorIndex % colorSchemes.length],
    [colorIndex]
  )

  const { title, subtitle, items = [] } = content

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick()
    } else if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <div
      className={`game-title-card ${isActive ? 'active' : ''} ${animationDirection || ''}`}
    >
      {/* Glass background layer */}
      <div className="glass-back"></div>

      {/* Content container */}
      <div className="game-title-content">
        {/* Title section */}
        <div className="title-section">
          <h1
            className="game-title"
            style={{
              background: `linear-gradient(135deg, ${currentScheme.primary} 0%, ${currentScheme.secondary} 50%, ${currentScheme.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {title}
          </h1>
          <h2 className="game-subtitle">{subtitle}</h2>
        </div>

        {/* Items grid */}
        <div className="items-grid">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="item-card floating-card"
              onClick={() => handleItemClick(item)}
              style={{
                borderColor: `${currentScheme.primary}44`
              }}
            >
              {/* Item image */}
              <div
                className="item-image"
                style={{
                  background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                  border: `1px solid ${currentScheme.primary}44`
                }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="placeholder-icon" style={{ color: currentScheme.primary }}>
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Item details */}
              <div className="item-details">
                <h3
                  className="item-name"
                  style={{ color: currentScheme.primary }}
                >
                  {item.name}
                </h3>

                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}

                {item.price && (
                  <div
                    className="item-price"
                    style={{
                      color: currentScheme.accent,
                      textShadow: `0 0 10px ${currentScheme.accent}66`
                    }}
                  >
                    {item.price}
                  </div>
                )}
              </div>

              {/* Glow effect on hover */}
              <div
                className="item-glow"
                style={{
                  boxShadow: `0 0 30px ${currentScheme.primary}66`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Optional call to action */}
        {content.callToAction && (
          <div className="cta-section">
            <p className="cta-text">{content.callToAction}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const GameTitleCardTemplate = memo(GameTitleCardTemplateComponent)
