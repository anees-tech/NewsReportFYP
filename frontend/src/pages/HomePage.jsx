"use client";

import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import NewsGrid from "../components/NewsGrid";
import "./HomePage.css";
import { 
  getFeaturedArticle, 
  getLatestArticles, 
  getPopularArticles, 
  getArticlesByCategory 
} from "../api";

const HomePage = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [categoryArticles, setCategoryArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = [
    "politics", 
    "sports", 
    "technology", 
    "entertainment", 
    "business", 
    "health", 
    "science"
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch featured article
        const featuredResponse = await getFeaturedArticle();
        setFeaturedArticle(featuredResponse.data);
        
        // Fetch latest articles
        const latestResponse = await getLatestArticles(6);
        setLatestArticles(latestResponse.data);
        
        // Fetch popular articles
        const popularResponse = await getPopularArticles(6);
        setPopularArticles(popularResponse.data);
        
        // Fetch articles by category
        const categoryData = {};
        await Promise.all(
          categories.map(async (category) => {
            try {
              const response = await getArticlesByCategory(category, 4);
              categoryData[category] = response.data;
            } catch (err) {
              console.error(`Error fetching ${category} articles:`, err);
              categoryData[category] = [];
            }
          })
        );
        
        setCategoryArticles(categoryData);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load news content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section with Featured Article */}
      {featuredArticle && <HeroSection featuredArticle={featuredArticle} />}

      {/* Latest News Section */}
      {latestArticles.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Latest News</h2>
            <a href="/category/latest" className="section-link">
              View All
            </a>
          </div>
          <NewsGrid articles={latestArticles} />
        </section>
      )}

      {/* Popular News Section */}
      {popularArticles.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Popular News</h2>
            <a href="/category/popular" className="section-link">
              View All
            </a>
          </div>
          <NewsGrid articles={popularArticles} />
        </section>
      )}

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
