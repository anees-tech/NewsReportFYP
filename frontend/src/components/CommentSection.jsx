"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CommentSection.css";
import { getCommentsByArticleId, createComment, deleteComment } from "../api";

const CommentSection = ({ articleId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getCommentsByArticleId(articleId);
      setComments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error loading comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to leave a comment");
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      // Make sure authorName is included to satisfy the backend validation
      const commentData = {
        articleId,
        content: newComment,
        author: user._id,
        authorName: user.username || user.name || "Anonymous", // Provide fallback
      };

      const response = await createComment(commentData);
      setComments([...comments, response.data]);
      setNewComment("");
      setError(null);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="comment-loading">Loading comments...</div>;

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="4"
            required
            disabled={submitting}
          ></textarea>
          <button type="submit" className="comment-submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="comment-login-message">
          Please <Link to="/login">log in</Link> to leave a comment
        </div>
      )}

      {error && <div className="comment-error">{error}</div>}

      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="no-comments">Be the first to comment</div>
        ) : (
          [...comments]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.authorName}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  {user && (user._id === comment.author || user.role === "admin") && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="comment-delete-btn"
                      title="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
