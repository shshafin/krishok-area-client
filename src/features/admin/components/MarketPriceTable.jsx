import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import styles from "../styles/galleryTable.module.css";
import toast, { Toaster } from "react-hot-toast";

const PAGE_SIZE = 20;

/* fallback mock that matches your form’s payload shape */
const MOCK = Array.from({ length: 43 }).map((_, i) => {
  const unit = i % 3 === 0 ? "কেজি" : i % 3 === 1 ? "লিটার" : "পিস";
  const price = 50 + (i % 10);
  const prev = price + (i % 2 === 0 ? -2 : 2);
  const dir = price > prev ? "up" : price < prev ? "down" : "flat";
  return {
    id: String(i + 1),
    categoryBn: ["ধান", "সবজি", "মসলা", "ডাল"][i % 4],
    item: {
      bn: ["চাল", "আলু", "পেঁয়াজ", "মসুর"][i % 4],
      en: ["Rice", "Potato", "Onion", "Lentil"][i % 4],
    },
    quality: ["উত্তম", "মাঝারি", "নিম্ন"][i % 3],
    price: { value: price, currency: "BDT", symbol: "৳", unit },
    previousPrice: { value: prev, currency: "BDT", symbol: "৳", unit },
    location: ["কাওরান বাজার", "চট্টগ্রাম", "রাজশাহী", "খুলনা"][i % 4],
    trend: { direction: dir, change: Math.abs(price - prev) },
  };
});

const trendIcon = (d) =>
  d === "up"
    ? "pi pi-arrow-up-right"
    : d === "down"
    ? "pi pi-arrow-down-right"
    : "pi pi-minus";

export default function MarketPriceTable() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [first, setFirst] = useState(0);
  const [total, setTotal] = useState(0);

  const [global, setGlobal] = useState("");
  const [typing, setTyping] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  // fetch page (limit=20, offset, q)
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

          const res = await fetch(`/api/market-prices?${params.toString()}`, {
            signal: ctrl.signal,
          });
          if (!res.ok) throw new Error("bad status");
          const body = await res.json();

          const list = Array.isArray(body) ? body : body.items ?? [];
          const count =
            body.total ??
            Number(res.headers.get("x-total-count")) ??
            list.length;

          const mapped = list.map((it, i) => {
            const price = it.price?.value ?? 0;
            const prev = it.previousPrice?.value ?? null;
            const unit = it.price?.unit ?? "";
            const dir =
              it.trend?.direction ??
              (prev == null
                ? "flat"
                : price > prev
                ? "up"
                : price < prev
                ? "down"
                : "flat");
            const change =
              it.trend?.change ?? (prev == null ? 0 : Math.abs(price - prev));
            return {
              id: it.id ?? String(first + i + 1),
              category: it.categoryBn ?? "",
              itemBn: it.item?.bn ?? "",
              itemEn: it.item?.en ?? "",
              quality: it.quality ?? "",
              priceVal: price,
              priceUnit: unit,
              priceSymbol: it.price?.symbol ?? "৳",
              prevVal: prev,
              prevUnit: it.previousPrice?.unit ?? unit,
              location: it.location ?? "",
              trend: { direction: dir, change },
            };
          });

          setRows(mapped);
          setTotal(count);
        } catch {
          // mock fallback
          const filtered = global
            ? MOCK.filter((x) => {
                const hay = [
                  x.categoryBn,
                  x.item?.bn,
                  x.item?.en,
                  x.quality,
                  x.location,
                  x.price?.unit,
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();
                return hay.includes(global.toLowerCase());
              })
            : MOCK;

          const mapped = filtered
            .slice(first, first + PAGE_SIZE)
            .map((it, i) => ({
              id: it.id ?? String(first + i + 1),
              category: it.categoryBn ?? "",
              itemBn: it.item?.bn ?? "",
              itemEn: it.item?.en ?? "",
              quality: it.quality ?? "",
              priceVal: it.price?.value ?? 0,
              priceUnit: it.price?.unit ?? "",
              priceSymbol: it.price?.symbol ?? "৳",
              prevVal: it.previousPrice?.value ?? null,
              prevUnit: it.previousPrice?.unit ?? it.price?.unit ?? "",
              location: it.location ?? "",
              trend: it.trend ?? { direction: "flat", change: 0 },
            }));

          setRows(mapped);
          setTotal(filtered.length);
          toast.error("Using mock data (fetch failed)");
        } finally {
          setLoading(false);
          setTyping(false);
        }
      },
      typing ? 300 : 0
    );

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
          placeholder="Search category, item, location…"
          className={styles.searchInput}
        />
      </span>
    </div>
  );

  // cells
  const itemBody = (row) => (
    <div className={styles.itemCell}>
      <div className={styles.itemBn}>{row.itemBn}</div>
      <div className={styles.itemEn}>{row.itemEn}</div>
    </div>
  );

  const qualityBody = (row) => (
    <span className={styles.qualityChip}>{row.quality}</span>
  );

  const priceBody = (row) => (
    <div className={styles.priceCell}>
      <div className={styles.priceNow}>
        {row.priceSymbol}
        {Number(row.priceVal).toLocaleString()}{" "}
        <span className={styles.unit}>/ {row.priceUnit}</span>
      </div>
      {row.prevVal != null ? (
        <div className={styles.pricePrev}>
          Prev: {row.priceSymbol}
          {Number(row.prevVal).toLocaleString()}{" "}
          <span className={styles.unit}>/ {row.prevUnit}</span>
        </div>
      ) : (
        <div className={styles.pricePrevMuted}>Prev: —</div>
      )}
    </div>
  );

  const trendBody = (row) => (
    <div
      className={`${styles.trendWrap} ${
        row.trend?.direction === "up"
          ? styles.trendUp
          : row.trend?.direction === "down"
          ? styles.trendDown
          : styles.trendFlat
      }`}
    >
      <i className={trendIcon(row.trend?.direction)} />
      <span className={styles.trendTxt}>
        {row.trend?.direction === "flat" ? "No change" : `${row.trend?.change}`}
      </span>
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

  const globalFields = useMemo(
    () => ["category", "itemBn", "itemEn", "quality", "location", "priceUnit"],
    []
  );

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
        emptyMessage="No market price entries"
        className={styles.table}
      >
        <Column field="category" header="Category" sortable />
        <Column header="Item" body={itemBody} />
        <Column header="Quality" body={qualityBody} />
        <Column header="Price" body={priceBody} />
        <Column field="location" header="Location" sortable />
        <Column header="Trend" body={trendBody} />
        <Column header="Actions" body={actionsBody} />
      </DataTable>

      {/* Confirm delete — reusing your dialog look */}
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
          <h3 className={styles.confirmTitle}>Delete item?</h3>
          <p className={styles.confirmText}>
            {confirmItem?.itemBn ? `“${confirmItem.itemBn}”` : "This item"} will
            be permanently removed.
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
            onClick={async () => {
              if (!confirmItem) return;
              const id = confirmItem.id;
              setConfirmOpen(false);
              const prev = rows;
              setRows((r) => r.filter((x) => x.id !== id));
              try {
                const res = await fetch(`/api/market-prices/${id}`, {
                  method: "DELETE",
                });
                if (!res.ok) throw new Error();
                toast.success("Deleted");
              } catch {
                setRows(prev);
                toast.error("Delete failed");
              }
            }}
          >
            Delete
          </button>
        </div>
      </Dialog>
    </div>
  );
}
