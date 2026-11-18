/**
 * Native looks inside the phone apps, from the shared Kolam kits (loaded in index.html):
 * - Android app (Capacitor shell, or ?app=android): Material Design 3 app bar + navigation bar (KolamM3).
 * - iPhone app (BrainGym-iOS shell, or ?app=ios): Apple HIG navigation bar + tab bar (KolamIOS).
 * In a normal browser both kits stay off and the website keeps its own look.
 */
import { parse, type Route } from './router'

type Kit = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    KolamM3?: Kit
    KolamIOS?: Kit
  }
}

const svg = (inner: string) =>
  `<svg class="ios-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`

const openNotifications = () => window.dispatchEvent(new CustomEvent('bg:notifications'))
const openSettings = () => (window.location.hash = '#/settings')

const TITLES: Partial<Record<Route['name'], string>> = {
  home: 'Brain Gym',
  games: 'Games',
  category: 'Games',
  stats: 'Progress',
  rewards: 'Rewards',
  profile: 'Profile',
  settings: 'Settings',
  play: 'Play',
}
const TAB_OF: Partial<Record<Route['name'], string>> = { home: 'home', games: 'games', category: 'games', play: 'games', stats: 'stats', rewards: 'rewards', profile: 'profile' }

let mode: 'android' | 'ios' | null = null
let m3: Kit | null = null

export function nativeMode() {
  return mode
}

export function initNative() {
  const ios = window.KolamIOS
    ? window.KolamIOS.init({
        appName: 'Brain Gym',
        uaTokens: ['BrainGym-iOS'],
        tint: { light: '#5A3FE0', dark: '#A796FF' },
        tabs: [
          { id: 'home', label: 'Home', icon: 'house', href: '#/' },
          { id: 'games', label: 'Games', icon: 'square.grid.2x2', href: '#/games' },
          { id: 'stats', label: 'Progress', icon: svg('<path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6"/>'), href: '#/stats' },
          { id: 'rewards', label: 'Rewards', icon: 'star', href: '#/rewards' },
          { id: 'profile', label: 'Profile', icon: 'person', href: '#/profile' },
        ],
        currentTab: 'home',
        content: '#main',
      })
    : null
  if (ios) {
    mode = 'ios'
    document.documentElement.classList.remove('k-android', 'k-app')
  } else if (window.KolamM3?.isAndroid) {
    mode = 'android'
    m3 = window.KolamM3.init({
      primary: '#5A3FE0',
      title: 'Brain Gym',
      home: '#/',
      destinations: [
        { id: 'home', label: 'Home', icon: 'home', href: '#/' },
        { id: 'games', label: 'Games', icon: 'sports_esports', href: '#/games' },
        { id: 'stats', label: 'Progress', icon: 'insights', href: '#/stats' },
        { id: 'rewards', label: 'Rewards', icon: 'emoji_events', href: '#/rewards' },
        { id: 'profile', label: 'Profile', icon: 'person', href: '#/profile' },
      ],
      actions: [
        { icon: 'notifications', label: 'Notifications', onClick: openNotifications },
        { icon: 'settings', label: 'Settings', onClick: openSettings },
      ],
    })
  }
  if (!mode) return
  const sync = () => syncNative(parse(window.location.hash))
  window.addEventListener('hashchange', sync)
  sync()
}

function syncNative(route: Route) {
  const playing = route.name === 'play'
  document.documentElement.classList.toggle('bg-playing', playing)
  const tab = TAB_OF[route.name]
  const title = TITLES[route.name] ?? 'Brain Gym'
  const back = route.name === 'category' || route.name === 'play' ? '#/games' : route.name === 'settings' ? '#/' : null
  if (mode === 'ios') {
    const K = window.KolamIOS!
    if (tab) K.tabBar.select(tab)
    const actions = [
      { icon: 'bell', label: 'Notifications', onClick: openNotifications },
      { icon: 'gearshape', label: 'Settings', onClick: openSettings },
    ]
    if (back)
      K.navBar.set({
        title,
        back: { label: route.name === 'settings' ? 'Home' : 'Games', onClick: () => (history.length > 1 ? history.back() : (window.location.hash = back)) },
        actions: playing ? [] : actions,
      })
    else K.navBar.set({ title, large: true, actions })
    setTimeout(() => K.enhance?.(document.getElementById('main')))
  } else if (m3) {
    // The kit resets its overrides on every route change, so set ours just after it.
    setTimeout(() => {
      m3!.setTitle(title)
      if (tab) m3!.setActive(tab)
      m3!.setBack(back ?? false)
    })
  }
}
