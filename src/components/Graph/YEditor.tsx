import { useCalculator } from '../../context/CalculatorContext'
import { useTheme } from '../../context/ThemeContext'
import styles from './YEditor.module.css'

export function YEditor() {
  const { state, setGraphFunction, toggleGraphFunction, setMode } = useCalculator()
  const { state: themeState } = useTheme()

  return (
    <div className={`${styles.container} ${themeState.isAlexisMode ? styles.alexisMode : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Plot Functions</span>
        <button onClick={() => setMode('graph')} className={styles.graphButton}>
          GRAPH →
        </button>
      </div>

      <div className={styles.functions}>
        {state.graphFunctions.slice(0, 6).map((func, index) => (
          <div key={func.id} className={styles.functionRow}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={func.enabled}
                onChange={() => toggleGraphFunction(index)}
                className={styles.checkbox}
              />
              <span
                className={styles.funcId}
                style={{ color: themeState.isAlexisMode ? themeState.primaryColor : func.color }}
              >
                Y{index + 1}=
              </span>
            </label>
            <input
              type="text"
              value={func.expression}
              onChange={(e) => setGraphFunction(index, e.target.value)}
              placeholder="e.g., X^2, sin(X), 2X+1"
              className={styles.input}
            />
          </div>
        ))}
      </div>

      <div className={styles.help}>
        <p>Tips: Use X as the variable</p>
        <p>Examples: X^2, sin(X), sqrt(X), abs(X), log(X)</p>
      </div>

      <button onClick={() => setMode('calc')} className={styles.backButton}>
        ← Back to Calculator
      </button>
    </div>
  )
}
