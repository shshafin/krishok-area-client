import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import BizzShortsCarousel from "@/features/bizzShorts/components/BizzShortsCarousel";

const BUTTON_LABELS = [
  { label: "টেক্সট পোস্ট", type: "text" },
  { label: "ভিডিও পোস্ট", type: "video" },
  { label: "ছবি / ভিডিও", type: "media" },
];

const FALLBACK_INFO = "তথ্য পাওয়া যায়নি";

export default function ProfileSidebar({
  profile,
  isOwner,
  compactSeedDisplay,
  seeds,
  hasMoreSeeds,
  onDeleteSeed,
  onOpenComposer,
  onLoadMoreSeeds,
}) {
  const [showSeedGallery, setShowSeedGallery] = useState(true);

  const carouselItems = useMemo(
    () =>
      seeds.map((seed) => ({
        ...seed,
        mediaUrl: seed.mediaUrl ?? seed.image,
        photographer: seed.photographer || seed.supplier || profile?.name || "অজানা তথ্য",
      })),
    [profile?.name, seeds]
  );

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar-card">
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>প্রাথমিক তথ্য</h3>
        <div className="sidebar-info-row">
          ইমেইল : <span>{profile.email || FALLBACK_INFO}</span>
        </div>
        <div className="sidebar-info-row">
          ফোন : <span>{profile.phone || FALLBACK_INFO}</span>
        </div>
        <div className="sidebar-info-row">
          বিভাগ : <span>{profile.division || FALLBACK_INFO}</span>
        </div>
        <div className="sidebar-info-row">
          ঠিকানা : <span>{profile.address || FALLBACK_INFO}</span>
        </div>
      </div>

      <div className="profile-sidebar-card seed-carousel-card">
        <div className="seed-carousel-card__header">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>বীজ সংগ্রহ</h3>
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
              title="বীজ গ্যালেরি"
              description="পছন্দের বীজগুলো এখানে দেখুন"
              allowDelete={isOwner} // show delete button only for owner
              showMeta={false} // hide title/credit, only image
              openSeedModalOnClick={true}
              onDelete={isOwner ? onDeleteSeed : undefined}
              loadMore={onLoadMoreSeeds}
              hasMore={hasMoreSeeds}
              loadMoreOffset={1}
            />
          ) : (
            <div className="empty-state seed-carousel-card__empty">এখনও কোনও বীজ যোগ করা হয়নি</div>
          )
        ) : (
          <div className="empty-state seed-carousel-card__empty">সংগ্রহ দেখতে আবার দেখুন বোতামে চাপ দিন</div>
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
  compactSeedDisplay: PropTypes.bool,
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
  compactSeedDisplay: false,
  seeds: [],
  hasMoreSeeds: false,
  onDeleteSeed: undefined,
  onOpenComposer: undefined,
  onLoadMoreSeeds: undefined,
};
