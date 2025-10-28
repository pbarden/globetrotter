import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'radio_free_moon_preferences'

const DEFAULT_PREFERENCES = {
  genres: {
    lofi: false,
    piano: false,
    electronic: false,
    hiphop: false,
    epic: false
  }
}

/**
 * Hook for managing user preferences
 * @returns {object} Preferences and control functions
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      // Ignore parse errors
    }
    return DEFAULT_PREFERENCES
  })

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      // Ignore storage errors
    }
  }, [preferences])

  /**
   * Toggle a genre preference
   * @param {string} genre - Genre key (lofi, piano, electronic, hiphop, epic)
   */
  const toggleGenre = useCallback((genre) => {
    setPreferences(prev => ({
      ...prev,
      genres: {
        ...prev.genres,
        [genre]: !prev.genres[genre]
      }
    }))
  }, [])

  /**
   * Set a specific genre preference
   * @param {string} genre - Genre key
   * @param {boolean} value - True/false
   */
  const setGenre = useCallback((genre, value) => {
    setPreferences(prev => ({
      ...prev,
      genres: {
        ...prev.genres,
        [genre]: value
      }
    }))
  }, [])

  /**
   * Clear all genre preferences
   */
  const clearGenres = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      genres: {
        lofi: false,
        piano: false,
        electronic: false,
        hiphop: false,
        epic: false
      }
    }))
  }, [])

  return {
    preferences,
    genres: preferences.genres,
    toggleGenre,
    setGenre,
    clearGenres
  }
}
