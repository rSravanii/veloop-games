import { useState } from 'react'
import { Link } from 'react-router-dom'
import GameHeader from '../components/games/GameHeader.jsx'
import { useGameEconomy } from '../context/GameEconomyContext.jsx'
import styles from './RedeemPage.module.css'

const offers = [
  { key: 've', label: 'VEs', cost: 100, amount: 10, icon: 'V' },
  { key: 'sve', label: 'SVEs', cost: 120, amount: 6, icon: 'S' },
  { key: 'gems', label: 'Gems', cost: 60, amount: 5, icon: '◆' },
  { key: 'tokens', label: 'Tokens', cost: 80, amount: 20, icon: 'T' },
  { key: 'spins', label: 'Spin Tickets', cost: 50, amount: 2, icon: '◎' },
]

export default function RedeemPage() {
  const { state, redeem } = useGameEconomy()
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  const confirm = () => {
    const result = redeem(selected)
    setMessage(result.ok ? `Redemption successful: ${selected.amount} ${selected.label} added.` : `Not enough Game Coins. You have ${state.gameCoins}; ${selected.cost} are required.`)
    setSelected(null)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <GameHeader />
        <section className={styles.head}><p>GAME COIN REDEMPTION</p><h1>Turn Game Coins into VELOOP rewards</h1><span>This prototype uses dummy conversion rates and local frontend state only.</span><div className={styles.balance}><img src="/assets/icons/game-coin.avif" alt=""/><strong>{state.gameCoins}</strong><span>Game Coins</span></div></section>
        <section className={styles.grid}>
          {offers.map((offer) => <article className={styles.offer} key={offer.key}><div className={styles.icon}>{offer.icon}</div><h2>{offer.label}</h2><p>Convert Game Coins to {offer.label}.</p><div className={styles.rate}><b>{offer.cost}</b> Game Coins <span>→</span> <b>{offer.amount}</b> {offer.label}</div><button type="button" onClick={() => setSelected(offer)}>Redeem</button></article>)}
        </section>
        {message && <div className={styles.message}>{message}</div>}
        <section className={styles.wallet}><h2>Your demo rewards</h2><div><span>{state.wallet.ve} VEs</span><span>{state.wallet.sve} SVEs</span><span>{state.wallet.gems} Gems</span><span>{state.wallet.spins} Spin Tickets</span><span>{state.tokens} Tokens</span></div></section>
        <section className={styles.history}><h2>Recent Redemptions</h2>{state.history.length ? state.history.map((item) => <div key={item.id}><span>{item.cost} Game Coins → {item.amount} {item.label}</span><time>{new Date(item.at).toLocaleString()}</time></div>) : <p>No redemptions yet.</p>}</section>
        <Link to="/games" className={styles.gamesLink}>← Play Games</Link>
      </div>
      {selected && <div className={styles.backdrop}><div className={styles.modal} role="dialog" aria-modal="true"><h2>Redeem Game Coins?</h2><p>You are about to convert <b>{selected.cost} Game Coins</b> into <b>{selected.amount} {selected.label}</b>.</p><p>Remaining after redemption: <b>{Math.max(0,state.gameCoins-selected.cost)} Game Coins</b></p>{state.gameCoins < selected.cost && <div className={styles.warning}>Not enough Game Coins. Keep playing games to earn more.</div>}<div><button type="button" className={styles.cancel} onClick={() => setSelected(null)}>Cancel</button><button type="button" onClick={confirm} disabled={state.gameCoins < selected.cost}>Confirm</button></div></div></div>}
    </main>
  )
}
