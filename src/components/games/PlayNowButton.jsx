import styles from './PlayNowButton.module.css'

export default function PlayNowButton({ onClick, disabled = false, loading = false, label = 'Play Now', ariaLabel }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
    >
      <span>{loading ? 'Starting...' : disabled ? 'Need 20 Tokens' : label}</span>
      {!loading && !disabled && <span className={styles.arrow} aria-hidden="true">→</span>}
    </button>
  )
}
