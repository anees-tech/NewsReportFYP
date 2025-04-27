"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import NewsGrid from "../components/NewsGrid"
import "./SearchPage.css"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query")

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const articlesPerPage = 9

  useEffect(() => {
    // Reset state when query changes
    setArticles([])
    setLoading(true)
    setError(null)
    setPage(1)
    setHasMore(true)

    if (query) {
      fetchSearchResults(1)
    } else {
      setLoading(false)
    }
  }, [query])

  const fetchSearchResults = async (pageNum) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}&page=${pageNum}&limit=${articlesPerPage}`,
      )

      if (pageNum === 1) {
        setArticles(response.data)
      } else {
        setArticles((prevArticles) => [...prevArticles, ...response.data])
      }

      // Check if we've reached the end
      setHasMore(response.data.length === articlesPerPage)
      setLoading(false)
    } catch (err) {
      console.error("Error searching articles:", err)
      setError("Failed to perform search. Please try again later.")
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchSearchResults(nextPage)
  }

  if (!query) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h1 className="search-title">Search Results</h1>
          <p className="search-info">Please enter a search term</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => fetchSearchResults(1)} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
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
  )
}

export default SearchPage
