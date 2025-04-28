"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminPages.css";
import { dummyArticles } from "../../dummyData";
import { localAdminArticles } from "./AdminDashboard";

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
    isFeatured: false,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      try {
        const articleData = localAdminArticles.find((a) => a._id === id);

        if (articleData) {
          const tagsString = Array.isArray(articleData.tags) ? articleData.tags.join(", ") : articleData.tags || "";

          setFormData({
            ...articleData,
            tags: tagsString,
          });
        } else {
          setError("Dummy article not found for editing.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading dummy article for edit:", err);
        setError("Failed to load dummy article data.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSuccess(false);

    try {
      const processedTags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const articleDataToSave = {
        ...formData,
        tags: processedTags,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        const index = localAdminArticles.findIndex((a) => a._id === id);
        if (index !== -1) {
          localAdminArticles[index] = { ...localAdminArticles[index], ...articleDataToSave };
          console.log("Simulated update article:", localAdminArticles[index]);
        } else {
          throw new Error("Dummy article not found for update.");
        }
      } else {
        const newArticle = {
          ...articleDataToSave,
          _id: `dummy-${Date.now()}`,
          createdAt: new Date().toISOString(),
          views: 0,
        };
        localAdminArticles.push(newArticle);
        console.log("Simulated create article:", newArticle);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      console.error("Error simulating save article:", err);
      setError(err.message || "Failed to simulate saving article.");
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
      {success && <div className="admin-success">Article saved successfully (simulation)!</div>}

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
          <button type="button" onClick={() => navigate("/admin")} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewsForm;
