"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import "./NewsDetailPage.css";
import { getArticleById, getArticlesByCategory, incrementArticleView } from "../api";

const NewsDetailPage = ({ user }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        
        // Fetch article data
        const response = await getArticleById(id);
        const articleData = response.data;
        setArticle(articleData);
        
        // Increment view count
        try {
          await incrementArticleView(id);
        } catch (viewErr) {
          console.error("Error incrementing view count:", viewErr);
          // Non-critical error, don't set main error state
        }
        
        // Fetch related articles from same category
        if (articleData.category) {
          try {
            const relatedResponse = await getArticlesByCategory(articleData.category, 3);
            
            // Handle both array response and object containing articles array
            const relatedArticles = Array.isArray(relatedResponse.data) 
              ? relatedResponse.data 
              : relatedResponse.data.articles || [];
            
            // Filter out current article
            const related = relatedArticles.filter(a => a._id !== id);
            setRelatedArticles(related.slice(0, 3)); // Limit to 3 articles
          } catch (relatedErr) {
            console.error("Error fetching related articles:", relatedErr);
            // Non-critical error, don't fail the whole page load
            setRelatedArticles([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err.response?.data?.message || "Failed to load the article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reusable image error handler
  const handleImageError = (e) => {
    if (e.target.src.includes("/placeholder.jpg")) {
      e.target.onerror = null;
      return;
    }
    e.target.onerror = null;
    e.target.src = "/placeholder.jpg";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading article...</p>
      </div>
    );
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
    );
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

        {/* Display video if available */}
        {article.hasVideo && article.videoUrl && (
          <div className="article-featured-video">
            <video controls width="100%">
              <source src={`http://localhost:5000${article.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Display image if no video or if both are available */}
        {(!article.hasVideo || (article.hasVideo && article.imageUrl)) && (
          <div className="article-featured-image">
            <img
              src={`http://localhost:5000/${article.videoUrl}` || "/placeholder.jpg"}
              alt={article.title}
              onError={handleImageError}
            />
          </div>
        )}

        <div className="article-content">
          {article.content && typeof article.content === "string"
            ? article.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            : <p>{article.content || "No content available."}</p>}
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
            <button 
              className="share-button facebook" 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
            >
              Facebook
            </button>
            <button 
              className="share-button twitter" 
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${article.title}`, '_blank')}
            >
              Twitter
            </button>
            <button 
              className="share-button linkedin" 
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${article.title}`, '_blank')}
            >
              LinkedIn
            </button>
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
                      onError={handleImageError}
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
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
