import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Badge from "../components/Badge.jsx";
import styles from "../styles/Tables.module.css";

/**
 * rows shape (example)
 * {
 *   crop: 'ধান',
 *   common: { items: ['জাব পোকা','থ্রিপস','বলওয়ার্ম'], extra: 4 },
 *   recommended: ['রিপকর্ড ১০ ইসি', 'কনফিডোর ২০০ এসএএল'],
 *   images: ['url1','url2','url3']
 * }
 */
export default function HarmfulInsectsTable({ rows = [] }) {
  const commonBody = (row) => (
    <div className={styles.flexWrap}>
      {row.common.items.map((t, i) => (
        <Badge key={i} tone="danger">
          {t}
        </Badge>
      ))}
      {row.common.extra ? (
        <span className={styles.extra}>+{row.common.extra}</span>
      ) : null}
    </div>
  );

  const recommendedBody = (row) => (
    <div className={styles.flexWrap}>
      {row.recommended.map((t, i) => (
        <Badge key={i} tone="success">
          {t}
        </Badge>
      ))}
    </div>
  );

  const imageBody = (row) => (
    <div className={styles.imgWrap}>
      {row.images.slice(0, 3).map((src, i) => (
        <img key={i} src={src} alt="Pest" className={styles.thumb} />
      ))}
    </div>
  );

  return (
    <DataTable
      value={rows}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 20]}
      className={styles.pTable}
      stripedRows
      size="small"
      responsiveLayout="scroll"
      emptyMessage="No data"
      tableStyle={{
        width: "100%",
        /* minimum useful width that still fits at 250px thanks to scroll */
        minWidth: "clamp(18rem, 70vw, 64rem)",
      }}
    >
      <Column field="crop" header="ফসল" bodyClassName={styles.cropCol} />
      <Column header="সাধারণ বালাই" body={commonBody} />
      <Column header="প্রস্তাবিত কীটনাশক" body={recommendedBody} />
      <Column header="ছবি" body={imageBody} />
    </DataTable>
  );
}
