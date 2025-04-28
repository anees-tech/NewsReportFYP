"use client";

import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import NewsGrid from "../components/NewsGrid";
import "./HomePage.css";
import { dummyArticles } from "../dummyData"; // Import dummy data

const HomePage = () => {
  // Initialize state with dummy data
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [categoryArticles, setCategoryArticles] = useState({});
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate data fetching with dummy data
    try {
      setLoading(true); // Optional: briefly show loading state

      // Find featured article (or use the first one)
      const featured = dummyArticles.find((a) => a.isFeatured) || dummyArticles[0];
      setFeaturedArticle(featured);

      // Get latest articles (sort by date)
      const latest = [...dummyArticles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
      setLatestArticles(latest);

      // Get popular articles (sort by views)
      const popular = [...dummyArticles].sort((a, b) => b.views - a.views).slice(0, 6);
      setPopularArticles(popular);

      // Get articles by category
      const categories = ["politics", "sports", "technology", "entertainment", "business", "health", "science"];
      const categoryData = {};
      categories.forEach((category) => {
        categoryData[category] = dummyArticles.filter((a) => a.category === category).slice(0, 4);
      });
      setCategoryArticles(categoryData);

      setLoading(false);
    } catch (err) {
      console.error("Error processing dummy data:", err);
      setError("Failed to load dummy news content.");
      setLoading(false);
    }
  }, []); // Empty dependency array, runs once

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section with Featured Article */}
      <HeroSection featuredArticle={featuredArticle} />

      {/* Latest News Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Latest News</h2>
          {/* Link might need adjustment if you don't have a dedicated 'latest' category page */}
          <a href="#" className="section-link">
            View All
          </a>
        </div>
        <NewsGrid articles={latestArticles} />
      </section>

      {/* Popular News Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular News</h2>
           {/* Link might need adjustment if you don't have a dedicated 'popular' category page */}
          <a href="#" className="section-link">
            View All
          </a>
        </div>
        <NewsGrid articles={popularArticles} />
      </section>

      {/* Category Sections */}
      {Object.entries(categoryArticles).map(
        ([category, articles]) =>
          articles.length > 0 && (
            <section className="section" key={category}>
              <div className="section-header">
                <h2 className="section-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <a href={`/category/${category}`} className="section-link">
                  View All
                </a>
              </div>
              <NewsGrid articles={articles} />
            </section>
          )
      )}
    </div>
  );
};

export default HomePage;
