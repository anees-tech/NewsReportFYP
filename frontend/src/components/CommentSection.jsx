"use client";

import { useState, useEffect } from "react";
import "./CommentSection.css";
import { dummyComments } from "../dummyData";

let localDummyComments = [...dummyComments];

const CommentSection = ({ articleId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const articleComments = localDummyComments.filter((c) => c.articleId === articleId);
      setComments(articleComments);
      setLoading(false);
    } catch (err) {
      console.error("Error loading dummy comments:", err);
      setError("Failed to load dummy comments");
      setLoading(false);
    }
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to leave a comment");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const commentToAdd = {
        _id: `temp-${Date.now()}`,
        articleId,
        content: newComment,
        author: user._id,
        authorName: user.username,
        createdAt: new Date().toISOString(),
      };

      localDummyComments.push(commentToAdd);
      setComments([...comments, commentToAdd]);
      setNewComment("");
      console.log("Simulated posting comment:", commentToAdd);
      setError(null);
    } catch (err) {
      console.error("Error simulating comment post:", err);
      setError("Failed to post dummy comment");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="comment-loading">Loading comments...</div>;
  if (error) return <div className="comment-error">{error}</div>;

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
          ></textarea>
          <button type="submit" className="comment-submit">
            Post Comment
          </button>
        </form>
      ) : (
        <div className="comment-login-message">
          Please <a href="/login">log in</a> to leave a comment
        </div>
      )}

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
