import React from "react";
import Notification from "../components/Notification";

const mock = Array.from({ length: 250 }).map((_, i) => ({
  id: `n-${i}`,
  type: ["FRIEND_REQUEST", "LIKE", "POST", "LOGIN", "LOGOUT", "MESSAGE"][i % 6],
  title:
    i % 6 === 0 ? "Sent a friend request" :
    i % 6 === 1 ? "Liked a post" :
    i % 6 === 2 ? "Created a new post" :
    i % 6 === 3 ? "Logged in" :
    i % 6 === 4 ? "Logged out" :
    "Sent a message",
  sub:
    i % 6 === 2 ? `"creating new post <:Happy >"` :
    i % 6 === 5 ? `"Hello bro"` :
    `User ID: user_${i.toString().padStart(3,"0")}`,
  timeLabel: `${(i % 60) + 1}m ago`,
  unread: i % 5 === 0
}));

export default function NotificationsPage() {
  const handleItemClick = (item) => {
    // simple: alert JSON payload with id + read status
    alert(JSON.stringify({ id: item.id, status: "read" }));
  };

  return (
    <div className="app dark">
      <Notification
        items={mock}
        onItemClick={handleItemClick}
      />
    </div>
  );
}