import styles from '../styles/AppShell.module.css';

export default function AppShell({ title, subtitle, children }) {
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              {/* book-open icon substitute */}
              <i className="pi pi-book" style={{ fontSize: 22, color: '#60a5fa' }} />
              <h1 className={styles.title}>{title}</h1>
            </div>
            <p className={styles.subtitle}>{subtitle}</p>
          </header>

          <div className={styles.content}>
            <div className="grid">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}