import express from "express"
import Article from "../models/Article.js"

const router = express.Router()

// Search articles
router.get("/", async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query

    if (!q) {
      return res.status(400).json({ message: "Search query is required" })
    }

    // Using MongoDB text search
    const articles = await Article.find(
      { $text: { $search: q } },
      // Add text score for relevance
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.status(200).json(articles)
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({ message: "Failed to perform search" })
  }
})

export default router
