import { useEffect, useMemo, useRef, useState } from "react";
import TableView from "./TableView";
import SearchBar from "./SearchBar";
import "../styles/adminScoped.css";

const PAGE_SIZE_FIRST = 30;
const PAGE_SIZE_NEXT = 20;

const DISTRICTS = [
  "\u09b0\u09be\u099c\u09b6\u09be\u09b9\u09c0",
  "\u09a2\u09be\u0995\u09be",
  "\u09b8\u09bf\u09b2\u09c7\u099f",
  "\u09ac\u09b0\u09bf\u09b6\u09be\u09b2",
  "\u09ae\u09df\u09ae\u09a8\u09b8\u09bf\u0982\u09b9",
  "\u09b0\u0982\u09aa\u09c1\u09b0",
  "\u099a\u099f\u09cd\u099f\u0997\u09cd\u09b0\u09be\u09ae",
];
const ADDRESSES = [
  "paba, rajshahi",
  "mohonpur, rajshahi",
  "tanor, rajshahi",
  "Paba. Raj",
  "shahmokhdum, rajshahi",
  "mothurdanga, rajshahi",
];
const NAMES = [
  "Md. Mosarrof Hossain",
  "Rana Khan",
  "Md. Momin Islam",
  "Md. Shihab Ali",
  "Konika Mk",
  "Krishok Ami",
  "Shoriful Islam",
  "Torikul Islam",
];
const HANDLES = [
  "mosarrofhossain",
  "ranakhan123",
  "mominrajshahikeshorhat",
  "mdshihabali",
  "santonakonikamk.SA",
  "krishokami1",
  "shorifulislam",
  "torikulislam",
];
const AVATARS = [
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&h=120&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&h=120&fit=crop&auto=format",
];
const SEARCH_PLACEHOLDER =
  "\u0995\u09c0\u099f\u09a8\u09be\u09b6\u0995\u0020\u09aa\u09a3\u09cd\u09af\u0020\u0996\u09cb\u099c\u0020\u0995\u09b0\u09c1\u09a8";
const STATS = [
  {
    label: "Total Users",
    value: 47,
    color: "bg-info",
    icon: "ion ion-person-add",
  },
  {
    label: "Total Posts",
    value: 56,
    color: "bg-success",
    icon: "ion ion-stats-bars",
  },
  {
    label: "Total Comments",
    value: 115,
    color: "bg-warning",
    icon: "ion ion-bag",
  },
  {
    label: "Total Likes",
    value: 15,
    color: "bg-danger",
    icon: "ion ion-pie-graph",
  },
];

const DEMO = Array.from({ length: 120 }, (_, i) => {
  const name = NAMES[i % NAMES.length];
  const handle = HANDLES[i % HANDLES.length];
  const username = handle || `user-${1000 - i}`;
  const id = 1000 - i;

  return {
    no: i + 1,
    id,
    name,
    handle,
    email: `user${i}@mailinator.com`,
    dept: DISTRICTS[i % DISTRICTS.length],
    address: ADDRESSES[i % ADDRESSES.length],
    phone: `017${String(10000000 + i).slice(0, 8)}`,
    avatar: AVATARS[i % AVATARS.length],
    username,
  };
});

export default function AdminTest() {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(DEMO);
  const [visible, setVisible] = useState(PAGE_SIZE_FIRST);
  const sentinelRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((u) => {
      return (
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.handle && u.handle.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.dept && u.dept.toLowerCase().includes(q)) ||
        (u.address && u.address.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q))
      );
    });
  }, [all, query]);

  const slice = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  useEffect(() => {
    setVisible(PAGE_SIZE_FIRST);
  }, [query]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE_NEXT, filtered.length));
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const handleDelete = (id) => {
    setAll((prev) => prev.filter((u) => u.id !== id));
  };

  const handleLogin = (username) => {
    const url = `${window.location.origin}/user/${encodeURIComponent(
      username
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="content-wrapper _scoped_admin"
      style={{ minHeight: "839px" }}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right" />
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {STATS.map((stat) => (
              <div
                className="col-lg-3 col-6"
                key={stat.label}>
                <div className={`small-box ${stat.color}`}>
                  <div className="inner">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                  <div className="icon">
                    <i className={stat.icon}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="card w-100">
              <div className="companyprosearchbox">
                <SearchBar
                  placeholder={SEARCH_PLACEHOLDER}
                  onChange={setQuery}
                  debounceMs={300}
                />
              </div>

              <div className="card-header">
                <h3 className="card-title">User Lists</h3>
              </div>

              <div className="card-body">
                <TableView
                  items={slice}
                  onDelete={handleDelete}
                  onLogin={handleLogin}
                />

                {visible < filtered.length && (
                  <div
                    ref={sentinelRef}
                    className="py-3 text-center text-muted">
                    Loading more...
                  </div>
                )}
                {filtered.length === 0 && (
                  <div className="py-4 text-center text-muted">
                    No results found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
