import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import styles from "../styles/galleryTable.module.css";
import toast, { Toaster } from "react-hot-toast";
import StarRating from "@/components/ui/StarRating";

const PAGE_SIZE = 15;

/* fallback mock */
const MOCK = [
  {
    id: "1",
    name: { bn: "গ্রিন ভ্যালি এগ্রো ফার্ম", en: "Green Valley Agro Farm" },
    rating: 5.0,
    type: "কৃষি খামার",
    taglineBn: "জৈব সবজি চাষ",
    description:
      "জৈব পদ্ধতিতে সবজি চাষ ও বিক্রয়। তাজা ও নিরাপদ সবজি সরবরাহ।",
    location: "সাভার, ঢাকা",
    phone: "+880-1711-123456",
    email: "greenvalley@gmail.com",
    tags: ["টমেটো", "বেগুন", "শসা", "লাউ", "ধনিয়া"],
    ownership: "মোঃ রহিম উদ্দিন",
  },
  {
    id: "2",
    name: { bn: "অটো ক্রপ কেয়ার লিঃ", en: "Auto Crop Care Ltd" },
    rating: 4.2,
    type: "সরবরাহকারী",
    taglineBn: "উচ্চমানের বীজ ও সার",
    description: "দেশসেরা কৃষি উপকরণ সরবরাহ।",
    location: "চট্টগ্রাম",
    phone: "+880-1812-000111",
    email: "support@autocrop.com",
    tags: ["বীজ", "সার"],
    ownership: "মোঃ করিম",
  },
];

export default function SeedTable() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [first, setFirst] = useState(0);
  const [total, setTotal] = useState(0);

  const [global, setGlobal] = useState("");
  const [typing, setTyping] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  // fetch page (limit=15, offset, q)
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", String(PAGE_SIZE));
        params.set("offset", String(first));
        if (global.trim()) params.set("q", global.trim());

        const res = await fetch(`/api/companies?${params.toString()}`, {
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
          nameBn: it.name?.bn ?? it.nameBn ?? it.bn ?? "",
          nameEn: it.name?.en ?? it.nameEn ?? it.en ?? "",
          rating: typeof it.rating === "number" ? it.rating : Number(it.rating ?? 0),
          type: it.type ?? "",
          taglineBn: it.taglineBn ?? it.whatDoingBn ?? "",
          description: it.description ?? "",
          location: it.location ?? "",
          phone: it.phone ?? "",
          email: it.email ?? "",
          tags: Array.isArray(it.tags) ? it.tags : [],
          ownership: it.ownership ?? "",
        }));

        setRows(mapped);
        setTotal(count);
      } catch {
        // mock fallback (client-side slice + filter)
        const filtered = global
          ? MOCK.filter((x) =>
              [
                x.name.bn,
                x.name.en,
                x.type,
                x.taglineBn,
                x.location,
                x.phone,
                x.email,
                x.tags.join(" "),
                x.ownership,
              ]
                .join(" ")
                .toLowerCase()
                .includes(global.toLowerCase())
            )
          : MOCK;

        const mapped = filtered.slice(first, first + PAGE_SIZE).map((it, i) => ({
          id: it.id ?? String(first + i + 1),
          nameBn: it.name.bn,
          nameEn: it.name.en,
          rating: it.rating,
          type: it.type,
          taglineBn: it.taglineBn,
          description: it.description,
          location: it.location,
          phone: it.phone,
          email: it.email,
          tags: it.tags,
          ownership: it.ownership,
        }));

        setRows(mapped);
        setTotal(filtered.length);
        toast.error("Using mock data (fetch failed)");
      } finally {
        setLoading(false);
        setTyping(false);
      }
    }, typing ? 250 : 0); // debounce while typing

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
          placeholder="Search name, type, location…"
          className={styles.searchInput}
        />
      </span>
    </div>
  );

  // cells (reuse existing helper styles: itemCell, itemBn, itemEn, qualityChip, priceCell/unit)
  const nameBody = (row) => (
    <div className={styles.itemCell}>
      <div className={styles.itemBn}>{row.nameBn}</div>
      <div className={styles.itemEn}>{row.nameEn}</div>
    </div>
  );

  const ratingBody = (row) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <StarRating value={Number(row.rating)} disabled size={18} />
      <span style={{ fontWeight: 700 }}>
        {Number(row.rating).toFixed(1)}
      </span>
    </div>
  );

  const typeBody = (row) => (
    <span className={styles.qualityChip}>{row.type || "—"}</span>
  );

  const taglineBody = (row) => (
    <div className={styles.priceCell}>
      <div className={styles.priceNow}>
        {row.taglineBn || "—"}
      </div>
      <div className={styles.pricePrevMuted}>
        {row.description ? (row.description.length > 48 ? row.description.slice(0, 48) + "…" : row.description) : "—"}
      </div>
    </div>
  );

  const contactBody = (row) => (
    <div className={styles.priceCell}>
      <div className={styles.priceNow}>{row.location || "—"}</div>
      <div className={styles.pricePrev}>
        {row.phone || "—"} <span className={styles.unit}> · </span> {row.email || "—"}
      </div>
    </div>
  );

  const tagsBody = (row) => {
    const t = row.tags || [];
    const shown = t.slice(0, 3);
    const rest = t.length - shown.length;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {shown.map((tag, i) => (
          <span key={`${tag}-${i}`} className={styles.qualityChip}>{tag}</span>
        ))}
        {rest > 0 && <span className={styles.qualityChip}>+{rest}</span>}
        {t.length === 0 && <span className={styles.pricePrevMuted}>—</span>}
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

  const globalFields = useMemo(
    () => ["nameBn", "nameEn", "type", "taglineBn", "location", "phone", "email", "ownership"],
    []
  );

  const handleDelete = async () => {
    if (!confirmItem) return;
    const id = confirmItem.id;
    setConfirmOpen(false);
    const prev = rows;

    setRows((r) => r.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
    } catch {
      setRows(prev);
      toast.error("Delete failed");
    }
  };

  return (
    <div className={styles.wrap}>
      <Toaster position="top-right" />
      
      <NavLink to="new" className="create">New</NavLink>
      <br /><br />

      <DataTable
        value={rows}
        dataKey="id"
        loading={loading}
        responsiveLayout="scroll"
        paginator
        rows={PAGE_SIZE}
        first={first}
        totalRecords={total}
        onPage={onPage}
        lazy
        header={header}
        globalFilter={global}
        globalFilterFields={globalFields}
        showGridlines
        emptyMessage="No companies"
        className={styles.table}
      >
        <Column header="Company" body={nameBody} sortable sortField="nameEn" />
        <Column header="Rating" body={ratingBody} style={{ width: 180, textAlign: "center" }} />
        <Column header="Type" body={typeBody} style={{ width: 180 }} />
        <Column header="What doing / Desc" body={taglineBody} />
        <Column header="Contact" body={contactBody} />
        <Column header="Tags" body={tagsBody} style={{ width: 220 }} />
        <Column header="Actions" body={actionsBody} style={{ width: 180, textAlign: "center" }} />
      </DataTable>

      {/* Confirm delete — same dialog look */}
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
          <h3 className={styles.confirmTitle}>Delete company?</h3>
          <p className={styles.confirmText}>
            {confirmItem?.nameBn ? `“${confirmItem.nameBn}”` : "This company"} will be permanently removed.
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
    </div>
  );
}