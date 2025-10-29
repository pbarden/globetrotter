import { useState, useCallback, useEffect, createContext, useContext } from 'react'

const STORAGE_KEY = 'radio_free_moon_preferences'

const DEFAULT_PREFERENCES = {
  genres: {
    lofi: false,
    piano: false,
    electronic: false,
    chill: false,
    epic: false
  }
}

// Create context for shared preferences
const UserPreferencesContext = createContext(null)

/**
 * Provider component for user preferences
 */
export function UserPreferencesProvider({ children }) {
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
   * @param {string} genre - Genre key (lofi, piano, electronic, chill, epic)
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
        chill: false,
        epic: false
      }
    }))
  }, [])

  const value = {
    preferences,
    genres: preferences.genres,
    toggleGenre,
    setGenre,
    clearGenres
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

/**
 * Hook for accessing user preferences
 * @returns {object} Preferences and control functions
 */
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider')
  }
  return context
}
