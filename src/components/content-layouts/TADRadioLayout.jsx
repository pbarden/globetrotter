import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import './TADRadioLayout.css'

/**
 * TADRadioLayout - Radio/Genre selection layout for TAD Radio
 */
export function TADRadioLayout({ content, currentScheme }) {
  // Use gold/yellow/orange color scheme (index 0) for this layout
  const goldScheme = { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' }

  // Genre icons - can be customized
  const genreIcons = [
    { icon: Icons.Music2, label: 'Lofi' },
    { icon: Icons.Piano, label: 'Piano' },
    { icon: Icons.Radio, label: 'Electronic' },
    { icon: Icons.Headphones, label: 'Hip-hop' },
    { icon: Icons.Sparkles, label: 'Epic' }
  ]

  return (
    <div className="tad-radio-layout">
      {/* Glass background layer */}
      <div className="glass-back"></div>

      {/* Content container */}
      <div className="tad-radio-container">

        {/* Header Section with Logo and Title */}
        <div className="tad-radio-header">
          <img
            src="/images/tadlogo.png"
            alt="TAD Logo"
            className="tad-logo-header"
          />
          <h1
            className="tad-radio-title"
            style={{
              background: `linear-gradient(135deg, ${goldScheme.primary} 0%, ${goldScheme.secondary} 50%, ${goldScheme.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            TAD Radio
          </h1>
        </div>

        {/* Subheading */}
        <p className="tad-radio-subtitle">
          Pick the styles you're in the mood to hear.
        </p>

        {/* Genre Icons Row (5 icons in 9-column grid) */}
        <div className="genre-icons-row">
          {genreIcons.map((genre, index) => {
            const IconComponent = genre.icon
            return (
              <div key={index} className={`genre-icon-area genre-icon-${index + 1}`}>
                <div className="genre-icon-box floating-card">
                  <div
                    className="genre-icon-placeholder"
                    style={{
                      background: `linear-gradient(135deg, ${goldScheme.primary}22 0%, ${goldScheme.secondary}22 100%)`,
                      border: `1px solid ${goldScheme.primary}44`
                    }}
                  >
                    <IconComponent
                      size={24}
                      strokeWidth={1.5}
                      style={{ color: goldScheme.primary, opacity: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Genre Labels Row (aligned with icons) */}
        <div className="genre-labels-row">
          {genreIcons.map((genre, index) => (
            <div key={index} className={`genre-label-area genre-label-${index + 1}`}>
              <span className="genre-label-text">{genre.label}</span>
            </div>
          ))}
        </div>

        {/* Footer with Moon Man Digital */}
        <div className="tad-radio-footer">
          <img
            src="/images/mmlogo.png"
            alt="Moon Man Digital"
            className="mm-logo-footer"
          />
          <p className="mm-credits">
            Presented by moon man digital, all rights reserved.
          </p>
        </div>

      </div>
    </div>
  )
}
