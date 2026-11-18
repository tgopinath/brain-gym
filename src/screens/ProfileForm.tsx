import { motion } from 'framer-motion'
import { useState } from 'react'
import { AVATARS } from '../components/ui'
import { AGE_GROUPS } from '../lib/difficulty'
import type { AgeGroup, DifficultyPref, Profile } from '../types'

export type ProfileDraft = Omit<Profile, 'id' | 'createdAt'>

export function ProfileForm({ initial, submitLabel, onSubmit, onCancel }: { initial?: ProfileDraft; submitLabel: string; onSubmit: (p: ProfileDraft) => void; onCancel?: () => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS[0])
  const [ageGroup, setAge] = useState<AgeGroup>(initial?.ageGroup ?? 'kids810')
  const [difficulty, setDiff] = useState<DifficultyPref>(initial?.difficulty ?? 'normal')
  const valid = name.trim().length > 0

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSubmit({ name: name.trim().slice(0, 20), avatar, ageGroup, difficulty })
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="pname" className="font-bold">
          Your name
        </label>
        <input
          id="pname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="e.g. Maya"
          autoComplete="off"
          className="rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg font-bold outline-none focus:border-primary"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-bold">Pick an avatar</legend>
        <div className="grid grid-cols-8 gap-2">
          {AVATARS.map((a) => (
            <motion.button
              whileTap={{ scale: 0.85 }}
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              aria-pressed={avatar === a}
              aria-label={`Avatar ${a}`}
              className={`grid aspect-square place-items-center rounded-2xl border-2 text-2xl transition sm:text-3xl ${avatar === a ? 'border-primary bg-primary-soft' : 'border-transparent bg-bg hover:border-line'}`}
            >
              {a}
            </motion.button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-bold">Age group</legend>
        <p className="-mt-1 mb-1 text-sm text-muted">We adapt instructions, numbers and timers to suit you.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AGE_GROUPS.map((g) => (
            <label key={g.id} className={`cursor-pointer rounded-2xl border-2 px-3 py-3 text-center font-bold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-secondary/40 ${ageGroup === g.id ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-white'}`}>
              <input type="radio" name="age" className="sr-only" checked={ageGroup === g.id} onChange={() => setAge(g.id)} />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-bold">Difficulty preference</legend>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['easy', '🌱 Relaxed'],
              ['normal', '🌟 Balanced'],
              ['hard', '🔥 Tough'],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className={`cursor-pointer rounded-2xl border-2 px-3 py-3 text-center font-bold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-secondary/40 ${difficulty === id ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-white'}`}>
              <input type="radio" name="diff" className="sr-only" checked={difficulty === id} onChange={() => setDiff(id)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3">
        {onCancel && (
          <button type="button" className="btn-ghost flex-1" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary flex-1 text-lg" disabled={!valid}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
