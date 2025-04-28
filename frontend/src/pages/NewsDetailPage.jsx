"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import "./NewsDetailPage.css";
import { dummyArticles, dummyComments } from "../dummyData";

const NewsDetailPage = ({ user }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);

      const foundArticle = dummyArticles.find((a) => a._id === id);

      if (foundArticle) {
        setArticle(foundArticle);

        const related = dummyArticles
          .filter((a) => a.category === foundArticle.category && a._id !== id)
          .slice(0, 3);
        setRelatedArticles(related);

        console.log(`Simulating view increment for article ${id}`);
      } else {
        setError("Dummy article not found.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error processing dummy article data:", err);
      setError("Failed to load the dummy article.");
      setLoading(false);
    }

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

        <div className="article-featured-image">
          <img
            src={article.imageUrl || "/placeholder.jpg"}
            alt={article.title}
            onError={handleImageError}
          />
        </div>

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
            <button className="share-button facebook" onClick={() => alert("Dummy Share: Facebook")}>Facebook</button>
            <button className="share-button twitter" onClick={() => alert("Dummy Share: Twitter")}>Twitter</button>
            <button className="share-button linkedin" onClick={() => alert("Dummy Share: LinkedIn")}>LinkedIn</button>
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
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Dummy Subscribe!"); }}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
