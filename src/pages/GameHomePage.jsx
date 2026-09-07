import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import games from '../data/gamesData.js'
import { useGameEconomy } from '../context/GameEconomyContext.jsx'
import GameHeader from '../components/games/GameHeader.jsx'
import GameBottomNav from '../components/games/GameBottomNav.jsx'
import GameGuideModal from '../components/games/GameGuideModal.jsx'
import styles from './GameHomePage.module.css'

export default function GameHomePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const game = useMemo(() => games.find((item) => item.slug === slug), [slug])
  const { state, spendTokens, markGuideSeen } = useGameEconomy()
  const [guideOpen, setGuideOpen] = useState(false)
  const [requiredGuide, setRequiredGuide] = useState(false)
  const [message, setMessage] = useState('')

  if (!game) return <div className={styles.missing}>Game not found.</div>

  const start = () => {
    if (!game.playable) {
      setMessage('This banner is complete; gameplay is only enabled for the two selected games in this prototype.')
      return
    }
    if (state.tokens < game.cost) {
      setMessage(`Not Enough Tokens. You need ${game.cost} Tokens to play. Your Balance: ${state.tokens} Tokens.`)
      return
    }
    if (!spendTokens(game.cost)) return
    if (!state.guideSeen[game.slug]) {
      setRequiredGuide(true)
      setGuideOpen(true)
    } else {
      navigate(`/games/${game.slug}/play`)
    }
  }

  const continueFromGuide = () => {
    markGuideSeen(game.slug)
    setGuideOpen(false)
    navigate(`/games/${game.slug}/play`)
  }

  return (
    <main className={styles.page} style={{ '--accent': game.accent }}>
      <div className={styles.shell}>
        <GameHeader />
        <section className={styles.hero}>
          <div className={styles.artwork}><img src={game.image} alt={`${game.name} artwork`} /></div>
          <div className={styles.content}>
            <span className={styles.category}>{game.category || 'Game'}</span>
            <h1>{game.name}</h1>
            <p>{game.description || 'A new VELOOP challenge is waiting for you.'}</p>
            <div className={styles.entry}>
              <img src="/assets/icons/token.avif" alt="" />
              <div><small>ENTRY FEE</small><strong>20 Tokens</strong></div>
            </div>
            <button className={styles.play} onClick={start} type="button">
              {game.playable ? '▶ Play Now' : 'Preview Banner'}
            </button>
            <button className={styles.how} onClick={() => setGuideOpen(true)} type="button" disabled={!game.guide}>How to Play</button>
            {message && <div className={styles.notice} role="status">{message}</div>}
          </div>
        </section>

        <section className={styles.features}>
          <div><b>Game Coins</b><span>Rewards flow into one centralized balance.</span></div>
          <div><b>Revive</b><span>The two playable games support a working revive flow.</span></div>
          <div><b>Responsive</b><span>Built for touch, mouse, tablet, and desktop.</span></div>
        </section>
        <GameBottomNav gameSlug={game.slug} />
      </div>
      {guideOpen && game.guide && (
        <GameGuideModal game={game} required={requiredGuide} onContinue={requiredGuide ? continueFromGuide : () => setGuideOpen(false)} onClose={() => setGuideOpen(false)} />
      )}
    </main>
  )
}
