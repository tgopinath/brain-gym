# Brain Gym

**Pitch:** Brain-training games for children, with levels that grow with the player.

**Description:** 37 mini-games across eight training zones (memory, focus, patterns, logic, numbers, spatial skills, speed and puzzles), each with ten levels, a clear pass mark and age-group presets. Daily challenges, missions, badges and coins keep practice going, and the Progress screen shows skill scores built only from games actually played, with a plain note that they are game scores, not a cognitive test. Everything runs offline in the browser and saves on the device; no account.

**Tags:** Kids, Games, Learning, React, PWA-style web app, Android, iOS

- Live: https://brain-gym-six.vercel.app
- APK: https://github.com/tgopinath/brain-gym/releases/latest/download/brain-gym.apk (4.2 MB, Android 7+, opens the live site)
- iOS: https://github.com/tgopinath/BrainGym-iOS (SwiftUI WKWebView shell; Simulator screenshots in screenshots/, no TestFlight)
- Repo: https://github.com/tgopinath/brain-gym
- Stack: React 19, TypeScript, Vite 8, Tailwind 4, Framer Motion, Recharts, Web Audio (synthesised sounds); LocalStorage. Native looks via the Kolam M3 kit (Android app) and Kolam iOS kit (iPhone app); website keeps its own look.
- Status: live, v1.0.0. Built outside the agent with its own playful look (Fredoka/Nunito, emoji art); not on Kolam.
- Assets: prototype/mobile.html, prototype/shots/{welcome,home,games,category,game,rewards}.jpg, prototype/shots/web.jpg (1440x900), prototype/icon.png. Re-shoot: node tools/shots.mjs
