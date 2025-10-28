import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import './TADSongLayout.css'

/**
 * TADSongLayout - Album/Song display layout with artist info
 */
export function TADSongLayout({ content, currentScheme }) {
  // Genre icons - same as TADRadioLayout
  const genreIcons = [
    { icon: Icons.Music2, label: 'Lofi' },
    { icon: Icons.Piano, label: 'Piano' },
    { icon: Icons.Radio, label: 'Electronic' },
    { icon: Icons.Headphones, label: 'Hip-hop' },
    { icon: Icons.Sparkles, label: 'Epic' }
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
            return (
              <div key={index} className={`song-genre-icon-area song-genre-icon-${index + 1}`}>
                <div className="song-genre-icon-box floating-card">
                  <div
                    className="song-genre-icon-placeholder"
                    style={{
                      background: `linear-gradient(135deg, ${currentScheme.primary}22 0%, ${currentScheme.secondary}22 100%)`,
                      border: `1px solid ${currentScheme.primary}44`
                    }}
                  >
                    <IconComponent
                      size={24}
                      strokeWidth={1.5}
                      style={{ color: currentScheme.primary, opacity: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Genre Labels Row (aligned with icons) */}
        <div className="song-genre-labels-row">
          {genreIcons.map((genre, index) => (
            <div key={index} className={`song-genre-label-area song-genre-label-${index + 1}`}>
              <span
                className="song-genre-label-text"
                style={{ color: currentScheme.primary }}
              >
                {genre.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
