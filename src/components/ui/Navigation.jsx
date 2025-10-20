import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import bookIcon from "@/assets/icons/Book.svg";
import homeIcon from "@/assets/icons/Home.svg";
import imageIcon from "@/assets/icons/Image.svg";
import followersIcon from "@/assets/icons/Followers.svg";
import notificationIcon from "@/assets/icons/Notification.svg";
import CloseIcon from "@/assets/IconComponents/Close";

const iconStyle = { width: 20, height: 20 };

const dummyNotifications = [
  {
    id: "notif-1",
    author: "Rana Khan",
    message: "আপনার পোস্টটি লাইক করেছেন।",
    timeAgo: "9 months ago",
    avatar: "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png",
  },
  {
    id: "notif-2",
    author: "Rana Khan",
    message: "আপনার পোস্টে মন্তব্য করেছেন।",
    timeAgo: "9 months ago",
    avatar: "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png",
  },
  {
    id: "notif-3",
    author: "Rana Khan",
    message: "আপনাকে ফলো করেছেন।",
    timeAgo: "10 months ago",
    avatar: "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png",
  },
  {
    id: "notif-4",
    author: "Rana Khan",
    message: "আলোচনায় আপনাকে মেনশন করেছেন।",
    timeAgo: "12 months ago",
    avatar: "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png",
  },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => setNotifications([]);

  const unreadCount = notifications.length;

  return (
    <nav className="NavigationLinks" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <NavLink to="/">
        <img src={homeIcon} alt="Home" style={iconStyle} />
      </NavLink>

      <NavLink to="/gallery">
        <img src={imageIcon} alt="Gallery" style={iconStyle} />
      </NavLink>

      <NavLink to="/guidelines">
        <img src={bookIcon} alt="Library" style={iconStyle} />
      </NavLink>

      <section className="nav-notification" ref={popoverRef}>
        <button
          type="button"
          className={`nav-icon-button ${isOpen ? "is-open" : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Open notifications">
          <img src={notificationIcon} alt="Notifications" style={iconStyle} />
          {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
        </button>

        {isOpen && (
          <aside className="notification-popover">
            <header className="notification-popover__header">
              <div>
                <span className="notification-popover__title">বিজ্ঞপ্তি</span>
                <p className="notification-popover__subtitle">
                  আপনার সাম্প্রতিক কার্যকলাপ সম্পর্কে দ্রুত আপডেট
                </p>
              </div>
              <button
                type="button"
                className="notification-clear"
                onClick={handleClearAll}
                disabled={!unreadCount}>
                Clear
              </button>
            </header>

            <div className="notification-popover__list" role="list">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <article className="notification-item" key={notification.id} role="listitem">
                    <div className="notification-avatar-wrapper">
                      <img
                        src={notification.avatar}
                        alt={notification.author}
                        className="notification-avatar"
                      />
                    </div>
                    <div className="notification-body">
                      <span className="notification-author">{notification.author}</span>
                      <p className="notification-message">{notification.message}</p>
                      <time className="notification-time">{notification.timeAgo}</time>
                    </div>
                    <button
                      type="button"
                      className="notification-dismiss"
                      aria-label="Dismiss notification"
                      onClick={() => handleDismiss(notification.id)}>
                      <CloseIcon width={14} height={14} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="notification-empty">
                  <p>সব কিছু আপডেটেড! নতুন কোনো নোটিফিকেশন নেই।</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </section>

      <NavLink to="/discover">
        <img src={followersIcon} alt="Followers" style={iconStyle} />
      </NavLink>
    </nav>
  );
}

export default Navigation;
