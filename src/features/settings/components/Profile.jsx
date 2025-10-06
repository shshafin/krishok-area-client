import CameraIcon from "@/assets/IconComponents/CameraIcon";
import "../styles/ProfileDetails.css";

function Profile({ data, changeProfile }) {
  const {
    profile,     // profile image URL
    name,
    email,
    username,
    followers,
    following,
    status,
  } = data || {};

  return (
    <section className="userDetails flex FY-center">
    
      {/* Profile Image */}
      <section className="relative">
        <div className="largeProfile">
          <img
            src={profile}
            alt={`${username || "user"}'s profile`}
          />
        </div>
        <button className="changeProfile"
          aria-label="Change Profile Picture"
          onClick={changeProfile}
        >
          <CameraIcon />
        </button>
      </section>

      {/* User Details */}
      <section className="user-details">
        <section className="main flex FD-c">
          <span className="name">{name}</span>
          <span className="email">{email}</span>
          <span className="username">@{username}</span>
        </section>

        {/* Followers / Following / Status */}
        <section className="status-container flex FY-center">
          <section className="followers flex FD-c F-center">
            <div className="count">{followers}</div>
            <div className="text">Followers</div>
          </section>
          <section className="followers flex FD-c F-center">
            <div className="count">{following}</div>
            <div className="text">Following</div>
          </section>
          <section className="followers flex FD-c F-center">
            <div className={`status ${status ? "green" : "gray"}`}>●</div>
            <div className="text">{status ? "Online" : "Offline"}</div>
          </section>
        </section>

      </section>
    </section>
  )
}

export default Profile;