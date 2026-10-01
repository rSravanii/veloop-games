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

  const hasEnoughTokens = state.tokens >= game.cost

  const openGame = () => {
    if (!hasEnoughTokens) return

    navigate(`/games/${game.slug}`)
  }

  return (
    <article
      className={styles.card}
      style={{ '--accent': game.accent }}
      aria-label={`${game.name} game card`}
      data-game-card
    >
      {/* GAME ARTWORK */}
      <div className={styles.artworkWrap}>
        {!loaded && !failed && (
          <div
            className={styles.skeleton}
            aria-hidden="true"
          >
            <span>Loading artwork…</span>
          </div>
        )}

        {failed ? (
          <div
            className={styles.fallback}
            role="img"
            aria-label={`${game.name} artwork unavailable`}
          >
            <span>Artwork unavailable</span>
          </div>
        ) : (
          <img
            src={game.image}
            alt={`${game.name} game artwork`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setFailed(true)
              setLoaded(false)
            }}
            className={`${styles.image} ${
              loaded ? styles.loaded : ''
            }`}
          />
        )}

        {/* GAME META */}
        <div className={styles.topMeta}>
          {game.category && (
            <span className={styles.category}>
              {game.category}
            </span>
          )}

          {game.badge && (
            <strong className={styles.badge}>
              {game.badge}
            </strong>
          )}
        </div>
      </div>

      {/* ACTION AREA */}
      <div className={styles.actionArea}>
        <div className={styles.info}>
          <h3 className={styles.title}>{game.name}</h3>
        </div>
        <div className={styles.footer}>
          <TokenCost
            amount={game.cost}
            compact
          />
          <PlayNowButton
          disabledled = {!hasEnoughTokens}
            onClick={openGame}
            ariaLabel={
              hasEnoughTokens
                ? `Play ${game.name}`
                : `${game.name}: requires ${game.cost} Tokens`
            }
          />
        </div>
      </div>
    </article>
  )
}