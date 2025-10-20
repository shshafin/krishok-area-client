import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import Post from "@/components/layout/Post";
import ModelView from "@/components/layout/ModelView";
import { fetchPosts, fetchMe, deleteComment } from "@/api/authApi";
import { toast } from "react-hot-toast";
import TrashIcon from "@/assets/IconComponents/Trash";
import { baseApi } from "../../../api";

const PAGE_SIZE = 10;
const FALLBACK_AVATAR =
  "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png";

export default function InfiniteFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [modalState, setModalState] = useState({ type: null, postId: null });
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetchPosts();
      const allPosts = res?.posts || [];
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

  useEffect(() => {
    let ignore = false;

    const loadCurrentUser = async () => {
      try {
        const response = await fetchMe();
        if (ignore) return;
        setCurrentUser(response?.data ?? response ?? null);
      } catch (err) {
        console.error("Failed to load current user", err);
      }
    };

    loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, []);

  const resolveId = (entity) =>
    entity?._id ?? entity?.id ?? entity?.userId ?? entity?.username ?? null;

  const sameId = (a, b) =>
    a != null && b != null && String(a) === String(b);

  const handleLikesView = (postId) => {
    const post = posts.find((p) => sameId(resolveId(p), postId));
    if (!post) return;
    setModalState({ type: "likes", postId });
  };

  const handleCommentsView = (postId) => {
    const post = posts.find((p) => sameId(resolveId(p), postId));
    if (!post) return;
    setModalState({ type: "comments", postId });
  };

  const handleLikeClick = (postId, newIsLiked) => {
    console.log(`Post ${postId} was ${newIsLiked ? "liked" : "unliked"}`);
    // API call to like/unlike post
  };

  const handleCloseModal = () => {
    setModalState({ type: null, postId: null });
  };

  const handleCommentDelete = async (postId, commentId) => {
    if (!postId || !commentId) return;
    setDeletingCommentId(commentId);
    try {
      await deleteComment(postId, commentId);
      setPosts((prev) =>
        prev.map((post) => {
          if (!sameId(resolveId(post), postId)) return post;
          return {
            ...post,
            comments: (post.comments || []).filter((comment) => {
              const existingId =
                resolveId(comment) ?? comment._id ?? comment.id ?? comment.commentId;
              if (existingId == null) return true;
              return !sameId(existingId, commentId);
            }),
          };
        })
      );
      toast.success("Comment removed");
    } catch (err) {
      console.error("Failed to delete comment", err);
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const isModalOpen = Boolean(modalState.type && modalState.postId);
  const modalTitle =
    modalState.type === "likes"
      ? "Liked by"
      : modalState.type === "comments"
      ? "Comments"
      : "";

  const renderModalContent = () => {
    if (!modalState.type || !modalState.postId) return null;

    const post = posts.find((p) => sameId(resolveId(p), modalState.postId));
    if (!post) {
      return <p className="modal-empty">Post not available</p>;
    }

    if (modalState.type === "likes") {
      if (!post.likes?.length) {
        return <p className="modal-empty">No likes yet</p>;
      }

      return (
        <div className="modal-list">
          {post.likes.map((user, index) => {
            const likeUser = user || {};
            const likeUserId = resolveId(likeUser);
            const profileImage = likeUser.profileImage
              ? likeUser.profileImage.startsWith("http") ||
                likeUser.profileImage.startsWith("blob:")
                ? likeUser.profileImage
                : `${baseApi}${likeUser.profileImage}`
              : FALLBACK_AVATAR;
            const Wrapper = likeUserId ? NavLink : "div";
            const wrapperProps = likeUserId
              ? {
                  to: `/user?id=${likeUserId}`,
                  className: "modal-list-item modal-list-item--link",
                }
              : { className: "modal-list-item modal-list-item--static" };

            return (
              <Wrapper
                key={likeUserId || `like-${index}`}
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
          })}
        </div>
      );
    }

    const comments = post.comments || [];
    const postIdentifier = resolveId(post);
    if (!comments.length) {
      return <p className="modal-empty">No comments yet</p>;
    }

    const currentUserId = resolveId(currentUser);

    return (
      <div className="modal-list">
        {comments.map((comment, index) => {
          const rawCommentId = comment._id || comment.id || comment.commentId || null;
          const commentKey = rawCommentId || `comment-${index}`;
          const commentUser = comment.user || {};
          const commentUserId = resolveId(commentUser);
          const avatar = commentUser.profileImage
            ? commentUser.profileImage.startsWith("http") ||
              commentUser.profileImage.startsWith("blob:")
              ? commentUser.profileImage
              : `${baseApi}${commentUser.profileImage}`
            : FALLBACK_AVATAR;
          const canDelete =
            currentUserId &&
            postIdentifier &&
            rawCommentId &&
            commentUserId &&
            sameId(currentUserId, commentUserId);
          const Wrapper = commentUserId ? NavLink : "div";
          const wrapperProps = commentUserId
            ? {
                to: `/user?id=${commentUserId}`,
                className:
                  "modal-list-item modal-list-item--link modal-list-item--comment",
              }
            : {
                className:
                  "modal-list-item modal-list-item--static modal-list-item--comment",
              };

          return (
            <Wrapper
              key={commentKey}
              {...wrapperProps}>
              <img
                src={avatar}
                alt={commentUser.username || "User avatar"}
                className="modal-avatar"
              />
              <div className="modal-body modal-body--comment">
                <div className="modal-text">
                  <span className="modal-username">
                    {commentUser.username || "User"}
                  </span>
                  <span className="modal-subtext">{comment.text}</span>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    className="modal-action-button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleCommentDelete(postIdentifier, rawCommentId);
                    }}
                    disabled={
                      deletingCommentId != null &&
                      sameId(deletingCommentId, rawCommentId)
                    }>
                    <TrashIcon className="modal-action-icon" />
                  </button>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>
    );
  };

  return (
    <div className="feed">
      {posts.map((post, index) => {
        const postId = resolveId(post);
        return (
          <Post
            key={`${postId}-${index}`}
            post={post}
            onLikeClick={handleLikeClick}
            onLikesView={handleLikesView}
            onCommentsView={handleCommentsView}
          />
        );
      })}

      {hasMore && (
        <div
          ref={loaderRef}
          style={{ height: "40px" }}
        />
      )}

      {isModalOpen && (
        <ModelView
          title={modalTitle}
          onClose={handleCloseModal}>
          {renderModalContent()}
        </ModelView>
      )}
    </div>
  );
}
