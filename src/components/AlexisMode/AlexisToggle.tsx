import { useTheme } from '../../context/ThemeContext'
import styles from './AlexisToggle.module.css'

export function AlexisToggle() {
  const { state, toggleAlexisMode } = useTheme()

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <span className={styles.text}>
          {state.isAlexisMode ? '✨' : ''} Alexis Mode
        </span>
        <div className={`${styles.toggle} ${state.isAlexisMode ? styles.active : ''}`}>
          <input
            type="checkbox"
            checked={state.isAlexisMode}
            onChange={toggleAlexisMode}
            className={styles.input}
            aria-label="Toggle Alexis Mode"
          />
          <span className={styles.slider}>
            {state.isAlexisMode && (
              <>
                <span className={styles.star} style={{ '--i': 0 } as React.CSSProperties}>
                  ✦
                </span>
                <span className={styles.star} style={{ '--i': 1 } as React.CSSProperties}>
                  ✧
                </span>
                <span className={styles.star} style={{ '--i': 2 } as React.CSSProperties}>
                  ✦
                </span>
              </>
            )}
          </span>
        </div>
      </label>
    </div>
  )
}
