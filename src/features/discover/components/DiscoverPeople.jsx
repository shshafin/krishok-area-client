import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import UserCard from "@/components/ui/UserCard";
import {
  fetchAllUsers,
  fetchMe,
  followUser,
  unfollowUser,
} from "@/api/authApi";
import { toast } from "react-hot-toast";

const TABS = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "friends", label: "Friends" },
];

const PAGE_SIZE = 6;

export default function DiscoverPeople() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Fetch current user
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await fetchMe();
        setCurrentUser(res.data);
        setFollowingIds(new Set(res.data.following || []));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load current user");
      }
    };
    loadCurrentUser();
  }, []);

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchAllUsers();
        const filtered = res.data?.filter((u) => u._id !== currentUser?._id);
        setUsers(filtered || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    };
    if (currentUser) loadUsers();
  }, [currentUser]);

  // Follow/unfollow toggle
  const handleFollowToggle = async (userId, currentlyFollowing) => {
    try {
      if (currentlyFollowing) {
        await unfollowUser(userId);
        setFollowingIds((s) => {
          const n = new Set(s);
          n.delete(userId);
          return n;
        });
        toast.success("Unfollowed successfully");
      } else {
        await followUser(userId);
        setFollowingIds((s) => new Set(s).add(userId));
        toast.success("Followed successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  // Filter & search logic
  const filteredUsers = useMemo(() => {
    if (!currentUser) return [];

    let base = users.filter(
      (u) =>
        (u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())) &&
        u._id !== currentUser._id
    );

    switch (activeTab) {
      case "online":
        return base.filter((u) => u.isOnline);
      case "friends":
        return base.filter((u) => followingIds.has(u._id));
      default:
        return base;
    }
  }, [users, query, activeTab, followingIds, currentUser]);

  const visibleUsers = useMemo(
    () => filteredUsers.slice(0, visibleCount),
    [filteredUsers, visibleCount]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <section className="discover-people">
      <div className="discover-controls">
        <SearchBar
          placeholder="Search users..."
          onChange={setQuery}
          defaultValue=""
          delay={250}
        />

        <div
          className="tab-row"
          role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              className={`tab-btn ${activeTab === t.key ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab(t.key);
                setVisibleCount(PAGE_SIZE);
              }}>
              {t.label} (
              {t.key === "friends" ? followingIds.size : filteredUsers.length})
            </button>
          ))}
        </div>
      </div>

      <div className="user-list">
        {visibleUsers.map((u) => (
          <UserCard
            key={u._id}
            user={u}
            isFollowing={followingIds.has(u._id)}
            onToggle={() => handleFollowToggle(u._id, followingIds.has(u._id))}
          />
        ))}
      </div>

      {visibleCount < filteredUsers.length && (
        <button
          onClick={handleLoadMore}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
            color: "#fff",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          Load More
        </button>
      )}

      {filteredUsers.length === 0 && (
        <div
          className="empty-state"
          style={{ textAlign: "center", marginTop: "20px" }}>
          No users found
        </div>
      )}
    </section>
  );
}
