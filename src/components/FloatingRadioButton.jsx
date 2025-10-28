import { memo } from 'react'
import './FloatingRadioButton.css'

/**
 * FloatingRadioButton - Floating button to return to Radio Free Moon card
 */
function FloatingRadioButtonComponent({ isVisible, onClick }) {
  if (!isVisible) return null

  return (
    <button
      className="floating-radio-button"
      onClick={onClick}
      aria-label="Return to Radio Free Moon"
    >
      <img
        src="/images/mmlogo.png"
        alt="Moon Man Digital"
        className="floating-radio-logo"
      />
    </button>
  )
}

export const FloatingRadioButton = memo(FloatingRadioButtonComponent)
