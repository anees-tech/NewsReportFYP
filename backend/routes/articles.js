import express from "express"
import Article from "../models/Article.js"
import Comment from "../models/Comment.js"
import { uploadImage, uploadVideo } from "../middleware/upload.js"
import path from "path"

const router = express.Router()

// Get all articles (with pagination)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Article.countDocuments()

    res.status(200).json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page * 1
    })
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
      if (latestArticle) {
        return res.status(200).json(latestArticle)
      }
      return res.status(404).json({ message: "No articles found" })
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
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Find articles with matching category
    const articles = await Article.find({ category })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Count total articles for pagination info
    const total = await Article.countDocuments({ category });

    // Return consistent format with metadata
    res.status(200).json({
      articles: articles,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(`Error getting ${req.params.category} articles:`, error);
    res.status(500).json({ message: `Failed to fetch ${req.params.category} articles` });
  }
})

// Get an article by ID
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
    const newArticle = new Article({
      ...req.body,
      hasVideo: !!req.body.videoUrl, // Set hasVideo based on videoUrl presence
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
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
    // Update hasVideo field based on videoUrl presence
    const updateData = {
      ...req.body,
      hasVideo: !!req.body.videoUrl,
      updatedAt: Date.now()
    }
    
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
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
    const article = await Article.findById(req.params.id)

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    article.views = (article.views || 0) + 1
    await article.save()

    res.status(200).json({ message: "View count incremented" })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    res.status(500).json({ message: "Failed to increment view count" })
  }
})

// Upload video for an article
router.post("/upload/video", uploadVideo.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" })
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`
    res.status(200).json({ videoUrl })
  } catch (error) {
    console.error("Error uploading video:", error)
    res.status(500).json({ message: "Failed to upload video" })
  }
})

// Upload image for an article
router.post("/upload/image", uploadImage.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" })
    }

    const imageUrl = `/uploads/images/${req.file.filename}`
    res.status(200).json({ imageUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
    res.status(500).json({ message: "Failed to upload image" })
  }
})

export default router
