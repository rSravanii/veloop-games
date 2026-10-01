import { useCallback, useEffect, useRef, useState } from 'react'

import GameCard from './GameCard.jsx'
import CarouselDots from './CarouselDots.jsx'

import styles from './GamesCarousel.module.css'

export default function GamesCarousel({ games }) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const rafRef = useRef(null)
  const resumeTimerRef = useRef(null)

  const [active, setActive] = useState(0)

  const pauseAutoScroll = useCallback(() => {
    pausedRef.current = true

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }
  }, [])

  const resumeAutoScroll = useCallback((delay = 0) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }

    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false
    }, delay)
  }, [])

  /* =========================================
     UPDATE ACTIVE DOT
  ========================================= */

  const updateActive = useCallback(() => {
    const track = trackRef.current

    if (!track || !games.length) return

    const first = track.querySelector('[data-game-card]')

    if (!first) return

    const gap =
      parseFloat(
        getComputedStyle(track).columnGap ||
          getComputedStyle(track).gap ||
          '18'
      ) || 18

    const step =
      first.getBoundingClientRect().width + gap

    if (!step) return

    const position = track.scrollLeft

    const index = Math.min(
      games.length - 1,
      Math.max(0, Math.round(position / step))
    )

    setActive(index)
  }, [games.length])

  /* =========================================
     AUTO SCROLL
  ========================================= */

  useEffect(() => {
    const track = trackRef.current

    if (!track || games.length <= 1) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduced) return

    let previous = performance.now()

    const tick = (now) => {
      const dt = Math.min(
        32,
        now - previous
      )

      previous = now

      if (
        !pausedRef.current &&
        track.scrollWidth > track.clientWidth
      ) {
        /*
         * Slow, smooth horizontal movement.
         */
        track.scrollLeft += dt * 0.027

        const maxScroll =
          track.scrollWidth - track.clientWidth

        /*
         * We have only ONE copy of the 13 banners.
         * When the end is reached, return to the first.
         */
        if (
          maxScroll > 0 &&
          track.scrollLeft >= maxScroll - 2
        ) {
          track.scrollTo({
            left: 0,
            behavior: 'smooth',
          })
        }
      }

      rafRef.current =
        requestAnimationFrame(tick)
    }

    rafRef.current =
      requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }
    }
  }, [games.length])

  /* =========================================
     DOT NAVIGATION
  ========================================= */

  const scrollToGame = useCallback(
    (index) => {
      const track = trackRef.current

      if (!track || !games.length) return

      const first =
        track.querySelector('[data-game-card]')

      if (!first) return

      const gap =
        parseFloat(
          getComputedStyle(track).columnGap ||
            getComputedStyle(track).gap ||
            '18'
        ) || 18

      const step =
        first.getBoundingClientRect().width + gap

      pauseAutoScroll()

      track.scrollTo({
        left: index * step,
        behavior: 'smooth',
      })

      setActive(index)

      resumeAutoScroll(1600)
    },
    [
      games.length,
      pauseAutoScroll,
      resumeAutoScroll,
    ]
  )

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (!games.length) {
    return null
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <>
      <div
        ref={trackRef}
        className={styles.track}

        onScroll={updateActive}

        onMouseEnter={pauseAutoScroll}
        onMouseLeave={() => resumeAutoScroll()}

        onPointerDown={pauseAutoScroll}

        onPointerUp={() => {
          updateActive()
          resumeAutoScroll(900)
        }}

        onPointerCancel={() => {
          updateActive()
          resumeAutoScroll(900)
        }}

        onTouchStart={pauseAutoScroll}

        onTouchEnd={() => {
          updateActive()
          resumeAutoScroll(900)
        }}

        role="region"
        aria-label="Games carousel. Swipe or scroll horizontally."
      >
        {games.map((game) => (
          <div
            key={game.id}
            className={styles.cardSlot}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

      <CarouselDots
        count={games.length}
        active={active}
        onSelect={scrollToGame}
      />
    </>
  )
}