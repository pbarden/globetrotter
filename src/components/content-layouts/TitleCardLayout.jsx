import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import './TitleCardLayout.css'

/**
 * TitleCardLayout - Home planet title card with game title, menu, and instructions
 */
export function TitleCardLayout({ content, currentScheme }) {
  const IconComponent = useMemo(() => Icons[content.iconName] || Icons.Circle, [content.iconName])

  return (
    <div className="title-card-layout">
      {/* Glass background layer */}
      <div className="glass-back"></div>

      {/* Content container */}
      <div className="title-content-container">

        {/* Game Title Section */}
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
            {content.heading || 'Radio Free Moon'}
          </h1>
          <p className="game-subtitle">{content.subheading || 'An Interactive Journey'}</p>
        </div>

        {/* Instructions */}
        <div className="instructions-box floating-card">
          <div className="instructions-label">How to Play</div>
          <p className="instructions-text">
            {content.paragraph || 'Scroll in any direction to explore the universe. Discover planets, unlock secrets, and navigate through the cosmic web.'}
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="menu-buttons-container">
          <button
            className="menu-button floating-card"
            style={{
              borderColor: currentScheme.primary + '66',
              background: `linear-gradient(135deg, ${currentScheme.primary}11 0%, ${currentScheme.secondary}11 100%)`
            }}
          >
            <Icons.Settings className="menu-icon" size={20} strokeWidth={2} style={{ color: currentScheme.primary }} />
            <span className="menu-text" style={{ color: currentScheme.primary }}>Settings</span>
          </button>

          <button
            className="menu-button floating-card"
            style={{
              borderColor: currentScheme.secondary + '66',
              background: `linear-gradient(135deg, ${currentScheme.secondary}11 0%, ${currentScheme.accent}11 100%)`
            }}
          >
            <Icons.HelpCircle className="menu-icon" size={20} strokeWidth={2} style={{ color: currentScheme.secondary }} />
            <span className="menu-text" style={{ color: currentScheme.secondary }}>Help</span>
          </button>

          <button
            className="menu-button floating-card"
            style={{
              borderColor: currentScheme.accent + '66',
              background: `linear-gradient(135deg, ${currentScheme.accent}11 0%, ${currentScheme.primary}11 100%)`
            }}
          >
            <Icons.Info className="menu-icon" size={20} strokeWidth={2} style={{ color: currentScheme.accent }} />
            <span className="menu-text" style={{ color: currentScheme.accent }}>About</span>
          </button>
        </div>

        {/* Continue/Resume Prompt */}
        <div className="continue-prompt">
          <div
            className="continue-indicator"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${currentScheme.primary}44 50%, transparent 100%)`
            }}
          >
            <Icons.MousePointerClick size={24} style={{ color: currentScheme.primary }} />
            <span style={{ color: currentScheme.primary }}>Scroll anywhere to continue</span>
          </div>
        </div>

      </div>
    </div>
  )
}
