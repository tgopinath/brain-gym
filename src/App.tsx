import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { Layout } from './components/Layout'
import { Empty } from './components/ui'
import { gameById } from './games/registry'
import { setConfettiReduced } from './lib/confetti'
import { href, useRoute } from './lib/router'
import { AppProvider, useApp } from './store/AppContext'
import { GameShell } from './screens/GameShell'
import { Category, Games } from './screens/Games'
import { Home } from './screens/Home'
import { ProfileScreen } from './screens/Profile'
import { Rewards } from './screens/Rewards'
import { SettingsScreen } from './screens/SettingsScreen'
import { Stats } from './screens/Stats'
import { Welcome } from './screens/Welcome'

function Screens() {
  const route = useRoute()
  const { active, settings } = useApp()

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', settings.reducedMotion)
    document.documentElement.classList.toggle('high-contrast', settings.highContrast)
    setConfettiReduced(settings.reducedMotion)
  }, [settings.reducedMotion, settings.highContrast])

  useEffect(() => {
    document.documentElement.classList.toggle('bg-onboarding', !active)
  }, [active])

  if (!active) return <Welcome />

  let screen
  switch (route.name) {
    case 'games':
      screen = <Games />
      break
    case 'category':
      screen = <Category id={route.id} />
      break
    case 'play': {
      const game = gameById(route.id)
      screen = game ? (
        <GameShell key={`${route.id}-${route.level}-${route.daily}`} game={game} initialLevel={route.level} daily={!!route.daily} />
      ) : (
        <Empty icon="🤔" title="Game not found" body="That game doesn’t exist." action={<a className="btn-primary" href={href({ name: 'games' })}>Browse games</a>} />
      )
      break
    }
    case 'stats':
      screen = <Stats />
      break
    case 'rewards':
      screen = <Rewards />
      break
    case 'profile':
      screen = <ProfileScreen />
      break
    case 'settings':
      screen = <SettingsScreen />
      break
    default:
      screen = <Home />
  }

  return (
    <MotionConfig reducedMotion={settings.reducedMotion ? 'always' : 'user'}>
      <Layout route={route}>{screen}</Layout>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  )
}
