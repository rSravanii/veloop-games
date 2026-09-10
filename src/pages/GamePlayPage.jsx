import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import games from '../data/gamesData.js'
import { useGameEconomy } from '../context/GameEconomyContext.jsx'
import GameHeader from '../components/games/GameHeader.jsx'
import styles from './GamePlayPage.module.css'

const BLADE_TIME = 30
const NUT_TIME = 60

function rewardFor(slug, score) {
  if (slug === 'blade-master') {
    return Math.min(40, Math.max(5, Math.floor(score / 100) * 5))
  }

  if (slug === 'nutcraft') {
    return Math.min(40, Math.max(5, Math.floor(score / 100) * 5))
  }

  return 5
}

/* =========================
   BLADE MASTER
========================= */

function BladeMaster({ onFinish }) {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(BLADE_TIME)
  const [lives, setLives] = useState(3)
  const [knives, setKnives] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [revived, setRevived] = useState(false)
  const [message, setMessage] = useState('Tap the target to throw!')

  const targetSize = 300

  useEffect(() => {
    if (gameOver) return undefined

    const timer = setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          setGameOver(true)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver])

  const throwKnife = (event) => {
    if (gameOver) return

    const rect = event.currentTarget.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const dx = x - centerX
    const dy = y - centerY

    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 35) {
      setScore((value) => value + 30)
      setMessage('🎯 PERFECT HIT! +30')
    } else if (distance < 90) {
      setScore((value) => value + 20)
      setMessage('🔥 GREAT HIT! +20')
    } else {
      setScore((value) => value + 10)
      setMessage('⚔️ HIT! +10')
    }

    const tooClose = knives.some(
      (knife) => Math.abs(knife.angle - angle) < 16
    )

    if (tooClose) {
      setLives((value) => {
        const next = Math.max(0, value - 1)

        if (next === 0) {
          setGameOver(true)
        }

        return next
      })

      setMessage('💥 Knife collision! -1 life')
      return
    }

    setKnives((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        angle,
      },
    ])
  }

  const revive = () => {
    setRevived(true)
    setLives(2)
    setTime(15)
    setGameOver(false)
    setMessage('⚔️ Revived! Keep throwing!')
  }

  return (
    <section className={styles.game}>
      <div className={styles.gameTitle}>
        <div>
          <small>REACTION GAME</small>
          <h1>🗡️ Blade Master</h1>
          <p>Aim. Throw. Hit perfect.</p>
        </div>

        <div className={styles.hud}>
          <div>
            <span>Score</span>
            <strong>{score}</strong>
          </div>

          <div>
            <span>Time</span>
            <strong>{time}s</strong>
          </div>

          <div>
            <span>Lives</span>
            <strong>{'♥'.repeat(lives)}{'♡'.repeat(3 - lives)}</strong>
          </div>
        </div>
      </div>

      <div className={styles.bladeArena}>
        <div className={styles.bladeMessage}>{message}</div>

        <button
          type="button"
          className={styles.target}
          onPointerDown={throwKnife}
          aria-label="Throw knife at target"
          style={{
            width: targetSize,
            height: targetSize,
          }}
        >
          <div className={styles.targetOuter}>
            <div className={styles.targetMiddle}>
              <div className={styles.targetInner}>🎯</div>
            </div>
          </div>

          {knives.map((knife) => (
            <span
              key={knife.id}
              className={styles.stuckKnife}
              style={{
                transform: `rotate(${knife.angle + 90}deg)`,
              }}
            >
              🔪
            </span>
          ))}
        </button>

        <p className={styles.bladeInstruction}>
          Click anywhere on the target to throw your knife
        </p>
      </div>

      {gameOver && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <small>GAME OVER</small>

            <h2>{score} Points</h2>

            <p>
              You threw {knives.length} knives.
              {time === 0 ? ' Time is up!' : ' You ran out of lives!'}
            </p>

            {!revived && (
              <button type="button" onClick={revive}>
                ⚔️ Revive +15 Seconds
              </button>
            )}

            <button
              type="button"
              className={styles.secondary}
              onClick={() => onFinish(score)}
            >
              No Thanks — Collect Reward
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* =========================
   NUTCRAFT
========================= */

const LEVELS = [
  [
    { id: 1, x: 22, y: 25, rotation: -18, color: 'red', blockers: [] },
    { id: 2, x: 54, y: 24, rotation: 15, color: 'blue', blockers: [] },
    { id: 3, x: 37, y: 45, rotation: -8, color: 'green', blockers: [1] },
    { id: 4, x: 66, y: 50, rotation: 18, color: 'orange', blockers: [2] },
    { id: 5, x: 22, y: 65, rotation: 10, color: 'purple', blockers: [1, 3] },
    { id: 6, x: 50, y: 70, rotation: -15, color: 'blue', blockers: [3, 4] },
  ],

  [
    { id: 1, x: 20, y: 22, rotation: 12, color: 'green', blockers: [] },
    { id: 2, x: 58, y: 20, rotation: -15, color: 'orange', blockers: [] },
    { id: 3, x: 40, y: 38, rotation: 5, color: 'red', blockers: [1] },
    { id: 4, x: 68, y: 45, rotation: -10, color: 'blue', blockers: [2] },
    { id: 5, x: 27, y: 58, rotation: -18, color: 'purple', blockers: [1, 3] },
    { id: 6, x: 52, y: 63, rotation: 12, color: 'green', blockers: [3, 4] },
    { id: 7, x: 75, y: 68, rotation: -12, color: 'red', blockers: [4, 6] },
  ],

  [
    { id: 1, x: 20, y: 22, rotation: -15, color: 'blue', blockers: [] },
    { id: 2, x: 55, y: 20, rotation: 15, color: 'red', blockers: [] },
    { id: 3, x: 75, y: 30, rotation: -8, color: 'green', blockers: [2] },
    { id: 4, x: 37, y: 42, rotation: 12, color: 'orange', blockers: [1] },
    { id: 5, x: 62, y: 45, rotation: -18, color: 'purple', blockers: [2, 3] },
    { id: 6, x: 20, y: 65, rotation: 15, color: 'green', blockers: [1, 4] },
    { id: 7, x: 48, y: 68, rotation: -10, color: 'red', blockers: [4, 5] },
    { id: 8, x: 75, y: 70, rotation: 14, color: 'blue', blockers: [3, 5, 7] },
  ],
]

function Nutcraft({ onFinish }) {
  const [level, setLevel] = useState(0)
  const [pieces, setPieces] = useState(LEVELS[0])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(NUT_TIME)
  const [mistakes, setMistakes] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [revived, setRevived] = useState(false)
  const [message, setMessage] = useState('Remove the free nuts first!')

  useEffect(() => {
    if (gameOver || completed) return undefined

    const timer = setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          setGameOver(true)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver, completed])

  const isFree = (piece) => {
    return piece.blockers.every(
      (blocker) => !pieces.some((item) => item.id === blocker)
    )
  }

  const removePiece = (piece) => {
    if (gameOver || completed) return

    setMoves((value) => value + 1)

    if (!isFree(piece)) {
      setMistakes((value) => value + 1)
      setMessage('🔒 Blocked! Remove its blocker first.')

      if (mistakes + 1 >= 3) {
        setGameOver(true)
      }

      return
    }

    setScore((value) => value + 50)
    setMessage('🔩 Piece removed! +50')

    const remaining = pieces.filter((item) => item.id !== piece.id)

    if (remaining.length === 0) {
      if (level < LEVELS.length - 1) {
        setLevel((value) => value + 1)
        setPieces(LEVELS[level + 1])
        setMessage(`🎉 Level ${level + 2} unlocked!`)
      } else {
        setCompleted(true)
        setScore((value) => value + time * 2)
      }
    } else {
      setPieces(remaining)
    }
  }

  const revive = () => {
    setRevived(true)
    setTime(25)
    setMistakes(0)
    setGameOver(false)
    setMessage('🔩 Revived! Solve the puzzle!')
  }

  return (
    <section className={styles.game}>
      <div className={styles.gameTitle}>
        <div>
          <small>PUZZLE GAME</small>
          <h1>🔩 Nutcraft</h1>
          <p>Twist. Remove. Master.</p>
        </div>

        <div className={styles.hud}>
          <div>
            <span>Level</span>
            <strong>{level + 1}/3</strong>
          </div>

          <div>
            <span>Time</span>
            <strong>{time}s</strong>
          </div>

          <div>
            <span>Score</span>
            <strong>{score}</strong>
          </div>
        </div>
      </div>

      <div className={styles.nutArena}>
        <div className={styles.nutMessage}>{message}</div>

        <div className={styles.woodBoard}>
          <div className={styles.boardTitle}>
            LEVEL {level + 1} — REMOVE ALL PIECES
          </div>

          {pieces.map((piece) => (
            <button
              key={piece.id}
              type="button"
              className={`${styles.nutPiece} ${styles[piece.color]} ${
                isFree(piece) ? styles.freePiece : styles.blockedPiece
              }`}
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                transform: `translate(-50%, -50%) rotate(${piece.rotation}deg)`,
              }}
              onClick={() => removePiece(piece)}
              aria-label={
                isFree(piece)
                  ? 'Remove free nut'
                  : 'Blocked nut'
              }
            >
              <span className={styles.nutHead}>✕</span>
              <span className={styles.nutBar} />
              <span className={styles.nutHead}>✕</span>
            </button>
          ))}

          <div className={styles.centerBolt}>
            🔩
          </div>
        </div>

        <div className={styles.nutStats}>
          <span>Moves: {moves}</span>
          <span>Mistakes: {mistakes}/3</span>
          <span>Pieces: {pieces.length}</span>
        </div>
      </div>

      {(gameOver || completed) && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <small>
              {completed ? 'PUZZLE COMPLETE' : 'GAME OVER'}
            </small>

            <h2>
              {completed
                ? `🏆 ${score} Points`
                : `Score: ${score}`}
            </h2>

            <p>
              {completed
                ? 'You mastered all three Nutcraft levels!'
                : 'The puzzle defeated you this time.'}
            </p>

            {!completed && !revived && (
              <button type="button" onClick={revive}>
                🔩 Revive +25 Seconds
              </button>
            )}

            <button
              type="button"
              className={styles.secondary}
              onClick={() => onFinish(score)}
            >
              {completed
                ? 'Collect Reward'
                : 'No Thanks — Collect Reward'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* =========================
   MAIN PAGE
========================= */

export default function GamePlayPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const game = useMemo(
    () => games.find((item) => item.slug === slug),
    [slug]
  )

  const { addGameCoins } = useGameEconomy()

  const [reward, setReward] = useState(null)

  if (!game?.playable) {
    return (
      <div className={styles.invalid}>
        This game is not enabled in the playable prototype.
      </div>
    )
  }

  const finish = (score) => {
    if (reward !== null) return

    const amount = rewardFor(slug, score)

    addGameCoins(amount)
    setReward(amount)

    setTimeout(() => {
      navigate(`/games/${slug}`, {
        replace: true,
        state: { earned: amount },
      })
    }, 1400)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <GameHeader backTo={`/games/${slug}`} />

        <div className={styles.gameWrap}>
          {slug === 'blade-master' && (
            <BladeMaster onFinish={finish} />
          )}

          {slug === 'nutcraft' && (
            <Nutcraft onFinish={finish} />
          )}
        </div>
      </div>

      {reward !== null && (
        <div className={styles.reward} role="status">
          <img
            src="/assets/icons/game-coin.avif"
            alt=""
          />

          <strong>+{reward} Game Coins</strong>

          <span>Balance updated</span>
        </div>
      )}
    </main>
  )
}