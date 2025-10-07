import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Video from "yet-another-react-lightbox/plugins/video";

const PAGE_SIZE = 20;

/* infer type */
const mediaType = (url = "", explicit) => {
  if (explicit) return explicit;
  const ext = url.split(".").pop()?.toLowerCase();
  return ["mp4", "webm", "mov", "m4v", "ogg"].includes(ext) ? "video" : "image";
};

/* fallback mock */
const MOCK = Array.from({ length: 43 }).map((_, i) => ({
  id: String(i + 1),
  url:
    i % 4 === 0
      ? "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      : "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  title: i % 4 === 0 ? `Video #${i + 1}` : `Image #${i + 1}`,
  description: "Demo item for development",
  type: i % 4 === 0 ? "video" : "image",
}));

export default function GalleryTable() {
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
  const [lbIndex, setLbIndex] = useState(0);

  // fetch page (server-friendly: limit=20 & offset)
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", String(PAGE_SIZE));
        params.set("offset", String(first));
        if (global.trim()) params.set("q", global.trim());

        const res = await fetch(`/api/gallery?${params.toString()}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("bad status");
        const body = await res.json();

        const list = Array.isArray(body) ? body : body.items ?? [];
        const count =
          body.total ??
          Number(res.headers.get("x-total-count")) ??
          list.length;

        const mapped = list.map((it, i) => ({
          id: it.id ?? String(first + i + 1),
          url: it.url,
          title: it.title ?? "",
          description: it.description ?? "",
          type: mediaType(it.url, it.type),
        }));

        setRows(mapped);
        setTotal(count);
      } catch {
        // mock fallback (client-side slice)
        const filtered = global
          ? MOCK.filter(
              (x) =>
                x.title.toLowerCase().includes(global.toLowerCase()) ||
                x.description.toLowerCase().includes(global.toLowerCase())
            )
          : MOCK;
        setTotal(filtered.length);
        setRows(filtered.slice(first, first + PAGE_SIZE));
        toast.error("Using mock data (fetch failed)");
      } finally {
        setLoading(false);
        setTyping(false);
      }
    }, typing ? 300 : 0); // debounce when typing

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [first, global, typing]);

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

  const openLightboxAt = (row) => {
    const idx = rows.findIndex((r) => r.id === row.id);
    setLbIndex(Math.max(0, idx));
    setLbOpen(true);
  };

  const mediaBody = (row) => {
    const kind = mediaType(row.url, row.type);
    return (
      <button
        type="button"
        className={styles.mediaWrap}
        onClick={() => openLightboxAt(row)}
        title="Open preview"
      >
        {kind === "video" ? (
          <video className={styles.media} src={row.url} muted />
        ) : (
          <img className={styles.media} src={row.url} alt={row.title || "media"} />
        )}
      </button>
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

  const filteredFields = useMemo(() => ["title", "description", "type"], []);

  const handleDelete = async () => {
    if (!confirmItem) return;
    const id = confirmItem.id;
    setConfirmOpen(false);
    const prev = rows;

    setRows((r) => r.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
    } catch {
      setRows(prev);
      toast.error("Delete failed");
    }
  };

  /* slides for yet-another-react-lightbox */
  const slides = rows.map((r) =>
    r.type === "video"
      ? {
          type: "video",
          sources: [{ src: r.url, type: "video/mp4" }],
          description: r.title || "",
        }
      : {
          src: r.url,
          alt: r.title || "image",
          description: r.description || "",
        }
  );

  return (
    <div className={styles.wrap}>
      {/* react-hot-toast portal */}
      <Toaster position="top-right" />

      <DataTable
        value={rows}
        dataKey="id"
        loading={loading}
        responsiveLayout="scroll"
        paginator
        rows={PAGE_SIZE}           /* 20 per page */
        first={first}
        totalRecords={total}
        onPage={onPage}
        lazy
        header={header}
        globalFilter={global}
        globalFilterFields={filteredFields}
        showGridlines
        emptyMessage="No gallery items"
        className={styles.table}
      >
        <Column header="Media" body={mediaBody} style={{ width: 200 }} />
        <Column field="title" header="Title" sortable />
        <Column field="description" header="Description" sortable />
        <Column header="Actions" body={actionsBody} style={{ width: 180, textAlign: "center" }} />
      </DataTable>

      {/* Confirm delete — large, colored, no outlines */}
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

      {/* Lightbox (zoom + video) */}
      <Lightbox
        open={lbOpen}
        close={() => setLbOpen(false)}
        index={lbIndex}
        slides={slides}
        plugins={[Zoom, Video]}
        carousel={{ finite: true }}
      />
    </div>
  );
}