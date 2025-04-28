import { Link } from "react-router-dom";
import "./NewsCard.css";

const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate the description to a certain length
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text; // Add check for null/undefined text
    return text.substr(0, maxLength) + "...";
  };

  const handleImageError = (e) => {
    // Prevent infinite loop if placeholder also fails
    if (e.target.src.includes("/placeholder.jpg")) {
      e.target.onerror = null; // Stop trying further
      return;
    }
    e.target.onerror = null; // Remove the handler to prevent potential loops with the placeholder
    e.target.src = "/placeholder.jpg"; // Set to placeholder
  };

  return (
    <div className="news-card">
      <div className="news-card-image">
        <Link to={`/news/${article._id}`}>
          <img
            src={article.imageUrl || "/placeholder.jpg"}
            alt={article.title || "News article image"} // Add fallback alt text
            onError={handleImageError} // Use the refined error handler
          />
        </Link>
        <div className="news-category">{article.category}</div>
      </div>
      <div className="news-card-content">
        <h3 className="news-title">
          <Link to={`/news/${article._id}`}>{article.title || "Untitled Article"}</Link> {/* Add fallback title */}
        </h3>
        <p className="news-description">{truncateText(article.description, 120)}</p>
        <div className="news-meta">
          <span className="news-date">{article.createdAt ? formatDate(article.createdAt) : "Unknown date"}</span> {/* Add fallback date */}
          <span className="news-author">By {article.author || "Unknown author"}</span> {/* Add fallback author */}
        </div>
        <Link to={`/news/${article._id}`} className="read-more">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
