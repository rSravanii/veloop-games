import GamesCarousel from '../components/games/GamesCarousel.jsx'
import games from '../data/gamesData.js'
import { useGameEconomy } from '../context/GameEconomyContext.jsx'
import styles from './GamesPage.module.css'

export default function GamesPage() {
  const { state, resetDemo } = useGameEconomy()
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.topbar}>
          <div className={styles.brand}><span>V</span> VELOOP <strong>Rewards</strong></div>
          <div className={styles.wallet}>
            <span><img src="/assets/icons/token.avif" alt="" /> {state.tokens} Tokens</span>
            <span><img src="/assets/icons/game-coin.avif" alt="" /> {state.gameCoins} Game Coins</span>
          </div>
        </div>

        <div className={styles.heading}>
          <div>
            <p>GAMES</p>
            <h1>Explore Games & Earn Rewards</h1>
            <span>Choose a challenge, enter with 20 Tokens, and collect centralized Game Coins.</span>
          </div>
          <button type="button" onClick={resetDemo}>Reset Demo Wallet</button>
        </div>

        <GamesCarousel games={games} />

        <div className={styles.infoGrid}>
          <div><strong>13</strong><span>Interactive banners</span></div>
          <div><strong>2</strong><span>Playable games</span></div>
          <div><strong>20</strong><span>Tokens per entry</span></div>
          <div><strong>1</strong><span>Central Game Coin wallet</span></div>
        </div>
      </section>
    </main>
  )
}
