import styles from '../styles/Badge.module.css';

export default function Badge({ children, tone = 'neutral' }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}