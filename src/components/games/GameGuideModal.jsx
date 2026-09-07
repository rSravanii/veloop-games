import styles from './GameGuideModal.module.css'

export default function GameGuideModal({ game, onContinue, onClose, required = false }) {
  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(e) => !required && e.target === e.currentTarget && onClose?.()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="guide-title">
        <div className={styles.kicker}>HOW TO PLAY</div>
        <h2 id="guide-title">{game.name}</h2>
        <img src={game.image} alt="" aria-hidden="true" />
        <ol>{game.guide?.map((item) => <li key={item}>{item}</li>)}</ol>
        <button type="button" onClick={onContinue}>Got it - Start Game</button>
        {!required && <button type="button" className={styles.secondary} onClick={onClose}>Close</button>}
      </section>
    </div>
  )
}
