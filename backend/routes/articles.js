import express from "express"
import Article from "../models/Article.js"
import Comment from "../models/Comment.js"

const router = express.Router()

// Get all articles (with pagination)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.status(200).json(articles)
  } catch (error) {
    console.error("Error getting articles:", error)
    res.status(500).json({ message: "Failed to fetch articles" })
  }
})

// Get featured article
router.get("/featured", async (req, res) => {
  try {
    const featuredArticle = await Article.findOne({ isFeatured: true }).sort({ createdAt: -1 })

    if (!featuredArticle) {
      // If no featured article, return the latest article
      const latestArticle = await Article.findOne().sort({ createdAt: -1 })

      return res.status(200).json(latestArticle)
    }

    res.status(200).json(featuredArticle)
  } catch (error) {
    console.error("Error getting featured article:", error)
    res.status(500).json({ message: "Failed to fetch featured article" })
  }
})

// Get latest articles
router.get("/latest", async (req, res) => {
  try {
    const { limit = 6 } = req.query

    const articles = await Article.find().sort({ createdAt: -1 }).limit(Number.parseInt(limit))

    res.status(200).json(articles)
  } catch (error) {
    console.error("Error getting latest articles:", error)
    res.status(500).json({ message: "Failed to fetch latest articles" })
  }
})

// Get popular articles
router.get("/popular", async (req, res) => {
  try {
    const { limit = 6 } = req.query

    const articles = await Article.find().sort({ views: -1 }).limit(Number.parseInt(limit))

    res.status(200).json(articles)
  } catch (error) {
    console.error("Error getting popular articles:", error)
    res.status(500).json({ message: "Failed to fetch popular articles" })
  }
})

// Get articles by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params
    const { page = 1, limit = 9 } = req.query

    const articles = await Article.find({ category: category.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.status(200).json(articles)
  } catch (error) {
    console.error(`Error getting ${req.params.category} articles:`, error)
    res.status(500).json({ message: `Failed to fetch ${req.params.category} articles` })
  }
})

// Get single article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    res.status(200).json(article)
  } catch (error) {
    console.error("Error getting article:", error)
    res.status(500).json({ message: "Failed to fetch article" })
  }
})

// Create a new article
router.post("/", async (req, res) => {
  try {
    const newArticle = new Article(req.body)
    await newArticle.save()

    res.status(201).json(newArticle)
  } catch (error) {
    console.error("Error creating article:", error)
    res.status(500).json({ message: "Failed to create article" })
  }
})

// Update an article
router.put("/:id", async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" })
    }

    res.status(200).json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    res.status(500).json({ message: "Failed to update article" })
  }
})

// Delete an article
router.delete("/:id", async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id)

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" })
    }

    // Delete all comments associated with this article
    await Comment.deleteMany({ articleId: req.params.id })

    res.status(200).json({ message: "Article and associated comments deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    res.status(500).json({ message: "Failed to delete article" })
  }
})

// Increment view count
router.post("/:id/view", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    res.status(200).json({ views: article.views })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    res.status(500).json({ message: "Failed to update view count" })
  }
})

export default router
