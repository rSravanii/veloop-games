import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import games from '../data/gamesData.js';
import { useGameEconomy } from '../context/GameEconomyContext.jsx';
import GameHeader from '../components/games/GameHeader.jsx';
import styles from './GamePlayPage.module.css';

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
  const [message, setMessage] = useState(
    'Aim for the centre and release your blade.'
  )

  const targetSize = 420

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

  const target = event.currentTarget
  const rect = target.getBoundingClientRect()

  const clientX = event.clientX
  const clientY = event.clientY

  const x = ((clientX - rect.left) / rect.width) * 100
  const y = ((clientY - rect.top) / rect.height) * 100

  const dx = x - 50
  const dy = y - 50

  const distance = Math.sqrt(dx * dx + dy * dy)

  // Outside the circular target
  if (distance > 50) return

  // Collision with an existing knife
  const tooClose = knives.some((knife) => {
    const knifeDx = knife.x - x
    const knifeDy = knife.y - y

    return Math.sqrt(
      knifeDx * knifeDx + knifeDy * knifeDy
    ) < 9
  })

  if (tooClose) {
    setLives((current) => {
      const next = current - 1

      if (next <= 0) {
        setGameOver(true)
      }

      return Math.max(0, next)
    })

    setMessage('💥 Your blade hit another knife!')
    return
  }

  // Accuracy score
  const accuracy = Math.max(
    0,
    1 - distance / 50
  )

  const points = Math.max(
    10,
    Math.round(100 * accuracy)
  )

  const tilt = Math.max(
    -35,
    Math.min(35, dx * 0.7)
  )

  const newKnife = {
    id: `${Date.now()}-${Math.random()}`,
    x,
    y,
    tilt,
    points,
  }

  setKnives((current) => [
    ...current,
    newKnife,
  ])

  setScore((current) => current + points)

  if (points >= 90) {
    setMessage(`🎯 Perfect hit! +${points}`)
  } else if (points >= 60) {
    setMessage(`⚔️ Great hit! +${points}`)
  } else {
    setMessage(`🗡️ Hit! +${points}`)
  }
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
            <strong>
              {'♥'.repeat(lives)}
              {'♡'.repeat(3 - lives)}
            </strong>
          </div>
        </div>
      </div>

      <div className={styles.bladeArena}>
        <div
          className={styles.bladeMessage}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>

        <button
          type="button"
          className={styles.target}
          onPointerDown={throwKnife}
          aria-label="Blade Master target. Tap or click to throw a knife."
          style={{
            width: targetSize,
            height: targetSize,
          }}
        >
          <div className={styles.targetOuter}>
            <div className={styles.targetMiddle}>
              <div className={styles.targetInner}>
                🎯
              </div>
            </div>
          </div>

          {knives.map((knife) => (
            <span
              key={knife.id}
              className={styles.stuckKnife}
              style={{
                left: `${knife.x}%`,
                top: `${knife.y}%`,
                transform: `
                  translate(-50%, -92%)
                  rotate(${knife.tilt}deg)
                `,
              }}
              aria-hidden="true"
            >
              🔪
            </span>
          ))}
        </button>

        <p className={styles.bladeInstruction}>
          Choose a clear position on the target to throw
          your blade.
        </p>
      </div>

      {gameOver && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <small>GAME OVER</small>

            <h2>{score} Points</h2>

            <p>
              You threw {knives.length} knives.
              {time === 0
                ? ' Time is up!'
                : ' You ran out of lives!'}
            </p>

            {!revived && (
              <button
                type="button"
                onClick={revive}
              >
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
    { id: 7, x: 72, y: 70, rotation: 8, color: 'orange', blockers: [2, 4] },
    { id: 8, x: 42, y: 78, rotation: -6, color: 'green', blockers: [5, 6] },
  ],

  [
    { id: 1, x: 20, y: 22, rotation: 12, color: 'green', blockers: [] },
    { id: 2, x: 58, y: 20, rotation: -15, color: 'orange', blockers: [] },
    { id: 3, x: 40, y: 38, rotation: 5, color: 'red', blockers: [1] },
    { id: 4, x: 68, y: 45, rotation: -10, color: 'blue', blockers: [2] },
    { id: 5, x: 27, y: 58, rotation: -18, color: 'purple', blockers: [1, 3] },
    { id: 6, x: 52, y: 63, rotation: 12, color: 'green', blockers: [3, 4] },
    { id: 7, x: 75, y: 68, rotation: -12, color: 'red', blockers: [4, 6] },
    { id: 8, x: 42, y: 76, rotation: 7, color: 'orange', blockers: [5, 7] },
    { id: 9, x: 68, y: 78, rotation: -9, color: 'purple', blockers: [6, 8] },
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
    { id: 9, x: 40, y: 78, rotation: -7, color: 'orange', blockers: [6, 8] },
    { id: 10, x: 67, y: 80, rotation: 10, color: 'purple', blockers: [7, 9] },
  ],
]

function scatterPieces(template) {
  const occupied = []

  return template.map((piece) => {
    let position = { x: piece.x, y: piece.y }

    for (let attempt = 0; attempt < 40; attempt += 1) {
      const candidate = { x: 13 + Math.random() * 74, y: 25 + Math.random() * 62 }
      const awayFromCentre = Math.hypot(candidate.x - 50, candidate.y - 50) > 22
      const clearOfOthers = occupied.every((other) => Math.hypot(candidate.x - other.x, candidate.y - other.y) > 20)

      if (awayFromCentre && clearOfOthers) {
        position = candidate
        break
      }
    }

    occupied.push(position)
    return { ...piece, ...position, rotation: piece.rotation + (-10 + Math.random() * 20) }
  })
}

function Nutcraft({ onFinish }) {
  const [level, setLevel] = useState(0)
  const [pieces, setPieces] = useState(() => scatterPieces(LEVELS[0]))
  const [fallingPieces, setFallingPieces] = useState([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(NUT_TIME)
  const [mistakes, setMistakes] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [revived, setRevived] = useState(false)
  const [message, setMessage] = useState('Clear the free hardware to unlock the assembly.')

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
    setMistakes((value) => {
      const next = value + 1

      if (next >= 3) {
        setGameOver(true)
        setMessage('💥 Too many mistakes!')
      } else {
        setMessage('🔒 Blocked! Remove its blocker first.')
      }

      return next
    })

    return
  }

  const remaining = pieces.filter(
    (item) => item.id !== piece.id
  )

  // Main removed piece
  const mainFallingPiece = {
    ...piece,
    fallId: `${piece.id}-${Date.now()}-main`,
    fallOffsetX: 0,
    fallDelay: 0,
  }

  // Extra falling nuts for a richer release animation
  const extraFallingPieces = Array.from(
    { length: 3 },
    (_, index) => ({
      ...piece,
      fallId: `${piece.id}-${Date.now()}-${index}`,
      x: Math.max(
        8,
        Math.min(
          92,
          piece.x + (-14 + Math.random() * 28)
        )
      ),
      y: Math.max(
        18,
        Math.min(
          82,
          piece.y + (-8 + Math.random() * 16)
        )
      ),
      rotation:
        piece.rotation +
        (-35 + Math.random() * 70),
      fallOffsetX: -30 + Math.random() * 60,
      fallDelay: index * 70,
    }))

  const releasedPieces = [
    mainFallingPiece,
    ...extraFallingPieces,
  ]

  setFallingPieces((current) => [
    ...current,
    ...releasedPieces,
  ])

  releasedPieces.forEach((fallingPiece) => {
    window.setTimeout(() => {
      setFallingPieces((current) =>
        current.filter(
          (item) => item.fallId !== fallingPiece.fallId
        )
      )
    }, 900 + fallingPiece.fallDelay)
  })

  setScore((value) => value + 50)

  if (remaining.length === 0) {
    if (level < LEVELS.length - 1) {
      setLevel((value) => value + 1)
      setPieces(
        scatterPieces(LEVELS[level + 1])
      )
      setMessage(
        `🎉 Level ${level + 2} unlocked!`
      )
    } else {
      const timeBonus = time * 2

      setScore((value) => value + timeBonus)
      setCompleted(true)

      setMessage(
        `🏆 All levels complete! +${timeBonus} time bonus`
      )
    }
  } else {
    setPieces(remaining)
    setMessage('🔩 Piece removed! +50')
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

          {fallingPieces.map((piece) => (
            <div
              key={piece.fallId}
              className={`${styles.nutPiece} ${styles[piece.color]} ${styles.fallingPiece}`}
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                '--fall-rotation': `${piece.rotation + 55}deg`,
                '--fall-x': `${piece.fallOffsetX || 0}px`,
                '--fall-delay': `${piece.fallDelay || 0}ms`,
              }}
              aria-hidden="true"
            >
              <span className={styles.nutHead}>X</span>
              <span className={styles.nutBar} />
              <span className={styles.nutHead}>X</span>
            </div>
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
  const { slug } = useParams();
  const navigate = useNavigate();
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
