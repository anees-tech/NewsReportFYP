import axios from "axios"

const API_URL = "http://localhost:5000/api"

// Create a configured axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// API functions for articles
export const getArticles = () => api.get("/articles")
export const getArticleById = (id) => api.get(`/articles/${id}`)
export const getFeaturedArticle = () => api.get("/articles/featured")
export const getLatestArticles = () => api.get("/articles/latest")
export const getPopularArticles = () => api.get("/articles/popular")
export const getArticlesByCategory = (category, limit) =>
  api.get(`/articles/category/${category}${limit ? `?limit=${limit}` : ""}`)

// API functions for comments
export const getCommentsByArticleId = (articleId) => api.get(`/comments/${articleId}`)
export const createComment = (comment) => api.post("/comments", comment)

// API functions for auth
export const login = (credentials) => api.post("/auth/login", credentials)
export const register = (userData) => api.post("/auth/register", userData)

// API functions for search
export const searchArticles = (query) => api.get(`/search?q=${query}`)

// API functions for admin
export const adminGetArticles = () => api.get("/admin/articles")
export const adminGetStats = () => api.get("/admin/stats")
export const createArticle = (article) => api.post("/articles", article)
export const updateArticle = (id, article) => api.put(`/articles/${id}`, article)
export const deleteArticle = (id) => api.delete(`/articles/${id}`)

export default api
