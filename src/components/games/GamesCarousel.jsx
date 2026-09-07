import { useEffect, useRef, useState } from 'react'
import GameCard from './GameCard.jsx'
import CarouselDots from './CarouselDots.jsx'
import styles from './GamesCarousel.module.css'

export default function GamesCarousel({ games }) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const rafRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let previous = performance.now()
    const tick = (now) => {
      const dt = Math.min(32, now - previous)
      previous = now
      if (!pausedRef.current) {
        track.scrollLeft += dt * 0.027
        const half = track.scrollWidth / 2
        if (track.scrollLeft >= half) track.scrollLeft -= half
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [games.length])

  const updateActive = () => {
    const track = trackRef.current
    if (!track) return
    const first = track.querySelector('[data-game-card]')
    if (!first) return
    const gap = parseFloat(getComputedStyle(track).gap || '18')
    const step = first.getBoundingClientRect().width + gap
    setActive(Math.round(track.scrollLeft / step) % games.length)
  }

  const scrollToGame = (index) => {
    const track = trackRef.current
    const first = track?.querySelector('[data-game-card]')
    if (!track || !first) return
    const gap = parseFloat(getComputedStyle(track).gap || '18')
    track.scrollTo({ left: index * (first.getBoundingClientRect().width + gap), behavior: 'smooth' })
    setActive(index)
  }

  return (
    <>
      <div
        ref={trackRef}
        className={styles.track}
        onScroll={updateActive}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onPointerDown={() => (pausedRef.current = true)}
        onPointerUp={() => { pausedRef.current = false; updateActive() }}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => { setTimeout(() => (pausedRef.current = false), 800); updateActive() }}
        aria-label="Games carousel. Swipe or scroll horizontally."
      >
        {[...games, ...games].map((game, index) => (
          <div data-game-card key={`${game.id}-${index}`} aria-hidden={index >= games.length ? 'true' : undefined}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
      <CarouselDots count={games.length} active={active} onSelect={scrollToGame} />
    </>
  )
}
