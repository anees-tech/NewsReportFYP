import express from "express"
import Article from "../models/Article.js"
import Comment from "../models/Comment.js"

const router = express.Router()

// Get all articles for admin (with more details)
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 })

    res.status(200).json(articles)
  } catch (error) {
    console.error("Error getting admin articles:", error)
    res.status(500).json({ message: "Failed to fetch articles" })
  }
})

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments()

    // Calculate total views
    const viewsResult = await Article.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }])
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0

    // Get total comments
    const totalComments = await Comment.countDocuments()

    res.status(200).json({
      totalArticles,
      totalViews,
      totalComments,
    })
  } catch (error) {
    console.error("Error getting admin stats:", error)
    res.status(500).json({ message: "Failed to fetch admin statistics" })
  }
})

export default router
