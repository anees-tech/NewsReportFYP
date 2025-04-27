"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import CommentSection from "../components/CommentSection"
import "./NewsDetailPage.css"

const NewsDetailPage = ({ user }) => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true)
        // Fetch the article details
        const response = await axios.get(`http://localhost:5000/api/articles/${id}`)
        setArticle(response.data)

        // Fetch related articles based on category
        const relatedRes = await axios.get(
          `http://localhost:5000/api/articles/category/${response.data.category}?limit=3`,
        )

        // Filter out the current article from related articles
        const filteredRelated = relatedRes.data.filter((relatedArticle) => relatedArticle._id !== id)

        setRelatedArticles(filteredRelated)
        setLoading(false)

        // Increment view count
        await axios.post(`http://localhost:5000/api/articles/${id}/view`)
      } catch (err) {
        console.error("Error fetching article:", err)
        setError("Failed to load the article. Please try again later.")
        setLoading(false)
      }
    }

    fetchArticleData()
    // Scroll to top when article changes
    window.scrollTo(0, 0)
  }, [id])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading article...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error || "Article not found"}</p>
        <Link to="/" className="btn btn-primary">
          Back to Homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="article-detail-page">
      <div className="article-container">
        <div className="article-header">
          <div className="article-metadata">
            <Link to={`/category/${article.category}`} className="article-category">
              {article.category}
            </Link>
            <span className="article-date">{formatDate(article.createdAt)}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-author">By {article.author}</div>
        </div>

        <div className="article-featured-image">
          <img
            src={article.imageUrl || "/placeholder.jpg"}
            alt={article.title}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.jpg"
            }}
          />
        </div>

        <div className="article-content">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="article-tags">
          {article.tags &&
            article.tags.map((tag) => (
              <Link key={tag} to={`/tag/${tag}`} className="article-tag">
                #{tag}
              </Link>
            ))}
        </div>

        <div className="article-share">
          <span>Share this article:</span>
          <div className="share-buttons">
            <button className="share-button facebook">Facebook</button>
            <button className="share-button twitter">Twitter</button>
            <button className="share-button linkedin">LinkedIn</button>
          </div>
        </div>

        <CommentSection articleId={id} user={user} />
      </div>

      <div className="article-sidebar">
        <div className="related-articles">
          <h3>Related Articles</h3>
          {relatedArticles.length > 0 ? (
            <div className="related-articles-list">
              {relatedArticles.map((related) => (
                <div key={related._id} className="related-article-card">
                  <Link to={`/news/${related._id}`} className="related-article-image">
                    <img
                      src={related.imageUrl || "/placeholder.jpg"}
                      alt={related.title}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.jpg"
                      }}
                    />
                  </Link>
                  <div className="related-article-content">
                    <Link to={`/news/${related._id}`} className="related-article-title">
                      {related.title}
                    </Link>
                    <span className="related-article-date">{formatDate(related.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-related">No related articles found</div>
          )}
        </div>

        <div className="newsletter-signup">
          <h3>Subscribe to Our Newsletter</h3>
          <p>Get the latest news delivered to your inbox</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage
