"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import NewsGrid from "../components/NewsGrid"
import "./CategoryPage.css"

const CategoryPage = () => {
  const { category } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const articlesPerPage = 9

  useEffect(() => {
    // Reset state when category changes
    setArticles([])
    setLoading(true)
    setError(null)
    setPage(1)
    setHasMore(true)

    fetchArticles(1)
  }, [category])

  const fetchArticles = async (pageNum) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:5000/api/articles/category/${category}?page=${pageNum}&limit=${articlesPerPage}`,
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
      console.error(`Error fetching ${category} articles:`, err)
      setError(`Failed to load ${category} articles. Please try again later.`)
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchArticles(nextPage)
  }

  const getCategoryTitle = () => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => fetchArticles(1)} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
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
          <p>Loading {getCategoryTitle()} articles...</p>
        </div>
      ) : (
        <div className="no-articles">
          <p>No articles found in this category</p>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
