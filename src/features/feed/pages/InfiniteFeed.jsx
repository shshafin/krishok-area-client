import { useEffect, useRef, useState, useCallback } from "react";
import Post from "@/components/layout/Post";
import ModelView from "@/components/layout/ModelView";
import { fetchPosts } from "@/api/authApi";
import { toast } from "react-hot-toast";
import { baseApi } from "../../../api";

const PAGE_SIZE = 10;

export default function InfiniteFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  // Fetch posts from backend
  const loadPosts = useCallback(async () => {
    try {
      const res = await fetchPosts();
      const allPosts = res?.posts || []; // use res.posts
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const newPosts = allPosts.slice(start, end);

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    }
  }, [page]);

  useEffect(() => {
    if (hasMore) loadPosts();
  }, [loadPosts, hasMore]);

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [hasMore]);

  const handleLikesView = (postId) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    setModalTitle("Liked by");
    setModalContent(
      <div>
        {post.likes.length > 0 ? (
          post.likes.map((user) => (
            <div
              key={user._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}>
              <img
                src={
                  user.profileImage
                    ? user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `${baseApi}${user.profileImage}`
                    : "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"
                }
                alt={user.username}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span
                style={{ fontWeight: "600", fontSize: "14px", color: "white" }}>
                {user.username}
              </span>
            </div>
          ))
        ) : (
          <p>No likes yet</p>
        )}
      </div>
    );
    setModalOpen(true);
  };

  const handleCommentsView = (postId) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    setModalTitle("Comments");
    setModalContent(
      <div>
        {post.comments.length > 0 ? (
          post.comments.map((c, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                alignItems: "flex-start",
              }}>
              <img
                src={
                  c.user?.profileImage
                    ? c.user.profileImage.startsWith("http")
                      ? c.user.profileImage
                      : `${baseApi}${c.user.profileImage}`
                    : "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"
                }
                alt={c.user?.username || "User"}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: "600",
                    margin: 0,
                    fontSize: "14px",
                    color: "white",
                  }}>
                  {c.user?.username || "User"}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "13px",
                    color: "gray",
                  }}>
                  {c.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    );
    setModalOpen(true);
  };

  const handleLikeClick = (postId, newIsLiked) => {
    console.log(`Post ${postId} was ${newIsLiked ? "liked" : "unliked"}`);
    // API call to like/unlike post
  };

  return (
    <div className="feed">
      {posts.map((p, index) => (
        <Post
          key={`${p._id}-${index}`}
          post={p} // ✅ pass entire post object
          onLikeClick={handleLikeClick}
          onLikesView={handleLikesView}
          onCommentsView={handleCommentsView}
        />
      ))}

      {/* Sentinel element to trigger loading more */}
      {hasMore && (
        <div
          ref={loaderRef}
          style={{ height: "40px" }}
        />
      )}

      {modalOpen && (
        <ModelView
          title={modalTitle}
          onClose={() => setModalOpen(false)}>
          {modalContent}
        </ModelView>
      )}
    </div>
  );
}
