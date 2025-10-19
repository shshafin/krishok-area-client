import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileDetails";
import ProfileTabs from "../components/ProfileTabs";
import Post from "@/components/layout/Post"; // don't edit your Post.jsx
import { fetchAllUsers, fetchMe, fetchPosts } from "@/api/authApi";
import { baseApi } from "@/api";
import styles from "../styles/Profile.module.css";

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

const VIDEO_PATTERN = /\.(mp4|webm|ogg)$/i;

function ensureString(value) {
  return value != null ? String(value) : null;
}

function normalizeId(entity) {
  if (entity == null) return null;
  if (typeof entity === "string" || typeof entity === "number") {
    return String(entity);
  }
  if (typeof entity === "object") {
    return (
      ensureString(entity.id) ??
      ensureString(entity._id) ??
      ensureString(entity.userId)
    );
  }
  return null;
}

function resolveAsset(url, fallback) {
  if (!url || typeof url !== "string") return fallback ?? null;
  if (
    url.startsWith("http") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `${baseApi}${url}`;
}

function mapUserToProfileUser(raw) {
  if (!raw) return null;

  const id = normalizeId(raw) ?? fallbackUser.id;
  const username =
    raw.username ??
    raw.handle ??
    raw.name ??
    (id ? `user_${id}` : fallbackUser.username);
  const name = raw.name ?? raw.fullName ?? username;

  const avatarUrl =
    resolveAsset(
      raw.avatarUrl ??
        raw.profileImage ??
        raw.avatar ??
        raw.photo ??
        raw.image,
      null
    ) ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      username
    )}`;

  const coverUrl = resolveAsset(
    raw.coverUrl ?? raw.coverImage ?? raw.coverPhoto,
    fallbackUser.coverUrl
  );

  const followers = Array.isArray(raw.followers)
    ? raw.followers.length
    : raw.followers ?? fallbackUser.followers;
  const following = Array.isArray(raw.following)
    ? raw.following.length
    : raw.following ?? fallbackUser.following;

  return {
    id,
    username,
    name,
    avatarUrl,
    coverUrl,
    location:
      raw.location ??
      raw.city ??
      raw.address ??
      raw.country ??
      fallbackUser.location,
    joinedAt: raw.joinedAt ?? raw.createdAt ?? fallbackUser.joinedAt,
    followers,
    following,
  };
}

function buildFallbackProfileUser(targetId) {
  const safeId = targetId ? String(targetId) : fallbackUser.id;
  return {
    ...fallbackUser,
    id: safeId,
    username: safeId,
    name: safeId,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      safeId
    )}`,
  };
}

function generateDummyPosts(total = 36, ownerProfile = fallbackUser) {
  const ownerId = normalizeId(ownerProfile) ?? fallbackUser.id;
  const ownerUsername = ownerProfile?.username ?? fallbackUser.username;
  const ownerAvatar =
    ownerProfile?.avatarUrl ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      ownerUsername
    )}`;

  return Array.from({ length: total }, (_, i) => {
    const index = i + 1;
    const isOwnerPost = index % 2 === 1;
    const username = isOwnerPost ? ownerUsername : `user_${index}`;
    const userId = isOwnerPost ? ownerId : `dummy-user-${index}`;
    const profileImage = isOwnerPost
      ? ownerAvatar
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          username
        )}`;

    const mediaCandidates = [`https://picsum.photos/seed/p${index}/600/450`];
    if (index % 3 === 0) {
      mediaCandidates.push(
        `https://picsum.photos/seed/p${index + 99}/600/450`
      );
    }
    if (index % 5 === 0) {
      mediaCandidates.push(
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
      );
    }

    const images = mediaCandidates.filter((m) => !VIDEO_PATTERN.test(m));
    const videos = mediaCandidates.filter((m) => VIDEO_PATTERN.test(m));

    return {
      _id: `dummy-post-${index}`,
      user: {
        _id: String(userId),
        id: String(userId),
        username,
        profileImage,
      },
      text: isOwnerPost
        ? `Owner post #${index} from ${ownerUsername}`
        : `Hello from ${username} - post #${index}`,
      images,
      videos,
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - index * 60_000).toISOString(),
    };
  });
}

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
  const [searchParams] = useSearchParams();
  const queryIdRaw = searchParams.get("id");
  const queryId =
    queryIdRaw && queryIdRaw.trim().length ? queryIdRaw.trim() : null;

  const [remoteProfileUser, setRemoteProfileUser] = useState(null);
  const [remotePosts, setRemotePosts] = useState([]);
  const [viewerId, setViewerId] = useState(
    loginID != null ? String(loginID) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loginID != null) setViewerId(String(loginID));
  }, [loginID]);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const mePromise = loginID != null ? Promise.resolve(null) : fetchMe();
        const [meRes, usersRes, postsRes] = await Promise.all([
          mePromise,
          fetchAllUsers(),
          fetchPosts(),
        ]);

        if (ignore) return;

        const meData = meRes?.data;
        const resolvedViewerId =
          loginID != null ? String(loginID) : normalizeId(meData);
        if (resolvedViewerId) setViewerId(resolvedViewerId);

        const targetId =
          queryId ??
          normalizeId(user) ??
          resolvedViewerId ??
          fallbackUser.id;

        const allUsers = usersRes?.data || [];
        const matchedUser = allUsers.find(
          (candidate) => normalizeId(candidate) === targetId
        );
        setRemoteProfileUser(
          matchedUser ? mapUserToProfileUser(matchedUser) : null
        );

        const filteredPosts = (postsRes?.posts || []).filter(
          (postItem) => normalizeId(postItem?.user) === targetId
        );
        setRemotePosts(filteredPosts);
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load profile data", err);
          setError(err);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [loginID, queryId, user]);

  const profileUserFromProps = useMemo(
    () => mapUserToProfileUser(user),
    [user]
  );

  const postsFromProps = useMemo(
    () => (Array.isArray(posts) ? posts : []),
    [posts]
  );

  const targetUserId = useMemo(
    () =>
      queryId ??
      normalizeId(profileUserFromProps) ??
      viewerId ??
      fallbackUser.id,
    [profileUserFromProps, queryId, viewerId]
  );

  const effectiveUser =
    profileUserFromProps ??
    remoteProfileUser ??
    buildFallbackProfileUser(targetUserId);

  const generatedPosts = useMemo(
    () => generateDummyPosts(36, effectiveUser),
    [effectiveUser]
  );

  const effectivePosts = useMemo(() => {
    if (postsFromProps.length) return postsFromProps;
    if (remotePosts.length) return remotePosts;
    return generatedPosts;
  }, [generatedPosts, postsFromProps, remotePosts]);

  // Owner check: viewer owns this profile
  const effectiveLoginID = viewerId ?? fallbackUser.id;
  const isOwner = useMemo(() => {
    const ownerId = normalizeId(effectiveUser);
    return (
      ownerId != null &&
      effectiveLoginID != null &&
      ownerId === String(effectiveLoginID)
    );
  }, [effectiveLoginID, effectiveUser]);

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
    if (!loaderRef.current) return undefined;
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
    return () => {
      io.disconnect();
    };
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
    (postItem) => <Post post={postItem} />,
    []
  );

  return (
    <div className={styles["profile-page"]}>
      <ProfileHeader user={effectiveUser} isOwner={isOwner} />

      {error && !remotePosts.length && !postsFromProps.length && (
        <div
          style={{
            padding: "0.75rem 1rem",
            textAlign: "center",
            color: "#ef4444",
          }}
          role="alert"
        >
          Unable to load live profile data. Showing fallback content.
        </div>
      )}

      <ProfileTabs posts={visiblePosts} renderPost={renderPost} />

      {loading && !remotePosts.length && !postsFromProps.length && (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#a1a1aa",
          }}
          role="status"
        >
          Loading profile...
        </div>
      )}

      {/* sentinel for infinite scroll */}
      {visibleCount < effectivePosts.length && (
        <div ref={loaderRef} style={{ height: 1 }} />
      )}
    </div>
  );
}
