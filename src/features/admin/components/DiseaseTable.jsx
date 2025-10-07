import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import styles from "../styles/galleryTable.module.css";

/* react-hot-toast (messages) */
import toast, { Toaster } from "react-hot-toast";

/* Lightbox (yet-another-react-lightbox) */
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const PAGE_SIZE = 15;

/* fallback mock */
const MOCK = Array.from({ length: 43 }).map((_, i) => ({
  id: String(i + 1),
  images: [
    `https://images.unsplash.com/photo-1526318472351-c75fcf070305?sig=${i + 1}`,
    `https://images.unsplash.com/photo-1524594227085-7f6a34a3b163?sig=${i + 101}`,
    `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?sig=${i + 201}`,
  ],
  title: `Disease #${i + 1}`,
  description: "Demo disease entry for development",
  lists: {
    symptoms: ["পাতায় দাগ", "গোড়া পচা"].slice(0, (i % 2) + 1),
    actions: ["রোগনাশক প্রয়োগ", "ক্ষেতে বাতাস চলাচল নিশ্চিত"].slice(0, (i % 2) + 1),
  },
}));

export default function DiseaseTable() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // lazy pagination
  const [first, setFirst] = useState(0);
  const [total, setTotal] = useState(0);

  // search
  const [global, setGlobal] = useState("");
  const [typing, setTyping] = useState(false);

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  // lightbox
  const [lbOpen, setLbOpen] = useState(false);
  const [lbSlides, setLbSlides] = useState([]);

  // page cache: key = `${q}|${offset}`
  const cacheRef = useRef(new Map());
  const warnedRef = useRef(false);

  const mapApiItems = (list, offset) =>
    list.map((it, i) => ({
      id: it.id ?? String(offset + i + 1),
      images: Array.isArray(it.images) ? it.images.slice(0, 3) : [],
      title: it.title ?? it.disease?.bn ?? "",
      description: it.description ?? it.disease?.en ?? "",
      lists: {
        symptoms: it.lists?.symptoms ?? it.symptoms ?? [],
        actions: it.lists?.actions ?? it.actions ?? [],
      },
    }));

  const fetchPage = async (offset, q, signal) => {
    const params = new URLSearchParams();
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String(offset));
    if (q) params.set("q", q);

    const res = await fetch(`/api/diseases?${params.toString()}`, { signal });
    if (!res.ok) throw new Error("bad status");
    const body = await res.json();
    const list = Array.isArray(body) ? body : body.items ?? [];
    const count = body.total ?? Number(res.headers.get("x-total-count")) ?? list.length;

    const page = mapApiItems(list, offset);
    return { page, count };
  };

  // main loader with caching + prefetch next page
  useEffect(() => {
    const q = global.trim();
    const key = `${q}|${first}`;

    const ctrl = new AbortController();
    const run = async () => {
      setLoading(true);

      // 1) serve from cache immediately
      if (cacheRef.current.has(key)) {
        const cached = cacheRef.current.get(key);
        setRows(cached.page);
        setTotal(cached.count);
        setLoading(false);
      }

      // 2) fetch (to refresh cache / or first time)
      try {
        const { page, count } = await fetchPage(first, q, ctrl.signal);
        cacheRef.current.set(key, { page, count });
        setRows(page);
        setTotal(count);

        // 3) prefetch next page in background
        const nextOffset = first + PAGE_SIZE;
        const nextKey = `${q}|${nextOffset}`;
        if (!cacheRef.current.has(nextKey) && nextOffset < count) {
          fetchPage(nextOffset, q).then(({ page, count }) => {
            cacheRef.current.set(nextKey, { page, count });
          }).catch(() => {});
        }
      } catch {
        // mock fallback (client slice)
        const filtered = q
          ? MOCK.filter(
              (x) =>
                x.title.toLowerCase().includes(q.toLowerCase()) ||
                x.description.toLowerCase().includes(q.toLowerCase())
            )
          : MOCK;
        const page = filtered.slice(first, first + PAGE_SIZE);
        setRows(page);
        setTotal(filtered.length);
        if (!warnedRef.current) {
          toast.error("Using mock data (fetch failed)");
          warnedRef.current = true;
        }
      } finally {
        setLoading(false);
        setTyping(false);
      }
    };

    // debounce only when typing
    const t = setTimeout(run, typing ? 250 : 0);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [first, global, typing]);

  // reset paging & cache when search changes
  useEffect(() => {
    setFirst(0);
    cacheRef.current.clear();
  }, [global]);

  const onPage = (e) => setFirst(e.first);

  const header = (
    <div className={styles.header}>
      <span className={`p-input-icon-left ${styles.search}`}>
        <i className="pi pi-search" />
        <InputText
          value={global}
          onChange={(e) => {
            setGlobal(e.target.value);
            setTyping(true);
          }}
          placeholder="Search title/description…"
          className={styles.searchInput}
        />
      </span>
    </div>
  );

  const openLightboxForRow = (row) => {
    const slides = (row.images || []).map((src) => ({ src, alt: row.title || "image" }));
    setLbSlides(slides);
    setLbOpen(true);
  };

  const mediaBody = (row) => {
    const imgs = row.images?.slice(0, 3) ?? [];
    return (
      <button
        type="button"
        className={styles.mediaWrap}
        onClick={() => openLightboxForRow(row)}
        title="Open preview"
        style={{ padding: 2 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            width: "100%",
            height: "100%",
          }}
        >
          {imgs.map((src, i) => (
            <img
              key={i}
              className={styles.media}
              src={src}
              alt={`image ${i + 1}`}
              loading="lazy"
              decoding="async"
            />
          ))}
          {imgs.length === 0 && (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                color: "#8892a6",
                fontSize: 12,
                gridColumn: "1 / -1",
              }}
            >
              No images
            </div>
          )}
        </div>
      </button>
    );
  };

  const listsBody = (row) => {
    const s = row.lists?.symptoms?.length ?? 0;
    const a = row.lists?.actions?.length ?? 0;
    return (
      <div className={styles.priceCell}>
        <div className={styles.priceNow}>
          রোগের লক্ষণ: {s} <span className={styles.unit}>items</span>
        </div>
        <div className={styles.pricePrev}>
          করনীয়: {a} <span className={styles.unit}>items</span>
        </div>
      </div>
    );
  };

  const actionsBody = (row) => (
    <div className={styles.actions}>
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.btnEdit}`}
        onClick={() => navigate(`edit?id=${encodeURIComponent(row.id)}`)}
        aria-label="Edit"
        title="Edit"
      >
        <i className="pi pi-pencil" />
      </button>
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.btnDelete}`}
        onClick={() => {
          setConfirmItem(row);
          setConfirmOpen(true);
        }}
        aria-label="Delete"
        title="Delete"
      >
        <i className="pi pi-trash" />
      </button>
    </div>
  );

  const filteredFields = useMemo(() => ["title", "description"], []);

  const handleDelete = async () => {
    if (!confirmItem) return;
    const id = confirmItem.id;
    setConfirmOpen(false);
    const prev = rows;

    setRows((r) => r.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/diseases/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      // invalidate caches that might contain this id
      cacheRef.current = new Map();
    } catch {
      setRows(prev);
      toast.error("Delete failed");
    }
  };

  return (
    <div className={styles.wrap}>
      <NavLink to="new" className="create">New</NavLink>
      <br /><br />

      <Toaster position="top-right" />

      <DataTable
        value={rows}
        dataKey="id"
        loading={loading}
        responsiveLayout="scroll"
        paginator
        rows={PAGE_SIZE}           /* 15 per page */
        first={first}
        totalRecords={total}
        onPage={onPage}
        lazy
        header={header}
        globalFilter={global}
        globalFilterFields={filteredFields}
        showGridlines
        emptyMessage="No disease items"
        className={styles.table}
      >
        <Column header="Media" body={mediaBody} style={{ width: 240 }} />
        <Column field="title" header="Title" sortable />
        <Column field="description" header="Description" sortable />
        <Column header="Lists" body={listsBody} style={{ width: 220 }} />
        <Column header="Actions" body={actionsBody} style={{ width: 180, textAlign: "center" }} />
      </DataTable>

      <Dialog
        visible={confirmOpen}
        onHide={() => setConfirmOpen(false)}
        closable={false}
        modal
        className={styles.confirm}
        draggable={false}
      >
        <div className={styles.confirmBody}>
          <div className={styles.confirmIcon}><i className="pi pi-trash" /></div>
          <h3 className={styles.confirmTitle}>Delete item?</h3>
          <p className={styles.confirmText}>
            {confirmItem?.title ? `“${confirmItem.title}”` : "This item"} will be permanently removed.
          </p>
        </div>
        <div className={styles.confirmActions}>
          <button type="button" className={styles.ghostBtn} onClick={() => setConfirmOpen(false)}>
            Cancel
          </button>
          <button type="button" className={styles.dangerBtn} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Dialog>

      <Lightbox
        open={lbOpen}
        close={() => setLbOpen(false)}
        slides={lbSlides}
        plugins={[Zoom]}
        carousel={{ finite: true }}
      />
    </div>
  );
}