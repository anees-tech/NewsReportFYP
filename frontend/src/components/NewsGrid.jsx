import NewsCard from "./NewsCard"
import "./NewsGrid.css"

const NewsGrid = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="no-articles">
        <p>No articles found</p>
      </div>
    )
  }

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <div className="news-grid-item" key={article._id}>
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  )
}

export default NewsGrid
