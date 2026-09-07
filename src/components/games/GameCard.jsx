import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameEconomy } from '../../context/GameEconomyContext.jsx'
import PlayNowButton from './PlayNowButton.jsx'
import TokenCost from './TokenCost.jsx'
import styles from './GameCard.module.css'

export default function GameCard({ game }) {
  const navigate = useNavigate()
  const { state } = useGameEconomy()
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const disabled = state.tokens < game.cost

  return (
    <article className={styles.card} style={{ '--accent': game.accent }} aria-label={`${game.name} game card`}>
      <div className={styles.artworkWrap}>
        {!loaded && !failed && <div className={styles.skeleton}>Loading artwork…</div>}
        {failed ? (
          <div className={styles.fallback}>Artwork unavailable</div>
        ) : (
          <img
            src={game.image}
            alt={`${game.name} game artwork`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={loaded ? styles.loaded : ''}
          />
        )}
        <div className={styles.topMeta}>
          <span>{game.category}</span>
          {game.badge && <strong>{game.badge}</strong>}
        </div>
      </div>
      <div className={styles.actionArea}>
        <div>
          <h3>{game.name}</h3>
          <TokenCost amount={game.cost} compact />
        </div>
        <PlayNowButton
          disabled={disabled}
          onClick={() => navigate(`/games/${game.slug}`)}
          ariaLabel={disabled ? `${game.name}: not enough Tokens` : `Open ${game.name}`}
        />
      </div>
    </article>
  )
}
