import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import Post from "@/components/layout/Post";
import ModelView from "@/components/layout/ModelView";
import { fetchPosts } from "@/api/authApi";
import { toast } from "react-hot-toast";
import { baseApi } from "../../../api";

const PAGE_SIZE = 10;
const FALLBACK_AVATAR =
  "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png";

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
      <div className="modal-list">
        {post.likes.length > 0 ? (
          post.likes.map((user, index) => {
            const likeUser = user || {};
            const hasProfileLink = Boolean(likeUser._id);
            const profileImage = likeUser.profileImage
              ? likeUser.profileImage.startsWith("http") ||
                likeUser.profileImage.startsWith("blob:")
                ? likeUser.profileImage
                : `${baseApi}${likeUser.profileImage}`
              : FALLBACK_AVATAR;
            const Wrapper = hasProfileLink ? NavLink : "div";
            const wrapperProps = hasProfileLink
              ? {
                  to: `/user/${likeUser._id}`,
                  className: "modal-list-item modal-list-item--link",
                }
              : { className: "modal-list-item modal-list-item--static" };

            return (
              <Wrapper
                key={likeUser._id || `like-${index}`}
                {...wrapperProps}>
                <img
                  src={profileImage}
                  alt={likeUser.username || "User avatar"}
                  className="modal-avatar"
                />
                <span className="modal-username">
                  {likeUser.username || "Unknown user"}
                </span>
              </Wrapper>
            );
          })
        ) : (
          <p className="modal-empty">No likes yet</p>
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
      <div className="modal-list">
        {post.comments.length > 0 ? (
          post.comments.map((comment, index) => {
            const commentUser = comment.user || {};
            const hasProfileLink = Boolean(commentUser._id);
            const avatar = commentUser.profileImage
              ? commentUser.profileImage.startsWith("http") ||
                commentUser.profileImage.startsWith("blob:")
                ? commentUser.profileImage
                : `${baseApi}${commentUser.profileImage}`
              : FALLBACK_AVATAR;
            const Wrapper = hasProfileLink ? NavLink : "div";
            const wrapperProps = hasProfileLink
              ? {
                  to: `/user/${commentUser._id}`,
                  className:
                    "modal-list-item modal-list-item--link modal-list-item--comment",
                }
              : {
                  className:
                    "modal-list-item modal-list-item--static modal-list-item--comment",
                };

            return (
              <Wrapper
                key={comment._id || commentUser._id || `comment-${index}`}
                {...wrapperProps}>
                <img
                  src={avatar}
                  alt={commentUser.username || "User avatar"}
                  className="modal-avatar"
                />
                <div className="modal-text">
                  <span className="modal-username">
                    {commentUser.username || "User"}
                  </span>
                  <span className="modal-subtext">{comment.text}</span>
                </div>
              </Wrapper>
            );
          })
        ) : (
          <p className="modal-empty">No comments yet</p>
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
