import './ContentCard.css'

export function ContentCard({ content, isActive, needsReorientation, animationDirection }) {
  return (
    <div className={`content-card ${isActive ? 'active' : ''} ${animationDirection || ''}`}>
      <div className="card-content">
        <div className="card-icon">{content.icon}</div>
        <h2 className="card-heading">{content.heading}</h2>
        <h3 className="card-subheading">{content.subheading}</h3>
        <p className="card-paragraph">{content.paragraph}</p>
      </div>
    </div>
  )
}
