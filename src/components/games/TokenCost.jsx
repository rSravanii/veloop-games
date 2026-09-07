import styles from './TokenCost.module.css'

export default function TokenCost({ amount = 20, compact = false }) {
  return (
    <div className={`${styles.cost} ${compact ? styles.compact : ''}`} aria-label={`${amount} Tokens required`}>
      <img src="/assets/icons/token.avif" alt="" aria-hidden="true" />
      <span>{amount} Tokens</span>
    </div>
  )
}
