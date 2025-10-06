import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProfileHeader from "../components/ProfileDetails";
import ProfileTabs from "../components/ProfileTabs";
import Post from "@/components/layout/Post"; // don't edit your Post.jsx
import styles from "../styles/Profile.module.css";

/* ---------------------- DUMMY DATA GENERATORS ---------------------- */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDummyPosts(total = 36, owner = "raiwa2") {
  return Array.from({ length: total }, (_, i) => {
    const id = i + 1;
    const isOwnerPost = id % 2 === 1; // alternate owner vs others
    const username = isOwnerPost ? owner : `user_${id}`;
    const media = [];

    // Always at least one image
    media.push(`https://picsum.photos/seed/p${id}/600/450`);
    // Sometimes add a second image
    if (id % 3 === 0)
      media.push(`https://picsum.photos/seed/p${id + 99}/600/450`);
    // Every 5th post include a video
    if (id % 5 === 0) {
      media.push(
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
      );
    }

    return {
      postId: id,
      username,
      profile: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        username
      )}`,
      time: new Date(Date.now() - id * 60_000).toISOString(), // staggered
      content: isOwnerPost
        ? `Owner post #${id} from ${owner}`
        : `Hello from ${username} — post #${id}`,
      media,
      likes: rand(0, 30),
      comments: rand(0, 10),
      isLiked: Math.random() > 0.6,
    };
  });
}

const fallbackUser = {
  id: "raiwa2", // <- owner of this profile
  username: "raiwa2",
  name: "Raiwa",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=raiwa2",
  coverUrl: "https://picsum.photos/seed/coverx/1200/280",
  location: "Earth",
  joinedAt: "2025-01-01T00:00:00Z",
  followers: 10,
  following: 3,
};
/* ------------------------------------------------------------------- */

/**
 * Props (all optional for now; falls back to dummy):
 *  - user: { id, username, ... }
 *  - loginID: string | number
 *  - posts: Post[]
 *  - onDeletePost?: (postId) => void
 *
 * Notes:
 *  - We DO NOT modify your Post.jsx. We just feed it data.
 *  - Edit buttons (in ProfileHeader) show only when owner is viewing (loginID === user.id).
 *  - Infinite feed: first 20, then +10 on scroll.
 */
export default function ProfilePage({
  user,
  loginID,
  posts,
  // onDeletePost, // passed through if your Post uses it; safe to ignore otherwise
}) {
  // Fallbacks so the page works before your real data is wired
  const effectiveUser = user ?? fallbackUser;
  const effectiveLoginID = loginID ?? "raiwa2"; // logged-in user is raiwa2 by default
  const generatedPosts = useMemo(() => generateDummyPosts(36, "raiwa2"), []);
  const effectivePosts =
    Array.isArray(posts) && posts.length ? posts : generatedPosts;

  // Owner check: raiwa2 owns this profile, others do not
  const isOwner = useMemo(() => {
    const key = effectiveUser?.id ?? effectiveUser?.username;
    return key != null && String(key) === String(effectiveLoginID);
  }, [effectiveUser?.id, effectiveUser?.username, effectiveLoginID]);

  // Infinite scroll: 20 first, then +10
  const INITIAL = 20;
  const STEP = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const loaderRef = useRef(null);

  // Reset when source posts change
  useEffect(() => {
    setVisibleCount(INITIAL);
  }, [effectivePosts]);

  // Observer to load more
  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + STEP, effectivePosts.length));
        }
      },
      { root: null, rootMargin: "300px 0px 300px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.unobserve(el);
  }, [effectivePosts.length]);

  const visiblePosts = useMemo(
    () =>
      effectivePosts.slice(0, Math.min(visibleCount, effectivePosts.length)),
    [effectivePosts, visibleCount]
  );

  // const handleDelete = useCallback(
  //   (postId) => {
  //     if (typeof onDeletePost === "function") onDeletePost(postId);
  //     // If you want local removal while using dummy posts,
  //     // lift effectivePosts into state and filter here.
  //   },
  //   [onDeletePost]
  // );

  const renderPost = useCallback(
    (p) => (
      <Post
        key={p.postId}
        {...p}
        // You said don't edit Post.jsx, so we only pass the props it already uses.
        // If your Post supports onDeletePost / isOwner, you can uncomment:
        // isOwner={isOwner}
        // onDeletePost={handleDelete}
      />
    ),
    [
      // isOwner,        // <- uncomment if your Post supports it
      // handleDelete,   // <- uncomment if your Post supports it
    ]
  );

  return (
    <div className={styles["profile-page"]}>
      <ProfileHeader
        user={effectiveUser}
        isOwner={isOwner}
      />
      <ProfileTabs
        posts={visiblePosts}
        renderPost={renderPost}
      />

      {/* sentinel for infinite scroll */}
      {visibleCount < effectivePosts.length && (
        <div
          ref={loaderRef}
          style={{ height: 1 }}
        />
      )}
    </div>
  );
}
