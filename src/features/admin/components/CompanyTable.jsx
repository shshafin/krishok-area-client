import { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import styles from "../styles/galleryTable.module.css"
import toast, { Toaster } from "react-hot-toast";

/* Your rating component */
import StarRating from "@/components/ui/StarRating";

const PAGE_SIZE = 20;

/* Fallback mock — includes your example */
const MOCK = [
  {
    id: "1",
    nameBn: "অটো ক্রপ কেয়ার লিঃ",
    nameEn: "Auto Crop Care Ltd",
    rating: 4.2,
    location: "চট্টগ্রাম, বাংলাদেশ",
  },
  {
    id: "2",
    nameBn: "আবেদিন ক্রপ কেয়ার লিঃ",
    nameEn: "Abedin Crop Care Ltd",
    rating: 4.5,
    location: "ঢাকা, বাংলাদেশ",
  },
  {
    id: "3",
    nameBn: "গ্রিন এগ্রো সল্যুশন",
    nameEn: "Green Agro Solution",
    rating: 3.9,
    location: "রাজশাহী, বাংলাদেশ",
  },
];

export default function CompanyTable() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [first, setFirst] = useState(0);
  const [total, setTotal] = useState(0);

  const [global, setGlobal] = useState("");
  const [typing, setTyping] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  // fetch page (server-friendly: limit, offset, q)
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(
      async () => {
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
            nameBn: it.nameBn ?? it.bn ?? "",
            nameEn: it.nameEn ?? it.en ?? "",
            rating:
              typeof it.rating === "number"
                ? it.rating
                : Number(it.rating ?? 0),
            location: it.location ?? "",
          }));

          setRows(mapped);
          setTotal(count);
        } catch {
          // mock fallback (client-side slice + simple filter)
          const filtered = global
            ? MOCK.filter((x) =>
                [x.nameBn, x.nameEn, x.location]
                  .join(" ")
                  .toLowerCase()
                  .includes(global.toLowerCase())
              )
            : MOCK;

          setTotal(filtered.length);
          setRows(filtered.slice(first, first + PAGE_SIZE));
          toast.error("Using mock data (fetch failed)");
        } finally {
          setLoading(false);
          setTyping(false);
        }
      },
      typing ? 300 : 0
    ); // debounce typing

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
          placeholder="Search company or location…"
          className={styles.searchInput}
        />
      </span>
    </div>
  );

  // cells
  const companyBody = (row) => (
    <div className={styles.companyCell}>
      <div className={styles.companyBn}>{row.nameBn}</div>
      <div className={styles.companyEn}>{row.nameEn}</div>
    </div>
  );

  const ratingBody = (row) => (
    <div
      className={styles.ratingWrap}
      title={`${Number(row.rating).toFixed(1)} / 5`}
    >
      <StarRating value={Number(row.rating)} />
      <span className={styles.ratingVal}>{Number(row.rating).toFixed(1)}</span>
    </div>
  );

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

  const globalFields = useMemo(() => ["nameBn", "nameEn", "location"], []);

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

      <NavLink to="new" className="create">
        New
      </NavLink>
      <br />
      <br />

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
        <Column
          header="Company"
          body={companyBody}
          sortable
          sortField="nameEn"
        />
        <Column
          header="Rating"
          body={ratingBody}
          style={{ width: 180, textAlign: "center" }}
        />
        <Column field="location" header="Location" sortable />
        <Column
          header="Actions"
          body={actionsBody}
          style={{ width: 180, textAlign: "center" }}
        />
      </DataTable>

      {/* Confirm delete — reuse your dialog look */}
      <Dialog
        visible={confirmOpen}
        onHide={() => setConfirmOpen(false)}
        closable={false}
        modal
        className={styles.confirm}
        draggable={false}
      >
        <div className={styles.confirmBody}>
          <div className={styles.confirmIcon}>
            <i className="pi pi-trash" />
          </div>
          <h3 className={styles.confirmTitle}>Delete company?</h3>
          <p className={styles.confirmText}>
            {confirmItem?.nameBn ? `“${confirmItem.nameBn}”` : "This company"}{" "}
            will be permanently removed.
          </p>
        </div>
        <div className={styles.confirmActions}>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Dialog>
    </div>
  );
}
