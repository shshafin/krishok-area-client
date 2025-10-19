import PropTypes from "prop-types";

function formatCount(label, count) {
  return `${count} ${label}`;
}

export default function ProfileOverview({
  profile,
  stats,
  isOwner,
  onPrimaryAction,
  onOpenAllPosts,
  onOpenFollowers,
  onOpenFollowing,
}) {
  return (
    <section className="profile-overview">
      <img
        src={profile.avatar}
        alt={`${profile.name} avatar`}
        className="profile-overview-avatar"
      />

      <div className="profile-overview-main">
        <h1 className="profile-overview-name">{profile.name}</h1>
        <div className="profile-overview-username">@{profile.username}</div>
        {profile.bio && <p style={{ marginTop: "0.5rem", color: "#334155" }}>{profile.bio}</p>}
      </div>

      <div className="profile-quick-actions">
        <div className="profile-stat-buttons">
          <button type="button" onClick={onOpenAllPosts}>
            {formatCount("টি পোস্ট করেছেন", stats.posts)}
          </button>
          <button type="button" onClick={onOpenFollowers}>
            {formatCount("জন ফলো করেছে", stats.followers)}
          </button>
          <button type="button" onClick={onOpenFollowing}>
            {formatCount("জনকে ফলো করেছেন", stats.following)}
          </button>
        </div>

        <button
          type="button"
          className={`profile-primary-button ${isOwner ? "owner" : ""}`}
          onClick={onPrimaryAction}
        >
          {isOwner ? "Edit profile" : "Follow"}
        </button>
      </div>
    </section>
  );
}

ProfileOverview.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    bio: PropTypes.string,
  }).isRequired,
  stats: PropTypes.shape({
    posts: PropTypes.number,
    followers: PropTypes.number,
    following: PropTypes.number,
  }),
  isOwner: PropTypes.bool,
  onPrimaryAction: PropTypes.func,
  onOpenAllPosts: PropTypes.func,
  onOpenFollowers: PropTypes.func,
  onOpenFollowing: PropTypes.func,
};

ProfileOverview.defaultProps = {
  stats: { posts: 0, followers: 0, following: 0 },
  isOwner: false,
  onPrimaryAction: undefined,
  onOpenAllPosts: undefined,
  onOpenFollowers: undefined,
  onOpenFollowing: undefined,
};
