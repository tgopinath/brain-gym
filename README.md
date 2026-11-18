# Brain Gym

A playful brain-training web app: 8 training zones, many mini-games, 10 levels each, XP, coins, badges, daily challenges and progress analytics. Everything runs offline in the browser and is saved to LocalStorage.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Architecture

```
src/
  types.ts                 Shared domain types (Profile, GameResult, ProgressState…)
  lib/
    storage.ts             StorageAdapter interface + LocalStorage impl (swap for a cloud backend)
    difficulty.ts          Level names, age-group presets, effective difficulty `d`, pass thresholds
    scoring.ts             Central scoring engine: raw outcome → score, stars, pass, XP, coins
    achievements.ts        Badge definitions + progress functions
    daily.ts               Date-seeded daily challenges, daily missions & weekly challenges
    stats.ts               Skill scores, brain score, totals for analytics
    random.ts              Seeded RNG, shuffle/sample, anti-repeat helpers
    sound.ts               Synthesised sound effects + optional music (Web Audio, no files)
    router.ts              Tiny hash router
  store/AppContext.tsx     Profiles, settings, recordResult() (progression, unlocks, rewards)
  games/
    types.ts               GameDef / GameProps / GameApi – the contract every game implements
    registry.ts            Categories + all games
    shared/                QuizEngine (multiple-choice games), Shape SVGs, DraggableTile, hooks
    memory/ focus/ pattern/ logic/ number/ spatial/ speed/ puzzle/   one file per game
  screens/
    GameShell.tsx          Intro → countdown → play (timer, score, hints, pause) → results
    Home, Games, Stats, Rewards, Profile, Settings, Welcome
```

### Adding a game

1. Create `src/games/<category>/MyGame.tsx` exporting a `GameDef`.
2. Scale only with `diff.d` (1–12) and `diff.time`; use the `rng` prop for all puzzle randomness.
3. Report through `api.correct()`, `api.wrong()`, `api.progress()`, `api.finish()`; register hints with `api.onHint()`.
4. Add it to the category's `index.ts`.

### Difficulty & progression

* Effective difficulty `d = level + ageOffset + preferenceOffset` (clamped 1–12). Timers are multiplied by an age factor.
* A level is passed when the game is completed with accuracy ≥ the level's threshold (60% rising to 85%). Passing your highest level unlocks the next. Nothing is random.
* Daily challenges are seeded from the date and profile, so they survive refreshes and change at midnight.

### Note on scores

Brain/skill scores are game-performance measures (accuracy weighted by level). They are not a validated cognitive assessment; the Progress screen says so.
