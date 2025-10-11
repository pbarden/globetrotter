import { useMemo } from 'react'
import * as Icons from 'lucide-react'

/**
 * DefaultLayout - Original content card layout with full grid
 */
export function DefaultLayout({ content, currentScheme }) {
  const IconComponent = useMemo(() => Icons[content.iconName] || Icons.Circle, [content.iconName])

  return (
    <>
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

        {/* Row 3 - Info boxes */}
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

        <div className="grid-item info-box-3-area">
          <div className="info-box floating-card">
            <div className="info-label">Level</div>
            <div className="info-value">Pro</div>
          </div>
        </div>

        {/* Row 4 - Five images in their own 9-column grid */}
        <div className="images-row-container">
          <div className="image-area-1">
            <div className="image-box floating-card">
              <div className="placeholder-image" style={{
                background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                border: `1px solid ${currentScheme.primary}44`
              }}>
                <Icons.Sparkles size={24} strokeWidth={1.5} style={{ color: currentScheme.primary, opacity: 0.6 }} />
              </div>
            </div>
          </div>

          <div className="image-area-2">
            <div className="image-box floating-card">
              <div className="placeholder-image" style={{
                background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                border: `1px solid ${currentScheme.primary}44`
              }}>
                <Icons.Zap size={24} strokeWidth={1.5} style={{ color: currentScheme.primary, opacity: 0.6 }} />
              </div>
            </div>
          </div>

          <div className="image-area-3">
            <div className="image-box floating-card">
              <div className="placeholder-image" style={{
                background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                border: `1px solid ${currentScheme.primary}44`
              }}>
                <Icons.Star size={24} strokeWidth={1.5} style={{ color: currentScheme.primary, opacity: 0.6 }} />
              </div>
            </div>
          </div>

          <div className="image-area-4">
            <div className="image-box floating-card">
              <div className="placeholder-image" style={{
                background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                border: `1px solid ${currentScheme.primary}44`
              }}>
                <Icons.Trophy size={24} strokeWidth={1.5} style={{ color: currentScheme.primary, opacity: 0.6 }} />
              </div>
            </div>
          </div>

          <div className="image-area-5">
            <div className="image-box floating-card">
              <div className="placeholder-image" style={{
                background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                border: `1px solid ${currentScheme.primary}44`
              }}>
                <Icons.Flame size={24} strokeWidth={1.5} style={{ color: currentScheme.primary, opacity: 0.6 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 5-6 - Paragraph */}
        <div className="grid-item paragraph-area">
          <div className="paragraph-box floating-card">
            <p className="card-paragraph">{content.paragraph}</p>
          </div>
        </div>

        {/* Row 8 - Buttons */}
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
    </>
  )
}
