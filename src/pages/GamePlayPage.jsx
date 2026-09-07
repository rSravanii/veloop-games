import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import games from '../data/gamesData.js'
import { useGameEconomy } from '../context/GameEconomyContext.jsx'
import GameHeader from '../components/games/GameHeader.jsx'
import styles from './GamePlayPage.module.css'

function rewardFor(slug, score) {
  if (slug === 'coin-catch') return Math.min(35, Math.max(5, Math.floor(score / 40) * 5))
  if (slug === 'memory-match') return Math.min(30, Math.max(5, Math.floor(score / 50) * 5))
  return 5
}

export default function GamePlayPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const game = useMemo(() => games.find((item) => item.slug === slug), [slug])
  const { addGameCoins } = useGameEconomy()
  const [reward, setReward] = useState(null)

  if (!game?.playable) return <div className={styles.invalid}>This game is not enabled in the playable prototype.</div>

  const finish = (score) => {
    const amount = rewardFor(slug, score)
    addGameCoins(amount)
    setReward(amount)
    setTimeout(() => navigate(`/games/${slug}`, { replace: true, state: { earned: amount } }), 1200)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <GameHeader backTo={`/games/${slug}`} />
        <div className={styles.gameWrap}>
          <div className={styles.placeholder}>This game is not included in the prototype build.</div>
        </div>
      </div>
      {reward !== null && (
        <div className={styles.reward} role="status">
          <img src="/assets/icons/game-coin.avif" alt="" />
          <strong>+{reward} Game Coins</strong>
          <span>Balance updated</span>
        </div>
      )}
    </main>
  )
}

