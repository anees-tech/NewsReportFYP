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
    // Get all articles for admin view
    const articles = await Article.find().sort({ createdAt: -1 });
    
    // Calculate statistics
    const totalArticles = articles.length;
    
    // Calculate total views
    let totalViews = 0;
    articles.forEach(article => {
      totalViews += article.views || 0;
    });
    
    // Get total comments
    const totalComments = await Comment.countDocuments();
    
    // Group articles by category for potential chart display
    const categoryCount = {};
    articles.forEach(article => {
      if (article.category) {
        if (categoryCount[article.category]) {
          categoryCount[article.category]++;
        } else {
          categoryCount[article.category] = 1;
        }
      }
    });
    
    // Recent activity - latest articles and comments
    const recentArticles = articles.slice(0, 5); // Get 5 most recent
    const recentComments = await Comment.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      articles,
      stats: {
        totalArticles,
        totalViews,
        totalComments,
        categoryCount,
        recentArticles,
        recentComments
      }
    })
  } catch (error) {
    console.error("Error getting admin stats:", error)
    res.status(500).json({ message: "Failed to fetch admin statistics" })
  }
})

export default router
