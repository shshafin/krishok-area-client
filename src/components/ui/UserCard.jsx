import React, { memo, useState } from "react";
import { toast } from "react-hot-toast";
import "@/assets/styles/UserCard.css";
import { baseApi } from "../../api";

function UserCardBase({ user, isFollowing, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user._id && !user.id) {
      toast.error("User ID missing!");
      console.error("User missing _id/id", user);
      return;
    }

    setLoading(true);
    try {
      await onToggle(user); // toggle follow/unfollow
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className="user-card"
      role="listitem">
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
            alt={user.name}
          />
          {user.isOnline && (
            <span
              className="status-dot"
              aria-label="Online"
            />
          )}
        </div>
      </div>

      <div className="user-card__body">
        <div className="name-row">
          <h3
            className="username"
            title={user.name}>
            {user.name}
          </h3>
          {user.isOnline && <span className="inline-dot" />}
        </div>
        <p
          className="bio"
          title={user.bio || "No bio available"}>
          {user.bio || "No bio available"}
        </p>

        <div className="meta-row">
          <span className="followers">
            {user.followers?.length || 0} Followers
          </span>
          <span className="following">
            {user.following?.length || 0} Following
          </span>
        </div>
      </div>

      <div className="user-card__right">
        <button
          className={`btn btn--follow ${isFollowing ? "following" : ""}`}
          onClick={handleClick}
          disabled={loading}>
          {loading ? (
            "Loading..."
          ) : isFollowing ? (
            <>
              {/* Check icon */}
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
              {/* User-plus icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                />
                <line
                  x1="19"
                  y1="8"
                  x2="19"
                  y2="14"
                />
                <line
                  x1="22"
                  y1="11"
                  x2="16"
                  y2="11"
                />
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
