import { Music, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Modal } from '../components/ui'
import { play } from '../lib/sound'
import { useApp } from '../store/AppContext'

function Toggle({ id, label, desc, checked, onChange, icon }: { id: string; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary" aria-hidden>
        {icon}
      </span>
      <div className="flex-1">
        <label htmlFor={id} className="font-bold">
          {label}
        </label>
        <p className="text-sm text-muted">{desc}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition ${checked ? 'bg-primary' : 'bg-line'}`}
      >
        <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${checked ? 'left-7' : 'left-1'}`} />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}

export function SettingsScreen() {
  const { settings, updateSettings, resetProgress } = useApp()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="card divide-y divide-line px-5">
        <Toggle id="s-sound" label="Sound effects" desc="Taps, correct and wrong answer sounds." checked={settings.sound} onChange={(v) => updateSettings({ sound: v })} icon={settings.sound ? <Volume2 /> : <VolumeX />} />
        <div className="flex items-center gap-4 py-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary" aria-hidden>
            <Volume2 />
          </span>
          <div className="flex-1">
            <label htmlFor="s-vol" className="font-bold">
              Volume
            </label>
            <input
              id="s-vol"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
              onMouseUp={() => play('correct')}
              onKeyUp={() => play('tap')}
              className="mt-2 w-full accent-primary"
              aria-valuetext={`${Math.round(settings.volume * 100)}%`}
            />
          </div>
          <span className="w-12 text-right font-bold">{Math.round(settings.volume * 100)}%</span>
        </div>
        <Toggle id="s-music" label="Background music" desc="A gentle looping melody while you play." checked={settings.music} onChange={(v) => updateSettings({ music: v })} icon={<Music />} />
      </section>

      <section className="card divide-y divide-line px-5">
        <Toggle id="s-motion" label="Reduce motion" desc="Turn off confetti and most animations. Also follows your device setting." checked={settings.reducedMotion} onChange={(v) => updateSettings({ reducedMotion: v })} icon={<span>🐢</span>} />
        <Toggle id="s-contrast" label="High contrast text" desc="Darker secondary text and borders." checked={settings.highContrast} onChange={(v) => updateSettings({ highContrast: v })} icon={<span>◐</span>} />
      </section>

      <section className="card p-5">
        <h2 className="font-semibold">Data</h2>
        <p className="mt-1 mb-4 text-sm text-muted">All progress is stored locally in this browser. Clearing browser data will remove it.</p>
        <button type="button" className="btn-ghost text-danger" onClick={() => setConfirm(true)}>
          <RotateCcw size={18} /> Reset my progress
        </button>
      </section>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Reset progress?">
        <p className="mb-5 text-muted">This permanently clears XP, coins, levels, badges and game history for the current player. It can’t be undone.</p>
        <div className="flex gap-3">
          <button type="button" className="btn-ghost flex-1" onClick={() => setConfirm(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn flex-1 bg-danger text-white"
            onClick={() => {
              resetProgress()
              setConfirm(false)
            }}
          >
            Reset
          </button>
        </div>
      </Modal>
    </div>
  )
}
