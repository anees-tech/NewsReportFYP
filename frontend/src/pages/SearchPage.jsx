"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NewsGrid from "../components/NewsGrid";
import "./SearchPage.css";
import { searchArticles } from "../api";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const articlesPerPage = 12;

  useEffect(() => {
    setArticles([]);
    setPage(1);
    
    if (query) {
      performSearch(1);
    }
  }, [query]);

  const performSearch = async (pageNumber) => {
    if (!query) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await searchArticles(query, pageNumber, articlesPerPage);
      
      if (pageNumber === 1) {
        setArticles(response.data);
      } else {
        setArticles(prevArticles => [...prevArticles, ...response.data]);
      }
      
      // If we got fewer articles than requested, there are no more to load
      setHasMore(response.data.length === articlesPerPage);
      
    } catch (err) {
      console.error("Error searching articles:", err);
      setError("Failed to perform search");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(nextPage);
  };

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
        <button onClick={() => performSearch(1)} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search Results for "{query}"</h1>
        <p className="search-info">{loading && page === 1 ? "Searching..." : `Found ${articles.length} results`}</p>
      </div>

      {articles.length > 0 ? (
        <>
          <NewsGrid articles={articles} />
          {hasMore && (
            <div className="load-more-container">
              <button onClick={loadMore} className="load-more-button" disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : loading && page === 1 ? (
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
