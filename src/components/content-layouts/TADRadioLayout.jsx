import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import './TADRadioLayout.css'

/**
 * TADRadioLayout - Radio/Genre selection layout for Radio Free Moon
 */
export function TADRadioLayout({ content, currentScheme }) {
  // Use gold/yellow/orange color scheme (index 0) for this layout
  const goldScheme = { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' }

  // Get user preferences
  const { genres, toggleGenre } = useUserPreferences()

  // Genre icons - can be customized
  const genreIcons = [
    { icon: Icons.Music2, label: 'Lofi', key: 'lofi' },
    { icon: Icons.Piano, label: 'Piano', key: 'piano' },
    { icon: Icons.Radio, label: 'Electronic', key: 'electronic' },
    { icon: Icons.Headphones, label: 'Chill', key: 'chill' },
    { icon: Icons.Sparkles, label: 'Epic', key: 'epic' }
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
            src="/images/mmlogo.png"
            alt="Moon Man Digital Logo"
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
            Radio Free Moon
          </h1>
        </div>

        {/* Subheading */}
        <p className="tad-radio-subtitle">
          Pick the styles you're in the mood to hear. Then, scroll or swipe in any direction to start listening. You can navigate back to this screen and change your preferences at any time.
        </p>

        {/* Genre Icons Row (5 icons in 9-column grid) */}
        <div className="genre-icons-row">
          {genreIcons.map((genre, index) => {
            const IconComponent = genre.icon
            const isSelected = genres[genre.key]
            const borderColor = isSelected ? goldScheme.primary : 'rgba(100, 150, 255, 0.25)'
            const iconColor = isSelected ? goldScheme.primary : 'rgba(100, 150, 255, 0.5)'

            return (
              <div key={index} className={`genre-icon-area genre-icon-${index + 1}`}>
                <div
                  className={`genre-icon-box floating-card ${isSelected ? 'selected' : ''}`}
                  style={{ borderColor }}
                  onClick={() => toggleGenre(genre.key)}
                >
                  <div
                    className="genre-icon-placeholder"
                    style={{
                      background: `linear-gradient(135deg, ${goldScheme.primary}22 0%, ${goldScheme.secondary}22 100%)`,
                      border: `1px solid ${isSelected ? goldScheme.primary + '44' : 'rgba(100, 150, 255, 0.15)'}`
                    }}
                  >
                    <IconComponent
                      size={24}
                      strokeWidth={1.5}
                      style={{ color: iconColor, opacity: isSelected ? 1 : 0.6 }}
                    />
                  </div>
                </div>
                <span
                  className="genre-label-text"
                  style={{
                    color: isSelected ? goldScheme.primary : 'rgba(192, 216, 255, 0.6)',
                    opacity: isSelected ? 1 : 0.7
                  }}
                >
                  {genre.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer with Moon Man Digital */}
        <div className="tad-radio-footer">
          <p className="mm-credits">
            Presented by moon man digital, all rights reserved.
          </p>
        </div>

      </div>
    </div>
  )
}
