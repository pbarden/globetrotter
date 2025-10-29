import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import { useUserPreferences } from '../../hooks/useUserPreferences.jsx'
import './TADRadioLayout.css'

/**
 * TADRadioLayout - Radio/Genre selection layout for Radio Free Moon
 */
export function TADRadioLayout({ content, currentScheme }) {
  // Get user preferences
  const { genres, toggleGenre } = useUserPreferences()

  // Map genres to color schemes
  const genreColorSchemes = {
    lofi: { primary: '#00ffaa', secondary: '#00ff88', accent: '#88ff00' }, // Green/Mint (2)
    piano: { primary: '#b388ff', secondary: '#8844ff', accent: '#cc99ff' }, // Purple/Violet (4)
    electronic: { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' }, // Gold/Orange/Yellow (0)
    chill: { primary: '#00ffff', secondary: '#00ccff', accent: '#66ffff' }, // Cyan/Aqua (5)
    epic: { primary: '#ff6b6b', secondary: '#ff3333', accent: '#ff9999' }  // Red/Crimson (3)
  }

  // Determine active color scheme based on selected genres
  const selectedGenres = Object.keys(genres).filter(genre => genres[genre])
  const activeScheme = selectedGenres.length > 0 && genreColorSchemes[selectedGenres[0]]
    ? genreColorSchemes[selectedGenres[0]]
    : { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' } // Default gold

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
              background: `linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ffaa00 100%)`,
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
          Pick the styles you're in the mood to hear. Then, scroll or swipe in any direction to start listening. You can change your preferences at any time.
        </p>

        {/* Genre Icons Row (5 icons in 9-column grid) */}
        <div className="genre-icons-row">
          {genreIcons.map((genre, index) => {
            const IconComponent = genre.icon
            const isSelected = genres[genre.key]
            const genreScheme = genreColorSchemes[genre.key] || { primary: '#ffd700', secondary: '#ff8c00', accent: '#ffaa00' }

            return (
              <div
                key={index}
                className={`genre-icon-area genre-icon-${index + 1}`}
                onClick={() => toggleGenre(genre.key)}
                style={{ cursor: 'pointer' }}
              >
                <IconComponent
                  size={48}
                  strokeWidth={2.5}
                  fill={isSelected ? `url(#genre-gradient-${index})` : 'none'}
                  style={{
                    color: isSelected ? genreScheme.primary : 'rgba(100, 150, 255, 0.4)',
                    opacity: isSelected ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                />
                <span
                  className="genre-label-text"
                  style={{
                    color: isSelected ? genreScheme.primary : 'rgba(192, 216, 255, 0.6)',
                    opacity: isSelected ? 1 : 0.7
                  }}
                >
                  {genre.label}
                </span>

                {/* SVG gradient definition for this genre */}
                {isSelected && (
                  <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                      <linearGradient id={`genre-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: genreScheme.primary, stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: genreScheme.secondary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: genreScheme.accent, stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
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
