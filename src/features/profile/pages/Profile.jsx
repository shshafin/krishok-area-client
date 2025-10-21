
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { LiquedLoader } from "@/components/loaders";
import CreatePost from "@/components/layout/CreatePost";

import "@/features/profile/styles/ProfilePage.css";

const imageFromSeed = (seed) =>
  `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80&sat=-20&blend-mode=overlay&blend-color=${seed}`;
const avatarFromSeed = (seed) => `https://i.pravatar.cc/120?u=${seed}`;
const sampleVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
const SEED_BATCH_SIZE = 4;
const createLikedUsers = (count, seedKey) =>
  Array.from({ length: count }, (_, index) => {
    const suffix = `${seedKey}-${index + 1}`;
    return {
      id: `liked-${suffix}`,
      name: `বন্ধু ${index + 1}`,
      username: `friend_${suffix}`,
      avatar: avatarFromSeed(suffix),
    };
  });

function buildMockProfile(usernameParam) {
  const username = usernameParam || "guest";
  const baseAvatar = avatarFromSeed(username);

  const profile = {
    id: username,
    username,
    name: username,
    avatar: baseAvatar,
    bio: "Passionate grower sharing innovations in agriculture.",
    email: "user@example.com",
    phone: "+8801998604895",
    division: "Rajshahi",
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
      content: "New harvest ready to share",
      createdAt: "2025-10-19T21:58:05Z",
      media: { type: "image", src: imageFromSeed("FFEDD5") },
      liked: false,
      author,
      comments: [
        {
          id: "199",
          text: "Looks great!",
          createdAt: "2025-10-19T22:02:23Z",
          author,
        },
      ],
      likedUsers: createLikedUsers(18, `${username}-166`),
    },
    {
      id: "165",
      content: "Logo concept for the new season",
      createdAt: "2025-10-19T21:57:47Z",
      media: { type: "image", src: imageFromSeed("E0F2FE") },
      liked: false,
      author,
      comments: [],
      likedUsers: createLikedUsers(6, `${username}-165`),
    },
    {
      id: "159",
      content: "Field update video",
      createdAt: "2025-10-12T16:05:32Z",
      media: { type: "video", src: sampleVideo },
      liked: true,
      author,
      comments: [],
      likedUsers: createLikedUsers(33, `${username}-159`),
    },
  ].map((post) => ({ ...post, likes: post.likedUsers.length }));

  const seedItems = [
    {
      id: "seed-11",
      title: "হাইব্রিড ধান BR-89",
      mediaUrl: imageFromSeed("FDE68A"),
      photographer: "Green Harvest Co.",
    },
    {
      id: "seed-10",
      title: "দেশি সবুজ লাউ",
      mediaUrl: imageFromSeed("FECDD3"),
      photographer: "Agro Roots",
    },
    {
      id: "seed-9",
      title: "মিষ্টি কুমড়া বীজ",
      mediaUrl: imageFromSeed("E2E8F0"),
      photographer: "Farm Fresh Seeds",
    },
    {
      id: "seed-8",
      title: "টমেটো গোল্ডেন সিডস",
      mediaUrl: imageFromSeed("F5F3FF"),
      photographer: "Urban Grower",
    },
    {
      id: "seed-7",
      title: "মরিচ হাইব্রিড F1",
      mediaUrl: imageFromSeed("DBEAFE"),
      photographer: "Spice Valley",
    },
    {
      id: "seed-6",
      title: "চাল কুমড়ো সংগ্রহ",
      mediaUrl: imageFromSeed("F1F5F9"),
      photographer: "Harvest Partner",
    },
    {
      id: "seed-5",
      title: "জৈব শসা বীজ",
      mediaUrl: imageFromSeed("FECACA"),
      photographer: "Eco Seeds Ltd.",
    },
    {
      id: "seed-4",
      title: "অর্গানিক ধনিয়া",
      mediaUrl: imageFromSeed("BBF7D0"),
      photographer: "Green Dales",
    },
    {
      id: "seed-3",
      title: "সূর্যমুখী প্রিমিয়াম",
      mediaUrl: imageFromSeed("FEE2E2"),
      photographer: "Sunline Agro",
    },
    {
      id: "seed-2",
      title: "গম উৎপাদন ১২০",
      mediaUrl: imageFromSeed("FEF3C7"),
      photographer: "Golden Field",
    },
    {
      id: "seed-1",
      title: "পেঁয়াজ মৌসুমি",
      mediaUrl: imageFromSeed("E0E7FF"),
      photographer: "Farm to Seed",
    },
    {
      id: "seed-0",
      title: "বেগুন মিশ্রণ",
      mediaUrl: imageFromSeed("FBCFE8"),
      photographer: "Purple Roots",
    },
  ];

  const following = [
    { id: "100", name: "New Lima Akter", username: "newlimaakter", avatar: avatarFromSeed("newlimaakter") },
    { id: "53", name: "Jokar", username: "fdffdfddsfdsfc", avatar: avatarFromSeed("jokar") },
    { id: "1", name: "Md. Mosarrof Hossain", username: "mosarrofhossain", avatar: avatarFromSeed("mosarrofhossain") },
    { id: "6", name: "Kobir", username: "firozkobir", avatar: avatarFromSeed("firozkobir") },
    { id: "17", name: "MD Majid", username: "mdmajid", avatar: avatarFromSeed("mdmajid") },
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
  const [remainingSeeds, setRemainingSeeds] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);

  const effectiveUsername = username ?? currentUser?.username ?? null;

  const viewerIdentity = useMemo(() => {
    if (currentUser) {
      const fallbackSeed = currentUser.username || currentUser.name || "viewer";
      return {
        id: resolveUserId(currentUser) ?? `viewer-${fallbackSeed}`,
        name: currentUser.name || currentUser.username || "You",
        username: currentUser.username || fallbackSeed,
        avatar:
          currentUser.profileImage ||
          currentUser.avatar ||
          avatarFromSeed(fallbackSeed),
      };
    }
    return {
      id: "viewer-guest",
      name: "You",
      username: "guest",
      avatar: avatarFromSeed("guest"),
    };
  }, [currentUser]);

  const viewerIdKey = viewerIdentity?.id ? String(viewerIdentity.id).toLowerCase() : null;

  const followerExists = useMemo(() => {
    if (!viewerIdKey) return false;
    return followers.some((follower) => {
      const followerId = resolveUserId(follower);
      return followerId && String(followerId).toLowerCase() === viewerIdKey;
    });
  }, [followers, viewerIdKey]);

  useEffect(() => {
    setIsFollowingProfile((prev) => (prev === followerExists ? prev : followerExists));
  }, [followerExists, profile?.id]);

  useEffect(() => {
    if (username) {
      return;
    }

    setProfile(null);
    setPosts([]);
    setSeedItems([]);
    setRemainingSeeds([]);
    setFollowers([]);
    setFollowing([]);
    setLoading(true);
  }, [username]);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("text");
  const [allPostsOpen, setAllPostsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [activePostMode, setActivePostMode] = useState("comments");

  const closeActivePost = useCallback(() => {
    setActivePostId(null);
    setActivePostMode("comments");
  }, []);

  const openPostComments = useCallback((postId) => {
    setActivePostMode("comments");
    setActivePostId(postId);
  }, []);

  const openPostLikes = useCallback((postId) => {
    setActivePostMode("likes");
    setActivePostId(postId);
  }, []);

  useEffect(() => {
    if (!effectiveUsername) {
      return;
    }

    setLoading(true);
    const mock = buildMockProfile(effectiveUsername);
    setProfile(mock.profile);
    setPosts(mock.posts);
    const seeds = mock.seedItems ?? [];
    setSeedItems(seeds.slice(0, SEED_BATCH_SIZE));
    setRemainingSeeds(seeds.slice(SEED_BATCH_SIZE));
    setFollowers(mock.followers);
    setFollowing(mock.following);
    setLoading(false);
  }, [effectiveUsername]);

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
  const currentUsername = currentUser?.username ? String(currentUser.username).toLowerCase() : null;
  const profileUsername = profile?.username ? String(profile.username).toLowerCase() : null;
  const isOwner = Boolean(
    (currentUserId &&
      profileOwnerId &&
      String(currentUserId).toLowerCase() === String(profileOwnerId).toLowerCase()) ||
    (currentUsername && profileUsername && currentUsername === profileUsername) ||
    (!username && currentUserId)
  );

  const stats = useMemo(() => ({
    posts: posts.length,
    followers: followers.length,
    following: following.length,
  }), [posts.length, followers.length, following.length]);

  const hasMoreSeeds = remainingSeeds.length > 0;

  const loadMoreSeeds = useCallback(() => {
    if (!remainingSeeds.length) {
      return Promise.resolve([]);
    }

    let nextChunk = [];
    setRemainingSeeds((prev) => {
      if (!prev.length) return prev;
      nextChunk = prev.slice(0, SEED_BATCH_SIZE);
      return prev.slice(SEED_BATCH_SIZE);
    });

    if (!nextChunk.length) {
      return Promise.resolve([]);
    }

    setSeedItems((prev) => [...prev, ...nextChunk]);
    return Promise.resolve(nextChunk);
  }, [remainingSeeds.length]);

  const followingLookup = useMemo(() => {
    const identifiers = new Set();
    following.forEach((item) => {
      const id = resolveUserId(item) ?? item?.username ?? item?.id;
      if (id !== undefined && id !== null) {
        identifiers.add(String(id).toLowerCase());
      }
    });
    return identifiers;
  }, [following]);

  const isUserInFollowing = useCallback(
    (user) => {
      const identifier = resolveUserId(user) ?? user?.username ?? user?.id;
      if (identifier === undefined || identifier === null) return false;
      return followingLookup.has(String(identifier).toLowerCase());
    },
    [followingLookup]
  );

  const toggleFollowUser = useCallback(
    (user, currentlyFollowing) => {
      const identifier = resolveUserId(user) ?? user?.username ?? user?.id;
      if (identifier === undefined || identifier === null) return;
      const targetId = String(identifier).toLowerCase();
      const displayName = user?.name || user?.username || "এই ব্যবহারকারী";

      setFollowing((prev) => {
        const filtered = prev.filter((item) => {
          const itemId = resolveUserId(item) ?? item?.username ?? item?.id;
          return !itemId || String(itemId).toLowerCase() !== targetId;
        });

        if (currentlyFollowing) {
          return filtered;
        }

        const normalizedUser = {
          id: resolveUserId(user) ?? user?.id ?? user?.username ?? targetId,
          name: user?.name ?? user?.username ?? "User",
          username: user?.username ?? String(identifier),
          avatar: user?.avatar ?? avatarFromSeed(user?.username ?? "follower"),
        };

        return [...filtered, normalizedUser];
      });

      toast.success(
        currentlyFollowing
          ? `${displayName} কে আনফলো করা হয়েছে`
          : `${displayName} কে ফলো করা হয়েছে`
      );
    },
    []
  );

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const willLike = !post.liked;
        const existingLikedUsers = Array.isArray(post.likedUsers) ? post.likedUsers : [];
        let updatedLikedUsers = existingLikedUsers;

        if (viewerIdentity && viewerIdKey) {
          const hasViewer = existingLikedUsers.some((user) => {
            const identifier = resolveUserId(user) ?? user?.username ?? user?.id;
            if (identifier === undefined || identifier === null) return false;
            return String(identifier).toLowerCase() === viewerIdKey;
          });

          if (willLike && !hasViewer) {
            updatedLikedUsers = [...existingLikedUsers, viewerIdentity];
          } else if (!willLike && hasViewer) {
            updatedLikedUsers = existingLikedUsers.filter((user) => {
              const identifier = resolveUserId(user) ?? user?.username ?? user?.id;
              if (identifier === undefined || identifier === null) return true;
              return String(identifier).toLowerCase() !== viewerIdKey;
            });
          }
        }

        const nextLikes = viewerIdKey
          ? updatedLikedUsers.length
          : willLike
            ? (post.likes ?? 0) + 1
            : Math.max(0, (post.likes ?? 0) - 1);

        return {
          ...post,
          liked: willLike,
          likes: nextLikes,
          likedUsers: viewerIdKey ? updatedLikedUsers : existingLikedUsers,
        };
      })
    );
  };

  const authorForNewComment = () => {
    if (currentUser) {
      return {
        id: resolveUserId(currentUser) ?? `current-${Date.now()}`,
        name: currentUser.name || currentUser.username || "You",
        avatar:
          currentUser.profileImage ||
          currentUser.avatar ||
          avatarFromSeed(currentUser.username || "current"),
      };
    }
    return {
      id: profile?.id ?? "guest",
      name: profile?.name ?? "Guest",
      avatar: profile?.avatar ?? avatarFromSeed("guest"),
    };
  };

  const addComment = (postId, text) => {
    const comment = {
      id: `comment-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      author: authorForNewComment(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
    toast.success("মন্তব্য যোগ হয়ছে");
  };

  const deleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
          : post
      )
    );
    toast.success("মন্তব্য মুছে ফেলা হয়ছে");
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    if (activePostId === postId) {
      closeActivePost();
    }
    toast.success("পোস্ট মুছে ফেলা হয়েছে");
  };
  const deleteSeed = (seedId) => {
    setSeedItems((prev) => prev.filter((seed) => seed.id !== seedId));
    setRemainingSeeds((prev) => prev.filter((seed) => seed.id !== seedId));
    toast.success("বীজ আইটেমটি মুছে ফেলা হয়ছে");
  };

  const submitComposer = async (payload) => {
    // eslint-disable-next-line no-console
    console.log("New post payload", payload);
    toast.success("পোস্টটি ড্রাফটে সফলভাবে সংরক্ষিত হয়ছে");
  };

  const handleUnfollow = (user) => {
    setFollowing((prev) => prev.filter((item) => item.id !== user.id));
    toast.success(`${user.name} অনুসরণ তালিকা থেকে সরানো হয়ছে`);
  };

  const canDeleteComment = (comment) => {
    const commentAuthorId = resolveUserId(comment.author);
    return isOwner || (commentAuthorId && currentUserId && String(commentAuthorId) === String(currentUserId));
  };

  const handlePrimaryAction = () => {
    if (isOwner) {
      toast.success("প্রোফাইল সম্পাদনার সুবিধা শীঘ্রই যোগ হবে");
    } else {
      const next = !isFollowingProfile;
      const followerEntry = viewerIdentity ? { ...viewerIdentity } : null;

      if (viewerIdKey && followerEntry) {
        setFollowers((prev) => {
          const filtered = prev.filter((item) => {
            const itemId = resolveUserId(item);
            return !itemId || String(itemId).toLowerCase() !== viewerIdKey;
          });

          return next ? [...filtered, followerEntry] : filtered;
        });
      }

      setIsFollowingProfile(next);
      toast.success(next ? "আপনি এখন এই প্রোফাইলটি অনুসরণ করছেন" : "আপনি এই প্রোফাইলটি অনুসরণ করা বন্ধ করেছেন");
    }
  };

  if (loading || !profile) {
    return (
      <div className="profile-page profile-page--loading">
        <LiquedLoader label="প্রোফাইল লোড হচ্ছে..." />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ProfileOverview
        profile={profile}
        stats={stats}
        isOwner={isOwner}
        isFollowing={isFollowingProfile}
        showPrimaryAction={!isOwner}
        onPrimaryAction={handlePrimaryAction}
        onOpenAllPosts={() => setAllPostsOpen(true)}
        onOpenFollowers={() => setFollowersOpen(true)}
        onOpenFollowing={() => setFollowingOpen(true)}
      />

      <div className="profile-two-column">
        <ProfileSidebar
          profile={profile}
          isOwner={isOwner}
          compactSeedDisplay={!isOwner}
          seeds={seedItems}
          hasMoreSeeds={hasMoreSeeds}
          onDeleteSeed={deleteSeed}
          onOpenComposer={(mode) => {
            setComposerMode(mode);
            setComposerOpen(true);
          }}
          onLoadMoreSeeds={loadMoreSeeds}
        />

        <section className="post-feed">
          {isOwner && (
            <CreatePost
              user={(profile.name || profile.username || "You").split(" ")[0]}
              profile={profile.avatar}
              onTextClick={() => {
                setComposerMode("text");
                setComposerOpen(true);
              }}
              onPhotoVideoClick={() => {
                setComposerMode("media");
                setComposerOpen(true);
              }}
              onFellingClick={() => {
                setComposerMode("text");
                setComposerOpen(true);
              }}
            />
          )}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={isOwner}
              onLike={toggleLike}
              onOpenComments={openPostComments}
              onOpenLikes={openPostLikes}
              onDelete={deletePost}
              onAddComment={addComment}
              onOpenPost={openPostComments}
            />
          ))}
        </section>
      </div>

      <AllPostsModal
        open={allPostsOpen}
        onClose={() => setAllPostsOpen(false)}
        posts={posts}
        onSelect={(post) => {
          openPostComments(post.id);
          setAllPostsOpen(false);
        }}
      />

      <FollowListModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        title="অনুসরণকারী"
        users={followers}
        onToggleFollow={toggleFollowUser}
        isFollowing={isUserInFollowing}
      />

      <FollowListModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        title="আপনি যাদের অনুসরণ করছেন"
        users={following}
        onToggleFollow={toggleFollowUser}
        isFollowing={isUserInFollowing}
        actionLabel={undefined}
        onAction={undefined}
      />

      <PostModal
        open={Boolean(activePost)}
        post={activePost}
        mode={activePostMode}
        onClose={closeActivePost}
        onToggleLike={toggleLike}
        onAddComment={addComment}
        onDeleteComment={deleteComment}
        canDeleteComment={canDeleteComment}
      />

      <PostComposerModal
        open={composerOpen}
        mode={composerMode}
        onClose={() => setComposerOpen(false)}
        onSubmit={submitComposer}
        viewer={{
          name: viewerIdentity?.name,
          username: viewerIdentity?.username,
          avatar: viewerIdentity?.avatar,
        }}
      />
    </div>
  );
}




