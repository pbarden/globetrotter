import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import './TADSongLayout.css'

/**
 * TADSongLayout - Album/Song display layout with artist info
 */
export function TADSongLayout({ content, currentScheme }) {
  // Genre icons - same as TADRadioLayout
  const genreIcons = [
    { icon: Icons.Music2, label: 'Lofi', key: 'lofi' },
    { icon: Icons.Piano, label: 'Piano', key: 'piano' },
    { icon: Icons.Radio, label: 'Electronic', key: 'electronic' },
    { icon: Icons.Headphones, label: 'Chill', key: 'chill' },
    { icon: Icons.Sparkles, label: 'Epic', key: 'epic' }
  ]

  return (
    <div className="tad-song-layout">
      {/* Glass background layer */}
      <div className="glass-back"></div>

      {/* Content container */}
      <div className="tad-song-container">

        {/* Top Section: Album Cover + Song Info */}
        <div className="song-info-section">
          {/* Album Cover */}
          <div className="album-cover-wrapper">
            <img
              src="/images/tadlogo.png"
              alt="Album Cover"
              className="album-cover-image"
            />
          </div>

          {/* Song Details */}
          <div className="song-details">
            <h1
              className="song-title"
              style={{
                background: `linear-gradient(135deg, ${currentScheme.primary} 0%, ${currentScheme.secondary} 50%, ${currentScheme.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {content.heading || 'Song Title'}
            </h1>

            <p className="artist-name">by Tad Miller</p>

            <button
              className="tech-button secondary-button"
              style={{
                borderColor: currentScheme.primary + '66',
                background: `linear-gradient(135deg, ${currentScheme.primary}11 0%, ${currentScheme.secondary}11 100%)`
              }}
              onClick={() => window.open('https://www.youtube.com/c/Tadon', '_blank')}
            >
              <span className="button-text" style={{ color: currentScheme.primary }}>check out @tadon youtube</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="content-divider"></div>

        {/* Genre Icons Row (5 icons in 9-column grid) */}
        <div className="song-genre-icons-row">
          {genreIcons.map((genre, index) => {
            const IconComponent = genre.icon
            const isActive = content.genres?.[genre.key] || false

            return (
              <div key={index} className={`song-genre-icon-area song-genre-icon-${index + 1}`}>
                <IconComponent
                  size={48}
                  strokeWidth={2.5}
                  fill={isActive ? `url(#song-gradient-${index})` : 'none'}
                  style={{
                    color: isActive ? currentScheme.primary : '#666666',
                    opacity: isActive ? 1 : 0.4,
                    transition: 'all 0.3s ease'
                  }}
                />
                <span
                  className="song-genre-label-text"
                  style={{
                    color: isActive ? currentScheme.primary : '#666666',
                    opacity: isActive ? 1 : 0.5
                  }}
                >
                  {genre.label}
                </span>

                {/* SVG gradient definition for active state */}
                {isActive && (
                  <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                      <linearGradient id={`song-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: currentScheme.primary, stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: currentScheme.secondary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: currentScheme.accent, stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
