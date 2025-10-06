import { Link } from "react-router-dom";
import "@/assets/styles/Followers.css";
import { useState } from "react";
import { baseApi } from "../../api";

function Follower({
  userid,
  userprofile,
  username,
  email,
  isFollowing: initialFollow = false,
  onFollow,
}) {
  const [isFollowing, setIsFollowing] = useState(initialFollow);

  const handleFollowClick = (e) => {
    e.preventDefault();
    setIsFollowing((prev) => !prev);
    if (onFollow) onFollow(userid, !isFollowing);
  };

  return (
    <Link
      to={`/user?id=${userid}`}
      className="follower">
      <section>
        <div className="profile">
          <img
            src={
              userprofile
                ? userprofile.startsWith("http") ||
                  userprofile.startsWith("blob:")
                  ? userprofile
                  : `${baseApi}${userprofile}`
                : "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png" // fallback
            }
            alt={username + " Profile"}
          />
        </div>
        <div className="info">
          <div className="name">{username}</div>
          <div className="username">{email}</div>
        </div>
      </section>
      <button onClick={handleFollowClick}>
        {isFollowing ? "Following" : "Follow"}
      </button>
    </Link>
  );
}

export default Follower;
