"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NewsGrid from "../components/NewsGrid";
import "./CategoryPage.css";
import { dummyArticles } from "../dummyData"; // Import dummy data

const CategoryPage = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching articles by category
    try {
      setLoading(true); // Optional
      setError(null);

      const categoryArticles = dummyArticles.filter((a) => a.category === category.toLowerCase());
      setArticles(categoryArticles);

      setLoading(false);
    } catch (err) {
      console.error(`Error processing dummy ${category} articles:`, err);
      setError(`Failed to load dummy ${category} articles.`);
      setLoading(false);
    }
  }, [category]); // Re-run when category changes

  const getCategoryTitle = () => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1 className="category-title">{getCategoryTitle()} News</h1>
        <p className="category-description">Latest and trending news in {getCategoryTitle()}</p>
      </div>

      {articles.length > 0 ? (
        <>
          <NewsGrid articles={articles} />
        </>
      ) : loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading {getCategoryTitle()} articles...</p>
        </div>
      ) : (
        <div className="no-articles">
          <p>No articles found in this category</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
