import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "timeago.js";
import DeleteOutlineIcon from "@/assets/IconComponents/DeleteOutlineIcon";

const mediaStyles = {
  width: "100%",
  display: "block",
  objectFit: "cover",
};

const TEXT_LIKED = "\u09B2\u09BE\u0987\u0995 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7";
const TEXT_LIKE = "\u09B2\u09BE\u0987\u0995";
const TEXT_COMMENTS = "\u09AE\u09A8\u09CD\u09A4\u09AC\u09CD\u09AF";
const TEXT_COMMENT = "\u09AE\u09A8\u09CD\u09A4\u09AC\u09CD\u09AF";
const TEXT_COMMENT_PLACEHOLDER = "\u09AE\u09A8\u09CD\u09A4\u09AC\u09CD\u09AF \u0995\u09B0\u09C1\u09A8...";

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
            aria-label="পোস্ট মুছে ফেলুন"
            onClick={() => onDelete?.(post.id)}
          >
            <DeleteOutlineIcon width={16} />
          </button>
        )}
      </header>

      {post.content && <p className="post-content">{post.content}</p>}

      {media?.src && (
        <div className="post-media">
          {media.type === "video" ? (
            <video src={media.src} controls muted loop style={mediaStyles} />
          ) : (
            <img src={media.src} alt={post.content || "পোস্টের ছবি"} style={mediaStyles} />
          )}
        </div>
      )}

      <div className="post-engagement">
        <span>{post.likes} লাইক</span>
        <span>{post.comments.length} মন্তব্য</span>
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={post.liked ? "liked" : ""}
          onClick={() => onLike?.(post.id)}
        >
          {post.liked ? TEXT_LIKED : TEXT_LIKE}
        </button>
        <button type="button" onClick={() => onOpenComments?.(post.id)}>
          {TEXT_COMMENTS}
        </button>
      </div>

      <div className="comment-form">
        <textarea
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder={TEXT_COMMENT_PLACEHOLDER}
        />
        <button type="button" onClick={submitComment}>
          {TEXT_COMMENT}
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
