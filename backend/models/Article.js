import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for text search
articleSchema.index({ title: "text", description: "text", content: "text", tags: "text" })

// Pre-save middleware to update the updatedAt field
articleSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const Article = mongoose.model("Article", articleSchema)

export default Article
