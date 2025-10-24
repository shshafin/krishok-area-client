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
            { user.username || "Unknown user"}
          </h3>
        </div>

        <p className="bio" title={user.state || "No State available"}>
          {user.state || "No State available"}
        </p>

        {/* <div className="meta-row">
          <span className="followers">
            <strong>{followersCount}</strong> Followers
          </span>
          <span className="following">
            <strong>{followingCount}</strong> Following
          </span>
        </div> */}
      </div>

      <div className="user-card__right">
        <button
          className={`btn btn--follow ${isFollowing ? "following" : ""}`}
          onClick={handleFollowToggle}
          disabled={loading}>
          {loading ? (
            "Loading..."
          ) : isFollowing ? "আনফলো" : "ফলো"}
        </button>
      </div>
    </article>
  );
}

export default memo(UserCardBase);
