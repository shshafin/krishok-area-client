import React, { useEffect, useMemo, useRef, useState, memo, useCallback } from "react";
import "@/assets/styles/Notification.css";

/**
 * Expected item shape (you control this; it's passed via props):
 * {
 *   id: string|number,
 *   type: "FRIEND_REQUEST" | "LIKE" | "POST" | "LOGIN" | "LOGOUT" | "MESSAGE",
 *   title: string,          // e.g., "Sent a friend request"
 *   sub?: string,           // e.g., 'User ID: ...' or message preview
 *   timeLabel: string,      // e.g., "18m ago"
 *   unread?: boolean,       // optional unread flag
 * }
 *
 * Props:
 * - items: NotificationItem[]
 * - className?: string
 * - onItemClick?: (item) => void
 * - theme?: "dark" | undefined  -> add .dark class on wrapper if set to "dark"
 *
 * Behaviour:
 * - Shows 70 initially, then loads +10 on end-of-list intersection.
 */

const INITIAL_COUNT = 70;
const CHUNK = 10;

function typeToVariant(type) {
  switch (type) {
    case "FRIEND_REQUEST": return { variant: "friend", badge: "FRIEND REQUEST", badgeClass: "badge--friend", iconClass: "icon--friend", icon: FriendIcon };
    case "LIKE": return { variant: "like", badge: "LIKE", badgeClass: "badge--like", iconClass: "icon--like", icon: HeartIcon };
    case "POST": return { variant: "post", badge: "POST", badgeClass: "badge--post", iconClass: "icon--post", icon: PostIcon };
    case "LOGIN": return { variant: "login", badge: "LOGIN", badgeClass: "badge--login", iconClass: "icon--login", icon: LoginIcon };
    case "LOGOUT": return { variant: "logout", badge: "LOGOUT", badgeClass: "badge--logout", iconClass: "icon--logout", icon: LogoutIcon };
    case "MESSAGE": return { variant: "message", badge: "MESSAGE", badgeClass: "badge--message", iconClass: "icon--message", icon: MessageIcon };
    default: return { variant: "post", badge: "POST", badgeClass: "badge--post", iconClass: "icon--post", icon: PostIcon };
  }
}

const FriendIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" x2="19" y1="8" y2="14"/>
    <line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);

const HeartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const PostIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" {...props}>
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
  </svg>
);

const LoginIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" x2="3" y1="12" y2="12"/>
  </svg>
);

const LogoutIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const MessageIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" {...props}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

/* Single item (memoized) */
const NotificationItem = memo(function NotificationItem({ item, onClick }) {
  const { variant, badge, badgeClass, iconClass, icon: Icon } = typeToVariant(item.type);

  // Avoid any HTML injection in preview texts
  const title = item.title ?? "";
  const sub = item.sub ?? "";

  return (
    <div
      className={`notification-item variant-${variant}`}
      onClick={() => onClick?.(item)}
      role="button"
      tabIndex={0}
    >
      <div className="notification-icon">
        <Icon className={iconClass} />
      </div>

      <div className="notification-body">
        <h4 className="notification-title">{title}</h4>
        {sub && <p className="notification-sub">{sub}</p>}

        <div className="notification-badges">
          <span className={`badge ${badgeClass}`}>{badge}</span>
        </div>
      </div>

      <div className="notification-meta">
        <div className="meta-time">
          <TimeIcon />
          <span>{item.timeLabel}</span>
        </div>
        {item.unread ? <div className="meta-dot" aria-label="unread" /> : null}
      </div>
    </div>
  );
});

const TimeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function Notification({
  items,
  className = "",
  onItemClick,
  theme = "dark",
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const sentinelRef = useRef(null);

  // Reset when data changes
  useEffect(() => setVisibleCount(INITIAL_COUNT), [items]);

  const visibleItems = useMemo(
    () => (items || []).slice(0, visibleCount),
    [items, visibleCount]
  );

  const onIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisibleCount((prev) => Math.min((items || []).length, prev + CHUNK));
      }
    },
    [items]
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "240px",
      threshold: 0.01,
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, [onIntersect]);

  const wrapperClass = `${theme === "dark" ? "dark" : ""} ${className}`.trim();

  return (
    <div className={wrapperClass}>
      <section className="notifications">
        <h2 className="notifications__title">Notifications</h2>

        <div className="notification-list" role="list">
          {visibleItems.map((it) => (
            <NotificationItem key={it.id} item={it} onClick={onItemClick} />
          ))}
          <div className="scroll-sentinel" ref={sentinelRef} aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}