# VELOOP Rewards — Games Banner + Mini Game Ecosystem

React/Vite implementation based on the supplied `Games_banner_task_FF.pdf` task specification.

## Included
- 13 reusable game banner cards generated from structured data
- Image-based game artwork with a separately coded bottom action area
- 20 Token entry cost on every card
- Infinite Play Now shimmer animation
- Smooth auto-scrolling horizontal carousel
- Touch/trackpad/native horizontal scrolling
- Interactive dot indicators
- No left/right carousel arrows
- Responsive layout from 320px through large desktop screens
- Loading/fallback states and accessibility labels
- Two fully playable prototype games:
  - **Coin Catch** — tap gold coins, avoid danger orbs, score/lives/timer, functional revive
  - **Memory Match** — flip cards, match pairs, lives/timer, functional revive
- Game-specific light-theme home pages
- First-time game guide stored in localStorage
- Centralized Token + Game Coin state
- 20 Token deduction before a playable game starts
- Insufficient-token state
- Game Coin rewards after gameplay
- Central redemption center for VEs, SVEs, Gems, Tokens and non-wager demo Spin Tickets
- Redemption confirmation, insufficient Game Coin state, wallet, and recent history
- Local persistence with `localStorage`

## Important asset note
The PDF links to a separate Google Drive asset folder, but those image files were not bundled into the uploaded PDF itself. This project therefore includes **original placeholder AVIF artwork** for all 13 banners plus placeholder Token/Game Coin icons so the project runs immediately.

For the final submission, replace:

```text
public/assets/games/game-01.avif ... game-13.avif
public/assets/icons/token.avif
public/assets/icons/game-coin.avif
```

with the official provided VELOOP assets, keeping the same filenames (or update `gamesData.js`). Crop important artwork carefully and preserve `object-fit: cover` / appropriate `object-position`.

## Tech stack
- React.js
- Vite
- Bootstrap
- CSS Modules
- React Hooks
- React Router

## Component structure
```text
src/
├── assets/
│   ├── games/
│   └── icons/
├── components/games/
│   ├── CarouselDots.jsx
│   ├── GameBottomNav.jsx
│   ├── GameCard.jsx
│   ├── GameGuideModal.jsx
│   ├── GameHeader.jsx
│   ├── GamesCarousel.jsx
│   ├── PlayNowButton.jsx
│   └── TokenCost.jsx
├── context/
│   └── GameEconomyContext.jsx
├── data/
│   └── gamesData.js
├── games/
│   ├── CoinCatch/
│   └── MemoryMatch/
├── pages/
│   ├── GameHomePage.jsx
│   ├── GamePlayPage.jsx
│   ├── GamesPage.jsx
│   └── RedeemPage.jsx
├── App.jsx
└── main.jsx
```

## Run locally
```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Vercel deployment
1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

For client-side routing on Vercel, this project includes `vercel.json` to rewrite routes to `index.html`.

## Netlify deployment
- Build command: `npm run build`
- Publish directory: `dist`
- `_redirects` is provided under `public/` for SPA routing.

## Prototype state vs production backend
Token/Game Coin balances in this project are dummy frontend values stored in `localStorage`. A production version should validate sessions, scores, rewards, token deductions and redemptions on a secure backend/API rather than trusting client-side values.

deployed link: https://veloop-games-flame.vercel.app/games
