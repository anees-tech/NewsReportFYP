"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import HeroSection from "../components/HeroSection"
import NewsGrid from "../components/NewsGrid"
import "./HomePage.css"

const HomePage = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [latestArticles, setLatestArticles] = useState([])
  const [popularArticles, setPopularArticles] = useState([])
  const [categoryArticles, setCategoryArticles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch featured and latest articles
        const [featuredRes, latestRes, popularRes] = await Promise.all([
          axios.get("http://localhost:5000/api/articles/featured"),
          axios.get("http://localhost:5000/api/articles/latest"),
          axios.get("http://localhost:5000/api/articles/popular"),
        ])

        setFeaturedArticle(featuredRes.data)
        setLatestArticles(latestRes.data)
        setPopularArticles(popularRes.data)

        // Fetch articles by major categories
        const categories = ["politics", "sports", "technology", "entertainment"]
        const categoryPromises = categories.map((category) =>
          axios.get(`http://localhost:5000/api/articles/category/${category}?limit=4`),
        )

        const categoryResults = await Promise.all(categoryPromises)
        const categoryData = {}

        categories.forEach((category, index) => {
          categoryData[category] = categoryResults[index].data
        })

        setCategoryArticles(categoryData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching homepage data:", err)
        setError("Failed to load news content. Please try again later.")
        setLoading(false)
      }
    }

    fetchHomePageData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading latest news...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Hero Section with Featured Article */}
      <HeroSection featuredArticle={featuredArticle} />

      {/* Latest News Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Latest News</h2>
          <a href="/category/latest" className="section-link">
            View All
          </a>
        </div>
        <NewsGrid articles={latestArticles} />
      </section>

      {/* Popular News Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular News</h2>
          <a href="/category/popular" className="section-link">
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
          ),
      )}
    </div>
  )
}

export default HomePage
