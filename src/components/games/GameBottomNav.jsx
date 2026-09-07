import { NavLink } from 'react-router-dom'
import styles from './GameBottomNav.module.css'

export default function GameBottomNav({ gameSlug }) {
  return (
    <nav className={styles.nav} aria-label="Game navigation">
      <NavLink to={`/games/${gameSlug}`}>⌂ <span>Home</span></NavLink>
      <NavLink to="/redeem">◎ <span>Redeem</span></NavLink>
    </nav>
  )
}
