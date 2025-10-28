import { useRef, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing audio playback with crossfade transitions
 * @param {number} fadeTime - Duration of fade in/out in milliseconds (default: 1500ms)
 * @param {function} onSongEnd - Callback when a song finishes playing
 * @returns {object} Audio player controls
 */
export function useAudioPlayer(fadeTime = 1500, onSongEnd = null) {
  const currentAudioRef = useRef(null)
  const nextAudioRef = useRef(null)
  const currentFadeInterval = useRef(null)
  const currentTrackUrl = useRef(null)
  const onSongEndRef = useRef(onSongEnd)

  // Cleanup function to stop all audio and clear intervals
  const cleanup = useCallback(() => {
    if (currentFadeInterval.current) {
      clearInterval(currentFadeInterval.current)
      currentFadeInterval.current = null
    }

    if (currentAudioRef.current) {
      // Remove event listener before cleanup
      if (currentAudioRef.current._endedListener) {
        currentAudioRef.current.removeEventListener('ended', currentAudioRef.current._endedListener)
      }
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }

    if (nextAudioRef.current) {
      if (nextAudioRef.current._endedListener) {
        nextAudioRef.current.removeEventListener('ended', nextAudioRef.current._endedListener)
      }
      nextAudioRef.current.pause()
      nextAudioRef.current = null
    }
  }, [])

  // Fade out an audio element
  const fadeOut = useCallback((audio, duration, onComplete) => {
    if (!audio) {
      onComplete?.()
      return
    }

    const startVolume = audio.volume
    const steps = 60 // 60 steps for smooth fade
    const stepTime = duration / steps
    const volumeDecrement = startVolume / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const newVolume = Math.max(0, startVolume - (volumeDecrement * currentStep))
      audio.volume = newVolume

      if (currentStep >= steps || newVolume <= 0) {
        clearInterval(interval)
        audio.pause()
        audio.volume = 0
        onComplete?.()
      }
    }, stepTime)

    return interval
  }, [])

  // Fade in an audio element
  const fadeIn = useCallback((audio, duration, targetVolume = 1.0) => {
    if (!audio) return

    audio.volume = 0

    const startFade = () => {
      const steps = 60
      const stepTime = duration / steps
      const volumeIncrement = targetVolume / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const newVolume = Math.min(targetVolume, volumeIncrement * currentStep)
        audio.volume = newVolume

        if (currentStep >= steps || newVolume >= targetVolume) {
          clearInterval(interval)
          audio.volume = targetVolume
        }
      }, stepTime)

      return interval
    }

    audio.play().then(startFade).catch(() => {})
  }, [])

  /**
   * Play a new track with crossfade
   * @param {string} audioUrl - Path to audio file
   */
  const playTrack = useCallback((audioUrl) => {
    // Don't restart if same track
    if (audioUrl === currentTrackUrl.current && currentAudioRef.current && !currentAudioRef.current.paused) {
      return
    }

    // Skip if no audio URL (like the radio card)
    if (!audioUrl) {
      // Fade out current track if playing
      if (currentAudioRef.current && !currentAudioRef.current.paused) {
        const audioToStop = currentAudioRef.current
        fadeOut(audioToStop, fadeTime, () => {
          if (audioToStop) {
            // Remove event listener before stopping
            if (audioToStop._endedListener) {
              audioToStop.removeEventListener('ended', audioToStop._endedListener)
              audioToStop._endedListener = null
            }
            audioToStop.pause()
          }
          if (currentAudioRef.current === audioToStop) {
            currentAudioRef.current = null
          }
        })
      }
      currentTrackUrl.current = null
      return
    }

    // Create new audio element for next track
    const nextAudio = new Audio(audioUrl)
    nextAudio.volume = 0

    // Add ended event listener for auto-advance
    const onAudioEnded = () => {
      if (onSongEndRef.current) {
        onSongEndRef.current()
      }
    }
    nextAudio.addEventListener('ended', onAudioEnded)
    // Store listener reference for cleanup
    nextAudio._endedListener = onAudioEnded

    const oldAudio = currentAudioRef.current

    // Update current ref immediately
    currentAudioRef.current = nextAudio
    currentTrackUrl.current = audioUrl

    // Cleanup old audio's event listener
    if (oldAudio && oldAudio._endedListener) {
      oldAudio.removeEventListener('ended', oldAudio._endedListener)
      oldAudio._endedListener = null
    }

    // Start crossfade
    if (oldAudio && !oldAudio.paused) {
      // Fade out old track
      fadeOut(oldAudio, fadeTime, () => {
        oldAudio.pause()
      })

      // Fade in new track (with slight delay for overlap)
      setTimeout(() => {
        fadeIn(nextAudio, fadeTime, 1.0)
      }, fadeTime * 0.3)
    } else {
      // No current track, just fade in the new one
      fadeIn(nextAudio, fadeTime, 1.0)
    }
  }, [fadeTime, fadeOut, fadeIn])

  /**
   * Stop playback and fade out current track
   */
  const stop = useCallback(() => {
    if (currentAudioRef.current && !currentAudioRef.current.paused) {
      const audioToStop = currentAudioRef.current
      fadeOut(audioToStop, fadeTime, () => {
        if (audioToStop) {
          // Remove event listener before stopping
          if (audioToStop._endedListener) {
            audioToStop.removeEventListener('ended', audioToStop._endedListener)
            audioToStop._endedListener = null
          }
          audioToStop.pause()
        }
        if (currentAudioRef.current === audioToStop) {
          currentAudioRef.current = null
        }
      })
    }
    currentTrackUrl.current = null
  }, [fadeTime, fadeOut])

  /**
   * Pause current track with fade out
   */
  const pause = useCallback(() => {
    if (currentAudioRef.current && !currentAudioRef.current.paused) {
      fadeOut(currentAudioRef.current, fadeTime / 2) // Faster fade for pause
    }
  }, [fadeTime, fadeOut])

  /**
   * Resume current track with fade in
   */
  const resume = useCallback(() => {
    if (currentAudioRef.current && currentAudioRef.current.paused) {
      fadeIn(currentAudioRef.current, fadeTime / 2, 1.0) // Faster fade for resume
    }
  }, [fadeTime, fadeIn])

  // Keep onSongEnd ref updated
  useEffect(() => {
    onSongEndRef.current = onSongEnd
  }, [onSongEnd])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    playTrack,
    stop,
    pause,
    resume,
    currentTrack: currentTrackUrl.current
  }
}
