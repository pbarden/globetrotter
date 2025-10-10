import { useEffect, useState } from 'react'
import './LoadingScreen.css'

export function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let progressInterval
    let loadingComplete = false

    const checkResources = async () => {
      // Wait for critical resources
      const promises = []

      // Wait for document ready
      if (document.readyState !== 'complete') {
        promises.push(new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true })
        }))
      }

      // Wait for fonts to load
      if (document.fonts) {
        promises.push(document.fonts.ready)
      }

      // Simulate minimum loading time to show animation
      promises.push(new Promise(resolve => setTimeout(resolve, 1500)))

      await Promise.all(promises)
      loadingComplete = true
    }

    // Start resource checking
    checkResources()

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (loadingComplete && prev >= 100) {
          clearInterval(progressInterval)
          setIsReady(true)
          setTimeout(() => onLoadComplete(), 500)
          return 100
        }
        // Slow down progress near 100 if resources aren't ready
        const increment = (loadingComplete || prev < 90) ? 2 : 0.5
        return Math.min(prev + increment, loadingComplete ? 100 : 95)
      })
    }, 30)

    return () => {
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [onLoadComplete])

  return (
    <div className={`loading-screen ${progress === 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-globe">
          <div className="wireframe-cube">
            <div className="cube-face front" style={{ transform: `translateZ(${75 + progress * 0.5}px)` }}></div>
            <div className="cube-face back" style={{ transform: `translateZ(-${75 + progress * 0.5}px) rotateY(180deg)` }}></div>
            <div className="cube-face left" style={{ transform: `translateX(-${75 + progress * 0.5}px) rotateY(-90deg)` }}></div>
            <div className="cube-face right" style={{ transform: `translateX(${75 + progress * 0.5}px) rotateY(90deg)` }}></div>
            <div className="cube-face top" style={{ transform: `translateY(-${75 + progress * 0.5}px) rotateX(90deg)` }}></div>
            <div className="cube-face bottom" style={{ transform: `translateY(${75 + progress * 0.5}px) rotateX(-90deg)` }}></div>
          </div>
        </div>
        <h1 className="loading-title">moon man digital</h1>
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-text">{progress}%</p>
      </div>
    </div>
  )
}
