import { motion } from 'framer-motion'
import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { ProfileForm } from './ProfileForm'
import { CATEGORIES, GAMES } from '../games/registry'

/** First-run screen and profile picker (shown when no profile is active). */
export function Welcome() {
  const { profiles, createProfile, switchProfile } = useApp()
  const [creating, setCreating] = useState(profiles.length === 0)

  return (
    <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="grid size-14 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-4xl shadow-pop" aria-hidden>
            🧠
          </span>
          <span className="font-display text-3xl font-bold">
            Brain<span className="text-primary">Gym</span>
          </span>
        </div>
        <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
          Train your brain.
          <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Have a blast doing it.</span>
        </h1>
        <p className="max-w-lg text-lg text-muted">
          {GAMES.length} playful mini-games for memory, focus, logic, patterns, numbers, spatial skills and speed – with levels that grow with you.
        </p>
        <ul className="grid max-w-lg grid-cols-4 gap-3" aria-label="Game categories">
          {CATEGORIES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 20, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.1 + i * 0.06, type: 'spring' }}
              className={`flex aspect-square flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${c.gradient} p-2 text-center text-white shadow-soft`}
            >
              <span className="text-3xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="mt-1 text-[11px] leading-tight font-bold">{c.title}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="card p-6 sm:p-8">
        {creating ? (
          <>
            <h2 className="mb-1 text-2xl font-semibold">Create your player</h2>
            <p className="mb-6 text-muted">Progress is saved on this device. Each family member can have their own profile.</p>
            <ProfileForm submitLabel="Let’s train! 🚀" onSubmit={createProfile} onCancel={profiles.length ? () => setCreating(false) : undefined} />
          </>
        ) : (
          <>
            <h2 className="mb-1 text-2xl font-semibold">Who’s training?</h2>
            <p className="mb-6 text-muted">Choose your profile.</p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profiles.map((d) => (
                <li key={d.profile.id}>
                  <button type="button" onClick={() => switchProfile(d.profile.id)} className="tile flex w-full flex-col items-center gap-2 p-4">
                    <span className="text-5xl" aria-hidden>
                      {d.profile.avatar}
                    </span>
                    <span className="max-w-full truncate">{d.profile.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => setCreating(true)} className="tile flex h-full w-full flex-col items-center justify-center gap-2 border-dashed p-4 text-muted">
                  <span className="text-4xl" aria-hidden>
                    ➕
                  </span>
                  New player
                </button>
              </li>
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
