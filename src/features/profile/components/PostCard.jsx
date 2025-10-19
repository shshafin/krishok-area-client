import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "timeago.js";

const mediaStyles = {
  width: "100%",
  display: "block",
  borderRadius: "16px",
  objectFit: "cover",
};

export default function PostCard({
  post,
  isOwner,
  onLike,
  onOpenComments,
  onDelete,
  onAddComment,
}) {
  const [commentText, setCommentText] = useState("");

  const submitComment = () => {
    const value = commentText.trim();
    if (!value) return;
    onAddComment?.(post.id, value);
    setCommentText("");
  };

  const media = post.media;

  return (
    <article className="post-card">
      <header className="post-card-header">
        <div className="post-card-meta">
          <img src={post.author.avatar} alt={post.author.name} />
          <div className="post-card-author">
            <h5>{post.author.name}</h5>
            <span>{format(post.createdAt)}</span>
          </div>
        </div>
        {isOwner && (
          <button
            type="button"
            className="post-delete-btn"
            aria-label="Delete post"
            onClick={() => onDelete?.(post.id)}
          >
            ×
          </button>
        )}
      </header>

      {post.content && <p className="post-content">{post.content}</p>}

      {media?.src && (
        <div className="post-media">
          {media.type === "video" ? (
            <video
              src={media.src}
              controls
              muted
              loop
              style={mediaStyles}
            />
          ) : (
            <img
              src={media.src}
              alt={post.content || "post media"}
              style={mediaStyles}
            />
          )}
        </div>
      )}

      <div className="post-engagement">
        <span>{post.likes} like</span>
        <span>{post.comments.length} comment</span>
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={post.liked ? "liked" : ""}
          onClick={() => onLike?.(post.id)}
        >
          {post.liked ? "Liked" : "Like"}
        </button>
        <button
          type="button"
          onClick={() => onOpenComments?.(post.id)}
        >
          Comments
        </button>
      </div>

      <div className="comment-form">
        <textarea
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="মন্তব্য করুন..."
        />
        <button type="button" onClick={submitComment}>
          Comment
        </button>
      </div>
    </article>
  );
}

PostCard.propTypes = {
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
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ),
  }).isRequired,
  isOwner: PropTypes.bool,
  onLike: PropTypes.func,
  onOpenComments: PropTypes.func,
  onDelete: PropTypes.func,
  onAddComment: PropTypes.func,
};

PostCard.defaultProps = {
  isOwner: false,
  onLike: undefined,
  onOpenComments: undefined,
  onDelete: undefined,
  onAddComment: undefined,
};
