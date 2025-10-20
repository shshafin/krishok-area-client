import React, { memo, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "@/assets/styles/UserCard.css";
import { baseApi } from "../../api";

function buildProfileSlug(user = {}) {
  const raw =
    user.username ||
    user.userName ||
    user.handle ||
    (typeof user.name === "string" && user.name.trim()) ||
    user._id ||
    user.id;

  if (!raw) return "";
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function UserCardBase({ user = {}, isFollowing, onToggle }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const profileSlug = useMemo(() => buildProfileSlug(user), [user]);

  const handleNavigate = useCallback(() => {
    if (!profileSlug) return;
    navigate(`/user/${encodeURIComponent(profileSlug)}`);
  }, [navigate, profileSlug]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  const handleFollowToggle = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!user._id && !user.id && !user.username) {
      toast.error("Unable to identify user.");
      console.error("User missing identifier", user);
      return;
    }

    setLoading(true);
    try {
      await onToggle?.(user);
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const followersCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;

  return (
    <article
      className="user-card"
      role="listitem"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={`View profile of ${user.name || user.username || "user"}`}>
      <div className="user-card__left">
        <div className="avatar-wrap">
          <img
            className="avatar"
            src={
              user.profileImage
                ? user.profileImage.startsWith("http") ||
                  user.profileImage.startsWith("blob:")
                  ? user.profileImage
                  : `${baseApi}${user.profileImage}`
                : "/default-profile.png"
            }
            alt={user.name || user.username || "User avatar"}
          />
          {user.isOnline && (
            <span className="status-dot" aria-label="Online status" />
          )}
        </div>
      </div>

      <div className="user-card__body">
        <div className="name-row">
          <h3 className="username" title={user.name || user.username}>
            {user.name || user.username || "Unknown user"}
          </h3>
          {user.isOnline && <span className="presence-label">Live</span>}
        </div>

        <p className="bio" title={user.bio || "No bio available"}>
          {user.bio || "No bio available"}
        </p>

        <div className="meta-row">
          <span className="followers">
            <strong>{followersCount}</strong> Followers
          </span>
          <span className="following">
            <strong>{followingCount}</strong> Following
          </span>
        </div>
      </div>

      <div className="user-card__right">
        <button
          className={`btn btn--follow ${isFollowing ? "following" : ""}`}
          onClick={handleFollowToggle}
          disabled={loading}>
          {loading ? (
            "Loading..."
          ) : isFollowing ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Following
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Follow
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default memo(UserCardBase);
