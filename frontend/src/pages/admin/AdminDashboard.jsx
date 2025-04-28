"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminPages.css";
import { dummyArticles, dummyStats } from "../../dummyData";

export let localAdminArticles = [...dummyArticles];

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      localAdminArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setArticles([...localAdminArticles]);
      setStats(dummyStats);
      setLoading(false);
    } catch (err) {
      console.error("Error loading dummy dashboard data:", err);
      setError("Failed to load dummy dashboard data.");
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      console.log(`Simulating delete for article ID: ${deleteId}`);
      localAdminArticles = localAdminArticles.filter((article) => article._id !== deleteId);
      setArticles([...localAdminArticles]);
      setShowConfirmDelete(false);
      setDeleteId(null);
      setError(null);
    } catch (err) {
      console.error("Error simulating article deletion:", err);
      setError("Failed to simulate article deletion.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalArticles}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalViews}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalComments}</div>
          <div className="stat-label">Total Comments</div>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h2>Articles Management</h2>
          <Link to="/admin/create" className="btn-create">
            Create New Article
          </Link>
        </div>

        <div className="articles-table-container">
          <table className="articles-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-articles">
                    No articles found
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article._id}>
                    <td className="article-title-cell">
                      <Link to={`/news/${article._id}`} target="_blank">
                        {article.title}
                      </Link>
                    </td>
                    <td>{article.category}</td>
                    <td>{article.views}</td>
                    <td>{formatDate(article.createdAt)}</td>
                    <td className="actions-cell">
                      <Link to={`/admin/edit/${article._id}`} className="btn-edit">
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteClick(article._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this article? This action cannot be undone (simulation).</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn-confirm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
