"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminPages.css";
import { getArticleById, createArticle, updateArticle } from "../../api";
import axios from "axios";

const AdminNewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "general",
    tags: "",
    author: "",
    imageUrl: "",
    videoUrl: "",
    hasVideo: false,
    isFeatured: false,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (isEditMode) {
      fetchArticleData();
    }
  }, [id]);

  const fetchArticleData = async () => {
    try {
      const response = await getArticleById(id);
      const articleData = response.data;
      
      // Convert tags array to string for form input
      const tagsString = Array.isArray(articleData.tags) 
        ? articleData.tags.join(", ") 
        : articleData.tags || "";

      setFormData({
        ...articleData,
        tags: tagsString,
      });
      
      setError(null);
    } catch (err) {
      console.error("Error loading article data:", err);
      setError("Failed to load article data for editing.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;
    
    try {
      setUploadingVideo(true);
      const formData = new FormData();
      formData.append("video", videoFile);
      
      const response = await axios.post(`${API_URL}/articles/upload/video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      return response.data.videoUrl;
    } catch (err) {
      console.error("Error uploading video:", err);
      throw new Error("Failed to upload video");
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSuccess(false);

    try {
      // Process tags: convert comma-separated string to array
      const processedTags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Upload video if selected
      let videoUrl = formData.videoUrl;
      
      if (videoFile) {
        videoUrl = await uploadVideo();
      }

      const articleDataToSave = {
        ...formData,
        tags: processedTags,
        videoUrl,
        hasVideo: !!videoUrl,
      };

      if (isEditMode) {
        await updateArticle(id, articleDataToSave);
      } else {
        await createArticle(articleDataToSave);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      console.error("Error saving article:", err);
      setError(err.response?.data?.message || "Failed to save article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading article data...</p>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <h1 className="admin-title">{isEditMode ? "Edit Article" : "Create New Article"}</h1>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">Article saved successfully!</div>}

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter article title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description/Teaser *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
            rows="3"
            placeholder="Brief summary of the article"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="politics">Politics</option>
              <option value="sports">Sports</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Image URL input only */}
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="form-control"
            placeholder="URL for the article's image"
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img 
                src={formData.imageUrl} 
                alt="Image preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.jpg";
                }}
              />
            </div>
          )}
        </div>

        {/* Video file upload only */}
        <div className="form-group">
          <label htmlFor="videoFile">Upload Video</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleVideoChange}
              className="form-control"
            />
            {uploadingVideo && (
              <div className="upload-progress">
                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                <span>{uploadProgress}%</span>
              </div>
            )}
          </div>
          
          {videoFile && (
            <div className="video-preview">
              <video controls width="100%">
                <source src={URL.createObjectURL(videoFile)} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {formData.videoUrl && !videoFile && (
            <div className="video-preview">
              <video controls width="100%">
                <source src={formData.videoUrl} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. politics, election, economy"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="form-control"
            rows="15"
            placeholder="Full article content"
          ></textarea>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="form-check-input"
          />
          <label htmlFor="isFeatured" className="form-check-label">
            Feature this article on homepage
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate("/admin")} 
            className="btn-cancel" 
            disabled={saving || uploadingVideo}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save" 
            disabled={saving || uploadingVideo}
          >
            {saving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewsForm;
