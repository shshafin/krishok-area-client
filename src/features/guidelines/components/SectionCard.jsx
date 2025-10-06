import styles from '../styles/SectionCard.module.css';

export default function SectionCard({ title, icon, tone = 'default', children }) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <i className={icon} />
          <span>{title}</span>
        </h3>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}