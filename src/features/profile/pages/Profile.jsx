import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchMe } from "@/api/authApi";

import ProfileOverview from "../components/ProfileOverview";
import ProfileSidebar from "../components/ProfileSidebar";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";
import PostComposerModal from "../components/PostComposerModal";
import FollowListModal from "../components/FollowListModal";
import AllPostsModal from "../components/AllPostsModal";

import "@/features/profile/styles/ProfilePage.css";

const IMAGE_PLACEHOLDER = (seed) => `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80&sat=-20&blend-mode=overlay&blend-color=${seed}`;
const AVATAR_PLACEHOLDER = (seed) => `https://i.pravatar.cc/120?u=${seed}`;
const VIDEO_PLACEHOLDER = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

function buildMockProfile(usernameParam) {
  const username = usernameParam || "krishokarea";
  const baseAvatar = AVATAR_PLACEHOLDER(username);
  const profile = {
    id: "user-1",
    username,
    name: username,
    avatar: baseAvatar,
    bio: "প্রকৃতি প্রেমী কৃষক, কৃষির উদ্ভাবনী ধারণা শেয়ার করতে ভালোবাসি।",
    email: "user@example.com",
    phone: "+8801998604895",
    division: "রাজশাহী",
    address: "Placeat delectus v",
  };

  const author = {
    id: profile.id,
    name: profile.name,
    avatar: baseAvatar,
  };

  const posts = [
    {
      id: "166",
      content: "New video done",
      createdAt: "2025-10-19T21:58:05Z",
      media: { type: "image", src: IMAGE_PLACEHOLDER("FFEDD5") },
      likes: 0,
      liked: false,
      author,
      comments: [
        {
          id: "199",
          text: "Thire can be comment able",
          createdAt: "2025-10-19T22:02:23Z",
          author,
        },
      ],
    },
    {
      id: "165",
      content: "Logo",
      createdAt: "2025-10-19T21:57:47Z",
      media: { type: "image", src: IMAGE_PLACEHOLDER("E0F2FE") },
      likes: 0,
      liked: false,
      author,
      comments: [],
    },
    {
      id: "159",
      content: "Post",
      createdAt: "2025-10-12T16:05:32Z",
      media: { type: "video", src: VIDEO_PLACEHOLDER },
      likes: 1,
      liked: true,
      author,
      comments: [],
    },
  ];

  const seedItems = [
    { id: "seed-11", image: IMAGE_PLACEHOLDER("FDE68A"), title: "Seed 1" },
    { id: "seed-10", image: IMAGE_PLACEHOLDER("FECDD3"), title: "Seed 2" },
    { id: "seed-8", image: IMAGE_PLACEHOLDER("E2E8F0"), title: "Seed 3" },
  ];

  const following = [
    { id: "100", name: "New Lima Akter", username: "newlimaakter", avatar: AVATAR_PLACEHOLDER("newlimaakter") },
    { id: "53", name: "jokar", username: "fdffdfddsfdsfc", avatar: AVATAR_PLACEHOLDER("jokar") },
    { id: "1", name: "Md.Mosarrof Hossain", username: "mosarrofhossain", avatar: AVATAR_PLACEHOLDER("mosarrofhossain") },
    { id: "6", name: "KOBIR", username: "firozkobir", avatar: AVATAR_PLACEHOLDER("firozkobir") },
    { id: "17", name: "MD Majid", username: "mdmajid", avatar: AVATAR_PLACEHOLDER("mdmajid") },
  ];

  const followers = [];

  return {
    profile,
    posts,
    seedItems,
    followers,
    following,
  };
}

function resolveUserId(user) {
  return user?.id ?? user?._id ?? user?.userId ?? user?.username ?? null;
}

export default function ProfilePage() {
  const { username } = useParams();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [seedItems, setSeedItems] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("text");
  const [allPostsOpen, setAllPostsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      const mock = buildMockProfile(username);
      setProfile(mock.profile);
      setPosts(mock.posts);
      setSeedItems(mock.seedItems);
      setFollowers(mock.followers);
      setFollowing(mock.following);
      setLoading(false);
    };
    bootstrap();
  }, [username]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetchMe();
        setCurrentUser(response?.data ?? response);
      } catch (error) {
        console.error("Failed to fetch current user", error);
        setCurrentUser(null);
      }
    };
    loadCurrentUser();
  }, []);

  const activePost = useMemo(() => posts.find((post) => post.id === activePostId), [activePostId, posts]);

  const currentUserId = resolveUserId(currentUser);
  const profileOwnerId = resolveUserId(profile);
  const isOwner = Boolean(currentUserId && profileOwnerId && String(currentUserId).toLowerCase() === String(profileOwnerId).toLowerCase());

  const stats = useMemo(() => ({
    posts: posts.length,
    followers: followers.length,
    following: following.length,
  }), [posts.length, followers.length, following.length]);

  const handleToggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
            }
          : post
      )
    );
  };

  const buildCommentAuthor = () => {
    if (currentUser) {
      return {
        id: resolveUserId(currentUser) ?? `current-${Date.now()}`,
        name: currentUser.name || currentUser.username || "You",
        avatar:
          currentUser.profileImage ||
          currentUser.avatar ||
          AVATAR_PLACEHOLDER(currentUser.username || "current"),
      };
    }
    return {
      id: profile?.id ?? "guest",
      name: profile?.name ?? "Guest",
      avatar: profile?.avatar ?? AVATAR_PLACEHOLDER("guest"),
    };
  };

  const handleAddComment = (postId, text) => {
    const comment = {
      id: `comment-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      author: buildCommentAuthor(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, comment],
            }
          : post
      )
    );
    toast.success("মন্তব্য যোগ করা হয়েছে");
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((comment) => comment.id !== commentId),
            }
          : post
      )
    );
    toast.success("মন্তব্য মুছে ফেলা হয়েছে");
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    if (activePostId === postId) setActivePostId(null);
    toast.success("পোস্ট মুছে ফেলা হয়েছে");
  };

  const handleDeleteSeed = (seedId) => {
    setSeedItems((prev) => prev.filter((seed) => seed.id !== seedId));
    toast.success("বীজ আইটেমটি মুছে ফেলা হয়েছে");
  };

  const handleComposerSubmit = async (payload) => {
    console.log("New post payload", payload);
    toast.success("পোস্টটি ড্রাফ্ট হিসাবে সংরক্ষিত হয়েছে");
  };

  const handleUnfollow = (user) => {
    setFollowing((prev) => prev.filter((item) => item.id !== user.id));
    toast.success(`${user.name} তালিকা থেকে সরানো হয়েছে`);
  };

  const canDeleteComment = (comment) => {
    const commentAuthorId = resolveUserId(comment.author);
    return isOwner || (commentAuthorId && currentUserId && String(commentAuthorId) === String(currentUserId));
  };

  const handlePrimaryAction = () => {
    if (isOwner) {
      toast.success("প্রোফাইল সম্পাদনা পৃষ্ঠাটি শীঘ্রই যুক্ত হবে");
    } else {
      toast.success("ফলো করা হয়েছে");
    }
  };

  if (loading || !profile) {
    return (
      <div className="profile-page">
        <div className="empty-state">প্রোফাইল তথ্য লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ProfileOverview
        profile={profile}
        stats={stats}
        isOwner={isOwner}
        onPrimaryAction={handlePrimaryAction}
        onOpenAllPosts={() => setAllPostsOpen(true)}
        onOpenFollowers={() => setFollowersOpen(true)}
        onOpenFollowing={() => setFollowingOpen(true)}
      />

      <div className="profile-two-column">
        <ProfileSidebar
          profile={profile}
          isOwner={isOwner}
          seeds={seedItems}
          onDeleteSeed={handleDeleteSeed}
          onOpenComposer={(mode) => {
            setComposerMode(mode);
            setComposerOpen(true);
          }}
        />

        <section className="post-feed">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={isOwner}
              onLike={handleToggleLike}
              onOpenComments={setActivePostId}
              onDelete={handleDeletePost}
              onAddComment={handleAddComment}
            />
          ))}
        </section>
      </div>

      <AllPostsModal
        open={allPostsOpen}
        onClose={() => setAllPostsOpen(false)}
        posts={posts}
        onSelect={(post) => {
          setActivePostId(post.id);
          setAllPostsOpen(false);
        }}
      />

      <FollowListModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        title="যারা ফলো করেছে"
        users={followers}
      />

      <FollowListModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        title="যাদের কে ফলো করেছেন"
        users={following}
        actionLabel={isOwner ? "Unfollow" : undefined}
        onAction={isOwner ? handleUnfollow : undefined}
      />

      <PostModal
        open={Boolean(activePost)}
        post={activePost}
        onClose={() => setActivePostId(null)}
        isOwner={isOwner}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        canDeleteComment={canDeleteComment}
      />

      <PostComposerModal
        open={composerOpen}
        mode={composerMode}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleComposerSubmit}
      />
    </div>
  );
}
