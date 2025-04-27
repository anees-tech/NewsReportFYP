import { Link } from "react-router-dom"
import "./HeroSection.css"

const HeroSection = ({ featuredArticle }) => {
  if (!featuredArticle) return null

  return (
    <div className="hero-section">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${featuredArticle.imageUrl || "/placeholder.jpg"})` }}
      >
        <div className="hero-content">
          <span className="hero-category">{featuredArticle.category}</span>
          <h1 className="hero-title">{featuredArticle.title}</h1>
          <p className="hero-description">{featuredArticle.description}</p>
          <Link to={`/news/${featuredArticle._id}`} className="hero-button">
            Read Full Story
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
