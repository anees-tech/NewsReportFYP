"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NewsGrid from "../components/NewsGrid";
import "./SearchPage.css";
import { dummyArticles } from "../dummyData"; // Import dummy data

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate search results
    setArticles([]);
    setLoading(true); // Optional
    setError(null);

    if (query) {
      try {
        const lowerCaseQuery = query.toLowerCase();
        const results = dummyArticles.filter(
          (a) =>
            a.title.toLowerCase().includes(lowerCaseQuery) ||
            a.description.toLowerCase().includes(lowerCaseQuery) ||
            a.content.toLowerCase().includes(lowerCaseQuery) ||
            (a.tags && a.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
        );
        setArticles(results);
        setLoading(false);
      } catch (err) {
        console.error("Error processing dummy search:", err);
        setError("Failed to perform dummy search.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [query]);

  if (!query) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h1 className="search-title">Search Results</h1>
          <p className="search-info">Please enter a search term</p>
        </div>
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
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search Results for "{query}"</h1>
        <p className="search-info">{loading ? "Searching..." : `Found ${articles.length} results`}</p>
      </div>

      {articles.length > 0 ? (
        <>
          <NewsGrid articles={articles} />
        </>
      ) : loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Searching for articles...</p>
        </div>
      ) : (
        <div className="no-results">
          <p>No articles found matching your search</p>
          <div className="search-suggestions">
            <h3>Suggestions:</h3>
            <ul>
              <li>Check the spelling of your search term</li>
              <li>Try using more general keywords</li>
              <li>Try searching for a related topic</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
