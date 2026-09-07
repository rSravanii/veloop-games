import { Link } from 'react-router-dom'
import { useGameEconomy } from '../../context/GameEconomyContext.jsx'
import styles from './GameHeader.module.css'

export default function GameHeader({ backTo = '/games' }) {
  const { state } = useGameEconomy()
  return (
    <header className={styles.header}>
      <Link to={backTo} className={styles.back}>← Back</Link>
      <div className={styles.balances}>
        <span><img src="/assets/icons/token.avif" alt="" /> {state.tokens} Tokens</span>
        <span><img src="/assets/icons/game-coin.avif" alt="" /> {state.gameCoins} Game Coins</span>
      </div>
    </header>
  )
}
