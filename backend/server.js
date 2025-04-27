import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

// Route imports
import authRoutes from "./routes/auth.js"
import articleRoutes from "./routes/articles.js"
import commentRoutes from "./routes/comments.js"
import searchRoutes from "./routes/search.js"
import adminRoutes from "./routes/admin.js"

// Config
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded({ extended: true, limit: "30mb" }))
app.use(cors())
app.use(morgan("dev")) // Logging

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/articles", articleRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/admin", adminRoutes)

// Static files (future implementation)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Default route
app.get("/", (req, res) => {
  res.send("News Stream API is running!")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : null,
  })
})

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/news-stream")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`)
      console.log(`MongoDB Connected: ${mongoose.connection.host}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message)
    process.exit(1)
  })
