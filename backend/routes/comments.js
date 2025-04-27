import express from "express"
import Comment from "../models/Comment.js"

const router = express.Router()

// Get comments for an article
router.get("/:articleId", async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId }).sort({ createdAt: -1 })

    res.status(200).json(comments)
  } catch (error) {
    console.error("Error getting comments:", error)
    res.status(500).json({ message: "Failed to fetch comments" })
  }
})

// Add a comment to an article
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body)
    await newComment.save()

    res.status(201).json(newComment)
  } catch (error) {
    console.error("Error creating comment:", error)
    res.status(500).json({ message: "Failed to create comment" })
  }
})

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;
