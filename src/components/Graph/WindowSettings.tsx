import { useCalculator } from '../../context/CalculatorContext'
import { useTheme } from '../../context/ThemeContext'
import { GraphEngine } from '../../engine/GraphEngine'
import styles from './WindowSettings.module.css'

export function WindowSettings() {
  const { state, setGraphWindow, setMode } = useCalculator()
  const { state: themeState } = useTheme()

  const handlePreset = (presetName: string) => {
    const presets = GraphEngine.getZoomPresets()
    const preset = presets[presetName]
    if (preset) {
      setGraphWindow(preset)
    }
  }

  return (
    <div className={`${styles.container} ${themeState.isAlexisMode ? styles.alexisMode : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Window Settings</span>
      </div>

      <div className={styles.settings}>
        <div className={styles.row}>
          <label>Xmin=</label>
          <input
            type="number"
            value={state.graphWindow.xMin}
            onChange={(e) => setGraphWindow({ xMin: Number(e.target.value) })}
          />
        </div>
        <div className={styles.row}>
          <label>Xmax=</label>
          <input
            type="number"
            value={state.graphWindow.xMax}
            onChange={(e) => setGraphWindow({ xMax: Number(e.target.value) })}
          />
        </div>
        <div className={styles.row}>
          <label>Xscl=</label>
          <input
            type="number"
            value={state.graphWindow.xScl}
            onChange={(e) => setGraphWindow({ xScl: Number(e.target.value) })}
          />
        </div>
        <div className={styles.row}>
          <label>Ymin=</label>
          <input
            type="number"
            value={state.graphWindow.yMin}
            onChange={(e) => setGraphWindow({ yMin: Number(e.target.value) })}
          />
        </div>
        <div className={styles.row}>
          <label>Ymax=</label>
          <input
            type="number"
            value={state.graphWindow.yMax}
            onChange={(e) => setGraphWindow({ yMax: Number(e.target.value) })}
          />
        </div>
        <div className={styles.row}>
          <label>Yscl=</label>
          <input
            type="number"
            value={state.graphWindow.yScl}
            onChange={(e) => setGraphWindow({ yScl: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.presets}>
        <span className={styles.presetLabel}>Zoom Presets:</span>
        <div className={styles.presetButtons}>
          <button onClick={() => handlePreset('standard')}>Standard</button>
          <button onClick={() => handlePreset('trig')}>Trig</button>
          <button onClick={() => handlePreset('decimal')}>Decimal</button>
          <button onClick={() => handlePreset('square')}>Square</button>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => setMode('graph')} className={styles.graphButton}>
          View Graph →
        </button>
        <button onClick={() => setMode('calc')} className={styles.backButton}>
          ← Back
        </button>
      </div>
    </div>
  )
}
