import { Link } from "react-router-dom"
import "./NewsCard.css"

const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Truncate the description to a certain length
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  return (
    <div className="news-card">
      <div className="news-card-image">
        <Link to={`/news/${article._id}`}>
          <img
            src={article.imageUrl || "/placeholder.jpg"}
            alt={article.title}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.jpg"
            }}
          />
        </Link>
        <div className="news-category">{article.category}</div>
      </div>
      <div className="news-card-content">
        <h3 className="news-title">
          <Link to={`/news/${article._id}`}>{article.title}</Link>
        </h3>
        <p className="news-description">{truncateText(article.description, 120)}</p>
        <div className="news-meta">
          <span className="news-date">{formatDate(article.createdAt)}</span>
          <span className="news-author">By {article.author}</span>
        </div>
        <Link to={`/news/${article._id}`} className="read-more">
          Read More
        </Link>
      </div>
    </div>
  )
}

export default NewsCard
