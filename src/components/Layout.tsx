import { motion } from 'framer-motion'
import { Bell, Flame, Gamepad2, Home, LineChart, Settings, Trophy, User } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { computeStreak } from '../lib/dates'
import { playerLevelFromXp } from '../lib/difficulty'
import { href, type Route } from '../lib/router'
import { useActive, useApp } from '../store/AppContext'
import { Modal } from './ui'

const NAV: { route: Route; label: string; icon: typeof Home; match: Route['name'][] }[] = [
  { route: { name: 'home' }, label: 'Home', icon: Home, match: ['home'] },
  { route: { name: 'games' }, label: 'Games', icon: Gamepad2, match: ['games', 'category'] },
  { route: { name: 'stats' }, label: 'Progress', icon: LineChart, match: ['stats'] },
  { route: { name: 'rewards' }, label: 'Rewards', icon: Trophy, match: ['rewards'] },
  { route: { name: 'profile' }, label: 'Profile', icon: User, match: ['profile'] },
]

export function Logo() {
  return (
    <a href={href({ name: 'home' })} className="flex items-center gap-2" aria-label="Brain Gym home">
      <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl shadow-soft" aria-hidden>
        🧠
      </span>
      <span className="hidden font-display text-xl font-bold sm:inline">
        Brain<span className="text-primary">Gym</span>
      </span>
    </a>
  )
}

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { profile, progress } = useActive()
  const { markAllRead } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)
  const streak = computeStreak(progress.playedDays)
  const lvl = playerLevelFromXp(progress.xp)
  const unread = progress.notifications.filter((n) => !n.read).length
  const playing = route.name === 'play'
  useEffect(() => {
    // The phone apps' native app bar has a Notifications button (src/lib/native.ts).
    const open = () => setNotifOpen(true)
    window.addEventListener('bg:notifications', open)
    return () => window.removeEventListener('bg:notifications', open)
  }, [])

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      {!playing && (
        <header className="site-header sticky top-0 z-30 border-b border-line/60 bg-bg/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3">
            <Logo />
            <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
              {NAV.map((n) => {
                const active = n.match.includes(route.name)
                return (
                  <a
                    key={n.label}
                    href={href(n.route)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2 font-bold transition ${active ? 'bg-white text-primary shadow-soft' : 'text-muted hover:text-ink'}`}
                  >
                    <n.icon size={18} /> {n.label}
                  </a>
                )
              })}
            </nav>
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <span className="chip bg-white py-2 text-sm shadow-soft" title="Daily streak" aria-label={`${streak} day streak`}>
                <Flame size={16} className={streak ? 'fill-accent text-accent' : 'text-muted'} /> {streak}
              </span>
              <span className="chip hidden bg-white py-2 text-sm shadow-soft sm:inline-flex" aria-label={`Player level ${lvl.level}`}>
                ⭐ Lv {lvl.level}
              </span>
              <button
                type="button"
                onClick={() => setNotifOpen(true)}
                className="relative grid size-10 place-items-center rounded-2xl bg-white shadow-soft hover:bg-primary-soft"
                aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
              >
                <Bell size={20} />
                {unread > 0 && <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">{unread}</span>}
              </button>
              <a href={href({ name: 'settings' })} className="grid size-10 place-items-center rounded-2xl bg-white shadow-soft hover:bg-primary-soft" aria-label="Settings">
                <Settings size={20} />
              </a>
              <a href={href({ name: 'profile' })} className="flex items-center gap-2 rounded-2xl bg-white py-1 pr-3 pl-1 shadow-soft hover:bg-primary-soft" aria-label={`Profile: ${profile.name}`}>
                <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-xl" aria-hidden>
                  {profile.avatar}
                </span>
                <span className="hidden max-w-24 truncate font-bold lg:inline">{profile.name}</span>
              </a>
            </div>
          </div>
        </header>
      )}

      <main id="main" className={playing ? '' : 'pb-24 md:pb-10'}>
        <motion.div key={JSON.stringify(route)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {children}
        </motion.div>
      </main>

      {!playing && (
        <nav className="site-tabbar fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-white/95 px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden" aria-label="Main">
          <ul className="flex justify-around">
            {NAV.map((n) => {
              const active = n.match.includes(route.name)
              return (
                <li key={n.label}>
                  <a href={href(n.route)} aria-current={active ? 'page' : undefined} className={`flex min-w-14 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-[11px] font-bold ${active ? 'text-primary' : 'text-muted'}`}>
                    <span className={`grid h-7 w-12 place-items-center rounded-full ${active ? 'bg-primary-soft' : ''}`}>
                      <n.icon size={20} />
                    </span>
                    {n.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      <Modal
        open={notifOpen}
        onClose={() => {
          setNotifOpen(false)
          markAllRead()
        }}
        title="Notifications"
      >
        {progress.notifications.length === 0 ? (
          <p className="py-6 text-center text-muted">No notifications yet. Play a game to earn badges and unlock levels!</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {progress.notifications.map((n) => (
              <li key={n.id} className={`flex gap-3 rounded-2xl p-3 ${n.read ? 'bg-bg' : 'bg-primary-soft'}`}>
                <span className="text-2xl" aria-hidden>
                  {n.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-bold">
                    {n.title}
                    {!n.read && <span className="sr-only"> (new)</span>}
                  </p>
                  <p className="text-sm text-muted">{n.body}</p>
                  <p className="mt-0.5 text-xs text-muted">{new Date(n.at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
