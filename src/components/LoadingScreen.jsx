import { useEffect, useState } from 'react'
import './LoadingScreen.css'

export function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onLoadComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
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
