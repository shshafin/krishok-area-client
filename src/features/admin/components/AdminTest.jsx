import { useEffect, useMemo, useRef, useState } from "react";
import TableView from "./TableView";
import SearchBar from "./SearchBar";
import "../styles/adminScoped.css";

const PAGE_SIZE_FIRST = 30;
const PAGE_SIZE_NEXT = 20;

function normalizeUser(raw, idx) {
  // Map your real API fields here.
  // The HTML you shared shows: name, handle, email, dept, address, phone, id, avatar
  return {
    no: idx + 1,
    id: raw.id,
    name: raw.name,
    handle: raw.handle,
    email: raw.email,
    dept: raw.dept,
    address: raw.address,
    phone: raw.phone,
    avatar: raw.avatar, // url
    username: raw.handle || (raw.email ? raw.email.split("@")[0] : `user-${raw.id}`),
  };
}

// Demo dataset (use your fetch in production)
const DEMO = Array.from({ length: 120 }).map((_, i) =>
  normalizeUser(
    {
      id: 1000 - i,
      name: i % 5 === 0 ? "বরেন্দ্র বকুল" : i % 4 === 0 ? "rana khan" : i % 3 === 0 ? "MD.Momin Islam" : "User " + (i + 1),
      handle: i % 3 === 0 ? "mominrajshahikeshorhat" : i % 2 ? "newnamespaceojkasldkfl" : "ranakhan123",
      email: `user${i}@mailinator.com`,
      dept: ["রাজশাহী", "ঢাকা", "সিলেট", "ময়মনসিংহ", "বরিশাল"][i % 5],
      address: ["paba, rajshahi", "mohonpur, rajshahi", "tanor, rajshahi", "Paba. Raj", "shahmokhdum, rajshahi"][i % 5],
      phone: "017" + String(10000000 + i).slice(0, 8),
      avatar:
        i % 4
          ? "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&h=120&fit=crop&auto=format"
          : "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&h=120&fit=crop&auto=format",
    },
    i
  )
);

export default function AdminTest() {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(DEMO); // replace with fetched data
  const [visible, setVisible] = useState(PAGE_SIZE_FIRST);
  const sentinelRef = useRef(null);

  // Debounced query – do filtering in-memory (swap to server-side if needed)
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

  // Reset window size on new searches
  useEffect(() => {
    setVisible(PAGE_SIZE_FIRST);
  }, [query]);

  // Infinite load using IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible((v) => {
            const next = v + PAGE_SIZE_NEXT;
            return Math.min(next, filtered.length);
          });
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const handleDelete = (id) => {
    // TODO: call your API then update UI. Here we update immediately.
    setAll((prev) => prev.filter((u) => u.id !== id));
  };

  const handleLogin = (username) => {
    const url = `${window.location.origin}/user/${encodeURIComponent(username)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="content-wrapper _scoped_admin">
      {/* Header */}
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

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Search box (kept same classes/structure vibe) */}
          <div className="card w-100">
            <div className="companyprosearchbox">
              <SearchBar
                placeholder=" কীটনাশক পণ্য খোজ করুন "
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

              {/* Sentinel for infinite loading */}
              {visible < filtered.length && (
                <div ref={sentinelRef} className="py-3 text-center text-muted">
                  Loading more…
                </div>
              )}
              {filtered.length === 0 && (
                <div className="py-4 text-center text-muted">No results found</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}