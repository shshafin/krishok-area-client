import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "timeago.js";
import Modal from "./Modal";

export default function PostModal({
  open,
  post,
  onClose,
  isOwner,
  onToggleLike,
  onAddComment,
  onDeleteComment,
  canDeleteComment,
}) {
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (open) setCommentText("");
  }, [open, post?.id]);

  if (!post) return null;

  const handleSubmitComment = () => {
    const value = commentText.trim();
    if (!value) return;
    onAddComment?.(post.id, value);
    setCommentText("");
  };

  const header = (
    <div className="ka-modal-header" style={{ gap: "0.75rem" }}>
      <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
        <img
          src={post.author.avatar}
          alt={post.author.name}
          style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{post.author.name}</div>
          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{format(post.createdAt)}</div>
        </div>
      </div>
      <button type="button" className="ka-modal-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      header={header}
      size="xl"
      className="post-modal"
    >
      <div className="post-modal-content">
        <div className="post-modal-media">
          {post.media?.type === "video" ? (
            <video src={post.media.src} controls muted loop />
          ) : (
            <img src={post.media?.src} alt={post.content || "post media"} />
          )}
        </div>

        <div className="post-modal-comments">
          {post.content && (
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.35rem" }}>{post.author.name}</div>
              <p style={{ margin: 0 }}>{post.content}</p>
            </div>
          )}

          <div className="post-engagement" style={{ marginTop: "0.25rem" }}>
            <button
              type="button"
              className={post.liked ? "liked" : ""}
              onClick={() => onToggleLike?.(post.id)}
              style={{ border: "none", background: "transparent", cursor: "pointer" }}
            >
              {post.liked ? "Liked" : "Like"} · {post.likes}
            </button>
            <span>{post.comments.length} Comments</span>
          </div>

          <div className="comment-list">
            {post.comments.length === 0 && <div className="empty-state">কোন মন্তব্য নেই</div>}
            {post.comments.map((comment) => (
              <div className="comment-item" key={comment.id}>
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="comment-item-avatar"
                />
                <div className="comment-item-body" style={{ flex: 1 }}>
                  <h6>{comment.author.name}</h6>
                  <p>{comment.text}</p>
                  <div className="comment-item-meta">
                    <span>{format(comment.createdAt)}</span>
                    {canDeleteComment?.(comment) && (
                      <button
                        type="button"
                        className="comment-delete-btn"
                        onClick={() => onDeleteComment?.(post.id, comment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="comment-input-area">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="মন্তব্য করুন..."
            />
            <button type="button" onClick={handleSubmitComment} disabled={!commentText.trim()}>
              Comment
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

PostModal.propTypes = {
  open: PropTypes.bool,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    media: PropTypes.shape({
      type: PropTypes.oneOf(["image", "video"]),
      src: PropTypes.string,
    }),
    likes: PropTypes.number,
    liked: PropTypes.bool,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        author: PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
  }),
  onClose: PropTypes.func,
  isOwner: PropTypes.bool,
  onToggleLike: PropTypes.func,
  onAddComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  canDeleteComment: PropTypes.func,
};

PostModal.defaultProps = {
  open: false,
  post: null,
  onClose: undefined,
  isOwner: false,
  onToggleLike: undefined,
  onAddComment: undefined,
  onDeleteComment: undefined,
  canDeleteComment: undefined,
};
