import axios from "axios"

// Base URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// Articles API
export const getArticles = (page = 1, limit = 10) => 
  api.get(`/articles?page=${page}&limit=${limit}`)
export const getArticleById = (id) => 
  api.get(`/articles/${id}`)
export const getFeaturedArticle = () => 
  api.get("/articles/featured")
export const getLatestArticles = (limit = 6) => 
  api.get(`/articles/latest?limit=${limit}`)
export const getPopularArticles = (limit = 6) => 
  api.get(`/articles/popular?limit=${limit}`)
export const getArticlesByCategory = (category, limit = 10) =>
  api.get(`/articles/category/${category}?limit=${limit}`)
export const incrementArticleView = (id) => 
  api.post(`/articles/${id}/view`)

// Comments API
export const getCommentsByArticleId = (articleId) => 
  api.get(`/comments/${articleId}`)
export const createComment = (comment) => 
  api.post("/comments", comment)
export const deleteComment = (id) => 
  api.delete(`/comments/${id}`)

// Auth API
export const login = (credentials) => 
  api.post("/auth/login", credentials)
export const register = (userData) => 
  api.post("/auth/register", userData)

// Search API
export const searchArticles = (query, page = 1, limit = 10) => 
  api.get(`/search?q=${query}&page=${page}&limit=${limit}`)

// Admin API
export const adminGetStats = () => 
  api.get("/admin/stats")
export const createArticle = (article) => 
  api.post("/articles", article)
export const updateArticle = (id, article) => 
  api.put(`/articles/${id}`, article)
export const deleteArticle = (id) => 
  api.delete(`/articles/${id}`)

export default api
