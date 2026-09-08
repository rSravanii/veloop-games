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
  - **Blade Master** — aim and throw knives at a target, score points, manage lives and timer, and use the functional revive flow
  - **Nutcraft** — solve mechanical nut-and-bolt puzzles by removing pieces in the correct order, while managing blockers, mistakes and timer
- 11 additional banner-only games:
  - Bowlexa
  - Block Crush
  - Slice Storm
  - Cosmo Warrior
  - Toilet Tictics
  - Word Hunt
  - Bubble Blast
  - Merge Master
  - Wormzy
  - Aqua Fill
  - Realm Clash
- Game-specific light-theme home pages for Blade Master and Nutcraft
- First-time game guide stored in localStorage
- Centralized Token + Game Coin state
- 20 Token deduction before a playable game starts
- Insufficient-token state
- Game Coin rewards after gameplay
- Functional revive flow for both playable games
- Central redemption center for VEs, SVEs, Gems, Tokens and Spin Tickets
- Redemption confirmation and insufficient Game Coin state
- Wallet balance and recent redemption history
- Local persistence with `localStorage`

## Games

### Blade Master
Blade Master is a reaction-based knife throwing game.

- Tap or click the target to throw a knife
- Hit closer to the centre for a higher score
- Avoid hitting existing knives
- Player has limited lives
- Countdown timer controls the round
- Game ends when the timer expires or all lives are lost
- Revive allows the player to continue the game
- Final performance generates Game Coin rewards

### Nutcraft
Nutcraft is a mechanical puzzle game based on nuts, bolts and removable pieces.

- Study the puzzle board
- Remove pieces that are currently free
- Blocked pieces become available after their blockers are removed
- Incorrect selections increase mistakes
- Complete multiple puzzle levels
- Manage the countdown timer
- Game ends when time or allowed mistakes are exhausted
- Revive allows the player to continue
- Game completion generates Game Coin rewards

## Game Economy

- Every game costs **20 Tokens**
- Token balance is checked before starting a playable game
- Tokens are deducted when the player starts the game flow
- Game Coins are earned after completing gameplay
- Game Coins are centrally shared between the playable games
- Game Coins can be redeemed for:
  - VEs
  - SVEs
  - Gems
  - Tokens
  - Spin Tickets
- Redemption includes confirmation, insufficient Game Coin handling, wallet updates and recent history

## Gameplay Flow

```text
Games
  ↓
Game Banner
  ↓
Play Now
  ↓
Game Home
  ↓
20 Tokens Deducted
  ↓
Game Guide
  ↓
Start Game
  ↓
Gameplay
  ↓
Game Ends
  ↓
Revive / No Thanks
  ↓
Continue / Finish
  ↓
Calculate Reward
  ↓
Game Coins Added
  ↓
Updated Game Coin Balance
  ↓
Game Home

##Important asset note

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
- JavaScript
- localStorage

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
│   └── gamesData.jsx
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
cd "C:\Users\ravul\OneDrive\Desktop\veloop-games"
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
<<<<<<< HEAD
Token/Game Coin balances in this project are dummy frontend values stored in `localStorage`. A production version should validate sessions, scores, rewards, token deductions and redemptions on a secure backend/API rather than trusting client-side values.

deployed link: https://veloop-games-flame.vercel.app/games
=======
Token and Game Coin balances in this project are dummy frontend values stored in `localStorage`.
A production version should validate sessions, scores, rewards, token deductions and redemptions on a secure backend/API rather than trusting client-side values.
>>>>>>> 07c29fa (2 fully playable games and 13 interactive game banners implemented)
