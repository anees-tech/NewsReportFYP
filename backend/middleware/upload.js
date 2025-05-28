import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads")
const videoDir = path.join(uploadDir, "videos")
const imageDir = path.join(uploadDir, "images")

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir)
}
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir)
}

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

// Storage configuration for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

// File filter for videos
const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true)
  } else {
    cb(new Error("Only video files are allowed!"), false)
  }
}

// Create multer instances
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
})

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
})