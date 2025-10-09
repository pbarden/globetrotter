import './ContentCard.css'
import * as Icons from 'lucide-react'

export function ContentCard({ content, isActive, needsReorientation, animationDirection, colorIndex }) {
  // Unified color scheme system
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

  const currentScheme = colorSchemes[colorIndex % colorSchemes.length]

  // Get the icon component dynamically
  const IconComponent = Icons[content.iconName] || Icons.Circle

  return (
    <div className={`content-card ${isActive ? 'active' : ''} ${animationDirection || ''}`}>
      {/* Glass background layer */}
      <div className="glass-back"></div>

      {/* Content grid container */}
      <div className="content-grid">
        {/* Row 1 - Icon (top left corner) */}
        <div className="grid-item icon-area">
          <IconComponent
            className="card-icon"
            strokeWidth={1.5}
            style={{
              color: currentScheme.primary,
              filter: `drop-shadow(0 4px 20px ${currentScheme.primary})`
            }}
          />
        </div>

        {/* Row 1 - Heading (right of icon) */}
        <div className="grid-item heading-area">
          <h2
            className="card-heading"
            style={{
              background: `linear-gradient(135deg, ${currentScheme.primary} 0%, ${currentScheme.secondary} 50%, ${currentScheme.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {content.heading}
          </h2>
        </div>

        {/* Row 2 - Two subheadings side by side, full width */}
        <div className="grid-item subheading-left-area">
          <div className="subheading-pill subheading-pill-left floating-card">
            <h3 className="card-subheading">{content.subheading}</h3>
          </div>
        </div>

        <div className="grid-item subheading-right-area">
          <div className="subheading-pill subheading-pill-right floating-card">
            <h3 className="card-subheading">Advanced Features</h3>
          </div>
        </div>

        {/* Row 3 - Paragraph */}
        <div className="grid-item paragraph-area">
          <div className="paragraph-box floating-card">
            <p className="card-paragraph">{content.paragraph}</p>
          </div>
        </div>

        {/* Row 4 - Image + Info boxes */}
        <div className="grid-item image-area">
          <div className="image-box floating-card">
            <div className="placeholder-image" style={{
              background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
              border: `1px solid ${currentScheme.primary}44`
            }}>
              <Icons.Sparkles size={32} strokeWidth={1.5} style={{ color: currentScheme.primary, opacity: 0.6 }} />
            </div>
          </div>
        </div>

        <div className="grid-item info-box-1-area">
          <div className="info-box floating-card">
            <div className="info-label">Status</div>
            <div className="info-value">Active</div>
          </div>
        </div>

        <div className="grid-item info-box-2-area">
          <div className="info-box floating-card">
            <div className="info-label">Version</div>
            <div className="info-value">2.0</div>
          </div>
        </div>

        {/* Row 5 - Buttons */}
        <div className="grid-item secondary-button-area">
          <button
            className="tech-button secondary-button"
            style={{
              borderColor: currentScheme.primary + '66',
              background: `linear-gradient(135deg, ${currentScheme.primary}11 0%, ${currentScheme.secondary}11 100%)`
            }}
          >
            <span className="button-text" style={{ color: currentScheme.primary }}>Details</span>
            <Icons.Info className="button-icon" size={18} strokeWidth={2} style={{ color: currentScheme.primary }} />
          </button>
        </div>

        <div className="grid-item primary-button-area">
          <button className="tech-button">
            <span className="button-text">Learn More</span>
            <Icons.ArrowRight className="button-icon" size={18} strokeWidth={2} />
            <div
              className="heading-underline"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${currentScheme.primary} 50%, transparent 100%)`,
                boxShadow: `0 0 10px ${currentScheme.primary}`
              }}
            ></div>
          </button>
        </div>

      </div>
    </div>
  )
}
