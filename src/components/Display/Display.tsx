import { useCalculator } from '../../context/CalculatorContext'
import { useTheme } from '../../context/ThemeContext'
import styles from './Display.module.css'

export function Display() {
  const { state } = useCalculator()
  const { state: themeState } = useTheme()

  // Get modifier indicator
  const getModifierIndicator = () => {
    if (state.modifier === '2nd') return '2ND'
    if (state.modifier === 'alpha') return 'ALPHA'
    return ''
  }

  return (
    <div className={`${styles.display} ${themeState.isAlexisMode ? styles.alexisMode : ''}`}>
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.modeName}>
          {state.mode === 'calc' ? 'NORMAL' : state.mode.toUpperCase()}
        </span>
        <span className={styles.modifier}>{getModifierIndicator()}</span>
      </div>

      {/* History */}
      <div className={styles.history}>
        {state.history.slice(-3).map((item, index) => (
          <div key={index} className={styles.historyItem}>
            <div className={styles.historyInput}>{item.input}</div>
            <div className={styles.historyResult}>{item.result}</div>
          </div>
        ))}
      </div>

      {/* Current input */}
      <div className={styles.inputLine}>
        <span className={styles.input}>{state.currentInput}</span>
        <span className={styles.cursor}>|</span>
      </div>

      {/* Error display */}
      {state.error && (
        <div className={styles.error}>
          {state.error}
        </div>
      )}

      {/* Last result */}
      {state.display && !state.error && !state.currentInput && (
        <div className={styles.result}>
          {state.display}
        </div>
      )}
    </div>
  )
}
