import { LogOut, Pencil, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Modal, Stars } from '../components/ui'
import { ACHIEVEMENTS } from '../lib/achievements'
import { AGE_GROUPS, levelName, playerLevelFromXp } from '../lib/difficulty'
import { computeStreak } from '../lib/dates'
import { useActive, useApp } from '../store/AppContext'
import { ProfileForm } from './ProfileForm'

export function ProfileScreen() {
  const { profile, progress } = useActive()
  const { profiles, updateProfile, switchProfile, deleteProfile, createProfile } = useApp()
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const lvl = playerLevelFromXp(progress.xp)
  const badges = ACHIEVEMENTS.filter((a) => progress.achievements[a.id])
  const threeStars = progress.history.filter((r) => r.stars === 3).length
  const toDelete = profiles.find((p) => p.profile.id === confirmDelete)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pt-6">
      <section className="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <span className="grid size-24 shrink-0 place-items-center rounded-[2rem] bg-gradient-to-br from-primary-soft to-[#dbeaff] text-6xl shadow-soft" aria-hidden>
          {profile.avatar}
        </span>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-muted">
            {AGE_GROUPS.find((g) => g.id === profile.ageGroup)?.label} · {profile.difficulty === 'easy' ? 'Relaxed' : profile.difficulty === 'hard' ? 'Tough' : 'Balanced'} difficulty
          </p>
          <p className="mt-1 font-bold">
            Level {lvl.level} · {levelName(Math.min(10, lvl.level))} · {computeStreak(progress.playedDays)}-day streak
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => setEditing(true)}>
          <Pencil size={18} /> Edit profile
        </button>
      </section>

      <section className="card p-5">
        <h2 className="mb-3 text-lg font-semibold">Achievements</h2>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted">
          <Stars value={3} size={16} /> {threeStars} perfect games · {badges.length} badges
        </div>
        {badges.length ? (
          <ul className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <li key={b.id} className="chip bg-accent/15 py-2 text-sm text-ink">
                <span aria-hidden>{b.icon}</span> {b.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No badges yet – finish a game to earn your first!</p>
        )}
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Players on this device</h2>
          <button type="button" className="btn-ghost !px-3 !py-2 text-sm" onClick={() => setAdding(true)}>
            <UserPlus size={16} /> Add player
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {profiles.map((d) => (
            <li key={d.profile.id} className={`flex items-center gap-3 rounded-2xl p-3 ${d.profile.id === profile.id ? 'bg-primary-soft' : 'bg-bg'}`}>
              <span className="text-3xl" aria-hidden>
                {d.profile.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{d.profile.name}</p>
                <p className="text-xs text-muted">
                  {d.progress.xp} XP · {d.progress.history.length} games
                </p>
              </div>
              {d.profile.id === profile.id ? (
                <span className="chip bg-primary text-white">Active</span>
              ) : (
                <button type="button" className="btn-ghost !px-3 !py-1.5 text-sm" onClick={() => switchProfile(d.profile.id)}>
                  Switch
                </button>
              )}
              <button type="button" onClick={() => setConfirmDelete(d.profile.id)} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-danger/10 hover:text-danger" aria-label={`Delete ${d.profile.name}`}>
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn-ghost mt-4 w-full" onClick={() => switchProfile(null)}>
          <LogOut size={18} /> Switch player
        </button>
      </section>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit profile">
        <ProfileForm
          initial={profile}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={(p) => {
            updateProfile(p)
            setEditing(false)
          }}
        />
      </Modal>
      <Modal open={adding} onClose={() => setAdding(false)} title="New player">
        <ProfileForm
          submitLabel="Create player"
          onCancel={() => setAdding(false)}
          onSubmit={(p) => {
            createProfile(p)
            setAdding(false)
          }}
        />
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete player?">
        <p className="mb-5 text-muted">
          This permanently removes <strong className="text-ink">{toDelete?.profile.name}</strong> and all their progress from this device. This can’t be undone.
        </p>
        <div className="flex gap-3">
          <button type="button" className="btn-ghost flex-1" onClick={() => setConfirmDelete(null)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn flex-1 bg-danger text-white"
            onClick={() => {
              if (confirmDelete) deleteProfile(confirmDelete)
              setConfirmDelete(null)
            }}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
