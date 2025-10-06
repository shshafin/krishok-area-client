import { format as timeagoFormat } from 'timeago.js';
import '@/assets/styles/CardGallery.css';
import { useCallback } from 'react';

function formatDate(date) {
  if (!date) return 'just now';
  const parsed = date instanceof Date ? date : new Date(date);
  return parsed instanceof Date && !isNaN(parsed.getTime()) ? timeagoFormat(parsed) : 'just now';
}

function Card({
  img,
  video,
  type,
  title,
  username,
  date,
  likes = 0,
  comments = 0,
  shares = 0,
  onAuthorClick,
  onOpen,
}) {
  const handleMediaClick = useCallback((e) => {
    e.preventDefault();
    onOpen?.();
  }, [onOpen]);

  const handleMediaKey = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen?.();
    }
  }, [onOpen]);

  return (
    <article className="card">
      <div className="media">
        {img && (
          <img
            src={img}
            alt={`user ${username} photo`}
            className="media-thumb clickable"
            loading="lazy"
            onClick={handleMediaClick}
            onKeyDown={handleMediaKey}
            tabIndex={0}
            role="button"
            aria-label={`Open ${title}`}
          />
        )}

        {video && (
          <video
            className="media-thumb clickable"
            onClick={handleMediaClick}
            onKeyDown={handleMediaKey}
            tabIndex={0}
            aria-label={`Play ${title}`}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div className="type">{type}</div>
      </div>

      <section className="card-details">
        <h3 className="title">{title}</h3>

        <div className="meta">
          <span className="by">
            by{' '}
            <button type="button" className="author-btn" onClick={() => onAuthorClick && onAuthorClick(username)}>
              {username}
            </button>
            {' · '}
          </span>
          <span className="time">{formatDate(date)}</span>
        </div>

        <div className="actions">
          <button type="button" className="action" aria-label="like">
            ❤️ <span>{likes}</span>
          </button>
          <button type="button" className="action" aria-label="comments">
            💬 <span>{comments}</span>
          </button>
          <button type="button" className="action" aria-label="share">
            🔗 <span>{shares}</span>
          </button>
        </div>
      </section>
    </article>
  );
}

export default Card;
