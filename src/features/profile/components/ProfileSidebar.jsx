import { useState } from "react";
import PropTypes from "prop-types";
import SeedGallery from "./SeedGallery";

export default function ProfileSidebar({
  profile,
  isOwner,
  seeds,
  onDeleteSeed,
  onOpenComposer,
}) {
  const [showSeedGallery, setShowSeedGallery] = useState(true);

  const toggleSeedGallery = () => setShowSeedGallery((prev) => !prev);

  const composerButtons = [
    { label: "পোস্ট করুন", type: "text" },
    { label: "লাইভ ভিডিও", type: "video" },
    { label: "ছবি / ভিডিও", type: "media" },
  ];

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar-card">
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>ব্যক্তিগত তথ্য</h3>
        <div className="sidebar-info-row">
          ই-মেইল : <span>{profile.email || "—"}</span>
        </div>
        <div className="sidebar-info-row">
          মোবাইল : <span>{profile.phone || "—"}</span>
        </div>
        <div className="sidebar-info-row">
          বিভাগ : <span>{profile.division || "—"}</span>
        </div>
        <div className="sidebar-info-row">
          বর্তমান ঠিকানা : <span>{profile.address || "—"}</span>
        </div>
      </div>

      {isOwner && (
        <div className="profile-sidebar-card">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>নতুন পোস্ট তৈরি করুন</h3>
          <div className="post-composer-buttons">
            {composerButtons.map((button) => (
              <button
                key={button.type}
                type="button"
                onClick={() => onOpenComposer?.(button.type)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="profile-sidebar-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>বীজ বাজার</h3>
          <button
            type="button"
            className="profile-primary-button"
            style={{
              padding: "0.45rem 0.9rem",
              fontSize: "0.85rem",
              background: "#f1f5f9",
              color: "#1f2937",
            }}
            onClick={toggleSeedGallery}
          >
            {showSeedGallery ? "লুকান" : "দেখুন"}
          </button>
        </div>

        {showSeedGallery ? (
          <SeedGallery seeds={seeds} onDelete={isOwner ? onDeleteSeed : undefined} />
        ) : (
          <div className="empty-state">বীজ বাজার গ্যালারি লুকানো আছে</div>
        )}
      </div>
    </aside>
  );
}

ProfileSidebar.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    division: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  isOwner: PropTypes.bool,
  seeds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      image: PropTypes.string.isRequired,
    })
  ),
  onDeleteSeed: PropTypes.func,
  onOpenComposer: PropTypes.func,
};

ProfileSidebar.defaultProps = {
  isOwner: false,
  seeds: [],
  onDeleteSeed: undefined,
  onOpenComposer: undefined,
};
