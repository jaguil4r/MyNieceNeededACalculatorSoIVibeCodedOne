import { useMemo } from 'react'
import { useCalculator } from '../../context/CalculatorContext'
import { useTheme } from '../../context/ThemeContext'
import styles from './TableScreen.module.css'

export function TableScreen() {
  const { state, mathEngine, setTableSettings, setMode } = useCalculator()
  const { state: themeState } = useTheme()

  const enabledFunctions = useMemo(
    () => state.graphFunctions.filter((f) => f.enabled && f.expression.trim()),
    [state.graphFunctions]
  )

  const tableData = useMemo(() => {
    const rows = []
    const { tblStart, tblStep } = state.tableSettings
    const numRows = 10

    for (let i = 0; i < numRows; i++) {
      const x = tblStart + i * tblStep
      const row: { x: number; values: (number | string)[] } = {
        x,
        values: enabledFunctions.map((func) => {
          const y = mathEngine.evaluateAt(func.expression, x)
          if (y === null) return 'ERROR'
          if (!isFinite(y)) return y > 0 ? '∞' : '-∞'
          // Round to reasonable precision
          return Number(y.toPrecision(6))
        }),
      }
      rows.push(row)
    }

    return rows
  }, [state.tableSettings, enabledFunctions, mathEngine])

  return (
    <div className={`${styles.container} ${themeState.isAlexisMode ? styles.alexisMode : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Table</span>
        <button onClick={() => setMode('y-editor')} className={styles.editButton}>
          Edit Y=
        </button>
      </div>

      <div className={styles.settings}>
        <label>
          TblStart=
          <input
            type="number"
            value={state.tableSettings.tblStart}
            onChange={(e) => setTableSettings({ tblStart: Number(e.target.value) })}
          />
        </label>
        <label>
          ΔTbl=
          <input
            type="number"
            value={state.tableSettings.tblStep}
            onChange={(e) => setTableSettings({ tblStep: Number(e.target.value) })}
            step="0.5"
          />
        </label>
      </div>

      {enabledFunctions.length === 0 ? (
        <div className={styles.noFunctions}>
          <p>No functions defined.</p>
          <button onClick={() => setMode('y-editor')}>Add Functions →</button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>X</th>
                {enabledFunctions.map((f, i) => (
                  <th
                    key={i}
                    style={{
                      color: themeState.isAlexisMode ? themeState.primaryColor : f.color,
                    }}
                  >
                    {f.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <td className={styles.xCell}>{row.x}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className={val === 'ERROR' ? styles.error : ''}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => setMode('calc')} className={styles.backButton}>
        ← Back to Calculator
      </button>
    </div>
  )
}
