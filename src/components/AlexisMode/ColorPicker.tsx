import { useState } from 'react'
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext'
import styles from './ColorPicker.module.css'

const THEME_LABELS: Record<string, string> = {
  pink: '💖 Pink',
  purple: '💜 Purple',
  blue: '💙 Blue',
  rainbow: '🌈 Rainbow',
  mint: '🌿 Mint',
  gold: '✨ Gold',
}

export function ColorPicker() {
  const { state, setTheme, setCustomColors, setSparkleEnabled } = useTheme()
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className={styles.container}>
      {/* Theme presets */}
      <div className={styles.presets}>
        {Object.keys(THEME_PRESETS).map((themeName) => {
          const preset = THEME_PRESETS[themeName]
          return (
            <button
              key={themeName}
              className={`${styles.preset} ${state.currentTheme === themeName ? styles.active : ''}`}
              onClick={() => setTheme(themeName)}
              style={{
                background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
              }}
              title={THEME_LABELS[themeName] || themeName}
              aria-label={`Select ${themeName} theme`}
            >
              {state.currentTheme === themeName && <span className={styles.check}>✓</span>}
            </button>
          )
        })}
        <button
          className={`${styles.preset} ${styles.customBtn} ${showCustom ? styles.active : ''}`}
          onClick={() => setShowCustom(!showCustom)}
          title="Custom colors"
          aria-label="Open custom color picker"
        >
          ⚙️
        </button>
      </div>

      {/* Sparkle toggle */}
      <label className={styles.sparkleToggle}>
        <input
          type="checkbox"
          checked={state.sparkleEnabled}
          onChange={(e) => setSparkleEnabled(e.target.checked)}
        />
        <span>✨ Sparkles</span>
      </label>

      {/* Custom color panel */}
      {showCustom && (
        <div className={styles.customPanel}>
          <div className={styles.colorRow}>
            <label>Primary</label>
            <input
              type="color"
              value={state.primaryColor}
              onChange={(e) => setCustomColors({ primaryColor: e.target.value })}
            />
          </div>
          <div className={styles.colorRow}>
            <label>Secondary</label>
            <input
              type="color"
              value={state.secondaryColor}
              onChange={(e) => setCustomColors({ secondaryColor: e.target.value })}
            />
          </div>
          <div className={styles.colorRow}>
            <label>Accent</label>
            <input
              type="color"
              value={state.accentColor}
              onChange={(e) => setCustomColors({ accentColor: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
