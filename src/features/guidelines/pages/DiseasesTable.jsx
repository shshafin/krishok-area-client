import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Badge from '../components/Badge.jsx';
import styles from '../styles/Tables.module.css';


export default function DiseasesTable({ rows = [] }) {
  const diseaseBody = (row) => (
    <div className={styles.flexWrap}>
      {row.diseases.items.map((t, i) => (
        <Badge key={i} tone="danger">{t}</Badge>
      ))}
      {row.diseases.extra ? <span className={styles.extra}>+{row.diseases.extra}</span> : null}
    </div>
  );

  const recommendedBody = (row) => (
    <div className={styles.flexWrap}>
      {row.recommended.map((t, i) => (
        <Badge key={i} tone="success">{t}</Badge>
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
    >
      <Column field="crop" header="ফসল" bodyClassName={styles.cropCol} />
      <Column header="সাধারণ বালাই" body={diseaseBody} />
      <Column header="প্রস্তাবিত কীটনাশক" body={recommendedBody} />
      <Column header="ছবি" body={imageBody} />
    </DataTable>
  );
}