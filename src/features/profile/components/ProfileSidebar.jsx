import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import BizzShortsCarousel from "@/features/bizzShorts/components/BizzShortsCarousel";

export default function ProfileSidebar({
  profile,
  isOwner,
  seeds,
  hasMoreSeeds,
  onDeleteSeed,
  onOpenComposer,
  onLoadMoreSeeds,
}) {
  const [showSeedGallery, setShowSeedGallery] = useState(true);

  const composerButtons = [
    { label: "লিখিত পোস্ট", type: "text" },
    { label: "ভিডিও যুক্ত করুন", type: "video" },
    { label: "ছবি / মিডিয়া", type: "media" },
  ];

  const carouselItems = useMemo(
    () =>
      seeds.map((seed) => ({
        ...seed,
        mediaUrl: seed.mediaUrl ?? seed.image,
        photographer: seed.photographer || seed.supplier || profile?.name || "বীজ সরবরাহকারী",
      })),
    [profile?.name, seeds]
  );

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar-card">
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>যোগাযোগের তথ্য</h3>
        <div className="sidebar-info-row">
          ইমেইল : <span>{profile.email || "প্রকাশ করা হয়নি"}</span>
        </div>
        <div className="sidebar-info-row">
          মোবাইল : <span>{profile.phone || "প্রকাশ করা হয়নি"}</span>
        </div>
        <div className="sidebar-info-row">
          বিভাগ : <span>{profile.division || "উল্লেখ নেই"}</span>
        </div>
        <div className="sidebar-info-row">
          ঠিকানা : <span>{profile.address || "উল্লেখ নেই"}</span>
        </div>
      </div>

      {isOwner && (
        <div className="profile-sidebar-card">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>দ্রুত পোস্ট তৈরি করুন</h3>
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

      <div className="profile-sidebar-card seed-carousel-card">
        <div className="seed-carousel-card__header">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>বীজ বাজার</h3>
          <button
            type="button"
            className="profile-primary-button seed-carousel-card__toggle"
            onClick={() => setShowSeedGallery((prev) => !prev)}
          >
            {showSeedGallery ? "লুকান" : "দেখুন"}
          </button>
        </div>

        {showSeedGallery ? (
          carouselItems.length ? (
            <BizzShortsCarousel
              items={carouselItems}
              className="profile-seed-carousel"
              title="বীজ বাজার"
              description="সর্বশেষ বীজ তালিকা দেখতে সোয়াইপ করুন"
              allowDelete={isOwner}
              onDelete={isOwner ? onDeleteSeed : undefined}
              loadMore={onLoadMoreSeeds}
              hasMore={hasMoreSeeds}
              loadMoreOffset={1}
            />
          ) : (
            <div className="empty-state seed-carousel-card__empty">বীজ বাজারে এখনো কিছু যোগ করা হয়নি</div>
          )
        ) : (
          <div className="empty-state seed-carousel-card__empty">বীজ বাজার ক্যারোসেল লুকানো আছে</div>
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
      title: PropTypes.string,
      mediaUrl: PropTypes.string,
      image: PropTypes.string,
      photographer: PropTypes.string,
      supplier: PropTypes.string,
    })
  ),
  hasMoreSeeds: PropTypes.bool,
  onDeleteSeed: PropTypes.func,
  onOpenComposer: PropTypes.func,
  onLoadMoreSeeds: PropTypes.func,
};

ProfileSidebar.defaultProps = {
  isOwner: false,
  seeds: [],
  hasMoreSeeds: false,
  onDeleteSeed: undefined,
  onOpenComposer: undefined,
  onLoadMoreSeeds: undefined,
};
