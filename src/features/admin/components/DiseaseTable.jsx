import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import styles from "../styles/galleryTable.module.css";
import toast, { Toaster } from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const PAGE_SIZE = 10;

const MOCK = Array.from({ length: 40 }).map((_, i) => ({
  id: String(i + 1),
  images: [
    `https://picsum.photos/200/300`,
    `https://picsum.photos/200/320`,
    `https://picsum.photos/210/300`,
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

  const [first, setFirst] = useState(0);
  const [total, setTotal] = useState(0);

  const [global, setGlobal] = useState("");
  const [typing, setTyping] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  const [lbOpen, setLbOpen] = useState(false);
  const [lbSlides, setLbSlides] = useState([]);

  // global sequential loader gate over the page's thumbnails (0..rows*3-1)
  const [thumbGate, setThumbGate] = useState(0);
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

    return { page: mapApiItems(list, offset), count };
  };

  useEffect(() => {
    const q = global.trim();
    const ctrl = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const { page, count } = await fetchPage(first, q, ctrl.signal);
        setRows(page);
        setTotal(count);
      } catch {
        const list = q
          ? MOCK.filter(
              (x) =>
                x.title.toLowerCase().includes(q.toLowerCase()) ||
                x.description.toLowerCase().includes(q.toLowerCase())
            )
          : MOCK;
        const page = list.slice(first, first + PAGE_SIZE);
        setRows(page);
        setTotal(list.length);
        if (!warnedRef.current) {
          toast.error("Using mock data (fetch failed)");
          warnedRef.current = true;
        }
      } finally {
        setLoading(false);
        setTyping(false);
      }
    };
    const t = setTimeout(run, typing ? 200 : 0);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [first, global, typing]);

  // reset loader sequence when page / query / list size changes
  useEffect(() => {
    setThumbGate(0);
  }, [first, global, rows.length]);

  // auto-skip missing images so gate never stalls
  useEffect(() => {
    const rowIndex = Math.floor(thumbGate / 3);
    const imgIndex = thumbGate % 3;
    const row = rows[rowIndex];
    if (!row) return;
    const src = row.images?.[imgIndex];
    if (!src) {
      setThumbGate((g) => (g === rowIndex * 3 + imgIndex ? g + 1 : g));
    }
  }, [thumbGate, rows]);

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
            setFirst(0);
          }}
          placeholder="Search title/description…"
          className={styles.searchInput}
        />
      </span>
    </div>
  );

  const openLightboxForRow = useCallback((row) => {
    const slides = [];
    if (row.images && row.images[0]) slides.push({ src: row.images[0], alt: row.title || "image" });
    if (row.images && row.images[1]) slides.push({ src: row.images[1], alt: row.title || "image" });
    if (row.images && row.images[2]) slides.push({ src: row.images[2], alt: row.title || "image" });
    setLbSlides(slides);
    setLbOpen(true);
  }, []);

  // 3 thumbnails per row, no loops; sequential loading via a global gate
  const mediaBody = useCallback((row, { rowIndex }) => {
    const s0 = row.images?.[0] || "";
    const s1 = row.images?.[1] || "";
    const s2 = row.images?.[2] || "";

    const base = rowIndex * 3;
    const show0 = s0 && thumbGate >= base;
    const show1 = s1 && thumbGate >= base + 1;
    const show2 = s2 && thumbGate >= base + 2;

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
          {/* img #1 */}
          {s0 ? (
            <img
              className={styles.media}
              alt={row.title || "image"}
              src={show0 ? s0 : undefined}
              loading="eager"
              decoding="async"
              onLoad={() => setThumbGate((g) => (g === base ? g + 1 : g))}
              onError={() => setThumbGate((g) => (g === base ? g + 1 : g))}
            />
          ) : (
            <div />
          )}

          {/* img #2 */}
          {s1 ? (
            <img
              className={styles.media}
              alt={row.title || "image"}
              src={show1 ? s1 : undefined}
              loading="eager"
              decoding="async"
              onLoad={() => setThumbGate((g) => (g === base + 1 ? g + 1 : g))}
              onError={() => setThumbGate((g) => (g === base + 1 ? g + 1 : g))}
            />
          ) : (
            <div />
          )}

          {/* img #3 */}
          {s2 ? (
            <img
              className={styles.media}
              alt={row.title || "image"}
              src={show2 ? s2 : undefined}
              loading="eager"
              decoding="async"
              onLoad={() => setThumbGate((g) => (g === base + 2 ? g + 1 : g))}
              onError={() => setThumbGate((g) => (g === base + 2 ? g + 1 : g))}
            />
          ) : (
            <div />
          )}
        </div>
      </button>
    );
  }, [openLightboxForRow, thumbGate]);

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
        rows={PAGE_SIZE}   /* 10 per page */
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
          <button type="button" className={styles.ghostBtn} onClick={() => setConfirmOpen(false)}>Cancel</button>
          <button type="button" className={styles.dangerBtn} onClick={handleDelete}>Delete</button>
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